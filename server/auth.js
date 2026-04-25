// Auth: in-memory token store, login/register/logout/me, gating middleware.
//
// Tokens are not persisted — on a process restart everyone re-logs in. The
// /me endpoint lets the SPA validate a stored token at boot and silently
// log out if it's stale.

import crypto from 'crypto';
import { query } from './db.js';
import { tables, coerce, rowToJson } from './columns.js';

const tokens = new Map(); // token → { userId, alumniId, role, email, issuedAt }
const newToken = () => crypto.randomBytes(24).toString('hex');

async function findUserByEmail(email) {
  const r = await query(`SELECT * FROM users WHERE LOWER(email) = LOWER($1)`, [email]);
  return r.rows[0] || null;
}
async function findAlumniByEmail(email) {
  const r = await query(`SELECT * FROM alumni WHERE LOWER(email) = LOWER($1)`, [email]);
  return r.rows[0] || null;
}
async function findAlumniById(id) {
  const r = await query(`SELECT * FROM alumni WHERE id = $1`, [id]);
  return r.rows[0] || null;
}

export function mountAuth(app) {
  // ── POST /api/auth/login ────────────────────────────────────────────────
  app.post('/api/auth/login', async (req, res, next) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      const userRow = await findUserByEmail(email);
      if (!userRow || userRow.password !== password) {
        // Same generic message — don't leak whether the email exists.
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const alumniRow = await findAlumniByEmail(email);
      if (!alumniRow) {
        return res.status(409).json({ error: 'Alumni profile missing for this account' });
      }
      const token = newToken();
      tokens.set(token, {
        userId: userRow.id,
        alumniId: alumniRow.id,
        role: userRow.role || 'alumni',
        email: userRow.email,
        issuedAt: Date.now(),
      });
      const user = { ...rowToJson('alumni', alumniRow), role: userRow.role || 'alumni' };
      res.json({ user, token });
    } catch (err) { next(err); }
  });

  // ── POST /api/auth/register ────────────────────────────────────────────
  // Atomic sign-up: validate, create alumni + users rows in a transaction,
  // issue token. Role is hard-coded to 'alumni' — never trust the body.
  app.post('/api/auth/register', async (req, res, next) => {
    const body = req.body || {};
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    try {
      const dupUser = await findUserByEmail(email);
      const dupAlumni = await findAlumniByEmail(email);
      if (dupUser || dupAlumni) {
        return res.status(409).json({
          error: 'An account with this email already exists. Please sign in instead.',
        });
      }

      // Allocate registration_id + ids before the transaction; cheap and
      // avoids holding a SELECT-COUNT under a write lock.
      const totalRes = await query('SELECT COUNT(*) AS c FROM alumni');
      const total = parseInt(totalRes.rows[0].c, 10) || 0;
      const alumniId = `alum-${Date.now().toString(36)}`;
      const userId = `user-${Date.now().toString(36)}`;
      const registrationId = body.registrationId || `SJ-2026-${String(total + 1).padStart(4, '0')}`;

      // Build alumni row from whatever the form submitted, then force the
      // sensitive fields server-side.
      const map = tables.alumni;
      const alumniData = {};
      for (const [field, def] of Object.entries(map)) {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
          alumniData[def.col] = coerce(body[field], def.type);
        }
      }
      alumniData.id = alumniId;
      alumniData.email = email;
      alumniData.batch = 2001;
      alumniData.is_registered = true;
      alumniData.registration_id = registrationId;
      alumniData.role = 'alumni';
      alumniData.created_at = new Date().toISOString();

      const cols = Object.keys(alumniData);
      const placeholders = cols.map((_, i) => `$${i + 1}`);
      const insertAlumniSql = `INSERT INTO alumni (${cols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;

      // Run both inserts atomically — half-registered states are the worst
      // class of bug at a reunion (visible profile, can't log in).
      const client = await (await import('./db.js')).getPool().connect();
      let createdAlumni;
      try {
        await client.query('BEGIN');
        const ar = await client.query(insertAlumniSql, Object.values(alumniData));
        createdAlumni = ar.rows[0];
        await client.query(
          `INSERT INTO users (id, email, password, alumni_id, role) VALUES ($1, $2, $3, $4, 'alumni')`,
          [userId, email, password, alumniId]
        );
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
      } finally {
        client.release();
      }

      const token = newToken();
      tokens.set(token, { userId, alumniId, role: 'alumni', email, issuedAt: Date.now() });
      res.status(201).json({
        user: { ...rowToJson('alumni', createdAlumni), role: 'alumni' },
        token,
      });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      next(err);
    }
  });

  // ── POST /api/auth/logout ──────────────────────────────────────────────
  app.post('/api/auth/logout', (req, res) => {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (token) tokens.delete(token);
    res.json({ ok: true });
  });

  // ── GET /api/auth/me ───────────────────────────────────────────────────
  app.get('/api/auth/me', async (req, res, next) => {
    try {
      const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
      const session = token && tokens.get(token);
      if (!session) return res.status(401).json({ error: 'Not signed in' });
      const alumniRow = await findAlumniById(session.alumniId);
      if (!alumniRow) return res.status(401).json({ error: 'Account no longer exists' });
      res.json({ user: { ...rowToJson('alumni', alumniRow), role: session.role } });
    } catch (err) { next(err); }
  });
}

// ── gating middleware ─────────────────────────────────────────────────────
//
// Public:        login/register/logout/me, GET /api/announcements, POST /api/rsvps, GET /api/_health
// Authenticated: everything else under /api/*
// Super-admin:   GET /api/users (list), PATCH/PUT/DELETE /api/users/:id

const isPublicReq = (req) => {
  const { method, path } = req;
  if (path === '/api/_health') return true;
  if (path.startsWith('/api/auth/')) return true;
  if (method === 'GET'  && path === '/api/announcements') return true;
  if (method === 'POST' && path === '/api/rsvps') return true;
  return false;
};
const isSuperAdminOnlyReq = (req) => {
  const { method, path } = req;
  if (path === '/api/users' && method === 'GET') return true;
  if (/^\/api\/users\/[^/]+$/.test(path) && ['PATCH', 'PUT', 'DELETE'].includes(method)) return true;
  return false;
};

export function authMiddleware(req, res, next) {
  if (!req.path.startsWith('/api/')) return next();
  if (isPublicReq(req)) return next();

  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const session = token ? tokens.get(token) : null;
  req.auth = session || null;

  if (!session) return res.status(401).json({ error: 'Authentication required' });
  if (isSuperAdminOnlyReq(req) && session.role !== 'super-admin') {
    return res.status(403).json({ error: 'Super-admin access required' });
  }
  next();
}
