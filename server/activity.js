// User activity log — the admin "User Activity" (usage audit) dashboard.
//
// Capture:
//   - logActivity() — used by auth.js for sign-in / register / sign-out.
//   - activityMiddleware — records every AUTHENTICATED write under /api/*
//     (fire-and-forget; never breaks the request it rides on).
//   - POST /api/activity/page — the client pings this on every route change,
//     giving real page-view data ("Page view" events).
//
// Serve (super-admin only): GET /api/admin/user-activity?from&to&user
//   KPIs, daily active users, logins over time, most visited pages,
//   per-user breakdown, and a session log (events grouped per user with a
//   30-minute inactivity gap starting a new session).
//
// Demo seed accounts are excluded from everything served, per house rule.

import { query } from './db.js';

const DEMO_EMAILS = new Set(['alumni@email.com', 'admin@email.com', 'superuser@email.com']);
const SESSION_GAP_MS = 30 * 60 * 1000;

const clientIp = (req) =>
  String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
  req.socket?.remoteAddress || null;

const browserOf = (ua = '') =>
  /edg\//i.test(ua) ? 'Edge'
  : /opr\//i.test(ua) ? 'Opera'
  : /chrome\//i.test(ua) ? 'Chrome'
  : /safari\//i.test(ua) ? 'Safari'
  : /firefox\//i.test(ua) ? 'Firefox'
  : ua ? 'Other' : '—';

export function logActivity({ userId, email, role, action, method, path, detail, ip, userAgent }) {
  query(
    `INSERT INTO activity_log (user_id, email, role, action, method, path, detail, ip, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [userId || null, email || null, role || null, action, method || null, path || null,
     detail || null, ip || null, userAgent || null]
  ).catch(() => {});
}

// Friendly action name from the request shape; unmapped endpoints fall back
// to "METHOD /base" so nothing goes uncaptured.
const actionOf = (method, path) => {
  const base = path.replace(/^\/api\//, '').split('/')[0];
  const V = { POST: 'Created', PATCH: 'Updated', PUT: 'Updated', DELETE: 'Deleted' }[method] || method;
  const NOUN = {
    'pledges': 'intent to give', 'alumni': 'profile', 'rsvps': 'RSVP', 'orders': 'order',
    'itineraries': 'itinerary', 'photos': 'photo', 'announcements': 'announcement',
    'users': 'user account', 'giveback-outreach': 'GB Tracking row', 'rooming': 'rooming entry',
    'travel-items': 'travel item', 'custom-groups': 'group', 'group-announcements': 'group post',
    'group-polls': 'group poll', 'group-memberships': 'group membership',
  }[base];
  return NOUN ? `${V} ${NOUN}` : `${method} /${base}`;
};

export function activityMiddleware(req, _res, next) {
  const { method, path } = req;
  if (
    req.auth &&
    ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method) &&
    path.startsWith('/api/') &&
    !path.startsWith('/api/auth/') &&
    !path.startsWith('/api/activity') &&
    !path.startsWith('/api/admin/user-activity')
  ) {
    logActivity({
      userId: req.auth.userId, email: req.auth.email, role: req.auth.role,
      action: actionOf(method, path), method, path,
      ip: clientIp(req), userAgent: req.headers['user-agent'],
    });
  }
  next();
}

export function mountActivity(app) {
  // ── Page-view ping (any signed-in user) ─────────────────────────────────
  app.post('/api/activity/page', (req, res) => {
    const page = String(req.body?.path || '').slice(0, 200);
    if (req.auth && page.startsWith('/')) {
      logActivity({
        userId: req.auth.userId, email: req.auth.email, role: req.auth.role,
        action: 'Page view', method: 'VIEW', path: page,
        ip: clientIp(req), userAgent: req.headers['user-agent'],
      });
    }
    res.json({ ok: true });
  });

  // ── Dashboard data (super-admin) ────────────────────────────────────────
  app.get('/api/admin/user-activity', async (req, res, next) => {
    try {
      if (!req.auth || req.auth.role !== 'super-admin') {
        return res.status(403).json({ error: 'Super-admin access required' });
      }
      const to = req.query.to ? new Date(`${req.query.to}T23:59:59`) : new Date();
      const from = req.query.from ? new Date(`${req.query.from}T00:00:00`)
        : new Date(Date.now() - 30 * 24 * 3600 * 1000);
      const userFilter = String(req.query.user || '').toLowerCase();

      const [ev, names, totalUsersQ] = await Promise.all([
        query(
          `SELECT email, role, action, method, path, ip, user_agent, created_at
             FROM activity_log
            WHERE created_at BETWEEN $1 AND $2 AND email IS NOT NULL
            ORDER BY created_at ASC
            LIMIT 50000`,
          [from.toISOString(), to.toISOString()]
        ),
        query(`SELECT email, name FROM alumni`),
        query(`SELECT COUNT(*) AS n FROM users WHERE lower(email) NOT IN ('alumni@email.com','admin@email.com','superuser@email.com')`),
      ]);
      const nameByEmail = new Map(names.rows.map((r) => [String(r.email || '').toLowerCase(), r.name]));
      const events = ev.rows
        .filter((r) => !DEMO_EMAILS.has(String(r.email).toLowerCase()))
        .filter((r) => !userFilter || String(r.email).toLowerCase() === userFilter)
        .map((r) => ({ ...r, t: new Date(r.created_at).getTime() }));

      // Day key in IST so the charts match the committee's clock.
      const dayOf = (t) => new Date(t + 5.5 * 3600 * 1000).toISOString().slice(0, 10);

      const daily = new Map();      // day -> Set(email)
      const logins = new Map();     // day -> count
      const pages = new Map();      // path -> count
      const byUser = new Map();     // email -> { events, pageViews }
      for (const e of events) {
        const d = dayOf(e.t);
        if (!daily.has(d)) daily.set(d, new Set());
        daily.get(d).add(e.email);
        if (e.action === 'Signed in') logins.set(d, (logins.get(d) || 0) + 1);
        if (e.action === 'Page view' && e.path) pages.set(e.path, (pages.get(e.path) || 0) + 1);
        if (!byUser.has(e.email)) byUser.set(e.email, { events: 0, pageViews: 0 });
        const u = byUser.get(e.email);
        u.events += 1;
        if (e.action === 'Page view') u.pageViews += 1;
      }

      // Sessionize: per user, a >30-min silence starts a new session.
      const perUser = new Map();
      for (const e of events) {
        if (!perUser.has(e.email)) perUser.set(e.email, []);
        perUser.get(e.email).push(e);
      }
      const sessions = [];
      for (const [email, list] of perUser) {
        let cur = null;
        for (const e of list) {
          if (!cur || e.t - cur.lastT > SESSION_GAP_MS) {
            cur = { email, login: e.t, lastT: e.t, pages: 0, ip: e.ip, ua: e.user_agent };
            sessions.push(cur);
          }
          cur.lastT = e.t;
          if (e.action === 'Page view') cur.pages += 1;
          if (e.ip) cur.ip = e.ip;
          if (e.user_agent) cur.ua = e.user_agent;
        }
      }
      sessions.sort((a, b) => b.login - a.login);
      const now = Date.now();
      const sessionRows = sessions.slice(0, 500).map((s) => ({
        email: s.email,
        name: nameByEmail.get(String(s.email).toLowerCase()) || null,
        login: new Date(s.login).toISOString(),
        lastActive: new Date(s.lastT).toISOString(),
        durationMs: s.lastT - s.login,
        pages: s.pages,
        ip: s.ip || null,
        browser: browserOf(s.ua || ''),
        active: now - s.lastT < SESSION_GAP_MS,
      }));
      const avgSessionMs = sessions.length
        ? sessions.reduce((x, s) => x + (s.lastT - s.login), 0) / sessions.length : 0;

      res.json({
        from: from.toISOString(), to: to.toISOString(),
        kpis: {
          totalUsers: Number(totalUsersQ.rows[0].n),
          activeUsers: new Set(events.map((e) => e.email)).size,
          avgSessionMs,
          pageViews: events.filter((e) => e.action === 'Page view').length,
          logins: events.filter((e) => e.action === 'Signed in').length,
          actions: events.filter((e) => !['Page view', 'Signed in', 'Signed out'].includes(e.action)).length,
        },
        daily: Array.from(daily.entries()).map(([day, set]) => ({ day, users: set.size })).sort((a, b) => a.day.localeCompare(b.day)),
        logins: Array.from(logins.entries()).map(([day, count]) => ({ day, count })).sort((a, b) => a.day.localeCompare(b.day)),
        topPages: Array.from(pages.entries()).map(([path, count]) => ({ path, count }))
          .sort((a, b) => b.count - a.count).slice(0, 10),
        byUser: Array.from(byUser.entries()).map(([email, v]) => ({
          email, name: nameByEmail.get(String(email).toLowerCase()) || null, ...v,
        })).sort((a, b) => b.events - a.events).slice(0, 12),
        users: Array.from(byUser.keys()).sort(),
        sessions: sessionRows,
      });
    } catch (err) { next(err); }
  });
}
