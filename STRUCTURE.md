# Project structure

```
agentscope-bulk-apikey/
│
├── src/                        # zero-dependency Node.js source
│   ├── agentscope.js           # AgentScope REST flow + access-token capture
│   ├── mailtm.js               # mail.tm disposable-inbox client
│   ├── connect-9router.js      # register AgentScope as a 9Router provider
│   ├── browser-transport.js    # drive Chrome over CDP for HTTP requests
│   ├── proxy.js                # HTTP(S) + SOCKS5 proxy transport (zero-dep)
│   ├── cdp.js                  # raw WebSocket + CDP client (RFC6455, no deps)
│   └── cli.js                  # `agentscope-bulk` command-line entry point
│
├── examples/
│   ├── basic.js                # create one account, print key + models
│   └── bulk-connect.js         # create N accounts + connect them all to 9Router
│
├── docs/
│   └── PROTOCOL.md             # exact end-to-end flow, endpoints, payloads
│
├── brand/
│   ├── logo.svg                # full-colour logo
│   └── icon.svg                # app-style icon
│
├── i18n/                       # translations of the README
│   ├── README.id.md            # Bahasa Indonesia
│   ├── README.zh.md            # 简体中文
│   ├── README.ja.md            # 日本語
│   ├── README.es.md            # Español
│   └── README.de.md            # Deutsch
│
├── README.md                   # English (default)
├── STRUCTURE.md                # this file
├── LICENSE                     # MIT
└── package.json
```

## Data flow

```
                 ┌──────────────────────────────────────────────────────────────┐
                 │                   agentscope-bulk (this repo)                 │
                 │                                                              │
  mail.tm  ◀─────┤  mailtm.js                                                   │
  inbox          │     │  create inbox / poll 6-digit code                        │
                 │     ▼                                                        │
                 │  agentscope.js ──▶ provisionAccount() ──▶ cli.js              │
                 │     │                       │                  │             │
                 │     ▼                       │                  ▼             │
                 │  transport                  │           accounts.json / .csv │
                 │   ├─ proxy.js      (HTTP/SOCKS5)                             │
                 │   ├─ browser-transport.js (Chrome · CDP · cdp.js)            │
                 │   └─ plain fetch   (fallback)                                │
                 └─────┬───────────────────────┬──────────────────────────────┘
                       │                       │
              ┌────────▼─────────┐    ┌────────▼───────────────────────────────┐
              │ residential IP   │    │ platform.agentscope.io                 │
              │ (proxy/browser)  │───▶│ /auth/* · /users/me/model-api-key/*     │
              └──────────────────┘    └────────┬───────────────────────────────┘
                                               │  reset → sk-as-…
                                               ▼
                                  ┌──────────────────────────────┐
                                  │ connect-9router.js           │
                                  │  provider-nodes + providers  │
                                  └──────────────┬───────────────┘
                                                 ▼
                                  ┌──────────────────────────────┐
                                  │ 9Router  http://…:20128/v1   │
                                  │  agentscope/<model-id>       │
                                  └──────────────────────────────┘
```

## Request lifecycle (per account)

```
createInbox ──▶ send-verify-email-code ──▶ wait code ──▶ register ──▶ login
     │                                                                    │
     └───────────────────────── retry-safe, JSON flushed after each ──────┤
                                                                          ▼
                                            reset model-api-key ──▶ sk-as-…
                                                                          │
                                                                          ▼
                                        router.connect() ──▶ 9Router provider
```
