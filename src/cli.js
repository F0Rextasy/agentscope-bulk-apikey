#!/usr/bin/env node
'use strict';

/**
 * agentscope-bulk — bulk-create AgentScope Platform accounts, mint a Model API
 * key for each, and (optionally) register them into a running 9Router instance.
 *
 * Usage:
 *   node src/cli.js --count 3 --cdp ws://127.0.0.1:9222/...
 *   node src/cli.js --count 3 --connect-9router --router http://localhost:20128
 *   node src/cli.js --count 1 --out accounts.json --csv accounts.csv
 *
 * Zero dependencies. Node.js >= 18 (needs global fetch + a Chrome with a
 * remote-debugging port for reliable e-mail delivery).
 */

const fs = require('fs');
const path = require('path');
const { MailTM, extractCode } = require('./mailtm');
const { BrowserTransport } = require('./browser-transport');
const { ProxyTransport } = require('./proxy');
const { provisionAccount } = require('./agentscope');
const router = require('./connect-9router');

const VERSION = require('../package.json').version;

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) { args[key] = next; i++; } else { args[key] = true; }
  }
  return args;
}

function bool(v) { return v === true || v === 'true' || v === '1' || v === 'yes'; }

function banner() {
  console.log(`
  ▄▀█ █▀▀ █▀▀ █▄░█ ▀█▀ █▀ █▀▀ █▀█ █▀█ █▀▀
  █▀█ █▄█ ██▄ █░▀█ ░█░ ▄█ █▄▄ █▄█ █▀▀ ██▄   v${VERSION}
  AgentScope bulk account + API key factory → 9Router
`);
}

function toCsv(rows) {
  const cols = ['email', 'password', 'apiKey', 'keyId', 'createdAt'];
  const head = cols.join(',');
  const body = rows.map((r) => cols.map((c) => {
    const v = r[c] == null ? '' : String(r[c]);
    return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  }).join(','));
  return [head, ...body].join('\n') + '\n';
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (bool(args.help) || bool(args.h)) { banner(); console.log(HELP); return; }

  const count = Math.max(1, parseInt(args.count || '1', 10));
  const connectRouter = bool(args['connect-9router']) || bool(args.connect);
  const routerBase = args.router || 'http://localhost:20128';
  const routerPassword = args['router-password'] || process.env.NINEROUTER_PASSWORD || '123456';
  const prefix = args.prefix || 'agentscope';
  const outJson = args.out || 'accounts.json';
  const outCsv = args.csv || null;
  const delayMs = parseInt(args.delay || '2000', 10);
  const password = args.password || null;
  const verifyTimeout = parseInt(args['code-timeout'] || '150000', 10);
  const proxyUrl = args.proxy || process.env.AGENTSCOPE_PROXY || null;

  banner();
  console.log(`  accounts   : ${count}`);
  if (proxyUrl) {
    const safe = String(proxyUrl).replace(/\/\/[^@/]*@/, '//***@');
    console.log(`  transport  : proxy ${safe}`);
  } else {
    console.log(`  CDP        : ${args.cdp || process.env.BU_CDP_WS || 'http://127.0.0.1:9222 (default)'}`);
  }
  console.log(`  connect 9R : ${connectRouter ? `yes -> ${routerBase}` : 'no'}`);
  console.log(`  output     : ${outJson}${outCsv ? ` + ${outCsv}` : ''}\n`);

  // ── choose transport: proxy (preferred) or a browser over CDP ──
  let transport;
  if (proxyUrl) {
    transport = new ProxyTransport({ proxy: proxyUrl });
    console.log('→ using proxy transport …');
    await transport.connect();
    console.log('  proxy ready\n');
  } else {
    transport = new BrowserTransport({ cdpUrl: args.cdp });
    console.log('→ attaching to browser over CDP …');
    await transport.connect();
    console.log('  browser ready\n');
  }

  const mail = new MailTM({ transport });

  let routerCookie = null;
  if (connectRouter) {
    console.log('→ 9Router login …');
    const { cookie, ok, body } = await router.login(routerBase, routerPassword);
    if (!ok) console.log(`  (login returned not-ok; body=${String(body).slice(0, 80)})`);
    routerCookie = cookie;
    console.log('  9Router ready\n');
  }

  const results = [];
  for (let i = 1; i <= count; i++) {
    console.log(`──────── account ${i}/${count} ────────`);
    try {
      const inbox = await mail.createInbox();
      console.log(`  inbox: ${inbox.address}`);
      const acct = await provisionAccount({
        inbox,
        transport,
        password,
        waitCode: async () => {
          const msg = await mail.waitForMessage(inbox.token, /AgentScope|验证码|verify/i, { timeoutMs: verifyTimeout });
          if (!msg) throw new Error(`verification e-mail not received within ${verifyTimeout / 1000}s`);
          const code = extractCode(msg);
          if (!code) throw new Error(`could not parse a code from subject "${msg.subject}"`);
          return code;
        },
        log: (m) => console.log('  ' + m),
      });
      console.log(`  ✓ key: ${acct.apiKey.slice(0, 14)}… (${acct.models.length} models)`);

      const row = {
        email: acct.email,
        password: acct.password,
        apiKey: acct.apiKey,
        keyId: acct.keyId,
        models: acct.models,
        createdAt: acct.createdAt,
      };

      if (connectRouter) {
        try {
          const conn = await router.connect({
            base: routerBase,
            password: routerPassword,
            apiKey: acct.apiKey,
            name: `AgentScope ${i}`,
            prefix,
            defaultModel: 'qwen3.8-flash',
          });
          row.router = conn;
          console.log(`  ✓ 9Router connection ${conn.connectionId} (prefix ${prefix})`);
        } catch (e) {
          row.routerError = e.message;
          console.log(`  ! 9Router connect failed: ${e.message}`);
        }
      }
      results.push(row);
    } catch (e) {
      console.error(`  ✗ account ${i} failed: ${e.message}`);
      results.push({ error: e.message, email: null });
    }

    fs.writeFileSync(outJson, JSON.stringify(results.filter((r) => !r.error), null, 2));
    if (outCsv) fs.writeFileSync(outCsv, toCsv(results.filter((r) => !r.error)));
    if (i < count && delayMs) await new Promise((r) => setTimeout(r, delayMs));
  }

  const ok = results.filter((r) => !r.error);
  console.log(`\n════ done: ${ok.length}/${count} accounts created`);
  console.log(`   saved -> ${path.resolve(outJson)}${outCsv ? ` and ${path.resolve(outCsv)}` : ''}`);

  if (connectRouter && ok.length) {
    try {
      const clientKey = await router.ensureClientKey(routerBase, routerCookie, 'agentscope');
      const models = await router.listRouterModels(routerBase, clientKey);
      console.log(`\n   9Router endpoint : ${routerBase}/v1`);
      console.log(`   9Router API key  : ${clientKey}`);
      console.log(`   models via router: ${models.join(', ') || '(none yet)'}`);
    } catch (e) {
      console.log(`   (could not read router models: ${e.message})`);
    }
  }

  await transport.close();
}

const HELP = `
Options:
  --count <n>              number of accounts to create              (default 1)
  --proxy <url>            route HTTP through a proxy (http/https/socks5)
  --cdp <ws-url>           CDP WebSocket URL of your Chrome          (default http://127.0.0.1:9222)
  --password <pw>          fixed password for every account          (default random)
  --connect-9router        register each account into a 9Router instance
  --router <url>           9Router base URL                           (default http://localhost:20128)
  --router-password <pw>   9Router login password                     (default 123456)
  --prefix <p>             provider prefix in 9Router                 (default agentscope)
  --out <file>             JSON output path                           (default accounts.json)
  --csv <file>             also write a CSV
  --delay <ms>             pause between accounts                     (default 2000)
  --code-timeout <ms>      how long to wait for the e-mail code       (default 150000)
  --help                   show this help

Transport (pick one):
  --proxy http://user:pass@host:port   residential proxy  (recommended)
  --proxy socks5://user:pass@host:port
  --cdp   ws://127.0.0.1:9222/...      drive a local Chrome over CDP
Env: AGENTSCOPE_PROXY / AGENTSCOPE_PROXY_FILE (one proxy per line),
     BU_CDP_WS (cloud browser CDP URL).

Note: AgentScope's verification-e-mail gateway drops requests from low-reputation
datacenter IPs. Run behind a residential proxy (--proxy) for reliable delivery.
`;

main().catch((e) => { console.error('\n[fatal] ' + e.message); process.exit(1); });
