<div align="center">

<img src="brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**Bulk-create [AgentScope Platform](https://platform.agentscope.io) accounts, auto-mint a Model API key for each, and register every key into a running [9Router](https://9router.com) instance — end to end. Zero dependencies.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-9router)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-transports)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-5%20languages-F59E0B.svg?style=for-the-badge)](#-languages)

[English](README.md) · [Bahasa Indonesia](i18n/README.id.md) · [简体中文](i18n/README.zh.md) · [日本語](i18n/README.ja.md) · [Español](i18n/README.es.md) · [Deutsch](i18n/README.de.md)

</div>

---

## ✨ Features

- 🔑 **Bulk account + API key** — one AgentScope account *and* one `sk-as-…` Model API key per run.
- 📧 **Disposable inboxes** — verification codes are read straight from [mail.tm](https://mail.tm); no e-mail account needed.
- 🔌 **9Router connector** — every key is registered as an OpenAI-compatible provider in 9Router in the same pass.
- 🌐 **Three transports** — a residential **proxy** (HTTP/SOCKS5), a real **browser over CDP**, or plain `fetch`.
- 🪶 **Zero dependencies** — pure Node.js ≥ 18. No `npm install`, no build step.
- 📦 **Exports** — results written to JSON **and** optional CSV.
- 🧩 **Library or CLI** — use `provisionAccount()` in code, or run the bundled `agentscope-bulk` command.
- 🌍 **5 languages** — EN, ID, ZH, JA, ES, DE.

## 🚀 Quick start

```bash
git clone https://github.com/0xgetz/agentscope-bulk-apikey
cd agentscope-bulk-apikey

# 1 account, behind a residential proxy, into a local 9Router
node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

That prints the created account, its `sk-as-…` key, the 9Router connection id, and the router endpoint + key you can point any OpenAI-compatible tool at.

## 🛠 Usage

```bash
agentscope-bulk --count 3                 # 3 accounts, no router
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>   # drive a local Chrome
```

| Flag | Description | Default |
| --- | --- | --- |
| `--count <n>` | number of accounts to create | `1` |
| `--proxy <url>` | route HTTP through a proxy (`http`/`https`/`socks5`) | – |
| `--cdp <ws-url>` | CDP WebSocket URL of your Chrome | `http://127.0.0.1:9222` |
| `--password <pw>` | fixed password for every account | random |
| `--connect-9router` | register each account into 9Router | off |
| `--router <url>` | 9Router base URL | `http://localhost:20128` |
| `--router-password <pw>` | 9Router login password | `123456` |
| `--prefix <p>` | provider prefix in 9Router | `agentscope` |
| `--out <file>` | JSON output path | `accounts.json` |
| `--csv <file>` | also write a CSV | – |
| `--delay <ms>` | pause between accounts | `2000` |

## 🌐 Transports

AgentScope's verification-e-mail gateway drops requests from low-reputation datacenter IPs, so a bare VPS/CI IP will seldom receive the code. Pick a transport that exits from a clean IP:

- **Proxy (recommended)** — `--proxy http://user:pass@host:port` or `socks5://…`. Also read from `AGENTSCOPE_PROXY` / `AGENTSCOPE_PROXY_FILE`.
- **Browser over CDP** — `--cdp ws://127.0.0.1:9222/<id>` (your own Chrome) or `BU_CDP_WS` (cloud browser). All calls are evaluated inside a page, inheriting the browser's IP and cookies.
- **Plain fetch** — the default fallback; fine for testing, unreliable for the e-mail step on a datacenter IP.

## 🔌 Connect to 9Router

9Router is a self-hosted, OpenAI-compatible router:

```bash
npm install -g 9router && 9router        # dashboard on http://localhost:20128
```

The connector registers one `openai-compatible` provider-node (prefix `agentscope`), attaches each account key as a connection, and mints a 9Router client key:

```
Endpoint : http://localhost:20128/v1
API key  : sk-<9router key>
Models   : agentscope/qwen3.8-flash, agentscope/qwen3.7-plus, agentscope/qwen3.8-max,
           agentscope/kimi-k3, agentscope/glm-5.2
```

Call it like any OpenAI endpoint:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<9router key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🧠 Available models

An `sk-as-…` key serves these models (as returned by `GET /v1/models`), routed
through 9Router under the `agentscope/` prefix:

| Model                     | Call as in 9Router                | Status                     |
| ------------------------- | --------------------------------- | -------------------------- |
| qwen3.8-flash             | `agentscope/qwen3.8-flash`        | ✅ works                    |
| qwen3.7-plus              | `agentscope/qwen3.7-plus`         | ✅ works                    |
| qwen3.8-max               | `agentscope/qwen3.8-max`          | ✅ works                    |
| kimi-k3                   | `agentscope/kimi-k3`              | ✅ works                    |
| glm-5.2                   | `agentscope/glm-5.2`              | ✅ works                    |
| deepseek-v4-flash         | `agentscope/deepseek-v4-flash`    | ⚠️ advertised, chat → *"Model not exist"* (upstream) |

`deepseek-v4-flash` is listed by `GET /v1/models` but the chat endpoint rejects
it — an AgentScope-side bug, not this toolkit. To refresh the list for your own
account:

```bash
curl https://platform.agentscope.io/v1/models -H "Authorization: Bearer sk-as-<your key>"
```

Note: the inference endpoint only accepts the minted `sk-as-…` key — the login
token is rejected with `ASP.PROXY.API_KEY_INVALID`.

## 📚 As a library

```js
const { MailTM, extractCode } = require('./src/mailtm');
const { provisionAccount } = require('./src/agentscope');
const { ProxyTransport } = require('./src/proxy');
const router = require('./src/connect-9router');

const transport = new ProxyTransport({ proxy: process.env.AGENTSCOPE_PROXY });
const mail = new MailTM({ transport });
const inbox = await mail.createInbox();

const acct = await provisionAccount({
  inbox,
  transport,
  waitCode: async () => {
    const msg = await mail.waitForMessage(inbox.token, /AgentScope|验证码|verify/i);
    return extractCode(msg);
  },
});
console.log(acct.apiKey); // sk-as-…

await router.connect({ apiKey: acct.apiKey, base: 'http://localhost:20128' });
```

## ⚙️ How it works

1. `POST /api/v1/auth/send-verify-email-code` `{ account, purpose:"register" }`
2. Read the 6-digit code from the mail.tm inbox.
3. `POST /api/v1/auth/register` `{ account, password, verifyCode }`
4. `POST /api/v1/auth/login` → captures the Bearer `accessToken`.
5. `POST /api/v1/users/me/model-api-key/reset` → full `sk-as-…` key.
6. Register the key into 9Router and list the exposed models.

See [`docs/PROTOCOL.md`](docs/PROTOCOL.md) for exact endpoints and payloads.

## 📁 Layout

See [`STRUCTURE.md`](STRUCTURE.md) for the full tree and data-flow diagram.

## ⚠️ Notes & limits

- **E-mail delivery is IP-sensitive *and* domain-sensitive.** AgentScope's gateway
  drops sends from low-reputation datacenter IPs, and it also filters some
  disposable-mail domains (mail.tm was served for a while and later blocked).
  If no code arrives, either run behind a residential proxy (`--proxy`) or point
  the toolkit at a different inbox via the `INBOX_*` env vars
  (see [`src/generic-inbox.js`](src/generic-inbox.js)) — the inbox provider is
  pluggable, so you are never stuck with one that is blocked.
- **Verification e-mails are rate-limited per account/IP.** Space out large batches; the toolkit writes results after every account so a crash never loses progress.
- `deepseek-v4-flash` is advertised by `/v1/models` but returns *“Model not exist”* — an upstream issue, not this toolkit.
- For personal/educational automation. Respect AgentScope's and 9Router's terms of service.

## 📄 License

[MIT](LICENSE) © 2026 0xgetz
