# Protocol — AgentScope Platform → 9Router

This document records the exact HTTP flow the toolkit speaks, so the code can be
audited and re-implemented. All AgentScope endpoints are under
`https://platform.agentscope.io`.

## 1. Request a verification code

```http
POST /api/v1/auth/send-verify-email-code
Content-Type: application/json

{ "account": "user@example.com", "purpose": "register" }
```

Response `200`:

```json
{ "data": null, "meta": {}, "request_id": "…" }
```

The code is e-mailed to `account`. **Delivery is IP-sensitive**: requests from
low-reputation datacenter IPs are silently dropped, so run behind a residential
proxy or a real browser.

## 2. Read the code from mail.tm

```http
POST https://api.mail.tm/accounts   { "address": "...", "password": "..." }
POST https://api.mail.tm/token      { "address": "...", "password": "..." }   -> { token }
GET  https://api.mail.tm/messages                                             (Bearer token)
GET  https://api.mail.tm/messages/{id}                                        (Bearer token)
```

The message subject is `【AgentScope Platform】注册验证码`; the body contains a
6-digit code valid for 5 minutes.

## 3. Register

```http
POST /api/v1/auth/register
{ "account": "...", "password": "...", "verifyCode": "123456" }
```

Response `200` on success.

## 4. Log in (capture the access token)

```http
POST /api/v1/auth/login
{ "account": "...", "password": "..." }
```

The web app stores a Bearer `accessToken` (and `refreshToken`) in
`localStorage`. Sensitive calls require `Authorization: Bearer <accessToken>`.

## 5. Mint the Model API key

```http
POST /api/v1/users/me/model-api-key/reset
Authorization: Bearer <accessToken>
Accept: application/json, text/plain, */*
```

Response:

```json
{
  "data": {
    "status": "active",
    "key_id": "…",
    "api_key": "sk-as-…",
    "key_prefix": "sk-as-",
    "chat_completions_url": "https://platform.agentscope.io/v1/chat/completions",
    "auth_header": "Authorization: Bearer sk-as-…"
  }
}
```

## 6. Call models (OpenAI-compatible, SSE only)

```http
POST https://platform.agentscope.io/v1/chat/completions
Authorization: Bearer sk-as-…
Accept: text/event-stream

{ "model": "qwen3.8-flash", "stream": true, "messages": [{"role":"user","content":"hi"}] }
```

`GET /v1/models` lists: `qwen3.8-flash`, `qwen3.7-plus`, `qwen3.8-max`,
`deepseek-v4-flash`, `kimi-k3`, `glm-5.2`.

> `deepseek-v4-flash` is listed but returns `{"code":"model_not_found","message":"Model not exist."}` on chat — an upstream AgentScope issue.

## 7. Register into 9Router (local)

9Router (self-hosted, default `http://localhost:20128`) is authenticated with a
password cookie:

```http
POST /api/auth/login               { "password": "…" }        -> auth_token cookie
GET  /api/provider-nodes
POST /api/provider-nodes           { "name", "prefix", "type": "openai-compatible",
                                     "baseUrl": "https://platform.agentscope.io/v1",
                                     "apiType": "chat" }
GET  /api/providers
POST /api/providers                { "provider": "<nodeId>", "apiKey": "sk-as-…",
                                     "name": "AgentScope", "priority": 1 }
GET  /api/keys
POST /api/keys                     { "name": "agentscope" }    -> sk-… (9Router key)
```

After registration, `GET /v1/models` on 9Router exposes the provider under its
prefix, e.g. `agentscope/qwen3.8-flash`.

## Transports

| Transport | Module | Notes |
| --- | --- | --- |
| Proxy | `src/proxy.js` | HTTP(S) CONNECT + SOCKS5, zero-dep |
| Browser | `src/browser-transport.js` | evaluates `fetch()` inside a CDP-driven tab |
| Direct | `src/agentscope.js` | plain Node `fetch`; fallback |
