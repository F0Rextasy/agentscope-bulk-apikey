<div align="center">

<img src="brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**Erstelle [AgentScope Platform](https://platform.agentscope.io)-Konten in großem Umfang, generiere automatisch einen Model-API-Schlüssel für jedes Konto und registriere jeden Schlüssel in einer laufenden [9Router](https://9router.com)-Instanz — von Anfang bis Ende. Keine Abhängigkeiten.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-omniroute)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-transports)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-10%20languages-F59E0B.svg?style=for-the-badge)](#)

[✨ Funktionen](#-features) · [🚀 Schnellstart](#-quick-start) · [🛠 Verwendung](#-usage) · [🌐 Transporte](#-transports) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [🧠 Modelle](#-available-models) · [📚 Bibliothek](#-as-a-library) · [⚙️ Funktionsweise](#-how-it-works) · [📄 Lizenz](#-license)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Funktionen

- 🔑 **Konten + API-Schlüssel in großem Umfang** — ein AgentScope-Konto *und* ein `sk-as-…` Model-API-Schlüssel pro Durchlauf.
- 📧 **Wegwerf-Postfächer** — Verifizierungscodes werden direkt von [mail.tm](https://mail.tm) gelesen; kein E-Mail-Konto erforderlich.
- 🔌 **9Router-Connector** — jeder Schlüssel wird im selben Durchgang als OpenAI-kompatibler Anbieter in 9Router registriert.
- 🌐 **Drei Transporte** — ein Residential-**Proxy** (HTTP/SOCKS5), ein echter **Browser über CDP** oder einfaches `fetch`.
- 🪶 **Keine Abhängigkeiten** — reines Node.js ≥ 18. Kein `npm install`, kein Build-Schritt.
- 📦 **Exporte** — Ergebnisse werden als JSON **und** optional als CSV geschrieben.
- 🧩 **Bibliothek oder CLI** — verwende `provisionAccount()` im Code oder führe den mitgelieferten Befehl `agentscope-bulk` aus.
- 🌍 **10 Sprachen** — EN, TR, ZH, JA, KO, ES, FR, DE, RU, PT.

## 🚀 Schnellstart

```bash
git clone https://github.com/F0Rextasy/agentscope-bulk-apikey
cd agentscope-bulk-apikey

# 1 account, behind a residential proxy, into a local 9Router
node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

Das gibt das erstellte Konto, seinen `sk-as-…`-Schlüssel, die Router-Verbindungs-ID sowie den Router-Endpunkt + Schlüssel aus, auf den du jedes OpenAI-kompatible Tool zeigen lassen kannst. Ersetze `--connect-9router` durch `--connect-omniroute`, um stattdessen in OmniRoute zu registrieren.

### 🖱️ Der Launcher

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

`node src/launcher.js` (oder `npm start`) fragt nach der Anzahl der Konten, der Proxy-Zeile oder dem CDP-Endpunkt, den Ausgabedateien und dem Budget für E-Mail-Codes, merkt sich die Antworten in `launcher.config.json` und führt die CLI mit den richtigen Flags aus. Der letzte Menüpunkt durchläuft `accounts.json` und registriert jeden Schlüssel in einem Durchgang bei einem lokalen 9Router (`node src/launcher.js --connect-9router`).

## 🛠 Verwendung

```bash
agentscope-bulk --count 3                 # 3 accounts, no router
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>   # drive a local Chrome
```

| Flag | Beschreibung | Standard |
| --- | --- | --- |
| `--count <n>` | Anzahl der zu erstellenden Konten | `1` |
| `--proxy <url>` | HTTP über einen Proxy leiten (`http`/`https`/`socks5`) | – |
| `--cdp <ws-url>` | CDP-WebSocket-URL deines Chrome | `http://127.0.0.1:9222` |
| `--password <pw>` | festes Passwort für jedes Konto | zufällig |
| `--connect-9router` | jedes Konto in 9Router registrieren | aus |
| `--router <url>` | 9Router-Basis-URL | `http://localhost:20128` |
| `--router-password <pw>` | 9Router-Login-Passwort | `123456` |
| `--prefix <p>` | Anbieter-Präfix in 9Router | `agentscope` |
| `--out <file>` | JSON-Ausgabepfad | `accounts.json` |
| `--csv <file>` | zusätzlich eine CSV schreiben | – |
| `--delay <ms>` | Pause zwischen den Konten | `2000` |

## 🌐 Transporte

Das Verifizierungs-E-Mail-Gateway von AgentScope verwirft Anfragen von Datacenter-IPs mit geringer Reputation, sodass eine reine VPS/CI-IP selten den Code erhält. Wähle einen Transport, der über eine saubere IP ausgeht:

- **Proxy (empfohlen)** — `--proxy http://user:pass@host:port` oder `socks5://…`. Wird auch aus `AGENTSCOPE_PROXY` / `AGENTSCOPE_PROXY_FILE` gelesen.
- **Browser über CDP** — `--cdp ws://127.0.0.1:9222/<id>` (dein eigener Chrome) oder `BU_CDP_WS` (Cloud-Browser). Alle Aufrufe werden innerhalb einer Seite ausgewertet und übernehmen die IP und Cookies des Browsers.
- **Einfaches fetch** — der Standard-Fallback; gut zum Testen, unzuverlässig für den E-Mail-Schritt auf einer Datacenter-IP.

## 🔌 Verbindung mit 9Router

9Router ist ein selbst gehosteter, OpenAI-kompatibler Router:

```bash
npm install -g 9router && 9router        # dashboard on http://localhost:20128
```

Der Connector registriert einen `openai-compatible`-Provider-Node (Präfix `agentscope`), hängt jeden Kontoschlüssel als Verbindung an und generiert einen 9Router-Client-Schlüssel:

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

Rufe es wie jeden OpenAI-Endpunkt auf:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<9router key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🔌 Verbindung mit OmniRoute

OmniRoute ist ein selbst gehosteter, OpenAI-kompatibler Router:

```bash
npm install -g omniroute && omniroute        # dashboard on http://localhost:20128
```

Der Connector registriert einen `openai-compatible`-Provider-Node (Präfix `agentscope`), hängt jeden Kontoschlüssel als Verbindung an und generiert einen OmniRoute-Client-Schlüssel:

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

Rufe es wie jeden OpenAI-Endpunkt auf:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<omniroute key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🧠 Verfügbare Modelle

Ein `sk-as-…`-Schlüssel bedient diese Modelle (wie von `GET /v1/models` zurückgegeben), geroutet
über 9Router unter dem Präfix `agentscope/`:

| Modell                    | Aufruf wie in 9Router             | Status                     |
| ------------------------- | --------------------------------- | -------------------------- |
| qwen3.8-flash             | `agentscope/qwen3.8-flash`        | ✅ funktioniert             |
| qwen3.7-plus              | `agentscope/qwen3.7-plus`         | ✅ funktioniert             |
| qwen3.8-max               | `agentscope/qwen3.8-max`          | ✅ funktioniert             |
| kimi-k3                   | `agentscope/kimi-k3`              | ✅ funktioniert             |
| glm-5.2                   | `agentscope/glm-5.2`              | ✅ funktioniert             |
| deepseek-v4-flash         | `agentscope/deepseek-v4-flash`    | ⚠️ angekündigt, Chat → *"Model not exist"* (Upstream) |

`deepseek-v4-flash` wird von `GET /v1/models` aufgelistet, aber der Chat-Endpunkt lehnt
es ab — ein Fehler auf AgentScope-Seite, nicht dieses Toolkit. Um die Liste für dein eigenes
Konto zu aktualisieren:

```bash
curl https://platform.agentscope.io/v1/models -H "Authorization: Bearer sk-as-<your key>"
```

Hinweis: Der Inferenz-Endpunkt akzeptiert nur den generierten `sk-as-…`-Schlüssel — das Login-
Token wird mit `ASP.PROXY.API_KEY_INVALID` abgelehnt.

## 📚 Als Bibliothek

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

## ⚙️ Funktionsweise

1. `POST /api/v1/auth/send-verify-email-code` `{ account, purpose:"register" }`
2. Den 6-stelligen Code aus dem mail.tm-Postfach lesen.
3. `POST /api/v1/auth/register` `{ account, password, verifyCode }`
4. `POST /api/v1/auth/login` → erfasst das Bearer-`accessToken`.
5. `POST /api/v1/users/me/model-api-key/reset` → vollständiger `sk-as-…`-Schlüssel.
6. Den Schlüssel in 9Router registrieren und die bereitgestellten Modelle auflisten.

Siehe [`docs/PROTOCOL.md`](docs/PROTOCOL.md) für die genauen Endpunkte und Payloads.

## 📁 Struktur

Siehe [`STRUCTURE.md`](STRUCTURE.md) für den vollständigen Baum und das Datenflussdiagramm.

## ⚠️ Hinweise & Einschränkungen

- **Die E-Mail-Zustellung ist IP-sensitiv *und* domain-sensitiv.** Das Gateway von
  AgentScope verwirft Sendungen von Datacenter-IPs mit geringer Reputation und filtert
  außerdem einige Wegwerf-Mail-Domains (mail.tm wurde eine Zeit lang bedient und später blockiert).
  Wenn kein Code ankommt, führe das Ganze entweder hinter einem Residential-Proxy (`--proxy`) aus oder richte
  das Toolkit über die `INBOX_*`-Umgebungsvariablen auf ein anderes Postfach aus
  (siehe [`src/generic-inbox.js`](src/generic-inbox.js)) — der Postfach-Anbieter ist
  austauschbar, sodass du nie an einen blockierten gebunden bist.
- **Verifizierungs-E-Mails sind pro Konto/IP ratenbegrenzt.** Verteile große Stapel; das Toolkit schreibt Ergebnisse nach jedem Konto, sodass ein Absturz nie Fortschritt verliert.
- `deepseek-v4-flash` wird von `/v1/models` angekündigt, gibt aber *„Model not exist“* zurück — ein Upstream-Problem, nicht dieses Toolkit.
- Für persönliche/edukative Automatisierung. Respektiere die Nutzungsbedingungen von AgentScope und 9Router.

## 📄 Lizenz

[MIT](LICENSE) © 2026 0xgetz