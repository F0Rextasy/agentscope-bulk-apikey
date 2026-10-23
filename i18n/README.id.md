<div align="center">

<img src="../brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**Buat akun [AgentScope Platform](https://platform.agentscope.io) secara massal, hasilkan kunci API Model otomatis untuk tiap akun, dan daftarkan semuanya ke [9Router](https://9router.com) — menyeluruh. Tanpa dependensi.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](../LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-sambungkan-ke-9router)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-transport)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-5%20languages-F59E0B.svg?style=for-the-badge)](#)

[English](../README.md) · [Bahasa Indonesia](README.id.md) · [简体中文](README.zh.md) · [日本語](README.ja.md) · [Español](README.es.md) · [Deutsch](README.de.md)

</div>

---

## ✨ Fitur

- 🔑 **Akun + kunci API massal** — satu akun AgentScope *dan* satu kunci `sk-as-…` per proses.
- 📧 **Kotak masuk sekali pakai** — kode verifikasi dibaca langsung dari [mail.tm](https://mail.tm).
- 🔌 **Konektor 9Router** — setiap kunci didaftarkan sebagai provider OpenAI-compatible di 9Router.
- 🌐 **Tiga transport** — **proxy** residensial (HTTP/SOCKS5), **browser** lewat CDP, atau `fetch` biasa.
- 🪶 **Tanpa dependensi** — Node.js ≥ 18 murni. Tanpa `npm install`.
- 📦 **Ekspor** — hasil ditulis ke JSON **dan** CSV opsional.
- 🧩 **Library atau CLI** — pakai `provisionAccount()` di kode, atau perintah `agentscope-bulk`.
- 🌍 **5 bahasa** — EN, ID, ZH, JA, ES, DE.

## 🚀 Mulai cepat

```bash
git clone https://github.com/0xgetz/agentscope-bulk-apikey
cd agentscope-bulk-apikey

node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

## 🛠 Penggunaan

```bash
agentscope-bulk --count 3                 # 3 akun, tanpa router
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>
```

| Flag | Keterangan | Bawaan |
| --- | --- | --- |
| `--count <n>` | jumlah akun | `1` |
| `--proxy <url>` | lewat proxy (`http`/`https`/`socks5`) | – |
| `--cdp <ws-url>` | URL WebSocket CDP Chrome Anda | `http://127.0.0.1:9222` |
| `--password <pw>` | kata sandi tetap untuk semua akun | acak |
| `--connect-9router` | daftarkan tiap akun ke 9Router | mati |
| `--router <url>` | URL dasar 9Router | `http://localhost:20128` |
| `--router-password <pw>` | kata sandi login 9Router | `123456` |
| `--prefix <p>` | prefiks provider di 9Router | `agentscope` |
| `--out <file>` | path keluaran JSON | `accounts.json` |
| `--csv <file>` | tulis CSV juga | – |
| `--delay <ms>` | jeda antar akun | `2000` |

## 🌐 Transport

Gateway email verifikasi AgentScope menjatuhkan permintaan dari IP datacenter. Pilih transport yang keluar dari IP bersih:

- **Proxy (disarankan)** — `--proxy http://user:pass@host:port` atau `socks5://…` (`AGENTSCOPE_PROXY`).
- **Browser lewat CDP** — `--cdp ws://127.0.0.1:9222/<id>` atau `BU_CDP_WS`.
- **Fetch biasa** — cadangan; kurang andal untuk langkah email.

## 🔌 Sambungkan ke 9Router

```bash
npm install -g 9router && 9router        # dasbor di http://localhost:20128
```

```
Endpoint : http://localhost:20128/v1
API key  : sk-<kunci 9router>
Model    : agentscope/qwen3.8-flash, agentscope/qwen3.7-plus, agentscope/qwen3.8-max,
           agentscope/kimi-k3, agentscope/glm-5.2
```

## 🔌 Sambungkan ke OmniRoute

```bash
npm install -g omniroute && omniroute        # dasbor di http://localhost:20128
```

```
Endpoint : http://localhost:20128/v1
API key  : sk-<kunci omniroute>
Model    : agentscope/qwen3.8-flash, agentscope/qwen3.7-plus, agentscope/qwen3.8-max,
           agentscope/kimi-k3, agentscope/glm-5.2
```

## 🧠 Model yang tersedia

Kunci `sk-as-…` melayani model berikut (dari `GET /v1/models`), dirutekan lewat
9Router dengan prefiks `agentscope/`:

| Model              | Panggil sebagai 9Router         | Status                                   |
| ------------------ | ------------------------------- | ---------------------------------------- |
| qwen3.8-flash      | `agentscope/qwen3.8-flash`      | ✅ berfungsi                              |
| qwen3.7-plus       | `agentscope/qwen3.7-plus`       | ✅ berfungsi                              |
| qwen3.8-max        | `agentscope/qwen3.8-max`        | ✅ berfungsi                              |
| kimi-k3            | `agentscope/kimi-k3`            | ✅ berfungsi                              |
| glm-5.2            | `agentscope/glm-5.2`            | ✅ berfungsi                              |
| deepseek-v4-flash  | `agentscope/deepseek-v4-flash`  | ⚠️ terdaftar, chat → *"Model not exist"* (sisi AgentScope) |

`deepseek-v4-flash` ada di `GET /v1/models` tetapi endpoint chat menolaknya —
bug di sisi AgentScope, bukan toolkit ini. Endpoint inferensi hanya menerima
kunci `sk-as-…` hasil mint; token login ditolak dengan
`ASP.PROXY.API_KEY_INVALID`.

## 📚 Sebagai library

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

## ⚙️ Cara kerja

1. `send-verify-email-code` → 2. baca kode dari mail.tm → 3. `register` → 4. `login` (tangkap token) → 5. `model-api-key/reset` → `sk-as-…` → 6. daftarkan ke 9Router.

Detail lengkap di [`docs/PROTOCOL.md`](../docs/PROTOCOL.md) dan [`STRUCTURE.md`](../STRUCTURE.md).

## ⚠️ Catatan

- **Pengiriman email sensitif terhadap IP.** Gunakan proxy residensial atau browser asli.
- **Email verifikasi dibatasi per akun/IP.** Beri jeda untuk batch besar; hasil ditulis tiap akun.
- `deepseek-v4-flash` terdaftar tetapi mengembalikan *“Model not exist”* (masalah upstream).
- Untuk otomasi pribadi/edukasi. Patuhi ToS AgentScope dan 9Router.

## 📄 Lisensi

[MIT](../LICENSE) © 2026 0xgetz
