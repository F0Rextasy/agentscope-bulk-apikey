<div align="center">

<img src="../brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**[AgentScope Platform](https://platform.agentscope.io) のアカウントを一括作成し、各アカウントに Model API キーを自動発行して、すべて [9Router](https://9router.com) に登録します — エンドツーエンド。依存ゼロ。**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](../LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-9router-への接続)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-トランスポート)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-5%20languages-F59E0B.svg?style=for-the-badge)](#)

[English](../README.md) · [Bahasa Indonesia](README.id.md) · [简体中文](README.zh.md) · [日本語](README.ja.md) · [Español](README.es.md) · [Deutsch](README.de.md)

</div>

---

## ✨ 特長

- 🔑 **アカウント + API キーの一括作成** — 1 回の実行で AgentScope アカウントと `sk-as-…` キーを 1 つずつ。
- 📧 **使い捨て受信箱** — 確認コードは [mail.tm](https://mail.tm) から直接取得。
- 🔌 **9Router コネクタ** — 各キーを OpenAI 互換プロバイダとして即時登録。
- 🌐 **3 つのトランスポート** — 住宅用 **プロキシ**（HTTP/SOCKS5）、**ブラウザ**（CDP）、通常の `fetch`。
- 🪶 **依存ゼロ** — 純粋な Node.js ≥ 18。`npm install` 不要。
- 📦 **エクスポート** — 結果を JSON **および**任意の CSV に出力。
- 🧩 **ライブラリ / CLI** — `provisionAccount()` を使うか `agentscope-bulk` を実行。
- 🌍 **5 言語** — EN, ID, ZH, JA, ES, DE。

## 🚀 クイックスタート

```bash
git clone https://github.com/0xgetz/agentscope-bulk-apikey
cd agentscope-bulk-apikey

node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

## 🛠 使い方

```bash
agentscope-bulk --count 3                 # 3 アカウント、ルーターなし
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>
```

| フラグ | 説明 | 既定値 |
| --- | --- | --- |
| `--count <n>` | 作成するアカウント数 | `1` |
| `--proxy <url>` | プロキシ経由（`http`/`https`/`socks5`） | – |
| `--cdp <ws-url>` | Chrome の CDP WebSocket URL | `http://127.0.0.1:9222` |
| `--password <pw>` | 全アカウント共通パスワード | ランダム |
| `--connect-9router` | 各アカウントを 9Router に登録 | オフ |
| `--router <url>` | 9Router のベース URL | `http://localhost:20128` |
| `--router-password <pw>` | 9Router ログインパスワード | `123456` |
| `--prefix <p>` | プロバイダ接頭辞 | `agentscope` |
| `--out <file>` | JSON 出力先 | `accounts.json` |
| `--csv <file>` | CSV も書き出す | – |
| `--delay <ms>` | アカウント間の待機 | `2000` |

## 🌐 トランスポート

AgentScope のメール送信ゲートウェイはデータセンター IP からのリクエストを破棄します。クリーンな IP のトランスポートを選んでください:

- **プロキシ（推奨）** — `--proxy http://user:pass@host:port` または `socks5://…`（`AGENTSCOPE_PROXY`）。
- **ブラウザ CDP** — `--cdp ws://127.0.0.1:9222/<id>` または `BU_CDP_WS`。
- **通常 fetch** — フォールバック。メール工程では不安定。

## 🔌 9Router への接続

```bash
npm install -g 9router && 9router        # ダッシュボード http://localhost:20128
```

```
Endpoint : http://localhost:20128/v1
API key  : sk-<9router key>
Models   : agentscope/qwen3.8-flash, agentscope/qwen3.7-plus, agentscope/qwen3.8-max,
           agentscope/kimi-k3, agentscope/glm-5.2
```

## 🔌 OmniRoute への接続

```bash
npm install -g omniroute && omniroute        # ダッシュボード http://localhost:20128
```

```
Endpoint : http://localhost:20128/v1
API key  : sk-<omniroute key>
Models   : agentscope/qwen3.8-flash, agentscope/qwen3.7-plus, agentscope/qwen3.8-max,
           agentscope/kimi-k3, agentscope/glm-5.2
```

## 🧠 利用可能なモデル

`sk-as-…` キーは以下のモデルを提供します（`GET /v1/models` より）。9Router 経由では
`agentscope/` プレフィックスでルーティングされます:

| モデル             | 9Router での呼び出し             | 状態                                        |
| ------------------ | -------------------------------- | ------------------------------------------- |
| qwen3.8-flash      | `agentscope/qwen3.8-flash`       | ✅ 動作                                      |
| qwen3.7-plus       | `agentscope/qwen3.7-plus`        | ✅ 動作                                      |
| qwen3.8-max        | `agentscope/qwen3.8-max`         | ✅ 動作                                      |
| kimi-k3            | `agentscope/kimi-k3`             | ✅ 動作                                      |
| glm-5.2            | `agentscope/glm-5.2`             | ✅ 動作                                      |
| deepseek-v4-flash  | `agentscope/deepseek-v4-flash`   | ⚠️ 一覧にはあるが chat は *"Model not exist"*（AgentScope 側） |

`deepseek-v4-flash` は `GET /v1/models` に載っていますがチャットエンドポイントは
拒否します — AgentScope 側のバグで、このツールキットの問題ではありません。推論
エンドポイントは発行済みの `sk-as-…` キーのみを受け付け、ログイントークンは
`ASP.PROXY.API_KEY_INVALID` で拒否されます。

## 📚 ライブラリとして

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

## ⚙️ 仕組み

1. `send-verify-email-code` → 2. mail.tm からコード取得 → 3. `register` → 4. `login`（トークン取得）→ 5. `model-api-key/reset` → `sk-as-…` → 6. 9Router に登録。

詳細は [`docs/PROTOCOL.md`](../docs/PROTOCOL.md) と [`STRUCTURE.md`](../STRUCTURE.md)。

## ⚠️ 注意

- **メール配送は IP に敏感。** 住宅用プロキシか実ブラウザを使用してください。
- **確認メールはアカウント/IP ごとに制限。** 大量処理は間隔を空けて。結果は各アカウント後に保存されます。
- `deepseek-v4-flash` は一覧にありますが *“Model not exist”* を返します（上流の問題）。
- 個人・学習用途向け。AgentScope と 9Router の利用規約を守ってください。

## 📄 ライセンス

[MIT](../LICENSE) © 2026 0xgetz
