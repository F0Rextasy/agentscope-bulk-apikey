<div align="center">

<img src="../brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**Crea cuentas de [AgentScope Platform](https://platform.agentscope.io) en lote, genera automáticamente una clave de API Model para cada una y regístralas todas en [9Router](https://9router.com) — de principio a fin. Cero dependencias.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](../LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-conectar-con-9router)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-transportes)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-5%20languages-F59E0B.svg?style=for-the-badge)](#-idiomas)

[English](../README.md) · [Bahasa Indonesia](README.id.md) · [简体中文](README.zh.md) · [日本語](README.ja.md) · [Español](README.es.md) · [Deutsch](README.de.md)

</div>

---

## ✨ Características

- 🔑 **Cuentas + claves en lote** — una cuenta de AgentScope *y* una clave `sk-as-…` por ejecución.
- 📧 **Buzones desechables** — los códigos se leen de [mail.tm](https://mail.tm).
- 🔌 **Conector 9Router** — cada clave se registra como proveedor compatible con OpenAI.
- 🌐 **Tres transportes** — **proxy** residencial (HTTP/SOCKS5), **navegador** vía CDP, o `fetch` simple.
- 🪶 **Cero dependencias** — Node.js puro ≥ 18. Sin `npm install`.
- 📦 **Exportación** — resultados en JSON **y** CSV opcional.
- 🧩 **Biblioteca o CLI** — usa `provisionAccount()` o el comando `agentscope-bulk`.
- 🌍 **5 idiomas** — EN, ID, ZH, JA, ES, DE.

## 🚀 Inicio rápido

```bash
git clone https://github.com/0xgetz/agentscope-bulk-apikey
cd agentscope-bulk-apikey

node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

## 🛠 Uso

```bash
agentscope-bulk --count 3                 # 3 cuentas, sin router
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>
```

| Opción | Descripción | Por defecto |
| --- | --- | --- |
| `--count <n>` | número de cuentas | `1` |
| `--proxy <url>` | proxy (`http`/`https`/`socks5`) | – |
| `--cdp <ws-url>` | URL WebSocket CDP de Chrome | `http://127.0.0.1:9222` |
| `--password <pw>` | contraseña fija para todas | aleatoria |
| `--connect-9router` | registrar cada cuenta en 9Router | off |
| `--router <url>` | URL base de 9Router | `http://localhost:20128` |
| `--router-password <pw>` | contraseña de 9Router | `123456` |
| `--prefix <p>` | prefijo del proveedor | `agentscope` |
| `--out <file>` | ruta JSON | `accounts.json` |
| `--csv <file>` | escribir también CSV | – |
| `--delay <ms>` | pausa entre cuentas | `2000` |

## 🌐 Transportes

La puerta de correo de AgentScope descarta solicitudes de IP de centro de datos. Elige un transporte con IP limpia:

- **Proxy (recomendado)** — `--proxy http://user:pass@host:port` o `socks5://…` (`AGENTSCOPE_PROXY`).
- **Navegador vía CDP** — `--cdp ws://127.0.0.1:9222/<id>` o `BU_CDP_WS`.
- **fetch simple** — respaldo; poco fiable para el correo.

## 🔌 Conectar con 9Router

```bash
npm install -g 9router && 9router        # panel en http://localhost:20128
```

```
Endpoint : http://localhost:20128/v1
API key  : sk-<clave 9router>
Models   : agentscope/qwen3.8-flash, agentscope/qwen3.7-plus, agentscope/qwen3.8-max,
           agentscope/kimi-k3, agentscope/glm-5.2
```

## 🧠 Modelos disponibles

Una clave `sk-as-…` sirve estos modelos (según `GET /v1/models`), enrutados a
través de 9Router con el prefijo `agentscope/`:

| Modelo             | Llamar como en 9Router           | Estado                                    |
| ------------------ | -------------------------------- | ----------------------------------------- |
| qwen3.8-flash      | `agentscope/qwen3.8-flash`       | ✅ funciona                                |
| qwen3.7-plus       | `agentscope/qwen3.7-plus`        | ✅ funciona                                |
| qwen3.8-max        | `agentscope/qwen3.8-max`         | ✅ funciona                                |
| kimi-k3            | `agentscope/kimi-k3`             | ✅ funciona                                |
| glm-5.2            | `agentscope/glm-5.2`             | ✅ funciona                                |
| deepseek-v4-flash  | `agentscope/deepseek-v4-flash`   | ⚠️ listado, chat → *"Model not exist"* (lado AgentScope) |

`deepseek-v4-flash` aparece en `GET /v1/models` pero el endpoint de chat lo
rechaza — un bug del lado de AgentScope, no de este toolkit. El endpoint de
inferencia solo acepta la clave `sk-as-…` generada; el token de inicio de sesión
se rechaza con `ASP.PROXY.API_KEY_INVALID`.

## 📚 Como biblioteca

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

## ⚙️ Cómo funciona

1. `send-verify-email-code` → 2. leer el código de mail.tm → 3. `register` → 4. `login` (captura el token) → 5. `model-api-key/reset` → `sk-as-…` → 6. registrar en 9Router.

Detalles en [`docs/PROTOCOL.md`](../docs/PROTOCOL.md) y [`STRUCTURE.md`](../STRUCTURE.md).

## ⚠️ Notas

- **La entrega de correo depende de la IP.** Usa un proxy residencial o un navegador real.
- **Los correos de verificación tienen límite por cuenta/IP.** Espacia los lotes grandes; los resultados se guardan tras cada cuenta.
- `deepseek-v4-flash` aparece listado pero devuelve *“Model not exist”* (problema del proveedor).
- Para automatización personal/educativa. Respeta los términos de AgentScope y 9Router.

## 📄 Licencia

[MIT](../LICENSE) © 2026 0xgetz
