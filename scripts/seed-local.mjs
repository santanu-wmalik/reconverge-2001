// Copies server/db.seed.json → server/db.json if the target doesn't exist.
// Safe to run every time you start `npm run server` — only seeds on first run
// or after you delete db.json to reset local state.

import { existsSync, copyFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const DB_PATH = join(root, 'server', 'db.json');
const SEED_PATH = join(root, 'server', 'db.seed.json');

if (existsSync(DB_PATH)) {
  // db.json exists — preserve whatever state the developer has locally.
  process.exit(0);
}

if (!existsSync(SEED_PATH)) {
  console.error(`[seed:local] Neither db.json nor db.seed.json exists.`);
  console.error(`[seed:local] Expected seed at: ${SEED_PATH}`);
  process.exit(1);
}

copyFileSync(SEED_PATH, DB_PATH);
console.log(`[seed:local] Seeded ${DB_PATH} from ${SEED_PATH}`);
