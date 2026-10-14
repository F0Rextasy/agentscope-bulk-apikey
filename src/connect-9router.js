'use strict';

/**
 * 9Router connector (zero dependencies).
 *
 * Registers AgentScope Platform as an OpenAI-compatible provider inside a
 * running 9Router instance and attaches one API key per account.
 *
 * 9Router itself can be self-hosted:
 *   npm install -g 9router && 9router         # dashboard on http://localhost:20128
 *
 * Endpoints used (all local, authenticated by the 9Router password cookie):
 *   POST /api/auth/login            { password }          -> auth_token cookie
 *   GET  /api/provider-nodes                              -> existing nodes
 *   POST /api/provider-nodes        { type, prefix, baseUrl, apiType, name }
 *   GET  /api/providers                                   -> existing connections
 *   POST /api/providers             { provider, apiKey, name, priority, defaultModel }
 *   GET  /api/keys | POST /api/keys { name }              -> 9Router client key (`sk-…`)
 */

const UA = 'agentscope-bulk-9router/1.0';

async function login(base, password) {
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
    body: JSON.stringify({ password: password ?? '123456' }),
  });
  const sc = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [];
  const cookie = sc.map((c) => c.split(';')[0]).join('; ');
  return { ok: res.ok, cookie, body: (await res.text()).slice(0, 200) };
}

async function apiCall(base, cookie, path, init = {}) {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UA,
      ...(cookie ? { Cookie: cookie } : {}),
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* ignore */ }
  return { status: res.status, ok: res.ok, json, text: text.slice(0, 400) };
}

/** Ensure an `openai-compatible` provider-node exists; returns it. */
async function ensureProviderNode(base, cookie, { name, prefix, baseUrl }) {
  const list = await apiCall(base, cookie, '/api/provider-nodes');
  const nodes = (list.json && list.json.nodes) || [];
  const existing = nodes.find((n) => n.name === name || n.prefix === prefix);
  if (existing) return { node: existing, created: false };
  const created = await apiCall(base, cookie, '/api/provider-nodes', {
    method: 'POST',
    body: JSON.stringify({ name, prefix, apiType: 'chat', type: 'openai-compatible', baseUrl }),
  });
  if (!created.ok) throw new Error(`create provider-node failed ${created.status}: ${created.text}`);
  return { node: created.json.node, created: true };
}

/** Attach an account API key as a 9Router connection to the node. */
async function ensureConnection(base, cookie, { nodeId, name, apiKey, defaultModel }) {
  const list = await apiCall(base, cookie, '/api/providers');
  const conns = (list.json && list.json.connections) || [];
  const existing = conns.find((c) => c.provider === nodeId && c.name === name);
  if (existing) return { connection: existing, created: false };
  const created = await apiCall(base, cookie, '/api/providers', {
    method: 'POST',
    body: JSON.stringify({ provider: nodeId, apiKey, name, priority: 1, defaultModel: defaultModel || null }),
  });
  if (!created.ok && created.status !== 409) {
    throw new Error(`create connection failed ${created.status}: ${created.text}`);
  }
  return { connection: created.json && created.json.connection, created: true };
}

/** Return (or mint) a 9Router client key used to call the local `/v1` API. */
async function ensureClientKey(base, cookie, name = 'agentscope') {
  const list = await apiCall(base, cookie, '/api/keys');
  const keys = (list.json && list.json.keys) || [];
  const existing = keys.find((k) => k.name === name && k.isActive);
  if (existing) return existing.key;
  const created = await apiCall(base, cookie, '/api/keys', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  if (!created.ok) throw new Error(`create client key failed ${created.status}: ${created.text}`);
  return created.json.key;
}

/**
 * High-level: connect one AgentScope account to 9Router.
 * @returns {Promise<{clientKey:string, nodeId:string, connectionId:string, models:string[]}>}
 */
async function connect({
  base = 'http://localhost:20128',
  password = '123456',
  apiKey,
  name = 'AgentScope',
  prefix = 'agentscope',
  baseUrl = 'https://platform.agentscope.io/v1',
  defaultModel = 'qwen3.8-flash',
  clientKeyName = 'agentscope',
}) {
  if (!apiKey) throw new Error('connect(): apiKey is required');
  const { cookie, ok, body } = await login(base, password);
  if (!ok && !/already|success|ok/i.test(body)) {
    throw new Error(`9Router login failed: ${body}`);
  }
  const { node } = await ensureProviderNode(base, cookie, { name, prefix, baseUrl });
  const { connection } = await ensureConnection(base, cookie, { nodeId: node.id, name, apiKey, defaultModel });
  const clientKey = await ensureClientKey(base, cookie, clientKeyName);
  return { clientKey, nodeId: node.id, connectionId: connection && connection.id, baseUrl: `${base}/v1` };
}

/** List model ids AgentScope exposes through 9Router's `/v1/models`. */
async function listRouterModels(base, clientKey, { filter = 'agentscope/' } = {}) {
  const res = await fetch(`${base}/v1/models`, {
    headers: { Authorization: `Bearer ${clientKey}`, 'User-Agent': UA },
  });
  if (!res.ok) throw new Error(`router /v1/models -> ${res.status}`);
  const data = await res.json();
  const ids = (data.data || []).map((m) => m.id);
  return filter ? ids.filter((id) => id.includes(filter)) : ids;
}

module.exports = {
  login,
  apiCall,
  ensureProviderNode,
  ensureConnection,
  ensureClientKey,
  connect,
  listRouterModels,
  UA,
};
