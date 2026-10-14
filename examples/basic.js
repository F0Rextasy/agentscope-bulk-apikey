'use strict';

/**
 * Example: create one AgentScope account + API key over a proxy transport,
 * then call the model through the platform (OpenAI-compatible, SSE only).
 *
 *   AGENTSCOPE_PROXY=socks5://user:pass@host:port node examples/basic.js
 */

const { MailTM, extractCode } = require('../src/mailtm');
const { provisionAccount } = require('../src/agentscope');
const { ProxyTransport } = require('../src/proxy');

async function main() {
  const transport = process.env.AGENTSCOPE_PROXY
    ? new ProxyTransport({ proxy: process.env.AGENTSCOPE_PROXY })
    : null;
  if (transport) await transport.connect();

  const mail = new MailTM({ transport });
  console.log('creating mail.tm inbox …');
  const inbox = await mail.createInbox();
  console.log('  ', inbox.address);

  const acct = await provisionAccount({
    inbox,
    transport,
    waitCode: async () => {
      const msg = await mail.waitForMessage(inbox.token, /AgentScope|验证码|verify/i, { timeoutMs: 120000 });
      if (!msg) throw new Error('no verification e-mail');
      return extractCode(msg);
    },
    log: (m) => console.log('  ' + m),
  });

  console.log('\naccount:');
  console.log('  email :', acct.email);
  console.log('  pass  :', acct.password);
  console.log('  key   :', acct.apiKey);
  console.log('  models:', acct.models.join(', '));

  const res = await fetch(acct.chatUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${acct.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({
      model: 'qwen3.8-flash',
      stream: true,
      messages: [{ role: 'user', content: 'Say hello in exactly three words.' }],
    }),
  });

  console.log('\nstreaming reply:');
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (payload === '[DONE]') continue;
      try {
        const j = JSON.parse(payload);
        const delta = j.choices && j.choices[0] && j.choices[0].delta;
        const out = delta && (delta.content || '');
        if (out) process.stdout.write(out);
      } catch { /* partial */ }
    }
  }
  console.log('\n');
  if (transport) await transport.close();
}

main().catch((e) => { console.error('[fatal]', e.message); process.exit(1); });
