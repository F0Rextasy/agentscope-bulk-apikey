<div align="center">

<img src="../brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**Erstelle [AgentScope Platform](https://platform.agentscope.io)-Konten im Bulk, generiere automatisch einen Model-API-Schlüssel pro Konto und registriere alle in einer laufenden [9Router](https://9router.com)-Instanz — Ende-zu-Ende. Null Abhängigkeiten.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](../LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-mit-9router-verbinden)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-transporte)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-5%20languages-F59E0B.svg?style=for-the-badge)](#)

[English](../README.md) · [Bahasa Indonesia](README.id.md) · [简体中文](README.zh.md) · [日本語](README.ja.md) · [Español](README.es.md) · [Deutsch](README.de.md)

</div>

---

## ✨ Funktionen

- 🔑 **Konten + Schlüssel im Bulk** — ein AgentScope-Konto *und* ein `sk-as-…`-Schlüssel pro Durchlauf.
- 📧 **Wegwerf-Postfächer** — Codes direkt von [mail.tm](https://mail.tm).
- 🔌 **9Router-Connector** — jeder Schlüssel wird sofort als OpenAI-kompatibler Provider registriert.
- 🌐 **Drei Transporte** — **Proxy** (HTTP/SOCKS5), **Browser** über CDP oder einfaches `fetch`.
- 🪶 **Null Abhängigkeiten** — reines Node.js ≥ 18. Kein `npm install`.
- 📦 **Export** — Ergebnisse als JSON **und** optional CSV.
- 🧩 **Library oder CLI** — `provisionAccount()` im Code oder der Befehl `agentscope-bulk`.
- 🌍 **5 Sprachen** — EN, ID, ZH, JA, ES, DE.

## 🚀 Schnellstart

```bash
git clone https://github.com/0xgetz/agentscope-bulk-apikey
cd agentscope-bulk-apikey

node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

## 🛠 Verwendung

```bash
agentscope-bulk --count 3                 # 3 Konten, kein Router
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>
```

| Flag | Beschreibung | Standard |
| --- | --- | --- |
| `--count <n>` | Anzahl der Konten | `1` |
| `--proxy <url>` | über Proxy (`http`/`https`/`socks5`) | – |
| `--cdp <ws-url>` | CDP-WebSocket-URL von Chrome | `http://127.0.0.1:9222` |
| `--password <pw>` | festes Passwort für alle Konten | zufällig |
| `--connect-9router` | jedes Konto in 9Router registrieren | aus |
| `--router <url>` | 9Router-Basis-URL | `http://localhost:20128` |
| `--router-password <pw>` | 9Router-Login-Passwort | `123456` |
| `--prefix <p>` | Provider-Präfix | `agentscope` |
| `--out <file>` | JSON-Ausgabepfad | `accounts.json` |
| `--csv <file>` | zusätzlich CSV schreiben | – |
| `--delay <ms>` | Pause zwischen Konten | `2000` |

## 🌐 Transporte

Das E-Mail-Gateway von AgentScope verwirft Anfragen von Datacenter-IPs. Wähle einen Transport mit sauberer IP:

- **Proxy (empfohlen)** — `--proxy http://user:pass@host:port` oder `socks5://…` (`AGENTSCOPE_PROXY`).
- **Browser via CDP** — `--cdp ws://127.0.0.1:9222/<id>` oder `BU_CDP_WS`.
- **Einfaches fetch** — Fallback; für den E-Mail-Schritt unzuverlässig.

## 🔌 Mit 9Router verbinden

```bash
npm install -g 9router && 9router        # Dashboard auf http://localhost:20128
```

```
Endpoint : http://localhost:20128/v1
API key  : sk-<9router-Schlüssel>
Models   : agentscope/qwen3.8-flash, agentscope/qwen3.7-plus, agentscope/qwen3.8-max,
           agentscope/kimi-k3, agentscope/glm-5.2
```

## 🧠 Verfügbare Modelle

Ein `sk-as-…`-Schlüssel bedient diese Modelle (laut `GET /v1/models`), über
9Router mit dem Präfix `agentscope/` geroutet:

| Modell             | Aufruf in 9Router                | Status                                    |
| ------------------ | -------------------------------- | ----------------------------------------- |
| qwen3.8-flash      | `agentscope/qwen3.8-flash`       | ✅ funktioniert                            |
| qwen3.7-plus       | `agentscope/qwen3.7-plus`        | ✅ funktioniert                            |
| qwen3.8-max        | `agentscope/qwen3.8-max`         | ✅ funktioniert                            |
| kimi-k3            | `agentscope/kimi-k3`             | ✅ funktioniert                            |
| glm-5.2            | `agentscope/glm-5.2`             | ✅ funktioniert                            |
| deepseek-v4-flash  | `agentscope/deepseek-v4-flash`   | ⚠️ gelistet, Chat → *"Model not exist"* (AgentScope-Seite) |

`deepseek-v4-flash` steht in `GET /v1/models`, aber der Chat-Endpunkt lehnt es
ab — ein Bug auf AgentScope-Seite, nicht dieses Toolkits. Der Inferenz-Endpunkt
akzeptiert nur den generierten `sk-as-…`-Schlüssel; das Login-Token wird mit
`ASP.PROXY.API_KEY_INVALID` abgelehnt.

## 📚 Als Library

```js
const { MailTM, extractCode } = require('./src/mailtm');
const { provisionAccount } = require('./src/agentscope');
const { ProxyTransport } = require('./src/proxy');
const router = require('./src/connect-9router');

const transport = new ProxyTransport({ proxy: process.env.AGENTSCOPE_PROXY });
const mail = new MailTM({ transport });
const inbox = await mail.createInbox();
const acct = await provisionAccount({ inbox, transport,
  waitCode: async () => extractCode(await mail.waitForMessage(inbox.token, /AgentScope|验证码|verify/i)) });
await router.connect({ apiKey: acct.apiKey, base: 'http://localhost:20128' });
```

## ⚙️ Funktionsweise

1. `send-verify-email-code` → 2. Code von mail.tm lesen → 3. `register` → 4. `login` (Token erfassen) → 5. `model-api-key/reset` → `sk-as-…` → 6. in 9Router registrieren.

Details in [`docs/PROTOCOL.md`](../docs/PROTOCOL.md) und [`STRUCTURE.md`](../STRUCTURE.md).

## ⚠️ Hinweise

- **E-Mail-Zustellung ist IP-abhängig.** Nutze einen Residential-Proxy oder einen echten Browser.
- **Verifizierungs-Mails sind pro Konto/IP limitiert.** Große Stapel mit Abstand; Ergebnisse werden nach jedem Konto gespeichert.
- `deepseek-v4-flash` ist gelistet, liefert aber *„Model not exist“* (Upstream-Problem).
- Für persönliche/edukative Automatisierung. Beachte die Nutzungsbedingungen von AgentScope und 9Router.

## 📄 Lizenz

[MIT](../LICENSE) © 2026 0xgetz
