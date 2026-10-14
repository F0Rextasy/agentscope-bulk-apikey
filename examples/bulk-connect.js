'use strict';

/**
 * Example: create N AgentScope accounts and register every one of them into a
 * running 9Router instance in a single pass.
 *
 *   AGENTSCOPE_PROXY=socks5://user:pass@host:port node examples/bulk-connect.js 3
 *
 * Requires a 9Router instance on http://localhost:20128 (override with
 * NINEROUTER_URL / NINEROUTER_PASSWORD).
 */

const fs = require('fs');
const { MailTM, extractCode } = require('../src/mailtm');
const { provisionAccount } = require('../src/agentscope');
const { ProxyTransport } = require('../src/proxy');
const router = require('../src/connect-9router');

const N = parseInt(process.argv[2] || '3', 10);
const BASE = process.env.NINEROUTER_URL || 'http://localhost:20128';
const PW = process.env.NINEROUTER_PASSWORD || '123456';

async function main() {
  const transport = process.env.AGENTSCOPE_PROXY
    ? new ProxyTransport({ proxy: process.env.AGENTSCOPE_PROXY })
    : null;
  if (transport) await transport.connect();

  const rows = [];
  for (let i = 1; i <= N; i++) {
    console.log(`\n=== account ${i}/${N} ===`);
    const mail = new MailTM({ transport });
    const inbox = await mail.createInbox();
    const acct = await provisionAccount({
      inbox,
      transport,
      waitCode: async () => {
        const msg = await mail.waitForMessage(inbox.token, /AgentScope|验证码|verify/i, { timeoutMs: 120000 });
        return extractCode(msg);
      },
      log: (m) => console.log('  ' + m),
    });

    const conn = await router.connect({
      base: BASE,
      password: PW,
      apiKey: acct.apiKey,
      name: `AgentScope ${i}`,
      prefix: 'agentscope',
      defaultModel: 'qwen3.8-flash',
    });

    rows.push({ email: acct.email, password: acct.password, apiKey: acct.apiKey, connectionId: conn.connectionId });
    console.log(`  ✓ ${acct.email} -> connection ${conn.connectionId}`);
  }

  fs.writeFileSync('accounts.json', JSON.stringify(rows, null, 2));

  const { cookie } = await router.login(BASE, PW);
  const clientKey = await router.ensureClientKey(BASE, cookie, 'agentscope');
  const models = await router.listRouterModels(BASE, clientKey);
  console.log(`\n9Router ready at ${BASE}/v1`);
  console.log(`  API key: ${clientKey}`);
  console.log(`  models : ${models.join(', ')}`);

  if (transport) await transport.close();
}

main().catch((e) => { console.error('[fatal]', e.message); process.exit(1); });
