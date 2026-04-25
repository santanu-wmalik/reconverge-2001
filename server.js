// REConverge 2001 — production + local entrypoint.
//
// Architecture:
//   - Postgres with proper relational tables (server/schema.sql).
//   - One generic resource factory (server/resources.js) mounts CRUD per
//     collection so the existing json-server-shaped REST surface keeps
//     working without per-resource boilerplate.
//   - Token-based auth (server/auth.js); tokens in-memory, not persisted.
//
// Bootstrap order:
//   1. Bind the port FIRST so Render's health check is satisfied even if the
//      DB is slow to come up.
//   2. ensureDatabase() (CREATE DATABASE if missing).
//   3. ensureSchema() (apply schema.sql; idempotent).
//   4. seedIfEmpty() (insert demo users on a fresh DB).
//   5. Mount API routes.

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { ensureDatabase, ensureSchema, dbInfo, query } from './server/db.js';
import { mountAuth, authMiddleware } from './server/auth.js';
import { mountResource } from './server/resources.js';
import { seedData } from './server/seed-data.mjs';
import { tables, coerce } from './server/columns.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT, 10) || 3001;

// ── seed: insert the demo super-admin / admin / alumni users on a fresh DB ─
async function seedIfEmpty() {
  const r = await query('SELECT COUNT(*) AS c FROM alumni');
  if (parseInt(r.rows[0].c, 10) > 0) return;

  console.log('[db] Empty database — inserting demo seed users…');
  for (const a of seedData.alumni) {
    const map = tables.alumni;
    const data = {};
    for (const [field, def] of Object.entries(map)) {
      if (Object.prototype.hasOwnProperty.call(a, field)) {
        data[def.col] = coerce(a[field], def.type);
      }
    }
    const cols = Object.keys(data);
    const ph = cols.map((_, i) => `$${i + 1}`);
    await query(
      `INSERT INTO alumni (${cols.join(', ')}) VALUES (${ph.join(', ')}) ON CONFLICT (id) DO NOTHING`,
      Object.values(data)
    );
  }
  for (const u of seedData.users) {
    await query(
      `INSERT INTO users (id, email, password, alumni_id, role)
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
      [u.id, u.email, u.password, u.alumniId, u.role]
    );
  }
  console.log('[db] Seed inserted (alumni + users).');
}

async function main() {
  const app = express();
  app.use(express.json({ limit: '12mb' }));
  app.use(express.urlencoded({ extended: false, limit: '12mb' }));

  let ready = false;
  let bootstrapError = null;

  // Health endpoint — always live, even if DB is broken.
  app.get('/api/_health', (req, res) => {
    res.json({
      ready,
      error: bootstrapError?.message ?? null,
      db: `postgres://${dbInfo.user}@${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`,
    });
  });

  // Bind FIRST so port detection on Render passes even if DB is slow.
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[server] REConverge 2001 listening on 0.0.0.0:${PORT}`);
    console.log(`[server] DB target: postgres://${dbInfo.user}@${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`);
  });

  try {
    await ensureDatabase();
    await ensureSchema();
    await seedIfEmpty();
  } catch (err) {
    bootstrapError = err;
    console.error('[db] Bootstrap failed:', err.message);
    console.error('[db] → Check EC2 security group, postgresql.conf, pg_hba.conf.');
    return; // server stays up so /api/_health remains reachable
  }

  // Auth endpoints (login/register/logout/me) — register BEFORE the
  // gating middleware so they remain reachable for unauthenticated users.
  mountAuth(app);

  // Gate every other /api/* call by token + role.
  app.use(authMiddleware);

  // Mount the per-resource CRUD endpoints. Order doesn't matter; each
  // mount is self-contained.
  mountResource(app, 'alumni');
  mountResource(app, 'users');
  mountResource(app, 'announcements', {
    defaultSort: { column: 'created_at', direction: 'DESC' },
  });
  mountResource(app, 'rsvps');
  mountResource(app, 'orders');
  mountResource(app, 'itineraries');
  mountResource(app, 'rooming');
  mountResource(app, 'travelItems');
  mountResource(app, 'customGroups');
  mountResource(app, 'groupMemberships');
  mountResource(app, 'groupAnnouncements', {
    defaultSort: { column: 'created_at', direction: 'DESC' },
  });
  mountResource(app, 'groupPolls', {
    defaultSort: { column: 'created_at', direction: 'DESC' },
  });
  mountResource(app, 'photos', {
    defaultSort: { column: 'created_at', direction: 'DESC' },
  });

  // Fallback error handler — keeps stack traces out of the response while
  // still surfacing them in Render logs.
  app.use((err, req, res, _next) => {
    console.error(`[api] ${req.method} ${req.path} →`, err.message);
    if (process.env.NODE_ENV !== 'production') console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  // Static frontend + SPA fallback.
  const distPath = join(__dirname, 'dist');
  const indexPath = join(distPath, 'index.html');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (existsSync(indexPath)) res.sendFile(indexPath);
    else res.status(404).json({ error: 'Build not found. Run: npm run build' });
  });

  ready = true;
  console.log('[server] Ready to serve requests.');
}

main().catch((err) => {
  console.error('[fatal] Startup failed:', err.message);
  console.error(err);
  process.exit(1);
});
