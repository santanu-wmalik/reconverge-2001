// Postgres pool + schema bootstrap.
//
// We create the database (if needed), apply schema.sql (idempotent), and
// expose a small query() helper. Connection options come from env vars —
// the same names render.yaml uses.

import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool, Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const PG_HOST     = process.env.PGHOST     || 'localhost';
const PG_PORT     = parseInt(process.env.PGPORT, 10) || 5432;
const PG_USER     = process.env.PGUSER     || 'postgres';
const PG_PASSWORD = process.env.PGPASSWORD || '';
const PG_DATABASE = process.env.PGDATABASE || 'reconverge_dev';

const baseConnOpts = {
  host: PG_HOST,
  port: PG_PORT,
  user: PG_USER,
  password: PG_PASSWORD,
  ssl: false,
  connectionTimeoutMillis: 10_000,
  statement_timeout: 30_000,
};

export const dbInfo = {
  host: PG_HOST,
  port: PG_PORT,
  user: PG_USER,
  database: PG_DATABASE,
};

// Create the target database if it doesn't exist. We connect to the default
// `postgres` admin DB to do this — once on startup.
export async function ensureDatabase() {
  const admin = new Client({ ...baseConnOpts, database: 'postgres' });
  await admin.connect();
  try {
    const res = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [PG_DATABASE]);
    if (res.rowCount === 0) {
      await admin.query(`CREATE DATABASE "${PG_DATABASE.replace(/"/g, '""')}"`);
      console.log(`[db] Created database '${PG_DATABASE}'`);
    }
  } finally {
    await admin.end();
  }
}

let pool = null;
export function getPool() {
  if (!pool) {
    pool = new Pool({ ...baseConnOpts, database: PG_DATABASE, max: 8 });
    pool.on('error', (err) => console.error('[db] Pool error:', err.message));
  }
  return pool;
}

export async function query(text, params) {
  return getPool().query(text, params);
}

// Apply schema.sql. Idempotent — uses CREATE ... IF NOT EXISTS throughout.
export async function ensureSchema() {
  const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
  await query(sql);
  console.log('[db] Schema ensured.');
}
