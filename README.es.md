<div align="center">

<img src="brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**Crea cuentas de [AgentScope Platform](https://platform.agentscope.io) en masa, genera automáticamente una clave de API de Modelo para cada una y registra cada clave en una instancia de [9Router](https://9router.com) en ejecución — de principio a fin. Cero dependencias.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-omniroute)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-transports)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-10%20languages-F59E0B.svg?style=for-the-badge)](#)

[✨ Características](#-features) · [🚀 Inicio rápido](#-quick-start) · [🛠 Uso](#-usage) · [🌐 Transportes](#-transports) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [🧠 Modelos](#-available-models) · [📚 Biblioteca](#-as-a-library) · [⚙️ Cómo funciona](#-how-it-works) · [📄 Licencia](#-license)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Características

- 🔑 **Cuenta + clave de API en masa** — una cuenta de AgentScope *y* una clave de API de Modelo `sk-as-…` por ejecución.
- 📧 **Bandejas desechables** — los códigos de verificación se leen directamente de [mail.tm](https://mail.tm); no se necesita una cuenta de correo.
- 🔌 **Conector 9Router** — cada clave se registra como un proveedor compatible con OpenAI en 9Router en la misma pasada.
- 🌐 **Tres transportes** — un **proxy** residencial (HTTP/SOCKS5), un **navegador real sobre CDP**, o `fetch` simple.
- 🪶 **Cero dependencias** — Node.js puro ≥ 18. Sin `npm install`, sin paso de compilación.
- 📦 **Exportaciones** — resultados escritos en JSON **y** CSV opcional.
- 🧩 **Biblioteca o CLI** — usa `provisionAccount()` en código, o ejecuta el comando incluido `agentscope-bulk`.
- 🌍 **10 idiomas** — EN, TR, ZH, JA, KO, ES, FR, DE, RU, PT.

## 🚀 Inicio rápido

```bash
git clone https://github.com/F0Rextasy/agentscope-bulk-apikey
cd agentscope-bulk-apikey

# 1 account, behind a residential proxy, into a local 9Router
node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

Eso imprime la cuenta creada, su clave `sk-as-…`, el id de conexión del router, y el endpoint + clave del router que puedes usar para apuntar cualquier herramienta compatible con OpenAI. Cambia `--connect-9router` por `--connect-omniroute` para registrar en OmniRoute en su lugar.

### 🖱️ El lanzador

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

`node src/launcher.js` (o `npm start`) pregunta por la cantidad de cuentas, la
línea de proxy o el endpoint CDP, los archivos de salida y el presupuesto de
códigos de correo, recuerda las respuestas en `launcher.config.json`, y ejecuta
la CLI con los flags correctos. El último elemento del menú recorre
`accounts.json` y registra cada clave con un 9Router local en una sola pasada
(`node src/launcher.js --connect-9router`).

## 🛠 Uso

```bash
agentscope-bulk --count 3                 # 3 accounts, no router
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>   # drive a local Chrome
```

| Flag | Descripción | Predeterminado |
| --- | --- | --- |
| `--count <n>` | número de cuentas a crear | `1` |
| `--proxy <url>` | enruta HTTP a través de un proxy (`http`/`https`/`socks5`) | – |
| `--cdp <ws-url>` | URL WebSocket CDP de tu Chrome | `http://127.0.0.1:9222` |
| `--password <pw>` | contraseña fija para cada cuenta | aleatoria |
| `--connect-9router` | registra cada cuenta en 9Router | desactivado |
| `--router <url>` | URL base de 9Router | `http://localhost:20128` |
| `--router-password <pw>` | contraseña de inicio de sesión de 9Router | `123456` |
| `--prefix <p>` | prefijo del proveedor en 9Router | `agentscope` |
| `--out <file>` | ruta de salida JSON | `accounts.json` |
| `--csv <file>` | también escribe un CSV | – |
| `--delay <ms>` | pausa entre cuentas | `2000` |

## 🌐 Transportes

La puerta de enlace de correo de verificación de AgentScope descarta las
solicitudes de IPs de centros de datos con baja reputación, por lo que una IP
simple de VPS/CI rara vez recibirá el código. Elige un transporte que salga
desde una IP limpia:

- **Proxy (recomendado)** — `--proxy http://user:pass@host:port` o `socks5://…`. También se lee desde `AGENTSCOPE_PROXY` / `AGENTSCOPE_PROXY_FILE`.
- **Navegador sobre CDP** — `--cdp ws://127.0.0.1:9222/<id>` (tu propio Chrome) o `BU_CDP_WS` (navegador en la nube). Todas las llamadas se evalúan dentro de una página, heredando la IP y las cookies del navegador.
- **Fetch simple** — el fallback predeterminado; sirve para pruebas, poco fiable para el paso de correo en una IP de centro de datos.

## 🔌 Conectar con 9Router

9Router es un router autoalojado compatible con OpenAI:

```bash
npm install -g 9router && 9router        # dashboard on http://localhost:20128
```

El conector registra un nodo-proveedor `openai-compatible` (prefijo `agentscope`), adjunta cada clave de cuenta como una conexión, y genera una clave de cliente de 9Router:

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

Llama a él como a cualquier endpoint de OpenAI:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<9router key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🔌 Conectar con OmniRoute

OmniRoute es un router autoalojado compatible con OpenAI:

```bash
npm install -g omniroute && omniroute        # dashboard on http://localhost:20128
```

El conector registra un nodo-proveedor `openai-compatible` (prefijo `agentscope`), adjunta cada clave de cuenta como una conexión, y genera una clave de cliente de OmniRoute:

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

Llama a él como a cualquier endpoint de OpenAI:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<omniroute key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🧠 Modelos disponibles

Una clave `sk-as-…` sirve estos modelos (según lo devuelto por `GET /v1/models`),
enrutados a través de 9Router bajo el prefijo `agentscope/`:

| Modelo                    | Llamar como en 9Router            | Estado                     |
| ------------------------- | --------------------------------- | -------------------------- |
| qwen3.8-flash             | `agentscope/qwen3.8-flash`        | ✅ funciona                 |
| qwen3.7-plus              | `agentscope/qwen3.7-plus`         | ✅ funciona                 |
| qwen3.8-max               | `agentscope/qwen3.8-max`          | ✅ funciona                 |
| kimi-k3                   | `agentscope/kimi-k3`              | ✅ funciona                 |
| glm-5.2                   | `agentscope/glm-5.2`              | ✅ funciona                 |
| deepseek-v4-flash         | `agentscope/deepseek-v4-flash`    | ⚠️ anunciado, chat → *"Model not exist"* (upstream) |

`deepseek-v4-flash` aparece en `GET /v1/models` pero el endpoint de chat lo
rechaza — un bug del lado de AgentScope, no de este toolkit. Para actualizar la
lista para tu propia cuenta:

```bash
curl https://platform.agentscope.io/v1/models -H "Authorization: Bearer sk-as-<your key>"
```

Nota: el endpoint de inferencia solo acepta la clave `sk-as-…` generada — el
token de inicio de sesión se rechaza con `ASP.PROXY.API_KEY_INVALID`.

## 📚 Como biblioteca

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

## ⚙️ Cómo funciona

1. `POST /api/v1/auth/send-verify-email-code` `{ account, purpose:"register" }`
2. Lee el código de 6 dígitos de la bandeja de mail.tm.
3. `POST /api/v1/auth/register` `{ account, password, verifyCode }`
4. `POST /api/v1/auth/login` → captura el `accessToken` Bearer.
5. `POST /api/v1/users/me/model-api-key/reset` → clave completa `sk-as-…`.
6. Registra la clave en 9Router y lista los modelos expuestos.

Consulta [`docs/PROTOCOL.md`](docs/PROTOCOL.md) para los endpoints y payloads exactos.

## 📁 Estructura

Consulta [`STRUCTURE.md`](STRUCTURE.md) para el árbol completo y el diagrama de flujo de datos.

## ⚠️ Notas y límites

- **La entrega de correo es sensible a la IP *y* al dominio.** La puerta de enlace
  de AgentScope descarta los envíos desde IPs de centros de datos con baja
  reputación, y también filtra algunos dominios de correo desechable (mail.tm
  estuvo disponible un tiempo y luego fue bloqueado). Si no llega ningún código,
  ejecuta detrás de un proxy residencial (`--proxy`) o apunta el toolkit a otra
  bandeja mediante las variables de entorno `INBOX_*`
  (consulta [`src/generic-inbox.js`](src/generic-inbox.js)) — el proveedor de
  bandeja es conectable, así que nunca quedas atascado con uno que esté bloqueado.
- **Los correos de verificación tienen límite de tasa por cuenta/IP.** Espacia los lotes grandes; el toolkit escribe los resultados después de cada cuenta para que un fallo nunca pierda el progreso.
- `deepseek-v4-flash` aparece anunciado por `/v1/models` pero devuelve *"Model not exist"* — un problema upstream, no de este toolkit.
- Para automatización personal/educativa. Respeta los términos de servicio de AgentScope y 9Router.

## 📄 Licencia

[MIT](LICENSE) © 2026 0xgetz