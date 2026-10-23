#!/usr/bin/env node
'use strict';

/**
 * Interactive launcher for the compiled build.
 *
 * The CLI's options stay configurable without reading its source: this launcher
 * asks for them, remembers the answers in `launcher.config.json`, and then runs
 * `cli.js` with the right flags — the transport (a proxy line or a Chrome over
 * CDP), the output files and the e-mail-code budget, which are the settings
 * people most often need and cannot guess. A final menu item walks the minted
 * accounts and registers each key with a local 9Router.
 *
 * Usage: node src/launcher.js            (menu)
 *        node src/launcher.js --help
 *        node src/launcher.js --connect-9router
node src/launcher.js --connect-omniroute
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..'); // data root (the repo root)
const CONFIG = path.join(ROOT, 'launcher.config.json');
const CLI = path.join(__dirname, 'cli.js');

const defaults = {
  count: 1,
  proxyFile: 'proxies.txt',
  proxy: '',
  cdp: '',
  prefix: 'agentscope',
  out: 'accounts.json',
  csv: '',
  delay: 2000,
  codeTimeout: 300000,
  resend: 90000,
  attempts: 3,
  nineRouter: {
    base: 'http://localhost:20128',
    password: '123456',
    prefix: 'agentscope',
    defaultModel: 'qwen3.8-flash',
  },
};

function loadConfig() {
  let saved = {};
  try {
    saved = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
  } catch (e) {
    saved = {};
  }
  return {
    ...defaults,
    ...saved,
    nineRouter: { ...defaults.nineRouter, ...(saved.nineRouter || {}) },
  };
}

function saveConfig(cfg) {
  try {
    fs.writeFileSync(CONFIG, JSON.stringify(cfg, null, 2) + '\n');
  } catch (e) {
    console.error(`  ! could not write ${path.basename(CONFIG)}: ${e.message}`);
  }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (question, fallback) =>
  new Promise((resolve) => {
    const hint = fallback ? ` [${String(fallback).slice(0, 30)}${String(fallback).length > 30 ? '…' : ''}]` : '';
    rl.question(`  ${question}${hint}: `, (answer) => resolve(answer.trim() || fallback || ''));
  });

function readProxyLines(file) {
  const resolved = path.resolve(ROOT, file);
  if (!fs.existsSync(resolved)) return null;
  return fs
    .readFileSync(resolved, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

function run(args) {
  console.log('');
  const res = spawnSync(process.execPath, [CLI, ...args], { windowsHide: true, cwd: ROOT, stdio: 'inherit' });
  if (res.status !== 0) console.log(`  ! exited with code ${res.status}`);
}

const BANNER_LOGO = String.raw`
 █████╗  ██████╗ ███████╗███╗   ██╗████████╗███████╗ ██████╗ ██████╗ ██████╗ ███████╗
██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝
███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ███████╗██║     ██║   ██║██████╔╝█████╗
██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║██║     ██║   ██║██╔═══╝ ██╔══╝
██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ███████║╚██████╗╚██████╔╝██║     ███████╗
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚══════╝
`;

function banner() {
  const cyan = '\x1b[36m';
  const dim = '\x1b[2m';
  const bold = '\x1b[1m';
  const reset = '\x1b[0m';
  const title = 'agentscope-bulk-apikey';
  const tagline = 'one account → one key, proxy or CDP transport';
  const lines = BANNER_LOGO.replace(/^\n/, '').replace(/\n$/, '').split('\n');
  const width = Math.max(...lines.map((l) => [...l].length), [...title].length, [...tagline].length);
  const pad = (s) => s + ' '.repeat(width - [...s].length);
  const inner = width + 4;
  console.log('');
  console.log(`${cyan}╔${'═'.repeat(inner)}╗${reset}`);
  console.log(`${cyan}║${' '.repeat(inner)}║${reset}`);
  for (const line of lines) console.log(`${cyan}║${reset}  ${bold}${pad(line)}${reset}  ${cyan}║${reset}`);
  console.log(`${cyan}║${' '.repeat(inner)}║${reset}`);
  console.log(`${cyan}║${reset}  ${pad(title)}  ${cyan}║${reset}`);
  console.log(`${cyan}║${reset}  ${dim}${pad(tagline)}${reset}  ${cyan}║${reset}`);
  console.log(`${cyan}║${' '.repeat(inner)}║${reset}`);
  console.log(`${cyan}╚${'═'.repeat(inner)}╝${reset}`);
  console.log(`  ${dim}agentscope-bulk-apikey contributors · MIT${reset}`);
  console.log('');
}

/**
 * The CLI takes a single `--proxy <url>`; a list on disk is therefore sampled
 * one line per run. Empty list + no explicit proxy means the CDP transport.
 */
function pickProxy(cfg) {
  if (cfg.proxy) return cfg.proxy;
  const lines = readProxyLines(cfg.proxyFile);
  if (!lines || !lines.length) return '';
  return lines[Math.floor(Math.random() * lines.length)];
}

async function mintFlow(cfg) {
  cfg.count = parseInt(await ask('How many accounts/keys do you want (any number)', cfg.count), 10) || cfg.count;
  cfg.proxyFile = await ask('Proxy list file (one per line, sampled per run)', cfg.proxyFile);
  cfg.proxy = await ask('Single proxy URL to force (blank = sample the list)', cfg.proxy);
  cfg.cdp = await ask('Chrome CDP endpoint (used when no proxy is set)', cfg.cdp);
  cfg.prefix = await ask('9Router provider prefix', cfg.prefix);
  cfg.out = await ask('Account records file (JSON)', cfg.out);
  cfg.csv = await ask('Also write a CSV (blank = JSON only)', cfg.csv);
  cfg.delay = parseInt(await ask('Pause between accounts (ms)', cfg.delay), 10) || cfg.delay;
  cfg.codeTimeout = parseInt(await ask('Total wait budget for the e-mail code (ms)', cfg.codeTimeout), 10) || cfg.codeTimeout;
  saveConfig(cfg);

  const args = [
    '--count', String(cfg.count),
    '--prefix', cfg.prefix,
    '--out', cfg.out,
    '--delay', String(cfg.delay),
    '--code-timeout', String(cfg.codeTimeout),
    '--resend', String(cfg.resend),
    '--attempts', String(cfg.attempts),
  ];
  if (cfg.csv) args.push('--csv', cfg.csv);

  const proxy = pickProxy(cfg);
  if (proxy) {
    args.push('--proxy', proxy);
    console.log(`  · out through ${String(proxy).replace(/\/\/[^@/]*@/, '//***@')}`);
  } else if (cfg.cdp) {
    args.push('--cdp', cfg.cdp);
    console.log(`  · out through the browser at ${cfg.cdp}`);
  } else {
    console.log('  ! no proxy line and no CDP endpoint — the CLI will attach to http://127.0.0.1:9222');
  }
  run(args);
}

function readAccounts(file) {
  const resolved = path.resolve(ROOT, file);
  if (!fs.existsSync(resolved)) return null;
  try {
    const rows = JSON.parse(fs.readFileSync(resolved, 'utf8'));
    return Array.isArray(rows) ? rows.filter((row) => row && row.apiKey) : null;
  } catch (e) {
    console.log(`  ! could not read ${file}: ${e.message}`);
    return null;
  }
}

async function nineRouter(cfg) {
  console.log('\n9Router — register every minted key as one connection');
  cfg.nineRouter.base = await ask('9Router base URL', cfg.nineRouter.base);
  cfg.nineRouter.password = await ask('9Router password', cfg.nineRouter.password);
  const accountsFile = await ask('Account records file to walk', cfg.out);
  cfg.out = accountsFile;
  cfg.nineRouter.prefix = await ask('Provider prefix in 9Router', cfg.nineRouter.prefix);
  cfg.nineRouter.defaultModel = await ask('Default model for the connections', cfg.nineRouter.defaultModel);
  saveConfig(cfg);

  const rows = readAccounts(accountsFile);
  if (!rows || !rows.length) {
    console.log(`  ! no API keys found in ${accountsFile} — mint some first (menu 1)`);
    return;
  }

  const router = require('./connect-9router.js');
  console.log(`\n▶ ${rows.length} key(s) from ${accountsFile} → ${cfg.nineRouter.base}\n`);
  let added = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      const conn = await router.connect({
        base: cfg.nineRouter.base,
        password: cfg.nineRouter.password,
        apiKey: row.apiKey,
        name: row.email ? `AgentScope ${row.email}` : `AgentScope ${i + 1}`,
        prefix: cfg.nineRouter.prefix,
        defaultModel: cfg.nineRouter.defaultModel,
      });
      console.log(`  ✓ ${row.email || row.apiKey.slice(0, 12) + '…'} → connection ${conn.connectionId}`);
      added += 1;
    } catch (e) {
      console.log(`  ! ${row.email || `key ${i + 1}`}: ${e.message}`);
    }
  }
  console.log(`\nDone. ${added}/${rows.length} connection(s) registered under prefix ${cfg.nineRouter.prefix}/`);
}

async function omniRouter(cfg) {
  console.log('\nOmniRoute — register every minted key as one connection');
  cfg.nineRouter.base = await ask('OmniRoute base URL', cfg.nineRouter.base);
  cfg.nineRouter.password = await ask('OmniRoute password', cfg.nineRouter.password);
  const accountsFile = await ask('Account records file to walk', cfg.out);
  cfg.out = accountsFile;
  cfg.nineRouter.prefix = await ask('Provider prefix in OmniRoute', cfg.nineRouter.prefix);
  cfg.nineRouter.defaultModel = await ask('Default model for the connections', cfg.nineRouter.defaultModel);
  saveConfig(cfg);

  const rows = readAccounts(accountsFile);
  if (!rows || !rows.length) {
    console.log(`  ! no API keys found in ${accountsFile} — mint some first (menu 1)`);
    return;
  }

  const router = require('./connect-omniroute.js');
  console.log(`\n▶ ${rows.length} key(s) from ${accountsFile} → ${cfg.nineRouter.base}\n`);
  let added = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      const conn = await router.connect({
        base: cfg.nineRouter.base,
        password: cfg.nineRouter.password,
        apiKey: row.apiKey,
        name: row.email ? `AgentScope ${row.email}` : `AgentScope ${i + 1}`,
        prefix: cfg.nineRouter.prefix,
        defaultModel: cfg.nineRouter.defaultModel,
      });
      console.log(`  ✓ ${row.email || row.apiKey.slice(0, 12) + '…'} → connection ${conn.connectionId}`);
      added += 1;
    } catch (e) {
      console.log(`  ! ${row.email || `key ${i + 1}`}: ${e.message}`);
    }
  }
  console.log(`\nDone. ${added}/${rows.length} connection(s) registered under prefix ${cfg.nineRouter.prefix}/`);
}

async function main() {
  const cfg = loadConfig();
  if (process.argv.includes('--connect-9router')) {
    await nineRouter(cfg);
    rl.close();
    return;
  }

  if (process.argv.includes('--connect-omniroute')) {
    await omniRouter(cfg);
    rl.close();
    return;
  }
  banner();
  console.log('  1) Mint keys      — one account per key, via a proxy line or a CDP browser');
  console.log('  2) Key list       — show the keys in the account records');
  console.log('  3) Settings       — show what this launcher remembers');
  console.log('  4) Help           — CLI options and notes');
  console.log('  5) Connect to 9Router — register every minted key with a local 9Router');
  console.log('  6) Connect to OmniRoute — register every minted key with a local OmniRoute');
  console.log('  q) Quit\n');
  const choice = (await ask('Choose', '1')).toLowerCase();

  if (choice === '1') await mintFlow(cfg);
  else if (choice === '2') {
    const rows = readAccounts(cfg.out);
    if (!rows || !rows.length) console.log(`\n  ! no account records with a key at ${cfg.out} yet`);
    else console.log('\n' + rows.map((row) => row.apiKey).join('\n'));
  } else if (choice === '3') console.log('\n' + JSON.stringify(cfg, null, 2));
  else if (choice === '4') run(['--help']);
  else if (choice === '5') await nineRouter(cfg);
  else if (choice === '6') await omniRouter(cfg);
  rl.close();
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Interactive launcher: run `node src/launcher.js` and pick a menu item.');
  console.log('  node src/launcher.js --connect-9router   register the minted keys with a local 9Router');
  process.exit(0);
}

main().catch((e) => {
  console.error('[fatal]', e.message);
  process.exit(1);
});
