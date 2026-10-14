'use strict';

/**
 * Proxy support for the direct (non-browser) transport, zero dependencies.
 *
 * AgentScope's verification-e-mail gateway drops requests from low-reputation
 * datacenter IPs, so running the factory behind a residential proxy is the
 * recommended setup. This module wraps a plain `fetch` with an HTTP(S) or
 * SOCKS5 proxy using only Node's built-in `http`, `https`, `tls` and `net`.
 *
 * URL forms accepted:
 *   http://user:pass@host:port
 *   https://user:pass@host:port
 *   socks5://user:pass@host:port
 *   socks5h://user:pass@host:port   (remote DNS)
 *
 * Env shortcuts:
 *   AGENTSCOPE_PROXY      one proxy URL
 *   AGENTSCOPE_PROXY_FILE  file with one URL (or host:port:user:pass) per line
 */

const http = require('http');
const https = require('https');
const net = require('net');
const tls = require('tls');
const { URL } = require('url');

/** Parse one proxy entry into { scheme, host, port, username, password }. */
function parseProxy(line) {
  if (!line) return null;
  line = line.trim();
  if (!line || line.startsWith('#')) return null;

  // host:port:user:pass  (reseller convention)
  if (!line.includes('://')) {
    const parts = line.split(':');
    if (parts.length >= 4) {
      return { scheme: 'http', host: parts[0], port: +parts[1], username: parts[2], password: parts.slice(3).join(':') };
    }
    if (parts.length === 2) {
      return { scheme: 'http', host: parts[0], port: +parts[1], username: '', password: '' };
    }
    return null;
  }
  const u = new URL(line);
  const scheme = u.protocol.replace(':', '');
  return {
    scheme,
    host: u.hostname,
    port: +u.port || (scheme.startsWith('socks') ? 1080 : scheme === 'https' ? 443 : 80),
    username: decodeURIComponent(u.username || ''),
    password: decodeURIComponent(u.password || ''),
  };
}

function fromEnv() {
  const list = [];
  if (process.env.AGENTSCOPE_PROXY) list.push(parseProxy(process.env.AGENTSCOPE_PROXY));
  const file = process.env.AGENTSCOPE_PROXY_FILE;
  if (file) {
    const fs = require('fs');
    if (fs.existsSync(file)) {
      for (const line of fs.readFileSync(file, 'utf8').split('\n')) list.push(parseProxy(line));
    }
  }
  return list.filter(Boolean);
}

function basicAuth(p) {
  return 'Basic ' + Buffer.from(`${p.username}:${p.password}`).toString('base64');
}

/** Open a TCP/TLS socket to the proxy and CONNECT to the target host:port. */
function httpConnect(proxy, targetHost, targetPort) {
  return new Promise((resolve, reject) => {
    const socket = proxy.scheme === 'https'
      ? tls.connect({ host: proxy.host, port: proxy.port, servername: proxy.host })
      : net.connect({ host: proxy.host, port: proxy.port });

    const onError = (e) => { socket.destroy(); reject(e); };
    socket.once('error', onError);

    const proceed = () => {
      const lines = [
        `CONNECT ${targetHost}:${targetPort} HTTP/1.1`,
        `Host: ${targetHost}:${targetPort}`,
      ];
      if (proxy.username) lines.push(`Proxy-Authorization: ${basicAuth(proxy)}`);
      lines.push('Connection: keep-alive', '', '');
      socket.write(lines.join('\r\n'));

      let buf = '';
      const onData = (chunk) => {
        buf += chunk.toString('latin1');
        const end = buf.indexOf('\r\n\r\n');
        if (end === -1) return;
        socket.removeListener('data', onData);
        socket.removeListener('error', onError);
        const status = buf.split('\r\n')[0];
        if (!/ 200 /.test(status)) {
          socket.destroy();
          return reject(new Error(`proxy CONNECT failed: ${status}`));
        }
        resolve(socket);
      };
      socket.on('data', onData);
    };

    if (proxy.scheme === 'https') socket.once('secureConnect', proceed);
    else socket.once('connect', proceed);
  });
}

/** Minimal SOCKS5 handshake (no auth or username/password auth). */
function socks5Connect(proxy, targetHost, targetPort, remoteDns) {
  return new Promise((resolve, reject) => {
    const socket = net.connect({ host: proxy.host, port: proxy.port });
    socket.once('error', reject);

    socket.once('connect', () => {
      const methods = proxy.username ? [0x00, 0x02] : [0x00];
      socket.write(Buffer.from([0x05, methods.length, ...methods]));
    });

    let stage = 'greeting';
    const onData = (data) => {
      if (stage === 'greeting') {
        if (data[1] === 0xff) { socket.destroy(); return reject(new Error('socks5: no acceptable auth method')); }
        if (data[1] === 0x02) {
          const u = Buffer.from(proxy.username);
          const pw = Buffer.from(proxy.password);
          const buf = Buffer.concat([Buffer.from([0x01, u.length]), u, Buffer.from([pw.length]), pw]);
          socket.write(buf);
          stage = 'auth';
          return;
        }
        stage = 'connect';
        sendConnect();
        return;
      }
      if (stage === 'auth') {
        if (data[1] !== 0x00) { socket.destroy(); return reject(new Error('socks5: auth failed')); }
        stage = 'connect';
        sendConnect();
        return;
      }
      // connect reply
      if (data[1] !== 0x00) { socket.destroy(); return reject(new Error(`socks5: connect failed code ${data[1]}`)); }
      socket.removeListener('data', onData);
      resolve(socket);
    };
    socket.on('data', onData);

    function sendConnect() {
      const host = remoteDns ? Buffer.from(targetHost) : null;
      const portBuf = Buffer.from([(targetPort >> 8) & 0xff, targetPort & 0xff]);
      let addr;
      let atyp;
      if (host) {
        atyp = 0x03;
        addr = Buffer.concat([Buffer.from([host.length]), host]);
      } else if (net.isIP(targetHost) === 4) {
        atyp = 0x01;
        addr = Buffer.from(targetHost.split('.').map(Number));
      } else {
        atyp = 0x03;
        addr = Buffer.concat([Buffer.from([targetHost.length]), Buffer.from(targetHost)]);
      }
      socket.write(Buffer.concat([Buffer.from([0x05, 0x01, 0x00, atyp]), addr, portBuf]));
    }
  });
}

/**
 * Perform `fetch`-like HTTP(S) request through a proxy.
 * Returns { ok, status, headers, text }.
 */
async function proxiedFetch(proxy, url, { method = 'GET', headers = {}, body } = {}) {
  const u = new URL(url);
  const isHttps = u.protocol === 'https:';
  const targetPort = +u.port || (isHttps ? 443 : 80);

  const socket = proxy.scheme.startsWith('socks')
    ? await socks5Connect(proxy, u.hostname, targetPort, proxy.scheme === 'socks5h')
    : await httpConnect(proxy, u.hostname, targetPort);

  const agent = isHttps ? https : http;
  const hdrs = { ...headers, Host: u.hostname };
  const bodyBuf = body !== undefined && body !== null ? Buffer.from(body) : null;
  if (bodyBuf) hdrs['Content-Length'] = bodyBuf.length;

  return new Promise((resolve, reject) => {
    const req = agent.request(
      {
        method,
        host: u.hostname,
        port: targetPort,
        path: u.pathname + u.search,
        headers: hdrs,
        socket,
        agent: false,
        createConnection: () => (isHttps
          ? tls.connect({ socket, servername: u.hostname })
          : socket),
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            headers: res.headers,
            text,
          });
        });
      },
    );
    req.on('error', reject);
    if (bodyBuf) req.write(bodyBuf);
    req.end();
  });
}

/** Proxy-based transport with the same interface as browser-transport. */
class ProxyTransport {
  constructor({ proxy } = {}) {
    this.proxy = typeof proxy === 'string' ? parseProxy(proxy) : proxy || null;
  }
  static fromEnv() {
    const list = fromEnv();
    return new ProxyTransport({ proxy: list[0] });
  }
  async connect() {
    if (!this.proxy) throw new Error('ProxyTransport: no proxy configured (set AGENTSCOPE_PROXY)');
    return this;
  }
  async request(url, opts = {}) {
    const body = opts.body !== undefined && opts.body !== null && typeof opts.body !== 'string'
      ? JSON.stringify(opts.body)
      : opts.body;
    return proxiedFetch(this.proxy, url, { ...opts, body });
  }
  async close() {}
}

module.exports = { parseProxy, proxiedFetch, ProxyTransport, fromEnv };
