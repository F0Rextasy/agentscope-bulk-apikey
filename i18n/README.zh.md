<div align="center">

<img src="../brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**批量创建 [AgentScope Platform](https://platform.agentscope.io) 账号，为每个账号自动生成 Model API 密钥，并全部注册到 [9Router](https://9router.com) —— 端到端。零依赖。**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](../LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-连接到-9router)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-传输方式)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-5%20languages-F59E0B.svg?style=for-the-badge)](#-语言)

[English](../README.md) · [Bahasa Indonesia](README.id.md) · [简体中文](README.zh.md) · [日本語](README.ja.md) · [Español](README.es.md) · [Deutsch](README.de.md)

</div>

---

## ✨ 功能特性

- 🔑 **批量账号 + 密钥** —— 每次运行创建一个 AgentScope 账号*和*一个 `sk-as-…` 密钥。
- 📧 **一次性邮箱** —— 直接从 [mail.tm](https://mail.tm) 读取验证码。
- 🔌 **9Router 连接器** —— 每个密钥即时注册为 OpenAI 兼容提供商。
- 🌐 **三种传输** —— 住宅 **代理**（HTTP/SOCKS5）、**浏览器**（CDP）或普通 `fetch`。
- 🪶 **零依赖** —— 纯 Node.js ≥ 18，无需 `npm install`。
- 📦 **导出** —— 结果写入 JSON **和**可选 CSV。
- 🧩 **库或 CLI** —— 代码中用 `provisionAccount()`，或运行 `agentscope-bulk`。
- 🌍 **5 种语言** —— EN、ID、ZH、JA、ES、DE。

## 🚀 快速开始

```bash
git clone https://github.com/0xgetz/agentscope-bulk-apikey
cd agentscope-bulk-apikey

node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

## 🛠 用法

```bash
agentscope-bulk --count 3                 # 3 个账号，不连接路由器
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>
```

| 参数 | 说明 | 默认 |
| --- | --- | --- |
| `--count <n>` | 创建账号数量 | `1` |
| `--proxy <url>` | 通过代理（`http`/`https`/`socks5`） | – |
| `--cdp <ws-url>` | Chrome 的 CDP WebSocket 地址 | `http://127.0.0.1:9222` |
| `--password <pw>` | 所有账号固定密码 | 随机 |
| `--connect-9router` | 将每个账号注册到 9Router | 关 |
| `--router <url>` | 9Router 地址 | `http://localhost:20128` |
| `--router-password <pw>` | 9Router 登录密码 | `123456` |
| `--prefix <p>` | 提供商前缀 | `agentscope` |
| `--out <file>` | JSON 输出路径 | `accounts.json` |
| `--csv <file>` | 同时写 CSV | – |
| `--delay <ms>` | 账号间暂停 | `2000` |

## 🌐 传输方式

AgentScope 的验证邮件网关会丢弃来自数据中心 IP 的请求。请选择干净 IP 的传输：

- **代理（推荐）** —— `--proxy http://user:pass@host:port` 或 `socks5://…`（`AGENTSCOPE_PROXY`）。
- **浏览器 CDP** —— `--cdp ws://127.0.0.1:9222/<id>` 或 `BU_CDP_WS`。
- **普通 fetch** —— 兜底方案，邮件环节不可靠。

## 🔌 连接到 9Router

```bash
npm install -g 9router && 9router        # 面板 http://localhost:20128
```

```
Endpoint : http://localhost:20128/v1
API key  : sk-<9router 密钥>
Models   : agentscope/qwen3.8-flash, agentscope/qwen3.7-plus, agentscope/qwen3.8-max,
           agentscope/kimi-k3, agentscope/glm-5.2
```

## 🧠 可用模型

`sk-as-…` 密钥提供以下模型（来自 `GET /v1/models`），经 9Router 以 `agentscope/`
前缀路由：

| 模型               | 在 9Router 中调用                | 状态                                      |
| ------------------ | -------------------------------- | ----------------------------------------- |
| qwen3.8-flash      | `agentscope/qwen3.8-flash`       | ✅ 可用                                    |
| qwen3.7-plus       | `agentscope/qwen3.7-plus`        | ✅ 可用                                    |
| qwen3.8-max        | `agentscope/qwen3.8-max`         | ✅ 可用                                    |
| kimi-k3            | `agentscope/kimi-k3`             | ✅ 可用                                    |
| glm-5.2            | `agentscope/glm-5.2`             | ✅ 可用                                    |
| deepseek-v4-flash  | `agentscope/deepseek-v4-flash`   | ⚠️ 已列出，但聊天返回 *"Model not exist"*（AgentScope 侧问题） |

`deepseek-v4-flash` 出现在 `GET /v1/models` 中，但聊天端点拒绝它 —— 这是
AgentScope 侧的 bug，与本工具无关。推理端点只接受铸造出的 `sk-as-…` 密钥，
登录令牌会被拒绝（`ASP.PROXY.API_KEY_INVALID`）。

## 📚 作为库使用

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

## ⚙️ 工作原理

1. `send-verify-email-code` → 2. 从 mail.tm 读取验证码 → 3. `register` → 4. `login`（捕获令牌）→ 5. `model-api-key/reset` → `sk-as-…` → 6. 注册到 9Router。

详见 [`docs/PROTOCOL.md`](../docs/PROTOCOL.md) 与 [`STRUCTURE.md`](../STRUCTURE.md)。

## ⚠️ 说明

- **邮件投递对 IP 敏感。** 请使用住宅代理或真实浏览器。
- **验证邮件按账号/IP 限流。** 大批量请分批并留出间隔；每个账号后都会写入结果。
- `deepseek-v4-flash` 已列出但返回 *“Model not exist”*（上游问题）。
- 仅供个人/教育用途。请遵守 AgentScope 与 9Router 的服务条款。

## 📄 许可证

[MIT](../LICENSE) © 2026 0xgetz
