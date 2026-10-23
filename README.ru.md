<div align="center">

<img src="brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**Массовое создание аккаунтов [AgentScope Platform](https://platform.agentscope.io), автоматический выпуск Model API key для каждого и регистрация каждого ключа в работающем экземпляре [9Router](https://9router.com) — от начала до конца. Без зависимостей.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-omniroute)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-transports)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-10%20languages-F59E0B.svg?style=for-the-badge)](#)

[✨ Возможности](#-features) · [🚀 Быстрый старт](#-quick-start) · [🛠 Использование](#-usage) · [🌐 Транспорты](#-transports) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [🧠 Модели](#-available-models) · [📚 Как библиотека](#-as-a-library) · [⚙️ Как это работает](#-how-it-works) · [📄 Лицензия](#-license)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Возможности

- 🔑 **Массовые аккаунты + API key** — один аккаунт AgentScope *и* один Model API key `sk-as-…` за каждый запуск.
- 📧 **Одноразовые входящие** — коды подтверждения читаются напрямую из [mail.tm](https://mail.tm); учётная запись электронной почты не нужна.
- 🔌 **Коннектор 9Router** — каждый ключ регистрируется как OpenAI-совместимый провайдер в 9Router за тот же проход.
- 🌐 **Три транспорта** — резидентный **прокси** (HTTP/SOCKS5), настоящий **браузер через CDP** или обычный `fetch`.
- 🪶 **Без зависимостей** — чистый Node.js ≥ 18. Никакого `npm install`, никакого шага сборки.
- 📦 **Экспорт** — результаты записываются в JSON **и** опционально в CSV.
- 🧩 **Библиотека или CLI** — используйте `provisionAccount()` в коде или запускайте встроенную команду `agentscope-bulk`.
- 🌍 **10 языков** — EN, TR, ZH, JA, KO, ES, FR, DE, RU, PT.

## 🚀 Быстрый старт

```bash
git clone https://github.com/F0Rextasy/agentscope-bulk-apikey
cd agentscope-bulk-apikey

# 1 account, behind a residential proxy, into a local 9Router
node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

Это выводит созданный аккаунт, его ключ `sk-as-…`, id подключения к роутеру, а также endpoint роутера + ключ, на который можно направить любой OpenAI-совместимый инструмент. Замените `--connect-9router` на `--connect-omniroute`, чтобы вместо этого зарегистрировать в OmniRoute.

### 🖱️ Лаунчер

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

`node src/launcher.js` (или `npm start`) запрашивает количество аккаунтов, строку
прокси или CDP endpoint, выходные файлы и бюджет кодов из писем, запоминает
ответы в `launcher.config.json` и запускает CLI с нужными флагами. Последний
пункт меню проходит по `accounts.json` и регистрирует каждый ключ в локальном
9Router за один проход (`node src/launcher.js --connect-9router`).

## 🛠 Использование

```bash
agentscope-bulk --count 3                 # 3 accounts, no router
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>   # drive a local Chrome
```

| Флаг | Описание | По умолчанию |
| --- | --- | --- |
| `--count <n>` | количество создаваемых аккаунтов | `1` |
| `--proxy <url>` | маршрутизировать HTTP через прокси (`http`/`https`/`socks5`) | – |
| `--cdp <ws-url>` | CDP WebSocket URL вашего Chrome | `http://127.0.0.1:9222` |
| `--password <pw>` | фиксированный пароль для каждого аккаунта | случайный |
| `--connect-9router` | регистрировать каждый аккаунт в 9Router | выкл. |
| `--router <url>` | базовый URL 9Router | `http://localhost:20128` |
| `--router-password <pw>` | пароль для входа в 9Router | `123456` |
| `--prefix <p>` | префикс провайдера в 9Router | `agentscope` |
| `--out <file>` | путь для вывода JSON | `accounts.json` |
| `--csv <file>` | также записать CSV | – |
| `--delay <ms>` | пауза между аккаунтами | `2000` |

## 🌐 Транспорты

Шлюз проверочных писем AgentScope отбрасывает запросы с IP-адресов дата-центров с низкой репутацией, поэтому голый IP VPS/CI редко получает код. Выберите транспорт, который выходит с чистого IP:

- **Прокси (рекомендуется)** — `--proxy http://user:pass@host:port` или `socks5://…`. Также читается из `AGENTSCOPE_PROXY` / `AGENTSCOPE_PROXY_FILE`.
- **Браузер через CDP** — `--cdp ws://127.0.0.1:9222/<id>` (ваш собственный Chrome) или `BU_CDP_WS` (облачный браузер). Все вызовы выполняются внутри страницы, наследуя IP и cookies браузера.
- **Обычный fetch** — запасной вариант по умолчанию; подходит для тестирования, ненадёжен для шага с письмом на IP дата-центра.

## 🔌 Подключение к 9Router

9Router — это самостоятельно размещаемый OpenAI-совместимый роутер:

```bash
npm install -g 9router && 9router        # dashboard on http://localhost:20128
```

Коннектор регистрирует один узел-провайдер `openai-compatible` (префикс `agentscope`), прикрепляет каждый ключ аккаунта как подключение и выпускает клиентский ключ 9Router:

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

Вызывайте его как любой OpenAI endpoint:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<9router key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🔌 Подключение к OmniRoute

OmniRoute — это самостоятельно размещаемый OpenAI-совместимый роутер:

```bash
npm install -g omniroute && omniroute        # dashboard on http://localhost:20128
```

Коннектор регистрирует один узел-провайдер `openai-compatible` (префикс `agentscope`), прикрепляет каждый ключ аккаунта как подключение и выпускает клиентский ключ OmniRoute:

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

Вызывайте его как любой OpenAI endpoint:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<omniroute key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🧠 Доступные модели

Ключ `sk-as-…` обслуживает эти модели (как возвращает `GET /v1/models`),
маршрутизируемые через 9Router под префиксом `agentscope/`:

| Модель                    | Вызов как в 9Router               | Статус                     |
| ------------------------- | --------------------------------- | -------------------------- |
| qwen3.8-flash             | `agentscope/qwen3.8-flash`        | ✅ работает                 |
| qwen3.7-plus              | `agentscope/qwen3.7-plus`         | ✅ работает                 |
| qwen3.8-max               | `agentscope/qwen3.8-max`          | ✅ работает                 |
| kimi-k3                   | `agentscope/kimi-k3`              | ✅ работает                 |
| glm-5.2                   | `agentscope/glm-5.2`              | ✅ работает                 |
| deepseek-v4-flash         | `agentscope/deepseek-v4-flash`    | ⚠️ заявлена, chat → *"Model not exist"* (upstream) |

`deepseek-v4-flash` указана в `GET /v1/models`, но chat endpoint её отклоняет
— это баг на стороне AgentScope, а не этого инструментария. Чтобы обновить
список для своего аккаунта:

```bash
curl https://platform.agentscope.io/v1/models -H "Authorization: Bearer sk-as-<your key>"
```

Примечание: endpoint инференса принимает только выпущенный ключ `sk-as-…` —
токен входа отклоняется с `ASP.PROXY.API_KEY_INVALID`.

## 📚 Как библиотека

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

## ⚙️ Как это работает

1. `POST /api/v1/auth/send-verify-email-code` `{ account, purpose:"register" }`
2. Прочитать 6-значный код из входящих mail.tm.
3. `POST /api/v1/auth/register` `{ account, password, verifyCode }`
4. `POST /api/v1/auth/login` → получить Bearer `accessToken`.
5. `POST /api/v1/users/me/model-api-key/reset` → полный ключ `sk-as-…`.
6. Зарегистрировать ключ в 9Router и вывести список доступных моделей.

Точные endpoints и payload'ы см. в [`docs/PROTOCOL.md`](docs/PROTOCOL.md).

## 📁 Структура

Полное дерево и диаграмму потоков данных см. в [`STRUCTURE.md`](STRUCTURE.md).

## ⚠️ Примечания и ограничения

- **Доставка писем чувствительна к IP *и* к домену.** Шлюз AgentScope
  отбрасывает отправки с IP-адресов дата-центров с низкой репутацией, а также
  фильтрует некоторые домены одноразовой почты (mail.tm какое-то время
  работал, а позже был заблокирован). Если код не приходит, либо запускайтесь
  за резидентным прокси (`--proxy`), либо направьте инструментарий на другую
  входящую через переменные окружения `INBOX_*`
  (см. [`src/generic-inbox.js`](src/generic-inbox.js)) — провайдер входящих
  подключаемый, так что вы никогда не застрянете на заблокированном.
- **Проверочные письма имеют лимит по аккаунту/IP.** Разносите большие партии по времени; инструментарий записывает результаты после каждого аккаунта, поэтому сбой никогда не теряет прогресс.
- `deepseek-v4-flash` заявлена в `/v1/models`, но возвращает *“Model not exist”* — это проблема upstream, а не этого инструментария.
- Для персональной/образовательной автоматизации. Уважайте условия обслуживания AgentScope и 9Router.

## 📄 Лицензия

[MIT](LICENSE) © 2026 0xgetz