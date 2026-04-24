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

// Shared connect options. connectionTimeoutMillis is critical — without it
// pg.Client.connect() will hang forever if the TCP handshake stalls (bad
// security group, wrong listen_addresses, etc.), and Render will silently
// kill the process for failing to bind a port before we ever log anything.
const baseConnOpts = {
  host: PG_HOST, port: PG_PORT, user: PG_USER, password: PG_PASSWORD,
  connectionTimeoutMillis: 10_000,
  statement_timeout: 30_000,
};

// Step 1 — ensure the target database exists. Connect to the default
// `postgres` maintenance DB, check pg_database, CREATE if missing.
async function ensureDatabase() {
  const admin = new Client({ ...baseConnOpts, database: 'postgres' });
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
  // Reconcile: if we've added new top-level collections to seedData since the
  // DB was first seeded (e.g. `photos`), merge them in as empty arrays/values
  // so json-server can serve POST/GET on them. Existing keys are preserved.
  const loaded = res.rows[0].data;
  const added = [];
  for (const key of Object.keys(seedData)) {
    if (!(key in loaded)) {
      loaded[key] = Array.isArray(seedData[key]) ? [] : seedData[key];
      added.push(key);
    }
  }
  if (added.length) {
    console.log(`[db] Reconciled missing collections: ${added.join(', ')}`);
  }
  return loaded;
}

async function main() {
  // Bind the port FIRST so Render's health check is satisfied even if the
  // DB bootstrap takes a while (or fails). The API middleware below checks
  // `ready` before serving; until the DB is loaded, /api/* returns 503.
  const app = jsonServer.create();
  const distPath = join(__dirname, 'dist');
  const indexPath = join(distPath, 'index.html');

  let router = null;
  let ready = false;
  let bootstrapError = null;

  // json-server's default bodyParser caps JSON at 1 MB — too tight for the
  // alumni photo uploads, which arrive as base64 data URLs (~400 KB–1.5 MB
  // after client-side resize). Swap in express parsers with a larger limit.
  const express = require('express');
  app.use(express.json({ limit: '12mb' }));
  app.use(express.urlencoded({ extended: false, limit: '12mb' }));

  // Health check — useful for debugging deploys.
  app.get('/api/_health', (req, res) => {
    res.json({
      ready,
      error: bootstrapError?.message ?? null,
      db: `postgres://${PG_USER}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`,
    });
  });

  // Bind immediately — must happen before the DB bootstrap, which may block
  // on a slow/unreachable EC2 Postgres.
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[server] REConverge 2001 listening on 0.0.0.0:${PORT}`);
    console.log(`[server] DB target: postgres://${PG_USER}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`);
  });

  // Now bootstrap the DB. Errors here are logged but do NOT crash the
  // process — the health endpoint will expose the reason.
  let db;
  try {
    console.log(`[db] Connecting to ${PG_HOST}:${PG_PORT} as ${PG_USER}...`);
    await ensureDatabase();
    db = new Client({ ...baseConnOpts, database: PG_DATABASE });
    await db.connect();
    console.log(`[db] Connected. Loading state...`);
  } catch (err) {
    bootstrapError = err;
    console.error(`[db] Bootstrap failed: ${err.message}`);
    console.error(`[db] → Check EC2 security group allows port ${PG_PORT} from Render's egress.`);
    console.error(`[db] → Check postgresql.conf has listen_addresses = '*'`);
    console.error(`[db] → Check pg_hba.conf has a 'host ... 0.0.0.0/0 scram-sha-256' line.`);
    return; // leave the server up so logs + /api/_health remain reachable
  }

  const state = await loadOrSeedState(db);
  router = jsonServer.router(state); // in-memory; no file on disk

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

  // Static frontend + SPA fallback — registered last, and only after DB is
  // ready so that /api/* is served by json-server, not swallowed by SPA.
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'Build not found. Run: npm run build' });
    }
  });

  ready = true;
  console.log(`[server] Ready to serve requests.`);
}

main().catch((err) => {
  console.error('[fatal] Startup failed:', err.message);
  console.error(err);
  process.exit(1);
});
