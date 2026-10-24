'use strict';

/**
 * Browser-backed HTTP transport (zero dependencies).
 *
 * AgentScope's verification-e-mail gateway silently drops requests that come
 * from datacenter IPs, so a plain `fetch()` from a VPS/CI box receives the code
 * e-mail 0 % of the time. Routing every request through a real browser on *your*
 * machine (a residential IP) makes delivery immediate and reliable.
 *
 * This transport drives an existing Chrome/Chromium over the DevTools Protocol
 * and evaluates `fetch()` inside a page, so the request inherits the browser's
 * IP, cookies and User-Agent. The response is returned as { status, headers, text }.
 *
 * Connection:
 *   - a running Chrome with `--remote-debugging-port=9222`, or
 *   - any CDP WebSocket URL (e.g. a cloud browser) via BU_CDP_WS.
 */

const { CDP, chromeEndpoint } = require('./solver');

const PAGE_ORIGIN = 'https://platform.agentscope.io';

class BrowserTransport {
  constructor({ cdpUrl, origin = PAGE_ORIGIN, timeoutMs = 60000 } = {}) {
    this.cdpUrl = cdpUrl || process.env.BU_CDP_WS || process.env.BU_CDP_URL;
    this.origin = origin;
    this.timeoutMs = timeoutMs;
    this.cdp = null;
  }

  async connect() {
    if (this.cdp) return this;
    const wsUrl = await chromeEndpoint(this.cdpUrl);
    this.cdp = new CDP(wsUrl, { commandTimeoutMs: this.timeoutMs });
    await this.cdp.connect();
    this._targetId = null;
    this._origin = null;
    return this;
  }

  /** Navigate the working tab to a host so in-page fetch() is same-origin. */
  async _ensureOrigin(host) {
    if (this._origin === host && this._targetId) return;
    const url = `https://${host}/`;
    if (!this._targetId) {
      const { targetId } = await this.cdp.newPage({ url: 'about:blank' });
      this._targetId = targetId;
      await this.cdp.send('Page.enable').catch(() => {});
    } else {
      await this.cdp.send('Page.enable').catch(() => {});
    }
    const loaded = this.cdp.waitFor('Page.loadEventFired', { timeoutMs: 25000 }).catch(() => {});
    await this.cdp.send('Page.navigate', { url });
    await Promise.race([loaded, new Promise((r) => setTimeout(r, 12000))]);
    // confirm the tab really landed on the host
    const cur = await this.cdp.send('Runtime.evaluate', { expression: 'location.href', returnByValue: true });
    const href = cur.result && cur.result.value;
    if (!href || !href.includes(host)) {
      throw new Error(`browser did not reach ${host} (at ${href})`);
    }
    this._origin = host;
  }

  /**
   * Evaluate a fetch inside the page and resolve to { status, headers, text }.
   * `opts` = { method, headers, body } where body is a JS value (objects are
   * JSON-encoded by the caller).
   */
  async request(url, opts = {}) {
    if (!this.cdp) await this.connect();
    const host = new URL(url).host;
    await this._ensureOrigin(host);
    // Headers are filtered: the browser sets Origin/Referer/User-Agent/host
    // itself, and overriding them confuses AgentScope's mail gateway (requests
    // with a hand-set Origin/UA are silently dropped). Only pass through
    // application headers such as Content-Type and Authorization.
    const DROP = new Set(['origin', 'referer', 'user-agent', 'host', 'cookie', 'accept-encoding', 'content-length', 'connection']);
    const headers = {};
    for (const [k, v] of Object.entries(opts.headers || {})) {
      if (!DROP.has(k.toLowerCase())) headers[k] = v;
    }
    const payload = {
      url,
      method: opts.method || 'GET',
      headers,
      body: opts.body === undefined ? null : opts.body,
    };
    const expr = `(async()=>{try{
      const r = await fetch(${JSON.stringify(url)}, {
        method: ${JSON.stringify(payload.method)},
        headers: ${JSON.stringify(payload.headers)},
        credentials: 'include',
        ${payload.body !== null ? `body: JSON.stringify(${JSON.stringify(payload.body)}),` : ''}
      });
      const text = await r.text();
      const headers = {}; r.headers.forEach((v,k)=>headers[k]=v);
      return JSON.stringify({ ok: r.ok, status: r.status, headers, text });
    }catch(e){ return JSON.stringify({ ok:false, status:0, error:String(e&&e.message||e) }); }})()`;

    const { result, exceptionDetails } = await this.cdp.send('Runtime.evaluate', {
      expression: expr,
      awaitPromise: true,
      returnByValue: true,
    });
    if (exceptionDetails) {
      throw new Error(`browser eval error: ${exceptionDetails.text || ''} ${(exceptionDetails.exception && exceptionDetails.exception.description) || ''}`.trim());
    }
    if (!result || result.value == null) {
      throw new Error('browser fetch returned no value');
    }
    const parsed = JSON.parse(result.value);
    if (parsed.status === 0) throw new Error(`browser fetch failed: ${parsed.error}`);
    return parsed;
  }

  /**
   * Cookie-aware request helper that keeps a simple in-page cookie jar by
   * relying on the browser's own cookie store (credentials:'include').
   * `cookies` is accepted for API parity but handled by the browser.
   */
  async fetchText(url, opts = {}) {
    const r = await this.request(url, opts);
    return r.text;
  }

  /**
   * Read a value from the current page's localStorage. Used to pick up the
   * access token the AgentScope web app stores after login.
   */
  async readLocalStorage(key) {
    if (!this.cdp) await this.connect();
    try {
      const { result } = await this.cdp.send('Runtime.evaluate', {
        expression: `window.localStorage.getItem(${JSON.stringify(key)})`,
        returnByValue: true,
      });
      return result && result.value ? result.value : null;
    } catch {
      return null;
    }
  }

  async close() {
    if (this.cdp) { this.cdp.close(); this.cdp = null; }
  }
}

module.exports = { BrowserTransport, PAGE_ORIGIN };
