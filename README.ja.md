<div align="center">

<img src="brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**[AgentScope Platform](https://platform.agentscope.io) のアカウントを一括作成し、それぞれに Model API キーを自動発行し、すべてのキーを稼働中の [9Router](https://9router.com) インスタンスに登録します — エンドツーエンド。依存関係ゼロ。**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-omniroute)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-transports)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-10%20languages-F59E0B.svg?style=for-the-badge)](#)

[✨ 機能](#-features) · [🚀 クイックスタート](#-quick-start) · [🛠 使い方](#-usage) · [🌐 トランスポート](#-transports) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [🧠 モデル](#-available-models) · [📚 ライブラリ](#-as-a-library) · [⚙️ 仕組み](#-how-it-works) · [📄 ライセンス](#-license)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 機能

- 🔑 **アカウント + API キーの一括作成** — 1 回の実行につき AgentScope アカウント *1 つ* と `sk-as-…` Model API キー *1 つ*。
- 📧 **使い捨て受信トレイ** — 認証コードは [mail.tm](https://mail.tm) から直接読み取ります。メールアカウントは不要です。
- 🔌 **9Router コネクタ** — すべてのキーが同じパスで 9Router に OpenAI 互換プロバイダーとして登録されます。
- 🌐 **3 つのトランスポート** — レジデンシャル **プロキシ** (HTTP/SOCKS5)、CDP 経由の実 **ブラウザ**、または通常の `fetch`。
- 🪶 **依存関係ゼロ** — 純粋な Node.js ≥ 18。`npm install` もビルドステップも不要です。
- 📦 **エクスポート** — 結果は JSON **および** オプションの CSV に書き出されます。
- 🧩 **ライブラリまたは CLI** — コード内で `provisionAccount()` を使うか、同梱の `agentscope-bulk` コマンドを実行します。
- 🌍 **10 言語** — EN、TR、ZH、JA、KO、ES、FR、DE、RU、PT。

## 🚀 クイックスタート

```bash
git clone https://github.com/F0Rextasy/agentscope-bulk-apikey
cd agentscope-bulk-apikey

# 1 account, behind a residential proxy, into a local 9Router
node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

作成されたアカウント、その `sk-as-…` キー、ルーター接続 ID、そして任意の OpenAI 互換ツールを向けられるルーターのエンドポイント + キーが出力されます。OmniRoute に登録する場合は `--connect-9router` を `--connect-omniroute` に置き換えてください。

### 🖱️ ランチャー

```

╔═════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                         ║
║   █████╗  ██████╗ ███████╗███╗   ██╗████████╗███████╗ ██████╗ ██████╗ ██████╗ ███████╗  ║
║  ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝  ║
║  ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ███████╗██║     ██║   ██║██████╔╝█████╗    ║
║  ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║██║     ██║   ██║██╔═══╝ ██╔══╝    ║
║  ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ███████║╚██████╗╚██████╔╝██║     ███████╗  ║
║  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚══════╝  ║
║                                                                                         ║
║  agentscope-bulk-apikey                                                                 ║
║  one account → one key, proxy or CDP transport                                          ║
║                                                                                         ║
╚═════════════════════════════════════════════════════════════════════════════════════════╝
  agentscope-bulk-apikey contributors · MIT
```

`node src/launcher.js`（または `npm start`）は、アカウント数、プロキシ行または CDP エンドポイント、出力ファイル、メールコードの予算を尋ね、回答を `launcher.config.json` に記憶し、適切なフラグを付けて CLI を実行します。最後のメニュー項目は `accounts.json` を走査し、すべてのキーを 1 回のパスでローカル 9Router に登録します（`node src/launcher.js --connect-9router`）。

## 🛠 使い方

```bash
agentscope-bulk --count 3                 # 3 accounts, no router
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>   # drive a local Chrome
```

| フラグ | 説明 | デフォルト |
| --- | --- | --- |
| `--count <n>` | 作成するアカウント数 | `1` |
| `--proxy <url>` | プロキシ経由で HTTP をルーティング (`http`/`https`/`socks5`) | – |
| `--cdp <ws-url>` | あなたの Chrome の CDP WebSocket URL | `http://127.0.0.1:9222` |
| `--password <pw>` | すべてのアカウントの固定パスワード | ランダム |
| `--connect-9router` | 各アカウントを 9Router に登録 | オフ |
| `--router <url>` | 9Router のベース URL | `http://localhost:20128` |
| `--router-password <pw>` | 9Router のログインパスワード | `123456` |
| `--prefix <p>` | 9Router 内のプロバイダープレフィックス | `agentscope` |
| `--out <file>` | JSON 出力パス | `accounts.json` |
| `--csv <file>` | CSV も書き出す | – |
| `--delay <ms>` | アカウント間の一時停止 | `2000` |

## 🌐 トランスポート

AgentScope の認証メールゲートウェイは、評判の低いデータセンター IP からのリクエストを拒否するため、素の VPS/CI IP ではコードを受け取れることはほとんどありません。クリーンな IP から出るトランスポートを選んでください:

- **プロキシ（推奨）** — `--proxy http://user:pass@host:port` または `socks5://…`。`AGENTSCOPE_PROXY` / `AGENTSCOPE_PROXY_FILE` からも読み取ります。
- **CDP 経由のブラウザ** — `--cdp ws://127.0.0.1:9222/<id>`（あなた自身の Chrome）または `BU_CDP_WS`（クラウドブラウザ）。すべての呼び出しはページ内で評価され、ブラウザの IP と Cookie を継承します。
- **通常の fetch** — デフォルトのフォールバック。テストには十分ですが、データセンター IP ではメールステップの信頼性が低くなります。

## 🔌 9Router への接続

9Router はセルフホスト型の OpenAI 互換ルーターです:

```bash
npm install -g 9router && 9router        # dashboard on http://localhost:20128
```

コネクタは 1 つの `openai-compatible` プロバイダーノード（プレフィックス `agentscope`）を登録し、各アカウントキーを接続としてアタッチし、9Router クライアントキーを発行します:

```bash
node src/cli.js --count 1 --connect-9router      # mint + register in one pass
node src/connect-9router.js                      # or register the keys you already have
```

```
Endpoint : http://localhost:20128/v1
API key  : sk-<9router key>
Models   : agentscope/qwen3.8-flash, agentscope/qwen3.7-plus, agentscope/qwen3.8-max,
           agentscope/kimi-k3, agentscope/glm-5.2
```

任意の OpenAI エンドポイントと同様に呼び出せます:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<9router key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🔌 OmniRoute への接続

OmniRoute はセルフホスト型の OpenAI 互換ルーターです:

```bash
npm install -g omniroute && omniroute        # dashboard on http://localhost:20128
```

コネクタは 1 つの `openai-compatible` プロバイダーノード（プレフィックス `agentscope`）を登録し、各アカウントキーを接続としてアタッチし、OmniRoute クライアントキーを発行します:

```bash
node src/cli.js --count 1 --connect-omniroute    # mint + register in one pass
node src/connect-omniroute.js                    # or register the keys you already have
```

```
Endpoint : http://localhost:20128/v1
API key  : sk-<omniroute key>
Models   : agentscope/qwen3.8-flash, agentscope/qwen3.7-plus, agentscope/qwen3.8-max,
           agentscope/kimi-k3, agentscope/glm-5.2
```

任意の OpenAI エンドポイントと同様に呼び出せます:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<omniroute key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🧠 利用可能なモデル

`sk-as-…` キーはこれらのモデルを提供します（`GET /v1/models` が返すとおり）。9Router を通じて `agentscope/` プレフィックスの下でルーティングされます:

| モデル                     | 9Router での呼び出し方                | ステータス                     |
| ------------------------- | --------------------------------- | -------------------------- |
| qwen3.8-flash             | `agentscope/qwen3.8-flash`        | ✅ 動作します                    |
| qwen3.7-plus              | `agentscope/qwen3.7-plus`         | ✅ 動作します                    |
| qwen3.8-max               | `agentscope/qwen3.8-max`          | ✅ 動作します                    |
| kimi-k3                   | `agentscope/kimi-k3`              | ✅ 動作します                    |
| glm-5.2                   | `agentscope/glm-5.2`              | ✅ 動作します                    |
| deepseek-v4-flash         | `agentscope/deepseek-v4-flash`    | ⚠️ 宣伝されているが、chat → *"Model not exist"*（上流） |

`deepseek-v4-flash` は `GET /v1/models` にリストされていますが、chat エンドポイントはそれを拒否します — これは AgentScope 側のバグであり、このツールキットの問題ではありません。自分のアカウント用にリストを更新するには:

```bash
curl https://platform.agentscope.io/v1/models -H "Authorization: Bearer sk-as-<your key>"
```

注: 推論エンドポイントは発行された `sk-as-…` キーのみを受け付けます — ログイントークンは `ASP.PROXY.API_KEY_INVALID` で拒否されます。

## 📚 ライブラリとして

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

## ⚙️ 仕組み

1. `POST /api/v1/auth/send-verify-email-code` `{ account, purpose:"register" }`
2. mail.tm の受信トレイから 6 桁のコードを読み取ります。
3. `POST /api/v1/auth/register` `{ account, password, verifyCode }`
4. `POST /api/v1/auth/login` → Bearer `accessToken` を取得します。
5. `POST /api/v1/users/me/model-api-key/reset` → 完全な `sk-as-…` キー。
6. キーを 9Router に登録し、公開されているモデルを一覧表示します。

正確なエンドポイントとペイロードについては [`docs/PROTOCOL.md`](docs/PROTOCOL.md) を参照してください。

## 📁 レイアウト

完全なツリーとデータフロー図については [`STRUCTURE.md`](STRUCTURE.md) を参照してください。

## ⚠️ 注意事項と制限

- **メール配信は IP に敏感で、*かつ* ドメインにも敏感です。** AgentScope のゲートウェイは、評判の低いデータセンター IP からの送信を拒否し、一部の使い捨てメールドメインもフィルタリングします（mail.tm はしばらく提供された後、ブロックされました）。コードが届かない場合は、レジデンシャルプロキシの背後で実行する（`--proxy`）か、`INBOX_*` 環境変数を介してツールキットを別の受信トレイに向けてください（[`src/generic-inbox.js`](src/generic-inbox.js) を参照） — 受信トレイプロバイダーはプラグイン可能なので、ブロックされたものに縛られることはありません。
- **認証メールはアカウント/IP ごとにレート制限されています。** 大量のバッチは間隔を空けてください。ツールキットは各アカウントの後に結果を書き出すため、クラッシュしても進捗が失われることはありません。
- `deepseek-v4-flash` は `/v1/models` によって宣伝されていますが、*「Model not exist」* を返します — これは上流の問題であり、このツールキットの問題ではありません。
- 個人/教育目的の自動化向けです。AgentScope と 9Router の利用規約を尊重してください。

## 📄 ライセンス

[MIT](LICENSE) © 2026 0xgetz