'use strict';

/**
 * Generic inbox adapter (zero dependencies).
 *
 * AgentScope's mail gateway filters some disposable-mail domains (mail.tm was
 * blocked at the time of writing), so the toolkit lets you plug in ANY inbox
 * via a small JSON contract instead of hard-coding one provider.
 *
 * A *provider* is just a URL plus a couple of JSON field paths:
 *
 *   POST <createUrl>                       -> { <addressPath>, <tokenPath> }
 *   GET  <listUrl>   (Bearer <token>)      -> an array (or wrapped array) of
 *                                             { id, subject, from, text/html }
 *
 * Configure with env:
 *   INBOX_CREATE_URL   e.g. https://api.mail.tm/accounts
 *   INBOX_LIST_URL     e.g. https://api.mail.tm/messages          ({token} ok)
 *   INBOX_READ_URL     e.g. https://api.mail.tm/messages/{id}     ({id} ok)
 *   INBOX_ADDRESS_PATH e.g. address          (dot path in the create result)
 *   INBOX_TOKEN_PATH   e.g. token            (dot path in the create result)
 *   INBOX_LIST_PATH    e.g. hydra:member     (dot path in the list result)
 *   INBOX_BODY_FIELDS  e.g. text,html,intro  (fields to scan for the code)
 *
 * For providers with a different shape (two-step creation, auth headers, …)
 * point INBOX_CREATE_URL at your own tiny proxy that speaks this contract.
 */

const http = require('http');
const https = require('https');

function dig(obj, path) {
  if (!path) return obj;
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

async function req(url, { method = 'GET', token, body, transport } = {}) {
  const headers = {
    Accept: 'application/json',
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  // A local inbox broker is reached directly: the browser transport evaluates
  // fetches inside the AgentScope page, where http://127.0.0.1 would be blocked
  // as mixed content, and through a proxy it would leave the machine for no
  // reason at all.
  const isLocal = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(?::\d+)?\//i.test(url);
  if (transport && !isLocal) {
    const r = await transport.request(url, { method, headers, body });
    if (!r.ok) throw new Error(`inbox ${method} ${url} -> ${r.status}`);
    return JSON.parse(r.text);
  }
  const res = await fetch(url, { method, headers, ...(body ? { body: JSON.stringify(body) } : {}) });
  const text = await res.text();
  if (!res.ok) throw new Error(`inbox ${method} ${url} -> ${res.status}: ${text.slice(0, 120)}`);
  return JSON.parse(text);
}

class GenericInbox {
  constructor(cfg = {}, { transport = null } = {}) {
    this.cfg = {
      createUrl: cfg.createUrl || process.env.INBOX_CREATE_URL,
      listUrl: cfg.listUrl || process.env.INBOX_LIST_URL,
      readUrl: cfg.readUrl || process.env.INBOX_READ_URL,
      addressPath: cfg.addressPath || process.env.INBOX_ADDRESS_PATH || 'address',
      tokenPath: cfg.tokenPath || process.env.INBOX_TOKEN_PATH || 'token',
      listPath: cfg.listPath || process.env.INBOX_LIST_PATH || 'hydra:member',
      bodyFields: (cfg.bodyFields || process.env.INBOX_BODY_FIELDS || 'text,html,intro').split(','),
    };
    this.transport = transport;
  }

  static configured() {
    return !!(process.env.INBOX_CREATE_URL && process.env.INBOX_LIST_URL);
  }

  async createInbox() {
    if (!this.cfg.createUrl) throw new Error('GenericInbox: INBOX_CREATE_URL is not set');
    const created = await req(this.cfg.createUrl, { method: 'POST', body: {}, transport: this.transport });
    const address = dig(created, this.cfg.addressPath);
    const token = dig(created, this.cfg.tokenPath);
    if (!address) throw new Error('GenericInbox: could not read address from create result');
    return { address, token, backend: 'generic' };
  }

  async listMessages(inbox) {
    const url = this.cfg.listUrl.replace('{token}', encodeURIComponent(inbox.token || ''));
    const data = await req(url, { token: inbox.token, transport: this.transport });
    const arr = dig(data, this.cfg.listPath);
    return Array.isArray(arr) ? arr : [];
  }

  async getMessage(inbox, id) {
    const url = this.cfg.readUrl
      ? this.cfg.readUrl.replace('{id}', encodeURIComponent(id)).replace('{token}', encodeURIComponent(inbox.token || ''))
      : null;
    if (!url) return null;
    return req(url, { token: inbox.token, transport: this.transport });
  }

  extractCode(message) {
    const parts = [];
    for (const f of this.cfg.bodyFields) {
      const v = message[f.trim()];
      if (Array.isArray(v)) parts.push(v.join('\n'));
      else if (v) parts.push(String(v));
    }
    parts.push(String(message.subject || ''));
    const m = parts.join('\n').match(/\b(\d{4,8})\b/);
    return m ? m[1] : null;
  }

  async waitForMessage(inbox, matcher, { timeoutMs = 120000, intervalMs = 4000 } = {}) {
    // provisionWithRetry() calls this with `inbox.token` (the shape MailTM's own
    // waitForMessage expects), so accept both a token string and an inbox object
    // instead of silently polling with an empty token.
    const box = typeof inbox === 'string' ? { token: inbox } : inbox;
    const deadline = Date.now() + timeoutMs;
    const seen = new Set();
    while (Date.now() < deadline) {
      const messages = await this.listMessages(box);
      for (const m of messages) {
        if (seen.has(m.id)) continue;
        seen.add(m.id);
        const subject = m.subject || '';
        if (matcher && !matcher.test(subject)) continue;
        const full = (await this.getMessage(box, m.id)) || m;
        return { id: m.id, subject, from: m.from, ...full };
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    return null;
  }
}

module.exports = { GenericInbox };
