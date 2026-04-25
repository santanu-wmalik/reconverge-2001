// Import the legacy single-row JSONB blob into the new relational tables.
//
// Usage:
//   node --env-file-if-exists=.env scripts/import-blob.mjs <path-to-blob.json>
//
// Idempotent: every INSERT uses ON CONFLICT (id) DO NOTHING so this can be
// re-run safely. Existing rows are preserved; only missing rows are added.
//
// What it does:
//   1. Connects to Postgres using PG* env vars.
//   2. Ensures the schema is in place.
//   3. For each top-level collection in the blob, maps camelCase fields to
//      snake_case columns via server/columns.js, coerces types, INSERTs.
//   4. Reports per-collection counts at the end.

import { readFileSync } from 'fs';
import { ensureDatabase, ensureSchema, query, getPool } from '../server/db.js';
import { tables, sqlTable, coerce } from '../server/columns.js';

const blobPath = process.argv[2];
if (!blobPath) {
  console.error('Usage: node scripts/import-blob.mjs <path-to-blob.json>');
  process.exit(1);
}

const blob = JSON.parse(readFileSync(blobPath, 'utf8'));

// Collections we know how to import. Order matters only for foreign keys
// (alumni/users before things that reference them). We don't enforce most
// FKs in the schema, but ordering still keeps logs sensible.
const ORDER = [
  'alumni',
  'users',
  'announcements',
  'rsvps',
  'orders',
  'itineraries',
  'rooming',
  'travelItems',
  'customGroups',
  'groupMemberships',
  'groupAnnouncements',
  'groupPolls',
  'photos',
];

async function importCollection(name) {
  const rows = blob[name];
  if (!Array.isArray(rows) || rows.length === 0) {
    console.log(`  ${name.padEnd(20)} (empty)`);
    return { inserted: 0, skipped: 0 };
  }
  const map = tables[name];
  const table = sqlTable[name];
  if (!map || !table) {
    console.warn(`  ${name.padEnd(20)} unknown collection — skipped`);
    return { inserted: 0, skipped: rows.length };
  }
  const idDef = map.id;

  let inserted = 0;
  let skipped = 0;
  for (const row of rows) {
    // Coerce numeric ids (json-server auto-incremented some collections) to
    // strings, since our id columns are TEXT.
    if (row.id !== undefined && typeof row.id !== 'string') {
      row.id = `${name}-${row.id}`;
    }

    const data = {};
    for (const [field, def] of Object.entries(map)) {
      if (Object.prototype.hasOwnProperty.call(row, field)) {
        data[def.col] = coerce(row[field], def.type);
      }
    }
    if (data[idDef.col] === undefined || data[idDef.col] === null) {
      console.warn(`    [${name}] row missing id, skipping:`, row);
      skipped++;
      continue;
    }
    const cols = Object.keys(data);
    const ph = cols.map((_, i) => `$${i + 1}`);
    const sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${ph.join(', ')})
                 ON CONFLICT (${idDef.col}) DO NOTHING`;
    try {
      const r = await query(sql, Object.values(data));
      if (r.rowCount > 0) inserted++;
      else skipped++;
    } catch (err) {
      console.error(`    [${name}] insert failed for id=${data[idDef.col]}: ${err.message}`);
      skipped++;
    }
  }
  console.log(`  ${name.padEnd(20)} ${String(inserted).padStart(4)} inserted · ${String(skipped).padStart(4)} skipped`);
  return { inserted, skipped };
}

async function main() {
  console.log(`[import] Reading blob: ${blobPath}`);
  await ensureDatabase();
  await ensureSchema();
  console.log(`[import] Importing collections (in dependency order):`);

  let total = 0;
  for (const name of ORDER) {
    const { inserted } = await importCollection(name);
    total += inserted;
  }

  // Anything in the blob not in ORDER → warn so we don't silently drop.
  for (const key of Object.keys(blob)) {
    if (!ORDER.includes(key)) {
      console.warn(`[import] Unknown collection in blob (skipped): ${key}`);
    }
  }

  console.log(`[import] Done. ${total} new rows inserted.`);
  await getPool().end();
}

main().catch((err) => {
  console.error('[import] FATAL:', err);
  process.exit(1);
});
