<div align="center">

<img src="brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**批量创建 [AgentScope Platform](https://platform.agentscope.io) 账户，为每个账户自动铸造一个 Model API 密钥，并将每个密钥注册到正在运行的 [9Router](https://9router.com) 实例中——端到端完成。零依赖。**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-omniroute)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-transports)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-10%20languages-F59E0B.svg?style=for-the-badge)](#)

[✨ 功能](#-features) · [🚀 快速开始](#-quick-start) · [🛠 用法](#-usage) · [🌐 传输方式](#-transports) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [🧠 模型](#-available-models) · [📚 作为库使用](#-as-a-library) · [⚙️ 工作原理](#-how-it-works) · [📄 许可证](#-license)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 功能

- 🔑 **批量账户 + API 密钥**——每次运行创建一个 AgentScope 账户*和*一个 `sk-as-…` Model API 密钥。
- 📧 **一次性收件箱**——验证码直接从 [mail.tm](https://mail.tm) 读取；无需电子邮件账户。
- 🔌 **9Router 连接器**——每个密钥在同一次运行中注册为 9Router 中的 OpenAI 兼容提供商。
- 🌐 **三种传输方式**——住宅**代理**（HTTP/SOCKS5）、通过 CDP 的真实**浏览器**，或普通 `fetch`。
- 🪶 **零依赖**——纯 Node.js ≥ 18。无需 `npm install`，无需构建步骤。
- 📦 **导出**——结果写入 JSON **以及**可选的 CSV。
- 🧩 **库或 CLI**——在代码中使用 `provisionAccount()`，或运行捆绑的 `agentscope-bulk` 命令。
- 🌍 **10 种语言**——EN、TR、ZH、JA、KO、ES、FR、DE、RU、PT。

## 🚀 快速开始

```bash
git clone https://github.com/F0Rextasy/agentscope-bulk-apikey
cd agentscope-bulk-apikey

# 1 account, behind a residential proxy, into a local 9Router
node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

这会打印创建的账户、其 `sk-as-…` 密钥、路由器连接 id，以及你可以将任何 OpenAI 兼容工具指向的路由器端点和密钥。将 `--connect-9router` 换成 `--connect-omniroute` 即可改为注册到 OmniRoute。

### 🖱️ 启动器

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

`node src/launcher.js`（或 `npm start`）会询问账户数量、代理行或 CDP 端点、输出文件和电子邮件验证码预算，将答案记住在 `launcher.config.json` 中，并使用正确的标志运行 CLI。最后一个菜单项会遍历 `accounts.json`，并在一次运行中将每个密钥注册到本地 9Router（`node src/launcher.js --connect-9router`）。

## 🛠 用法

```bash
agentscope-bulk --count 3                 # 3 accounts, no router
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>   # drive a local Chrome
```

| 标志 | 描述 | 默认值 |
| --- | --- | --- |
| `--count <n>` | 要创建的账户数量 | `1` |
| `--proxy <url>` | 通过代理路由 HTTP（`http`/`https`/`socks5`） | – |
| `--cdp <ws-url>` | 你的 Chrome 的 CDP WebSocket URL | `http://127.0.0.1:9222` |
| `--password <pw>` | 每个账户的固定密码 | 随机 |
| `--connect-9router` | 将每个账户注册到 9Router | 关闭 |
| `--router <url>` | 9Router 基础 URL | `http://localhost:20128` |
| `--router-password <pw>` | 9Router 登录密码 | `123456` |
| `--prefix <p>` | 9Router 中的提供商前缀 | `agentscope` |
| `--out <file>` | JSON 输出路径 | `accounts.json` |
| `--csv <file>` | 同时写入 CSV | – |
| `--delay <ms>` | 账户之间的暂停 | `2000` |

## 🌐 传输方式

AgentScope 的验证电子邮件网关会丢弃来自低信誉数据中心 IP 的请求，因此裸 VPS/CI IP 很少能收到验证码。请选择从干净 IP 出口的传输方式：

- **代理（推荐）**——`--proxy http://user:pass@host:port` 或 `socks5://…`。也可从 `AGENTSCOPE_PROXY` / `AGENTSCOPE_PROXY_FILE` 读取。
- **通过 CDP 的浏览器**——`--cdp ws://127.0.0.1:9222/<id>`（你自己的 Chrome）或 `BU_CDP_WS`（云浏览器）。所有调用都在页面内求值，继承浏览器的 IP 和 cookie。
- **普通 fetch**——默认回退方案；适合测试，但在数据中心 IP 上进行电子邮件步骤时不可靠。

## 🔌 连接到 9Router

9Router 是一个自托管的、OpenAI 兼容的路由器：

```bash
npm install -g 9router && 9router        # dashboard on http://localhost:20128
```

连接器注册一个 `openai-compatible` 提供商节点（前缀 `agentscope`），将每个账户密钥附加为连接，并铸造一个 9Router 客户端密钥：

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

像调用任何 OpenAI 端点一样调用它：

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<9router key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🔌 连接到 OmniRoute

OmniRoute 是一个自托管的、OpenAI 兼容的路由器：

```bash
npm install -g omniroute && omniroute        # dashboard on http://localhost:20128
```

连接器注册一个 `openai-compatible` 提供商节点（前缀 `agentscope`），将每个账户密钥附加为连接，并铸造一个 OmniRoute 客户端密钥：

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

像调用任何 OpenAI 端点一样调用它：

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<omniroute key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🧠 可用模型

一个 `sk-as-…` 密钥可提供以下模型（由 `GET /v1/models` 返回），通过 9Router 在 `agentscope/` 前缀下路由：

| 模型                     | 在 9Router 中的调用方式                | 状态                     |
| ------------------------- | --------------------------------- | -------------------------- |
| qwen3.8-flash             | `agentscope/qwen3.8-flash`        | ✅ 可用                    |
| qwen3.7-plus              | `agentscope/qwen3.7-plus`         | ✅ 可用                    |
| qwen3.8-max               | `agentscope/qwen3.8-max`          | ✅ 可用                    |
| kimi-k3                   | `agentscope/kimi-k3`              | ✅ 可用                    |
| glm-5.2                   | `agentscope/glm-5.2`              | ✅ 可用                    |
| deepseek-v4-flash         | `agentscope/deepseek-v4-flash`    | ⚠️ 已公布，聊天 → *"Model not exist"*（上游） |

`deepseek-v4-flash` 被 `GET /v1/models` 列出，但聊天端点拒绝它——这是 AgentScope 侧的错误，不是本工具包的问题。要为你自己的账户刷新列表：

```bash
curl https://platform.agentscope.io/v1/models -H "Authorization: Bearer sk-as-<your key>"
```

注意：推理端点只接受铸造的 `sk-as-…` 密钥——登录令牌会被拒绝，并返回 `ASP.PROXY.API_KEY_INVALID`。

## 📚 作为库使用

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

## ⚙️ 工作原理

1. `POST /api/v1/auth/send-verify-email-code` `{ account, purpose:"register" }`
2. 从 mail.tm 收件箱读取 6 位验证码。
3. `POST /api/v1/auth/register` `{ account, password, verifyCode }`
4. `POST /api/v1/auth/login` → 捕获 Bearer `accessToken`。
5. `POST /api/v1/users/me/model-api-key/reset` → 完整的 `sk-as-…` 密钥。
6. 将密钥注册到 9Router 并列出暴露的模型。

有关确切的端点和负载，请参阅 [`docs/PROTOCOL.md`](docs/PROTOCOL.md)。

## 📁 布局

有关完整的目录树和数据流图，请参阅 [`STRUCTURE.md`](STRUCTURE.md)。

## ⚠️ 注意事项与限制

- **电子邮件投递对 IP *和*域名都敏感。** AgentScope 的网关会丢弃来自低信誉数据中心 IP 的发送，并且还会过滤一些一次性邮件域名（mail.tm 曾一度可用，后来被屏蔽）。如果没有收到验证码，要么在住宅代理后面运行（`--proxy`），要么通过 `INBOX_*` 环境变量将工具包指向其他收件箱（参见 [`src/generic-inbox.js`](src/generic-inbox.js)）——收件箱提供商是可插拔的，因此你永远不会被一个被屏蔽的提供商困住。
- **验证电子邮件按账户/IP 限速。** 大批量时请拉开间隔；工具包在每个账户后写入结果，因此崩溃永远不会丢失进度。
- `deepseek-v4-flash` 被 `/v1/models` 公布，但返回 *“Model not exist”*——这是上游问题，不是本工具包的问题。
- 用于个人/教育自动化。请遵守 AgentScope 和 9Router 的服务条款。

## 📄 许可证

[MIT](LICENSE) © 2026 0xgetz