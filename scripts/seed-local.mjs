// Writes server/db.json from the embedded seed (server/seed-data.mjs) if
// the target doesn't exist.
//
// Safe to run every time you start `npm run server` — only seeds on first
// run or after you delete db.json to reset local state.

import { existsSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { seedData } from '../server/seed-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const DB_PATH = join(root, 'server', 'db.json');

if (existsSync(DB_PATH)) {
  // db.json exists — preserve whatever state the developer has locally.
  process.exit(0);
}

writeFileSync(DB_PATH, JSON.stringify(seedData, null, 2));
console.log(`[seed:local] Wrote embedded seed → ${DB_PATH}`);
