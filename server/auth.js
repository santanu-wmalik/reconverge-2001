// Auth: in-memory token store, login/register/logout/me, gating middleware.
//
// Tokens are not persisted — on a process restart everyone re-logs in. The
// /me endpoint lets the SPA validate a stored token at boot and silently
// log out if it's stale.

import crypto from 'crypto';
import { query } from './db.js';
import { tables, coerce, rowToJson } from './columns.js';
import { sendPasswordResetEmail } from './mailer.js';

const tokens = new Map(); // token → { userId, alumniId, role, email, issuedAt }
const newToken = () => crypto.randomBytes(24).toString('hex');

// ── password-reset config ──────────────────────────────────────────────
const RESET_TOKEN_TTL_MINUTES = 30;
const RESET_MIN_PASSWORD_LEN = 6;
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

// Simple in-memory rate limiter: max N events per key per window.
// Restart wipes the counters — fine for this scale.
function createRateLimiter({ max, windowMs }) {
  const hits = new Map(); // key → [timestamp, ...]
  return function allow(key) {
    const now = Date.now();
    const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (arr.length >= max) {
      hits.set(key, arr);
      return false;
    }
    arr.push(now);
    hits.set(key, arr);
    return true;
  };
}
const forgotLimitByIp = createRateLimiter({ max: 10, windowMs: 60 * 60 * 1000 });
const forgotLimitByEmail = createRateLimiter({ max: 3, windowMs: 60 * 60 * 1000 });

// Purge every live session for the given user (used after password reset).
function purgeSessionsForUser(userId) {
  for (const [tok, sess] of tokens.entries()) {
    if (sess.userId === userId) tokens.delete(tok);
  }
}

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

  // ── POST /api/auth/impersonate ─────────────────────────────────────────
  // Super-admin-only. Issues a new token that acts as the target user but
  // remembers the original super-admin so they can switch back without
  // re-entering their password. The new token's session carries an
  // `impersonatedBy` field; the role used for authz is the TARGET user's
  // role (not super-admin) so the impersonator sees the portal exactly the
  // way the target sees it.
  app.post('/api/auth/impersonate', async (req, res, next) => {
    try {
      const callerToken = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
      const caller = callerToken && tokens.get(callerToken);
      if (!caller || caller.role !== 'super-admin') {
        return res.status(403).json({ error: 'Super-admin access required' });
      }
      // Don't allow chained impersonation — keeps the back-button trail simple.
      if (caller.impersonatedBy) {
        return res
          .status(400)
          .json({ error: 'Already impersonating; stop first before starting a new session.' });
      }
      const { targetUserId } = req.body || {};
      if (!targetUserId) return res.status(400).json({ error: 'targetUserId is required' });
      const ur = await query(`SELECT * FROM users WHERE id = $1`, [targetUserId]);
      const targetUser = ur.rows[0];
      if (!targetUser) return res.status(404).json({ error: 'Target user not found' });
      if (targetUser.id === caller.userId) {
        return res.status(400).json({ error: 'Cannot impersonate yourself' });
      }
      const targetAlumni = targetUser.alumni_id
        ? await findAlumniById(targetUser.alumni_id)
        : null;
      if (!targetAlumni) return res.status(404).json({ error: 'Target alumni profile missing' });

      const token = newToken();
      tokens.set(token, {
        userId: targetUser.id,
        alumniId: targetAlumni.id,
        role: targetUser.role || 'alumni',
        email: targetUser.email,
        issuedAt: Date.now(),
        // Snapshot enough to switch back without a password.
        impersonatedBy: {
          userId: caller.userId,
          alumniId: caller.alumniId,
          role: caller.role,
          email: caller.email,
        },
      });
      // We deliberately leave the caller's original token alive — if they
      // open a second tab, that tab keeps working as super-admin. The "Stop
      // impersonating" call below also re-issues a fresh super-admin token,
      // so cleanup is automatic from either side.
      res.json({
        user: { ...rowToJson('alumni', targetAlumni), role: targetUser.role || 'alumni' },
        token,
        impersonating: true,
      });
    } catch (err) { next(err); }
  });

  // ── POST /api/auth/stop-impersonating ──────────────────────────────────
  app.post('/api/auth/stop-impersonating', async (req, res, next) => {
    try {
      const t = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
      const session = t && tokens.get(t);
      if (!session || !session.impersonatedBy) {
        return res.status(400).json({ error: 'Not currently impersonating' });
      }
      // Look up the original super-admin's alumni record to return as `user`.
      const orig = session.impersonatedBy;
      const alumniRow = await findAlumniById(orig.alumniId);
      if (!alumniRow) return res.status(409).json({ error: 'Original account no longer exists' });
      // Drop the impersonation token; mint a fresh super-admin token.
      tokens.delete(t);
      const newT = newToken();
      tokens.set(newT, {
        userId: orig.userId,
        alumniId: orig.alumniId,
        role: orig.role,
        email: orig.email,
        issuedAt: Date.now(),
      });
      res.json({
        user: { ...rowToJson('alumni', alumniRow), role: orig.role },
        token: newT,
      });
    } catch (err) { next(err); }
  });

  // ── POST /api/auth/forgot-password ─────────────────────────────────────
  // Always responds 200 with a generic message — never leaks whether the
  // email exists. If the account is real we generate a random token, store
  // only its SHA-256 hash in password_resets, invalidate prior unused tokens
  // for the same user, and email the raw token as a link.
  app.post('/api/auth/forgot-password', async (req, res, next) => {
    const genericResponse = {
      ok: true,
      message:
        "If an account exists for that email, we've sent a reset link. " +
        'Check your inbox (and spam). The link expires in ' +
        RESET_TOKEN_TTL_MINUTES + ' minutes.',
    };
    try {
      const emailRaw = String((req.body || {}).email || '').trim().toLowerCase();
      if (!emailRaw || !/^\S+@\S+\.\S+$/.test(emailRaw)) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
      }

      const ip = (req.headers['x-forwarded-for'] || req.ip || 'unknown').toString().split(',')[0].trim();
      const ua = (req.headers['user-agent'] || '').slice(0, 500);
      if (!forgotLimitByIp(ip) || !forgotLimitByEmail(emailRaw)) {
        // Same generic 200 — don't tell scrapers they hit a limit.
        return res.json(genericResponse);
      }

      const userRow = await findUserByEmail(emailRaw);
      if (!userRow) return res.json(genericResponse);

      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = sha256(rawToken);
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

      // Invalidate any prior live tokens for this user — only the newest link works.
      await query(
        `UPDATE password_resets SET used_at = NOW()
         WHERE user_id = $1 AND used_at IS NULL AND expires_at > NOW()`,
        [userRow.id]
      );
      await query(
        `INSERT INTO password_resets (user_id, token_hash, expires_at, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5)`,
        [userRow.id, tokenHash, expiresAt.toISOString(), ip, ua]
      );

      // Build reset URL. Prefer APP_URL; fall back to the request's own origin.
      const base = (process.env.APP_URL || '').replace(/\/$/, '')
        || `${req.protocol}://${req.get('host')}`;
      const resetUrl = `${base}/reset-password?token=${rawToken}`;

      const alumniRow = await findAlumniByEmail(emailRaw);
      const displayName = alumniRow?.name || '';

      // Fire-and-log — don't leak send failures to the response.
      try {
        await sendPasswordResetEmail({
          to: emailRaw,
          name: displayName,
          resetUrl,
          expiresMinutes: RESET_TOKEN_TTL_MINUTES,
        });
      } catch (mailErr) {
        console.error('[auth] password reset email send failed:', mailErr);
      }

      return res.json(genericResponse);
    } catch (err) { next(err); }
  });

  // ── POST /api/auth/reset-password ──────────────────────────────────────
  // Consumes a reset token (single-use, time-boxed), updates the password,
  // and purges every live session for that user so any other logged-in
  // devices are signed out.
  app.post('/api/auth/reset-password', async (req, res, next) => {
    try {
      const { token, newPassword } = req.body || {};
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Reset token is required' });
      }
      if (!newPassword || typeof newPassword !== 'string' || newPassword.length < RESET_MIN_PASSWORD_LEN) {
        return res.status(400).json({
          error: `Password must be at least ${RESET_MIN_PASSWORD_LEN} characters`,
        });
      }
      const tokenHash = sha256(token);
      const r = await query(
        `SELECT * FROM password_resets
         WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
         LIMIT 1`,
        [tokenHash]
      );
      const resetRow = r.rows[0];
      if (!resetRow) {
        return res.status(400).json({
          error: 'This reset link is invalid or has expired. Please request a new one.',
        });
      }

      // Atomic: update password, mark token used, purge sessions.
      const { getPool } = await import('./db.js');
      const client = await getPool().connect();
      try {
        await client.query('BEGIN');
        await client.query(
          `UPDATE users SET password = $1 WHERE id = $2`,
          [newPassword, resetRow.user_id]
        );
        await client.query(
          `UPDATE password_resets SET used_at = NOW() WHERE id = $1`,
          [resetRow.id]
        );
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
      } finally {
        client.release();
      }

      purgeSessionsForUser(resetRow.user_id);
      return res.json({ ok: true, message: 'Password updated. You can now sign in.' });
    } catch (err) { next(err); }
  });

  // ── GET /api/auth/me ───────────────────────────────────────────────────
  app.get('/api/auth/me', async (req, res, next) => {
    try {
      const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
      const session = token && tokens.get(token);
      if (!session) return res.status(401).json({ error: 'Not signed in' });
      const alumniRow = await findAlumniById(session.alumniId);
      if (!alumniRow) return res.status(401).json({ error: 'Account no longer exists' });
      res.json({
        user: { ...rowToJson('alumni', alumniRow), role: session.role },
        impersonating: Boolean(session.impersonatedBy),
        impersonatedBy: session.impersonatedBy
          ? { name: session.impersonatedBy.email, role: session.impersonatedBy.role }
          : null,
      });
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
