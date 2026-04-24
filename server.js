// Production + local entrypoint.
//
// Data is persisted to a Postgres database hosted on an EC2 instance.
// The entire json-server state lives in a single JSONB row in `app_state`
// — this preserves the existing json-server-style REST surface (so the
// React frontend needs zero changes) while giving us durable storage that
// survives deploys, Render free-tier spin-downs, and instance restarts.
//
// Bootstrap sequence:
//   1. Connect to Postgres; create the target database if missing.
//   2. Create the `app_state` table if missing.
//   3. Load the state blob; on first run, seed it from server/seed-data.mjs.
//   4. Hand that in-memory state to json-server.
//   5. After every successful write (POST/PUT/PATCH/DELETE), UPSERT the
//      full state blob back to Postgres (debounced — coalesces bursts).
//
// Credentials are currently in render.yaml (checked into git) per the
// deployment directive. Before any real public launch, move PGPASSWORD
// to a Render secret env var and rotate it.

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import pg from 'pg';
import { seedData } from './server/seed-data.mjs';

const { Client } = pg;
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const jsonServer = require('json-server');
const express = require('express');

const PORT = process.env.PORT || 3001;

// DB config — env vars take precedence; defaults match the committed
// render.yaml so `npm run dev:full` works out of the box with no .env file.
const PG_HOST = process.env.PGHOST || 'CHANGE-ME';
const PG_PORT = Number(process.env.PGPORT || 5432);
const PG_USER = process.env.PGUSER || 'CHANGE-ME';
const PG_PASSWORD = process.env.PGPASSWORD || 'CHANGE-ME';
const PG_DATABASE = process.env.PGDATABASE || 'CHANGE-ME';

// Step 1 — ensure the target database exists. Connect to the default
// `postgres` maintenance DB, check pg_database, CREATE if missing.
async function ensureDatabase() {
  const admin = new Client({
    host: PG_HOST, port: PG_PORT, user: PG_USER,
    password: PG_PASSWORD, database: 'postgres',
  });
  await admin.connect();
  const res = await admin.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [PG_DATABASE]
  );
  if (res.rowCount === 0) {
    // Postgres disallows parameterised identifiers. PG_DATABASE is trusted
    // (our own config), but we still double-quote it.
    await admin.query(`CREATE DATABASE "${PG_DATABASE}"`);
    console.log(`[db] Created database "${PG_DATABASE}"`);
  }
  await admin.end();
}

// Step 2+3 — ensure the `app_state` table exists; return the loaded state
// blob (or seed it on first run).
async function loadOrSeedState(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS app_state (
      id         INTEGER PRIMARY KEY,
      data       JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  const res = await db.query(`SELECT data FROM app_state WHERE id = 1`);
  if (res.rowCount === 0) {
    await db.query(
      `INSERT INTO app_state (id, data) VALUES (1, $1)`,
      [JSON.stringify(seedData)]
    );
    console.log(`[db] First boot — seeded app_state with embedded seedData`);
    return seedData;
  }
  console.log(`[db] Loaded app_state from Postgres (transaction data preserved)`);
  return res.rows[0].data;
}

async function main() {
  await ensureDatabase();

  const db = new Client({
    host: PG_HOST, port: PG_PORT, user: PG_USER,
    password: PG_PASSWORD, database: PG_DATABASE,
  });
  await db.connect();

  const state = await loadOrSeedState(db);

  const app = jsonServer.create();
  const router = jsonServer.router(state); // in-memory; no file on disk
  const distPath = join(__dirname, 'dist');
  const indexPath = join(distPath, 'index.html');

  app.use(jsonServer.bodyParser);

  // Debounced persistence. If many writes arrive back-to-back (e.g. a batch
  // registration), we coalesce them into a single UPSERT so we don't
  // hammer the DB. Good enough for ~350 alumni traffic.
  let pending = null;
  const schedulePersist = () => {
    if (pending) return;
    pending = setTimeout(async () => {
      pending = null;
      try {
        const snapshot = JSON.stringify(router.db.getState());
        await db.query(
          `UPDATE app_state SET data = $1::jsonb, updated_at = NOW() WHERE id = 1`,
          [snapshot]
        );
      } catch (err) {
        console.error('[db] Persist failed:', err.message);
      }
    }, 200);
  };

  // Intercept successful writes and trigger persistence.
  app.use('/api', (req, res, next) => {
    const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    if (isWrite) {
      res.on('finish', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          schedulePersist();
        }
      });
    }
    next();
  });

  // Mirror the old routes.json behaviour: strip the /api prefix before
  // handing to the json-server router.
  app.use('/api', jsonServer.rewriter({ '/api/*': '/$1' }), router);

  // Static frontend + SPA fallback.
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'Build not found. Run: npm run build' });
    }
  });

  app.listen(PORT, () => {
    console.log(`[server] REConverge 2001 listening on :${PORT}`);
    console.log(`[server] DB: postgres://${PG_USER}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`);
  });
}

main().catch((err) => {
  console.error('[fatal] Startup failed:', err.message);
  console.error(err);
  process.exit(1);
});
