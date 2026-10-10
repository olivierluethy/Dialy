#!/usr/bin/env node
/**
 * Serves the Ratgeber article editor (tools/article-editor/index.html) on
 * http://localhost:8095, with the Supabase URL and publishable key from .env.
 *
 * Editing needs an account listed in public.article_editors
 * (supabase/migrations/0006_article_editors.sql).
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 8095;

function readEnv() {
  const envPath = join(root, '.env');
  const env = {};
  if (!existsSync(envPath)) return env;
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return env;
}

const env = { ...readEnv(), ...process.env };
const config = {
  url: env.EXPO_PUBLIC_SUPABASE_URL || '',
  key: env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
};
if (!config.url || !config.key) {
  console.warn('⚠ EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY missing in .env - the editor will ask for them.');
}

const files = {
  '/': {
    path: join(root, 'tools', 'article-editor', 'index.html'),
    type: 'text/html; charset=utf-8',
    // "<" escaped so the values can't close the script tag.
    transform: (html) =>
      html.replace('/*CONFIG*/null', JSON.stringify(config).replace(/</g, '\\u003c')),
  },
  '/supabase.js': {
    path: join(root, 'node_modules', '@supabase', 'supabase-js', 'dist', 'umd', 'supabase.js'),
    type: 'text/javascript; charset=utf-8',
  },
};

createServer((req, res) => {
  const file = files[new URL(req.url, 'http://localhost').pathname];
  if (!file) {
    res.writeHead(404).end('Not found');
    return;
  }
  const body = readFileSync(file.path, 'utf8');
  res.writeHead(200, { 'Content-Type': file.type, 'Cache-Control': 'no-store' });
  res.end(file.transform ? file.transform(body) : body);
}).listen(PORT, '127.0.0.1', () => {
  console.log(`✔ Ratgeber-Editor: http://localhost:${PORT}  (Ctrl+C beendet)`);
});
