<div align="center">

<img src="brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**[AgentScope Platform](https://platform.agentscope.io) 계정을 대량으로 생성하고, 각 계정마다 Model API 키를 자동으로 발급하며, 모든 키를 실행 중인 [9Router](https://9router.com) 인스턴스에 등록합니다 — 처음부터 끝까지. 의존성 제로.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-omniroute)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-transports)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-10%20languages-F59E0B.svg?style=for-the-badge)](#)

[✨ 기능](#-features) · [🚀 빠른 시작](#-quick-start) · [🛠 사용법](#-usage) · [🌐 전송 방식](#-transports) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [🧠 모델](#-available-models) · [📚 라이브러리](#-as-a-library) · [⚙️ 작동 방식](#-how-it-works) · [📄 라이선스](#-license)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 기능

- 🔑 **계정 + API 키 대량 생성** — 실행할 때마다 AgentScope 계정 하나와 `sk-as-…` Model API 키 하나를 생성합니다.
- 📧 **일회용 받은편지함** — 인증 코드를 [mail.tm](https://mail.tm)에서 바로 읽어옵니다. 이메일 계정이 필요 없습니다.
- 🔌 **9Router 커넥터** — 모든 키가 같은 과정에서 9Router에 OpenAI 호환 프로바이더로 등록됩니다.
- 🌐 **세 가지 전송 방식** — 주거용 **프록시**(HTTP/SOCKS5), CDP를 통한 실제 **브라우저**, 또는 일반 `fetch`.
- 🪶 **의존성 제로** — 순수 Node.js ≥ 18. `npm install`도, 빌드 단계도 없습니다.
- 📦 **내보내기** — 결과를 JSON **및** 선택적 CSV로 기록합니다.
- 🧩 **라이브러리 또는 CLI** — 코드에서 `provisionAccount()`를 사용하거나, 번들로 제공되는 `agentscope-bulk` 명령을 실행하세요.
- 🌍 **10개 언어** — EN, TR, ZH, JA, KO, ES, FR, DE, RU, PT.

## 🚀 빠른 시작

```bash
git clone https://github.com/F0Rextasy/agentscope-bulk-apikey
cd agentscope-bulk-apikey

# 1 account, behind a residential proxy, into a local 9Router
node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

그러면 생성된 계정, 해당 `sk-as-…` 키, 라우터 연결 id, 그리고 모든 OpenAI 호환 도구를 연결할 수 있는 라우터 엔드포인트 + 키가 출력됩니다. OmniRoute에 등록하려면 `--connect-9router`를 `--connect-omniroute`로 바꾸세요.

### 🖱️ 런처

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

`node src/launcher.js`(또는 `npm start`)는 계정 수, 프록시
라인 또는 CDP 엔드포인트, 출력 파일, 이메일 코드 예산을 물어보고,
답변을 `launcher.config.json`에 기억한 뒤 올바른 플래그로 CLI를 실행합니다.
마지막 메뉴 항목은 `accounts.json`을 순회하며 모든 키를 한 번에 로컬
9Router에 등록합니다(`node src/launcher.js --connect-9router`).

## 🛠 사용법

```bash
agentscope-bulk --count 3                 # 3 accounts, no router
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>   # drive a local Chrome
```

| 플래그 | 설명 | 기본값 |
| --- | --- | --- |
| `--count <n>` | 생성할 계정 수 | `1` |
| `--proxy <url>` | 프록시를 통해 HTTP 라우팅 (`http`/`https`/`socks5`) | – |
| `--cdp <ws-url>` | Chrome의 CDP WebSocket URL | `http://127.0.0.1:9222` |
| `--password <pw>` | 모든 계정에 사용할 고정 비밀번호 | 무작위 |
| `--connect-9router` | 각 계정을 9Router에 등록 | 꺼짐 |
| `--router <url>` | 9Router 기본 URL | `http://localhost:20128` |
| `--router-password <pw>` | 9Router 로그인 비밀번호 | `123456` |
| `--prefix <p>` | 9Router의 프로바이더 접두사 | `agentscope` |
| `--out <file>` | JSON 출력 경로 | `accounts.json` |
| `--csv <file>` | CSV도 작성 | – |
| `--delay <ms>` | 계정 간 일시정지 | `2000` |

## 🌐 전송 방식

AgentScope의 인증 이메일 게이트웨이는 평판이 낮은 데이터센터 IP에서 오는 요청을 차단하므로, 순수 VPS/CI IP로는 코드를 거의 받을 수 없습니다. 깨끗한 IP로 나가는 전송 방식을 선택하세요:

- **프록시 (권장)** — `--proxy http://user:pass@host:port` 또는 `socks5://…`. `AGENTSCOPE_PROXY` / `AGENTSCOPE_PROXY_FILE`에서도 읽습니다.
- **CDP를 통한 브라우저** — `--cdp ws://127.0.0.1:9222/<id>`(자체 Chrome) 또는 `BU_CDP_WS`(클라우드 브라우저). 모든 호출이 페이지 내부에서 평가되어 브라우저의 IP와 쿠키를 상속합니다.
- **일반 fetch** — 기본 폴백이며, 테스트에는 괜찮지만 데이터센터 IP에서는 이메일 단계에 신뢰할 수 없습니다.

## 🔌 9Router에 연결

9Router는 자체 호스팅되는 OpenAI 호환 라우터입니다:

```bash
npm install -g 9router && 9router        # dashboard on http://localhost:20128
```

커넥터는 하나의 `openai-compatible` 프로바이더 노드(접두사 `agentscope`)를 등록하고, 각 계정 키를 연결로 첨부하며, 9Router 클라이언트 키를 발급합니다:

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

다른 OpenAI 엔드포인트처럼 호출하세요:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<9router key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🔌 OmniRoute에 연결

OmniRoute는 자체 호스팅되는 OpenAI 호환 라우터입니다:

```bash
npm install -g omniroute && omniroute        # dashboard on http://localhost:20128
```

커넥터는 하나의 `openai-compatible` 프로바이더 노드(접두사 `agentscope`)를 등록하고, 각 계정 키를 연결로 첨부하며, OmniRoute 클라이언트 키를 발급합니다:

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

다른 OpenAI 엔드포인트처럼 호출하세요:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<omniroute key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🧠 사용 가능한 모델

`sk-as-…` 키는 다음 모델을 제공하며(`GET /v1/models`가 반환하는 대로),
9Router를 통해 `agentscope/` 접두사로 라우팅됩니다:

| 모델                     | 9Router에서의 호출                | 상태                     |
| ------------------------- | --------------------------------- | -------------------------- |
| qwen3.8-flash             | `agentscope/qwen3.8-flash`        | ✅ 작동                    |
| qwen3.7-plus              | `agentscope/qwen3.7-plus`         | ✅ 작동                    |
| qwen3.8-max               | `agentscope/qwen3.8-max`          | ✅ 작동                    |
| kimi-k3                   | `agentscope/kimi-k3`              | ✅ 작동                    |
| glm-5.2                   | `agentscope/glm-5.2`              | ✅ 작동                    |
| deepseek-v4-flash         | `agentscope/deepseek-v4-flash`    | ⚠️ 광고됨, 채팅 → *"Model not exist"* (업스트림) |

`deepseek-v4-flash`는 `GET /v1/models`에 나열되지만 채팅 엔드포인트가
이를 거부합니다 — 이 툴킷이 아니라 AgentScope 측 버그입니다. 자신의 계정에
대해 목록을 새로 고치려면:

```bash
curl https://platform.agentscope.io/v1/models -H "Authorization: Bearer sk-as-<your key>"
```

참고: 추론 엔드포인트는 발급된 `sk-as-…` 키만 허용합니다 — 로그인
토큰은 `ASP.PROXY.API_KEY_INVALID`와 함께 거부됩니다.

## 📚 라이브러리로 사용

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

## ⚙️ 작동 방식

1. `POST /api/v1/auth/send-verify-email-code` `{ account, purpose:"register" }`
2. mail.tm 받은편지함에서 6자리 코드를 읽습니다.
3. `POST /api/v1/auth/register` `{ account, password, verifyCode }`
4. `POST /api/v1/auth/login` → Bearer `accessToken`을 캡처합니다.
5. `POST /api/v1/users/me/model-api-key/reset` → 전체 `sk-as-…` 키.
6. 키를 9Router에 등록하고 노출된 모델을 나열합니다.

정확한 엔드포인트와 페이로드는 [`docs/PROTOCOL.md`](docs/PROTOCOL.md)를 참고하세요.

## 📁 구조

전체 트리와 데이터 흐름 다이어그램은 [`STRUCTURE.md`](STRUCTURE.md)를 참고하세요.

## ⚠️ 참고 및 제한

- **이메일 전송은 IP에 민감하고 *도메인에도* 민감합니다.** AgentScope의 게이트웨이는
  평판이 낮은 데이터센터 IP에서 오는 전송을 차단하며, 일부
  일회용 메일 도메인도 필터링합니다(mail.tm은 한동안 제공되다가 나중에 차단됨).
  코드가 도착하지 않으면 주거용 프록시(`--proxy`) 뒤에서 실행하거나
  `INBOX_*` 환경 변수를 통해 툴킷을 다른 받은편지함으로
  지정하세요([`src/generic-inbox.js`](src/generic-inbox.js) 참고) — 받은편지함
  프로바이더는 교체 가능하므로 차단된 것에 묶여 있을 필요가 없습니다.
- **인증 이메일은 계정/IP별로 속도 제한이 있습니다.** 대량 배치는 간격을 두세요. 툴킷은 계정마다 결과를 기록하므로 충돌이 나도 진행 상황을 잃지 않습니다.
- `deepseek-v4-flash`는 `/v1/models`에 광고되지만 *“Model not exist”*를 반환합니다 — 이 툴킷이 아니라 업스트림 문제입니다.
- 개인/교육용 자동화용입니다. AgentScope와 9Router의 서비스 약관을 준수하세요.

## 📄 라이선스

[MIT](LICENSE) © 2026 0xgetz