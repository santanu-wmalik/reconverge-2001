// Production + local entrypoint.
//
// - Local dev:  DB lives at server/db.json (gitignored).
// - Production: DB lives at /data/db.json on Render's persistent disk.
//
// On first boot (or any time the target DB file is missing) we copy
// server/db.seed.json into place. The committed seed file is the single
// source of truth for "fresh environment" data — it contains the three demo
// accounts and empty collections. After the first boot, the live DB file is
// preserved across every deploy because it sits on the persistent disk (or
// outside git, locally).

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, copyFileSync, mkdirSync } from 'fs';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const jsonServer = require('json-server');
const express = require('express');

const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// Where json-server reads/writes at runtime.
// In production we point at the Render persistent disk mounted at /data
// (configure this in render.yaml / the Render dashboard).
const DB_PATH = isProd ? '/data/db.json' : join(__dirname, 'server', 'db.json');
const SEED_PATH = join(__dirname, 'server', 'db.seed.json');

// Make sure the directory exists (Render mounts /data for us, but be defensive).
if (isProd) {
  try { mkdirSync('/data', { recursive: true }); } catch { /* ignore */ }
}

// First-boot seed. If the live DB file doesn't exist yet, lift the committed
// seed file into place. On subsequent deploys the live file is already there
// → we skip seeding → user data is preserved.
if (!existsSync(DB_PATH)) {
  if (!existsSync(SEED_PATH)) {
    console.error(`[seed] FATAL: neither ${DB_PATH} nor ${SEED_PATH} exists — cannot start.`);
    process.exit(1);
  }
  copyFileSync(SEED_PATH, DB_PATH);
  console.log(`[seed] First boot — copied ${SEED_PATH} → ${DB_PATH}`);
} else {
  console.log(`[seed] Using existing ${DB_PATH} (transaction data preserved).`);
}

const app = jsonServer.create();
const router = jsonServer.router(DB_PATH);
const distPath = join(__dirname, 'dist');
const indexPath = join(distPath, 'index.html');

// json-server body parser (needed for POST/PUT/PATCH)
app.use(jsonServer.bodyParser);

// API routes: mount json-server under /api
app.use('/api', router);

// Serve built frontend from dist/
app.use(express.static(distPath));

// SPA fallback: any non-API GET returns index.html
app.get('*', (req, res) => {
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Build not found. Run: npm run build' });
  }
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   REConverge 2001 - Production Server    ║
  ╠══════════════════════════════════════════╣
  ║   App:  http://localhost:${PORT}            ║
  ║   API:  http://localhost:${PORT}/api        ║
  ║   DB:   ${DB_PATH}
  ╚══════════════════════════════════════════╝
  `);
});
