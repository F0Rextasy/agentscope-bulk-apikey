'use strict';

/**
 * mail.tm disposable-inbox client (zero dependencies).
 *
 * mail.tm is a free, public REST API for throwaway mailboxes. We use it to
 * receive the AgentScope e-mail verification code during sign-up.
 *
 * Docs: https://docs.mail.tm
 *
 * The client can run over the plain `fetch` (host IP) or through a browser
 * transport so all traffic leaves from the same residential IP as the sign-up
 * request — the combination AgentScope's mail gateway reliably accepts.
 */

const BASE = 'https://api.mail.tm';
const UA = 'agentscope-bulk-9router/1.0 (+https://github.com/0xgetz/agentscope-bulk-apikey)';

function makeFetcher(transport) {
  return async function fetcher(path, { method = 'GET', token, body } = {}) {
    const headers = {
      Accept: 'application/json',
      'User-Agent': UA,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    let status;
    let text;
    if (transport) {
      const r = await transport.request(`${BASE}${path}`, { method, headers, body });
      status = r.status;
      text = r.text;
    } else {
      const res = await fetch(`${BASE}${path}`, {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      status = res.status;
      text = await res.text();
    }
    let json = null;
    try { json = JSON.parse(text); } catch { /* not JSON */ }
    if (status < 200 || status >= 300) {
      const msg = (json && (json.message || json.detail)) || String(text).slice(0, 200);
      throw new Error(`mail.tm ${method} ${path} -> ${status}: ${msg}`);
    }
    return json;
  };
}

class MailTM {
  /** @param {object} [opts] @param {object} [opts.transport] browser transport */
  constructor({ transport = null } = {}) {
    this.transport = transport;
    this.req = makeFetcher(transport);
  }

  /** Pick an active public domain (prefers maxxspace.com when available). */
  async pickDomain() {
    const domains = await this.req('/domains?page=1');
    const list = (domains['hydra:member'] || domains).filter((d) => d.isActive && !d.isPrivate);
    if (!list.length) throw new Error('mail.tm: no active public domain');
    const preferred = list.find((d) => d.domain === 'maxxspace.com');
    return (preferred || list[0]).domain;
  }

  /** Create a mailbox and return { address, password, token }. */
  async createInbox({ localPart, password, domain } = {}) {
    const dom = domain || (await this.pickDomain());
    const user = localPart || `as${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const pass = password || `As!${Math.random().toString(36).slice(2, 10)}Aa1`;
    const address = `${user}@${dom}`;
    await this.req('/accounts', { method: 'POST', body: { address, password: pass } });
    const { token } = await this.req('/token', { method: 'POST', body: { address, password: pass } });
    return { address, password: pass, token, domain: dom };
  }

  /** List current messages (newest first). */
  async listMessages(token) {
    const data = await this.req('/messages?page=1', { token });
    return data['hydra:member'] || [];
  }

  /** Full message (text + html) by id. */
  getMessage(token, id) { return this.req(`/messages/${id}`, { token }); }

  /**
   * Poll the inbox until a message whose subject matches `matcher` arrives.
   * Resolves to null on timeout.
   */
  async waitForMessage(token, matcher, { timeoutMs = 120000, intervalMs = 3000, since } = {}) {
    const deadline = Date.now() + timeoutMs;
    const seen = new Set();
    while (Date.now() < deadline) {
      const messages = await this.listMessages(token);
      for (const m of messages) {
        if (seen.has(m.id)) continue;
        seen.add(m.id);
        if (since && new Date(m.createdAt).getTime() < since) continue;
        const subject = m.subject || '';
        const intro = m.intro || '';
        if (!matcher || matcher.test(subject + ' ' + intro)) {
          const full = await this.getMessage(token, m.id);
          return {
            id: m.id,
            subject,
            from: (m.from && m.from.address) || '',
            text: full.text || '',
            html: Array.isArray(full.html) ? full.html.join('\n') : full.html || '',
            intro,
            createdAt: m.createdAt,
          };
        }
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    return null;
  }

  /** Extract the first 4-8 digit numeric code from a message. */
  static extractCode(message) {
    const haystack = [message.subject, message.intro, message.text, message.html].filter(Boolean).join('\n');
    const m = haystack.match(/\b(\d{4,8})\b/);
    return m ? m[1] : null;
  }
}

module.exports = { MailTM, BASE, extractCode: MailTM.extractCode };
