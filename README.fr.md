<div align="center">

<img src="brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**Créez en masse des comptes [AgentScope Platform](https://platform.agentscope.io), générez automatiquement une clé API Model pour chacun, et enregistrez chaque clé dans une instance [9Router](https://9router.com) en cours d'exécution — de bout en bout. Zéro dépendance.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-omniroute)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-transports)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-10%20languages-F59E0B.svg?style=for-the-badge)](#)

[✨ Fonctionnalités](#-features) · [🚀 Démarrage rapide](#-quick-start) · [🛠 Utilisation](#-usage) · [🌐 Transports](#-transports) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [🧠 Modèles](#-available-models) · [📚 Bibliothèque](#-as-a-library) · [⚙️ Fonctionnement](#-how-it-works) · [📄 Licence](#-license)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Fonctionnalités

- 🔑 **Comptes + clés API en masse** — un compte AgentScope *et* une clé API Model `sk-as-…` par exécution.
- 📧 **Boîtes de réception jetables** — les codes de vérification sont lus directement depuis [mail.tm](https://mail.tm) ; aucun compte e-mail nécessaire.
- 🔌 **Connecteur 9Router** — chaque clé est enregistrée comme fournisseur compatible OpenAI dans 9Router au cours de la même passe.
- 🌐 **Trois transports** — un **proxy** résidentiel (HTTP/SOCKS5), un vrai **navigateur via CDP**, ou un simple `fetch`.
- 🪶 **Zéro dépendance** — Node.js ≥ 18 pur. Pas de `npm install`, pas d'étape de build.
- 📦 **Exports** — résultats écrits en JSON **et** CSV en option.
- 🧩 **Bibliothèque ou CLI** — utilisez `provisionAccount()` dans le code, ou lancez la commande fournie `agentscope-bulk`.
- 🌍 **10 langues** — EN, TR, ZH, JA, KO, ES, FR, DE, RU, PT.

## 🚀 Démarrage rapide

```bash
git clone https://github.com/F0Rextasy/agentscope-bulk-apikey
cd agentscope-bulk-apikey

# 1 account, behind a residential proxy, into a local 9Router
node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

Cela affiche le compte créé, sa clé `sk-as-…`, l'identifiant de connexion au routeur, ainsi que l'endpoint et la clé du routeur que vous pouvez utiliser avec n'importe quel outil compatible OpenAI. Remplacez `--connect-9router` par `--connect-omniroute` pour enregistrer dans OmniRoute à la place.

### 🖱️ Le lanceur

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

`node src/launcher.js` (ou `npm start`) demande le nombre de comptes, la ligne
de proxy ou l'endpoint CDP, les fichiers de sortie et le budget de codes e-mail,
mémorise les réponses dans `launcher.config.json`, et exécute la CLI avec les
bons flags. Le dernier élément du menu parcourt `accounts.json` et enregistre
chaque clé auprès d'un 9Router local en une seule passe
(`node src/launcher.js --connect-9router`).

## 🛠 Utilisation

```bash
agentscope-bulk --count 3                 # 3 accounts, no router
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>   # drive a local Chrome
```

| Flag | Description | Default |
| --- | --- | --- |
| `--count <n>` | nombre de comptes à créer | `1` |
| `--proxy <url>` | router le HTTP via un proxy (`http`/`https`/`socks5`) | – |
| `--cdp <ws-url>` | URL WebSocket CDP de votre Chrome | `http://127.0.0.1:9222` |
| `--password <pw>` | mot de passe fixe pour chaque compte | aléatoire |
| `--connect-9router` | enregistrer chaque compte dans 9Router | désactivé |
| `--router <url>` | URL de base de 9Router | `http://localhost:20128` |
| `--router-password <pw>` | mot de passe de connexion 9Router | `123456` |
| `--prefix <p>` | préfixe du fournisseur dans 9Router | `agentscope` |
| `--out <file>` | chemin de sortie JSON | `accounts.json` |
| `--csv <file>` | écrire aussi un CSV | – |
| `--delay <ms>` | pause entre les comptes | `2000` |

## 🌐 Transports

La passerelle d'e-mails de vérification d'AgentScope rejette les requêtes provenant d'IP de datacenter à faible réputation, donc une simple IP de VPS/CI recevra rarement le code. Choisissez un transport qui sort depuis une IP propre :

- **Proxy (recommandé)** — `--proxy http://user:pass@host:port` ou `socks5://…`. Également lu depuis `AGENTSCOPE_PROXY` / `AGENTSCOPE_PROXY_FILE`.
- **Navigateur via CDP** — `--cdp ws://127.0.0.1:9222/<id>` (votre propre Chrome) ou `BU_CDP_WS` (navigateur cloud). Tous les appels sont évalués dans une page, héritant de l'IP et des cookies du navigateur.
- **Fetch simple** — le repli par défaut ; correct pour les tests, peu fiable pour l'étape e-mail sur une IP de datacenter.

## 🔌 Connexion à 9Router

9Router est un routeur auto-hébergé, compatible OpenAI :

```bash
npm install -g 9router && 9router        # dashboard on http://localhost:20128
```

Le connecteur enregistre un nœud fournisseur `openai-compatible` (préfixe `agentscope`), attache chaque clé de compte comme connexion, et génère une clé client 9Router :

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

Appelez-le comme n'importe quel endpoint OpenAI :

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<9router key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🔌 Connexion à OmniRoute

OmniRoute est un routeur auto-hébergé, compatible OpenAI :

```bash
npm install -g omniroute && omniroute        # dashboard on http://localhost:20128
```

Le connecteur enregistre un nœud fournisseur `openai-compatible` (préfixe `agentscope`), attache chaque clé de compte comme connexion, et génère une clé client OmniRoute :

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

Appelez-le comme n'importe quel endpoint OpenAI :

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<omniroute key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🧠 Modèles disponibles

Une clé `sk-as-…` donne accès à ces modèles (tels que renvoyés par `GET /v1/models`), routés
via 9Router sous le préfixe `agentscope/` :

| Model                     | Call as in 9Router                | Status                     |
| ------------------------- | --------------------------------- | -------------------------- |
| qwen3.8-flash             | `agentscope/qwen3.8-flash`        | ✅ fonctionne                    |
| qwen3.7-plus              | `agentscope/qwen3.7-plus`         | ✅ fonctionne                    |
| qwen3.8-max               | `agentscope/qwen3.8-max`          | ✅ fonctionne                    |
| kimi-k3                   | `agentscope/kimi-k3`              | ✅ fonctionne                    |
| glm-5.2                   | `agentscope/glm-5.2`              | ✅ fonctionne                    |
| deepseek-v4-flash         | `agentscope/deepseek-v4-flash`    | ⚠️ annoncé, chat → *"Model not exist"* (amont) |

`deepseek-v4-flash` est listé par `GET /v1/models` mais l'endpoint de chat le
rejette — un bug côté AgentScope, pas de cette boîte à outils. Pour actualiser la liste pour votre propre
compte :

```bash
curl https://platform.agentscope.io/v1/models -H "Authorization: Bearer sk-as-<your key>"
```

Remarque : l'endpoint d'inférence n'accepte que la clé `sk-as-…` générée — le jeton
de connexion est rejeté avec `ASP.PROXY.API_KEY_INVALID`.

## 📚 En tant que bibliothèque

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

## ⚙️ Fonctionnement

1. `POST /api/v1/auth/send-verify-email-code` `{ account, purpose:"register" }`
2. Lire le code à 6 chiffres depuis la boîte mail.tm.
3. `POST /api/v1/auth/register` `{ account, password, verifyCode }`
4. `POST /api/v1/auth/login` → capture le `accessToken` Bearer.
5. `POST /api/v1/users/me/model-api-key/reset` → clé `sk-as-…` complète.
6. Enregistrer la clé dans 9Router et lister les modèles exposés.

Voir [`docs/PROTOCOL.md`](docs/PROTOCOL.md) pour les endpoints et payloads exacts.

## 📁 Arborescence

Voir [`STRUCTURE.md`](STRUCTURE.md) pour l'arborescence complète et le diagramme de flux de données.

## ⚠️ Remarques et limites

- **La livraison des e-mails est sensible à l'IP *et* au domaine.** La passerelle d'AgentScope
  rejette les envois depuis des IP de datacenter à faible réputation, et elle filtre aussi certains
  domaines de mail jetable (mail.tm a été servi un temps puis bloqué plus tard).
  Si aucun code n'arrive, exécutez soit derrière un proxy résidentiel (`--proxy`), soit pointez
  la boîte à outils vers une autre boîte de réception via les variables d'environnement `INBOX_*`
  (voir [`src/generic-inbox.js`](src/generic-inbox.js)) — le fournisseur de boîte de réception est
  enfichable, donc vous n'êtes jamais bloqué avec un fournisseur bloqué.
- **Les e-mails de vérification sont limités en débit par compte/IP.** Espacez les gros lots ; la boîte à outils écrit les résultats après chaque compte afin qu'un crash ne perde jamais la progression.
- `deepseek-v4-flash` est annoncé par `/v1/models` mais renvoie *« Model not exist »* — un problème en amont, pas de cette boîte à outils.
- Pour l'automatisation personnelle/éducative. Respectez les conditions d'utilisation d'AgentScope et de 9Router.

## 📄 Licence

[MIT](LICENSE) © 2026 0xgetz