<div align="center">

<img src="brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**Crie contas em massa na [AgentScope Platform](https://platform.agentscope.io), gere automaticamente uma chave de API de Modelo para cada uma e registre todas as chaves em uma instância do [9Router](https://9router.com) em execução — de ponta a ponta. Zero dependências.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-omniroute)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-transports)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-10%20languages-F59E0B.svg?style=for-the-badge)](#)

[✨ Recursos](#-features) · [🚀 Início rápido](#-quick-start) · [🛠 Uso](#-usage) · [🌐 Transportes](#-transports) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [🧠 Modelos](#-available-models) · [📚 Biblioteca](#-as-a-library) · [⚙️ Como funciona](#-how-it-works) · [📄 Licença](#-license)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Recursos

- 🔑 **Conta + chave de API em massa** — uma conta AgentScope *e* uma chave de API de Modelo `sk-as-…` por execução.
- 📧 **Caixas de entrada descartáveis** — os códigos de verificação são lidos diretamente do [mail.tm](https://mail.tm); nenhuma conta de e-mail é necessária.
- 🔌 **Conector 9Router** — cada chave é registrada como um provedor compatível com OpenAI no 9Router na mesma passagem.
- 🌐 **Três transportes** — um **proxy** residencial (HTTP/SOCKS5), um **navegador real via CDP**, ou `fetch` simples.
- 🪶 **Zero dependências** — Node.js puro ≥ 18. Sem `npm install`, sem etapa de build.
- 📦 **Exportações** — resultados gravados em JSON **e** CSV opcional.
- 🧩 **Biblioteca ou CLI** — use `provisionAccount()` no código, ou execute o comando `agentscope-bulk` incluído.
- 🌍 **10 idiomas** — EN, TR, ZH, JA, KO, ES, FR, DE, RU, PT.

## 🚀 Início rápido

```bash
git clone https://github.com/F0Rextasy/agentscope-bulk-apikey
cd agentscope-bulk-apikey

# 1 account, behind a residential proxy, into a local 9Router
node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

Isso imprime a conta criada, sua chave `sk-as-…`, o id de conexão do roteador, e o endpoint + chave do roteador que você pode apontar para qualquer ferramenta compatível com OpenAI. Troque `--connect-9router` por `--connect-omniroute` para registrar no OmniRoute em vez disso.

### 🖱️ O launcher

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

`node src/launcher.js` (ou `npm start`) pergunta a quantidade de contas, a linha
do proxy ou o endpoint CDP, os arquivos de saída e o orçamento de códigos de
e-mail, memoriza as respostas em `launcher.config.json`, e executa a CLI com as
flags corretas. O último item do menu percorre `accounts.json` e registra cada
chave em um 9Router local em uma única passagem (`node src/launcher.js --connect-9router`).

## 🛠 Uso

```bash
agentscope-bulk --count 3                 # 3 accounts, no router
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>   # drive a local Chrome
```

| Flag | Descrição | Padrão |
| --- | --- | --- |
| `--count <n>` | número de contas a criar | `1` |
| `--proxy <url>` | roteia HTTP através de um proxy (`http`/`https`/`socks5`) | – |
| `--cdp <ws-url>` | URL WebSocket CDP do seu Chrome | `http://127.0.0.1:9222` |
| `--password <pw>` | senha fixa para cada conta | aleatória |
| `--connect-9router` | registra cada conta no 9Router | desligado |
| `--router <url>` | URL base do 9Router | `http://localhost:20128` |
| `--router-password <pw>` | senha de login do 9Router | `123456` |
| `--prefix <p>` | prefixo do provedor no 9Router | `agentscope` |
| `--out <file>` | caminho de saída JSON | `accounts.json` |
| `--csv <file>` | também grava um CSV | – |
| `--delay <ms>` | pausa entre contas | `2000` |

## 🌐 Transportes

O gateway de e-mail de verificação da AgentScope descarta requisições de IPs de datacenter com baixa reputação, então um IP simples de VPS/CI raramente receberá o código. Escolha um transporte que saia de um IP limpo:

- **Proxy (recomendado)** — `--proxy http://user:pass@host:port` ou `socks5://…`. Também lido de `AGENTSCOPE_PROXY` / `AGENTSCOPE_PROXY_FILE`.
- **Navegador via CDP** — `--cdp ws://127.0.0.1:9222/<id>` (seu próprio Chrome) ou `BU_CDP_WS` (navegador na nuvem). Todas as chamadas são avaliadas dentro de uma página, herdando o IP e os cookies do navegador.
- **Fetch simples** — o fallback padrão; bom para testes, não confiável para a etapa de e-mail em um IP de datacenter.

## 🔌 Conectar ao 9Router

O 9Router é um roteador auto-hospedado, compatível com OpenAI:

```bash
npm install -g 9router && 9router        # dashboard on http://localhost:20128
```

O conector registra um provider-node `openai-compatible` (prefixo `agentscope`), anexa cada chave de conta como uma conexão, e gera uma chave de cliente do 9Router:

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

Chame-o como qualquer endpoint OpenAI:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<9router key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🔌 Conectar ao OmniRoute

O OmniRoute é um roteador auto-hospedado, compatível com OpenAI:

```bash
npm install -g omniroute && omniroute        # dashboard on http://localhost:20128
```

O conector registra um provider-node `openai-compatible` (prefixo `agentscope`), anexa cada chave de conta como uma conexão, e gera uma chave de cliente do OmniRoute:

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

Chame-o como qualquer endpoint OpenAI:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<omniroute key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🧠 Modelos disponíveis

Uma chave `sk-as-…` serve estes modelos (conforme retornado por `GET /v1/models`), roteados
através do 9Router sob o prefixo `agentscope/`:

| Modelo                    | Chame como no 9Router             | Status                     |
| ------------------------- | --------------------------------- | -------------------------- |
| qwen3.8-flash             | `agentscope/qwen3.8-flash`        | ✅ funciona                 |
| qwen3.7-plus              | `agentscope/qwen3.7-plus`         | ✅ funciona                 |
| qwen3.8-max               | `agentscope/qwen3.8-max`          | ✅ funciona                 |
| kimi-k3                   | `agentscope/kimi-k3`              | ✅ funciona                 |
| glm-5.2                   | `agentscope/glm-5.2`              | ✅ funciona                 |
| deepseek-v4-flash         | `agentscope/deepseek-v4-flash`    | ⚠️ anunciado, chat → *"Model not exist"* (upstream) |

`deepseek-v4-flash` é listado por `GET /v1/models` mas o endpoint de chat o rejeita
— um bug do lado da AgentScope, não deste toolkit. Para atualizar a lista para sua própria
conta:

```bash
curl https://platform.agentscope.io/v1/models -H "Authorization: Bearer sk-as-<your key>"
```

Nota: o endpoint de inferência só aceita a chave `sk-as-…` gerada — o token de login
é rejeitado com `ASP.PROXY.API_KEY_INVALID`.

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

## ⚙️ Como funciona

1. `POST /api/v1/auth/send-verify-email-code` `{ account, purpose:"register" }`
2. Leia o código de 6 dígitos da caixa de entrada do mail.tm.
3. `POST /api/v1/auth/register` `{ account, password, verifyCode }`
4. `POST /api/v1/auth/login` → captura o `accessToken` Bearer.
5. `POST /api/v1/users/me/model-api-key/reset` → chave `sk-as-…` completa.
6. Registre a chave no 9Router e liste os modelos expostos.

Veja [`docs/PROTOCOL.md`](docs/PROTOCOL.md) para endpoints e payloads exatos.

## 📁 Estrutura

Veja [`STRUCTURE.md`](STRUCTURE.md) para a árvore completa e o diagrama de fluxo de dados.

## ⚠️ Notas e limites

- **A entrega de e-mail é sensível ao IP *e* sensível ao domínio.** O gateway da
  AgentScope descarta envios de IPs de datacenter com baixa reputação, e também filtra alguns
  domínios de e-mail descartável (o mail.tm foi servido por um tempo e depois bloqueado).
  Se nenhum código chegar, execute atrás de um proxy residencial (`--proxy`) ou aponte
  o toolkit para uma caixa de entrada diferente via as variáveis de ambiente `INBOX_*`
  (veja [`src/generic-inbox.js`](src/generic-inbox.js)) — o provedor de caixa de entrada é
  plugável, então você nunca fica preso a um que esteja bloqueado.
- **E-mails de verificação têm limite de taxa por conta/IP.** Espaçe lotes grandes; o toolkit grava os resultados após cada conta para que uma falha nunca perca o progresso.
- `deepseek-v4-flash` é anunciado por `/v1/models` mas retorna *"Model not exist"* — um problema upstream, não deste toolkit.
- Para automação pessoal/educacional. Respeite os termos de serviço da AgentScope e do 9Router.

## 📄 Licença

[MIT](LICENSE) © 2026 0xgetz