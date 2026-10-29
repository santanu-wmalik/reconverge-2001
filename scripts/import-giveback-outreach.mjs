// Import the fundraising committee's "Giving Back Master List" sheet into
// the giveback_outreach table (admin GB Tracking page).
//
// Usage:
//   node --env-file-if-exists=.env scripts/import-giveback-outreach.mjs "<path-to-Reunion Fundraising.xlsx>"
//
// Safe to re-run: by default it refuses to import if the table already has
// rows (pass --force to append anyway). It never updates or deletes.

import { ensureDatabase, ensureSchema, query, getPool } from '../server/db.js';
import XLSX from 'xlsx';

const file = process.argv[2];
const force = process.argv.includes('--force');
if (!file) {
  console.error('Usage: node scripts/import-giveback-outreach.mjs <xlsx> [--force]');
  process.exit(1);
}

const wb = XLSX.readFile(file);
const sheet = wb.Sheets['Giving Back Master List'];
if (!sheet) {
  console.error('Sheet "Giving Back Master List" not found. Sheets:', wb.SheetNames.join(', '));
  process.exit(1);
}
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// Row 0 is a totals row, row 1 is the header. Columns, in order:
// 0 Full Name · 1 Branch · 2 Current Geo Location · 3 Home · 4 On WhatsApp ·
// 5 Registered in Website · 6 Paid for reunion · 7 Phone · 8 Outreach POC ·
// 9 Commit (Lakhs) · 10 Additional Company Match · 11 Intent Submitted ·
// 12 Money sent to NITCAA · 13 Comments
const headerIdx = rows.findIndex((r) => String(r[0]).trim() === 'Full Name');
if (headerIdx < 0) { console.error('Header row not found'); process.exit(1); }
const data = rows.slice(headerIdx + 1)
  .map((r) => r.map((c) => (c == null ? '' : String(c).trim())))
  .filter((r) => r[0]); // keep rows with a name

await ensureDatabase();
await ensureSchema();

const existing = await query('SELECT COUNT(*)::int AS n FROM giveback_outreach');
if (existing.rows[0].n > 0 && !force) {
  console.error(`giveback_outreach already has ${existing.rows[0].n} rows — pass --force to append anyway.`);
  await getPool().end();
  process.exit(1);
}

let n = 0;
for (const r of data) {
  const commit = r[9] !== '' && Number.isFinite(Number(r[9])) ? Number(r[9]) : null;
  const paid = r[6] !== '' ? String(r[6]) : null; // amount or Yes
  await query(
    `INSERT INTO giveback_outreach
       (id, full_name, branch, location, home_state, on_whatsapp, registered, paid,
        phone, poc, commit_lakhs, company_match, intent_submitted, money_sent, comments, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
    [
      `gbo-${n.toString(36).padStart(4, '0')}-${Math.random().toString(36).slice(2, 7)}`,
      r[0].slice(0, 200), r[1] || null, r[2] || null, r[3] || null,
      r[4] || null, r[5] || null, paid,
      r[7] || null, r[8] || null, commit,
      r[10] || null, r[11] || null, r[12] || null, r[13] || null, n,
    ]
  );
  n++;
}
console.log(`Imported ${n} people into giveback_outreach.`);
await getPool().end();
