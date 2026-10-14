'use strict';

/**
 * AgentScope Platform (platform.agentscope.io) client (zero dependencies).
 *
 * Public, cookie-authenticated REST flow used by the web app:
 *
 *   1. POST /api/v1/auth/send-verify-email-code   { account, purpose:"register" }
 *   2. GET  mail.tm inbox                          -> 6-digit verifyCode
 *   3. POST /api/v1/auth/register                  { account, password, verifyCode }
 *   4. POST /api/v1/auth/login                     { account, password }  -> auth cookie
 *   5. POST /api/v1/users/me/api-key/reset         -> full `sk-as-…` key (shown once)
 *
 * The inference endpoint is OpenAI-compatible but SSE-streaming only:
 *     POST https://platform.agentscope.io/v1/chat/completions
 *     Authorization: Bearer sk-as-…
 *
 * IMPORTANT — the verification e-mail is only delivered when the sign-up
 * request comes from a residential IP. Pass a `transport` (see
 * browser-transport.js) to route through a real browser; a bare VPS IP will
 * never receive the code.
 */

const ORIGIN = 'https://platform.agentscope.io';
const API = `${ORIGIN}/api/v1`;
const V1 = `${ORIGIN}/v1`;

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/126.0.0.0 Safari/537.36';

/** Minimal cookie jar used by the direct-fetch transport. */
class CookieJar {
  constructor() { this.store = new Map(); }
  absorb(res) {
    const raw = typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')] : []);
    for (const line of raw) {
      const [pair] = line.split(';');
      const i = pair.indexOf('=');
      if (i > 0) this.store.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
    }
  }
  header() {
    return [...this.store.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
  }
}

class AgentScope {
  /**
   * @param {object}  [opts]
   * @param {object}  [opts.transport] browser transport (recommended). When
   *   absent, falls back to direct fetch from the current host — which will
   *   NOT receive verification e-mails on a datacenter IP.
   */
  constructor({ jar = new CookieJar(), transport = null } = {}) {
    this.jar = jar;
    this.transport = transport;
    this.token = null;
  }

  _url(path) { return path.startsWith('http') ? path : `${API}${path}`; }

  async _fetch(path, { method = 'GET', body, json = true, headers = {} } = {}) {
    const hdrs = {
      Accept: 'application/json, text/plain, */*',
      'User-Agent': UA,
      Origin: ORIGIN,
      Referer: `${ORIGIN}/model-calls`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...headers,
    };

    if (this.transport) {
      const r = await this.transport.request(this._url(path), { method, headers: hdrs, body });
      const text = r.text;
      let data = null;
      if (json) { try { data = JSON.parse(text); } catch { /* non-JSON */ } }
      return { ok: r.ok, status: r.status, data, text };
    }

    // Direct fetch: prefer the Bearer token; only send the cookie when we do
    // not have a token (a stale cookie alongside a token triggers 401).
    const cookie = this.token ? '' : this.jar.header();
    const res = await fetch(this._url(path), {
      method,
      headers: { ...hdrs, ...(cookie ? { Cookie: cookie } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    this.jar.absorb(res);
    const text = await res.text();
    let data = null;
    if (json) { try { data = JSON.parse(text); } catch { /* non-JSON */ } }
    return { ok: res.ok, status: res.status, data, text };
  }

  async _call(path, opts = {}) {
    const { ok, status, data, text } = await this._fetch(path, opts);
    if (!ok) {
      const msg = (data && (data.message || data.error || data.detail)) || text.slice(0, 200);
      const err = new Error(`AgentScope ${opts.method || 'GET'} ${path} -> ${status}: ${msg}`);
      err.status = status;
      err.body = data;
      throw err;
    }
    return data;
  }

  /** Step 1 — ask AgentScope to e-mail a verification code. */
  sendVerifyCode(account, purpose = 'register') {
    return this._call('/auth/send-verify-email-code', { method: 'POST', body: { account, purpose } });
  }

  /** Step 3 — complete registration once the code is known. */
  register(account, password, verifyCode) {
    return this._call('/auth/register', { method: 'POST', body: { account, password, verifyCode } });
  }

  /** Step 4 — log in; captures the Bearer access token the app stores. */
  async login(account, password) {
    const data = await this._call('/auth/login', { method: 'POST', body: { account, password } });
    const token = data && data.data && (data.data.accessToken || data.data.access_token || data.data.token);
    if (token) this.token = token;
    // Some deployments only put the token in the page's localStorage; read it
    // back through the browser when a browser transport is in use.
    if (!this.token && this.transport && this.transport.readLocalStorage) {
      this.token = await this.transport.readLocalStorage('accessToken');
    }
    return data;
  }

  /** Read the signed-in user's profile. */
  userinfo() { return this._call('/auth/userinfo'); }

  /** Step 5 — mint / reset the Model API key (returns the full sk-as-… key). */
  resetModelApiKey() { return this._call('/users/me/model-api-key/reset', { method: 'POST' }); }

  /** Read the (masked) current Model API key metadata. */
  getModelApiKey() { return this._call('/users/me/model-api-key'); }

  /** List the platform's side credits balance. */
  credits() { return this._call('/users/me/credits'); }

  /** List model ids the platform advertises (OpenAI-compatible shape). */
  async listModels() {
    const { ok, data, text } = await this._fetch(`${V1}/models`, { headers: { Accept: 'application/json' } });
    if (!ok) throw new Error(`listModels -> ${text.slice(0, 120)}`);
    return (data && data.data ? data.data : []).map((m) => m.id);
  }
}

/**
 * Full provision: sign up a brand-new AgentScope account on a fresh mail.tm
 * inbox, verify it, log in, and mint a Model API key.
 *
 * @param {object}   opts
 * @param {object}   opts.inbox      result of mailtm.createInbox()
 * @param {function} opts.waitCode   async () => verifyCode string
 * @param {string}   [opts.password]
 * @param {object}   [opts.transport] browser transport (recommended)
 * @param {function} [opts.log]
 */
async function provisionAccount({ inbox, waitCode, password, transport = null, log = () => {} }) {
  const client = new AgentScope({ transport });
  const pass = password || `As${Math.random().toString(36).slice(2, 10)}!Aa1`;

  log(`[1/5] request verify code -> ${inbox.address}`);
  await client.sendVerifyCode(inbox.address, 'register');

  log('[2/5] waiting for e-mail code …');
  const code = await waitCode();
  if (!code) throw new Error('verification code never arrived');
  log(`      got code ${code}`);

  log('[3/5] register');
  await client.register(inbox.address, pass, code);

  log('[4/5] login');
  await client.login(inbox.address, pass);

  log('[5/5] mint Model API key');
  const keyData = await client.resetModelApiKey();
  const d = (keyData && keyData.data) || {};
  if (!d.api_key) throw new Error('no api_key in reset response');

  let userinfo = null;
  let models = [];
  try { userinfo = await client.userinfo(); } catch { /* optional */ }
  try { models = await client.listModels(); } catch { /* optional */ }

  return {
    email: inbox.address,
    password: pass,
    apiKey: d.api_key,
    keyId: d.key_id,
    chatUrl: d.chat_completions_url || `${V1}/chat/completions`,
    models,
    userinfo,
    createdAt: new Date().toISOString(),
    client,
  };
}

module.exports = { AgentScope, CookieJar, provisionAccount, ORIGIN, API, V1, UA };
