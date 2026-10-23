<div align="center">

<img src="brand/logo.svg" alt="agentscope-bulk" width="150" />

# agentscope-bulk-apikey

**Toplu olarak [AgentScope Platform](https://platform.agentscope.io) hesabı oluşturun, her biri için otomatik olarak bir Model API anahtarı üretin ve her anahtarı çalışan bir [9Router](https://9router.com) örneğine kaydedin — baştan sona. Sıfır bağımlılık.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3DA639.svg?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg?style=for-the-badge)](#)
[![OpenAI compatible](https://img.shields.io/badge/API-OpenAI--compatible-412991.svg?style=for-the-badge&logo=openai&logoColor=white)](https://platform.agentscope.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-omniroute)
[![Proxy](https://img.shields.io/badge/transport-HTTP%20%7C%20SOCKS5%20%7C%20CDP-0EA5E9.svg?style=for-the-badge)](#-transports)
[![mail.tm](https://img.shields.io/badge/inbox-mail.tm-22C55E.svg?style=for-the-badge)](https://mail.tm)
[![Languages](https://img.shields.io/badge/i18n-10%20languages-F59E0B.svg?style=for-the-badge)](#)

[✨ Özellikler](#-features) · [🚀 Hızlı başlangıç](#-quick-start) · [🛠 Kullanım](#-usage) · [🌐 Taşıma katmanları](#-transports) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [🧠 Modeller](#-available-models) · [📚 Kütüphane](#-as-a-library) · [⚙️ Nasıl çalışır](#-how-it-works) · [📄 Lisans](#-license)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Özellikler

- 🔑 **Toplu hesap + API anahtarı** — her çalıştırmada bir AgentScope hesabı *ve* bir `sk-as-…` Model API anahtarı.
- 📧 **Tek kullanımlık gelen kutuları** — doğrulama kodları doğrudan [mail.tm](https://mail.tm) üzerinden okunur; e-posta hesabı gerekmez.
- 🔌 **9Router bağlayıcısı** — her anahtar aynı geçişte 9Router'da OpenAI uyumlu bir sağlayıcı olarak kaydedilir.
- 🌐 **Üç taşıma katmanı** — bir konut **proxy**'si (HTTP/SOCKS5), CDP üzerinden gerçek bir **tarayıcı** veya düz `fetch`.
- 🪶 **Sıfır bağımlılık** — saf Node.js ≥ 18. `npm install` yok, derleme adımı yok.
- 📦 **Dışa aktarımlar** — sonuçlar JSON **ve** isteğe bağlı CSV olarak yazılır.
- 🧩 **Kütüphane veya CLI** — kod içinde `provisionAccount()` kullanın veya paketlenmiş `agentscope-bulk` komutunu çalıştırın.
- 🌍 **10 dil** — EN, TR, ZH, JA, KO, ES, FR, DE, RU, PT.

## 🚀 Hızlı başlangıç

```bash
git clone https://github.com/F0Rextasy/agentscope-bulk-apikey
cd agentscope-bulk-apikey

# 1 account, behind a residential proxy, into a local 9Router
node src/cli.js \
  --count 1 \
  --proxy socks5://user:pass@host:port \
  --connect-9router --router http://localhost:20128 --router-password 123456
```

Bu, oluşturulan hesabı, `sk-as-…` anahtarını, yönlendirici bağlantı kimliğini ve herhangi bir OpenAI uyumlu aracı yönlendirebileceğiniz yönlendirici uç noktası + anahtarını yazdırır. OmniRoute'a kaydolmak için `--connect-9router` yerine `--connect-omniroute` kullanın.

### 🖱️ Başlatıcı

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

`node src/launcher.js` (veya `npm start`) hesap sayısını, proxy satırını veya CDP uç noktasını, çıktı dosyalarını ve e-posta kodu bütçesini sorar, yanıtları `launcher.config.json` içinde hatırlar ve CLI'yi doğru bayraklarla çalıştırır. Son menü öğesi `accounts.json` dosyasını tarar ve her anahtarı tek geçişte yerel bir 9Router'a kaydeder (`node src/launcher.js --connect-9router`).

## 🛠 Kullanım

```bash
agentscope-bulk --count 3                 # 3 accounts, no router
agentscope-bulk --count 3 --connect-9router
agentscope-bulk --count 5 --csv accounts.csv
agentscope-bulk --count 1 --cdp ws://127.0.0.1:9222/<id>   # drive a local Chrome
```

| Bayrak | Açıklama | Varsayılan |
| --- | --- | --- |
| `--count <n>` | oluşturulacak hesap sayısı | `1` |
| `--proxy <url>` | HTTP'yi bir proxy üzerinden yönlendir (`http`/`https`/`socks5`) | – |
| `--cdp <ws-url>` | Chrome'unuzun CDP WebSocket URL'si | `http://127.0.0.1:9222` |
| `--password <pw>` | her hesap için sabit parola | rastgele |
| `--connect-9router` | her hesabı 9Router'a kaydet | kapalı |
| `--router <url>` | 9Router temel URL'si | `http://localhost:20128` |
| `--router-password <pw>` | 9Router giriş parolası | `123456` |
| `--prefix <p>` | 9Router'da sağlayıcı öneki | `agentscope` |
| `--out <file>` | JSON çıktı yolu | `accounts.json` |
| `--csv <file>` | ayrıca bir CSV yaz | – |
| `--delay <ms>` | hesaplar arasında bekleme | `2000` |

## 🌐 Taşıma katmanları

AgentScope'un doğrulama e-postası ağ geçidi, düşük itibarlı veri merkezi IP'lerinden gelen istekleri reddeder, bu nedenle çıplak bir VPS/CI IP'si kodu nadiren alır. Temiz bir IP'den çıkan bir taşıma katmanı seçin:

- **Proxy (önerilen)** — `--proxy http://user:pass@host:port` veya `socks5://…`. Ayrıca `AGENTSCOPE_PROXY` / `AGENTSCOPE_PROXY_FILE` üzerinden okunur.
- **CDP üzerinden tarayıcı** — `--cdp ws://127.0.0.1:9222/<id>` (kendi Chrome'unuz) veya `BU_CDP_WS` (bulut tarayıcı). Tüm çağrılar bir sayfa içinde değerlendirilir, tarayıcının IP'sini ve çerezlerini devralır.
- **Düz fetch** — varsayılan geri dönüş; test için uygundur, veri merkezi IP'sinde e-posta adımı için güvenilmezdir.

## 🔌 9Router'a bağlanma

9Router, kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir:

```bash
npm install -g 9router && 9router        # dashboard on http://localhost:20128
```

Bağlayıcı, bir `openai-compatible` sağlayıcı düğümü (önek `agentscope`) kaydeder, her hesap anahtarını bir bağlantı olarak ekler ve bir 9Router istemci anahtarı üretir:

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

Herhangi bir OpenAI uç noktası gibi çağırın:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<9router key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🔌 OmniRoute'a bağlanma

OmniRoute, kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir:

```bash
npm install -g omniroute && omniroute        # dashboard on http://localhost:20128
```

Bağlayıcı, bir `openai-compatible` sağlayıcı düğümü (önek `agentscope`) kaydeder, her hesap anahtarını bir bağlantı olarak ekler ve bir OmniRoute istemci anahtarı üretir:

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

Herhangi bir OpenAI uç noktası gibi çağırın:

```bash
curl http://localhost:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-<omniroute key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"agentscope/qwen3.8-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🧠 Kullanılabilir modeller

Bir `sk-as-…` anahtarı bu modelleri sunar (`GET /v1/models` tarafından döndürüldüğü şekilde), 9Router üzerinden `agentscope/` öneki altında yönlendirilir:

| Model                     | 9Router'da çağrı olarak            | Durum                     |
| ------------------------- | --------------------------------- | -------------------------- |
| qwen3.8-flash             | `agentscope/qwen3.8-flash`        | ✅ çalışıyor                    |
| qwen3.7-plus              | `agentscope/qwen3.7-plus`         | ✅ çalışıyor                    |
| qwen3.8-max               | `agentscope/qwen3.8-max`          | ✅ çalışıyor                    |
| kimi-k3                   | `agentscope/kimi-k3`              | ✅ çalışıyor                    |
| glm-5.2                   | `agentscope/glm-5.2`              | ✅ çalışıyor                    |
| deepseek-v4-flash         | `agentscope/deepseek-v4-flash`    | ⚠️ duyuruluyor, sohbet → *"Model not exist"* (üst kaynak) |

`deepseek-v4-flash`, `GET /v1/models` tarafından listelenir ancak sohbet uç noktası onu reddeder — bu, AgentScope tarafındaki bir hata, bu araç setinin değil. Kendi hesabınız için listeyi yenilemek için:

```bash
curl https://platform.agentscope.io/v1/models -H "Authorization: Bearer sk-as-<your key>"
```

Not: çıkarım uç noktası yalnızca üretilen `sk-as-…` anahtarını kabul eder — giriş belirteci `ASP.PROXY.API_KEY_INVALID` ile reddedilir.

## 📚 Kütüphane olarak

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

## ⚙️ Nasıl çalışır

1. `POST /api/v1/auth/send-verify-email-code` `{ account, purpose:"register" }`
2. mail.tm gelen kutusundan 6 haneli kodu okuyun.
3. `POST /api/v1/auth/register` `{ account, password, verifyCode }`
4. `POST /api/v1/auth/login` → Bearer `accessToken`'ı yakalar.
5. `POST /api/v1/users/me/model-api-key/reset` → tam `sk-as-…` anahtarı.
6. Anahtarı 9Router'a kaydedin ve sunulan modelleri listeleyin.

Kesin uç noktalar ve yükler için [`docs/PROTOCOL.md`](docs/PROTOCOL.md) dosyasına bakın.

## 📁 Düzen

Tam ağaç ve veri akışı diyagramı için [`STRUCTURE.md`](STRUCTURE.md) dosyasına bakın.

## ⚠️ Notlar ve sınırlar

- **E-posta teslimi IP'ye duyarlı *ve* alan adına duyarlıdır.** AgentScope'un ağ geçidi,
  düşük itibarlı veri merkezi IP'lerinden gelen gönderimleri reddeder ve ayrıca bazı
  tek kullanımlık posta alan adlarını filtreler (mail.tm bir süre hizmet verdi ve sonra engellendi).
  Kod gelmezse, ya bir konut proxy'si arkasında çalıştırın (`--proxy`) ya da
  araç setini `INBOX_*` ortam değişkenleri aracılığıyla farklı bir gelen kutusuna yönlendirin
  (bkz. [`src/generic-inbox.js`](src/generic-inbox.js)) — gelen kutusu sağlayıcısı
  takılıp çıkarılabilir, böylece engellenmiş bir sağlayıcıyla asla sıkışıp kalmazsınız.
- **Doğrulama e-postaları hesap/IP başına hız sınırına tabidir.** Büyük grupları aralıklı çalıştırın; araç seti her hesaptan sonra sonuçları yazar, böylece bir çökme ilerlemeyi asla kaybetmez.
- `deepseek-v4-flash`, `/v1/models` tarafından duyurulur ancak *"Model not exist"* döndürür — bu araç seti değil, üst kaynak sorunudur.
- Kişisel/eğitim amaçlı otomasyon için. AgentScope'un ve 9Router'un hizmet şartlarına uyun.

## 📄 Lisans

[MIT](LICENSE) © 2026 0xgetz