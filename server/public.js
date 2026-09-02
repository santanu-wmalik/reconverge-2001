// Public, unauthenticated, PII-free aggregates for the landing page.
//
// The raw /api/alumni and /api/rsvps resources are (correctly) auth-gated —
// they carry emails, phones, payment UIDs, ID numbers, family details. The
// landing page's "Roll of Honour" only needs counts, per-branch totals and the
// name list (name · branch · city · paid flag · avatar flag), nothing more.
//
// Route: GET /api/public/roll-of-honour   (allow-listed in auth.js isPublicReq)
// Response:
//   {
//     totals:   { signedUp, paid, paidAny, interestOnly, heads },
//     byBranch: [{ branch, signedUp, paid, heads }],   // every branch, sorted desc
//     roster:   [{ id, name, branch, city, paid, verified, hasAvatar }]  // registered only
//   }
// Cache-Control: public, max-age=60 — cheap on Render bandwidth, and 60s
// staleness is fine for a leaderboard.

import { query } from './db.js';

// Keep in sync with src/utils/isDemoUser.js
const DEMO_EMAILS = new Set(['alumni@email.com', 'admin@email.com', 'superuser@email.com']);

const BRANCHES = [
  'Architecture',
  'Civil Engineering',
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Production Engineering',
];

const isPaid = (s) => s === 'paid' || s === 'confirmed';
// Anyone who has paid — verified (confirmed) or not yet (paid / pending-verification)
// — is flagged on the roster as "paid & coming".
const PAID_ANY = new Set(['paid', 'pending-verification', 'confirmed']);

export function mountPublic(app) {
  app.get('/api/public/roll-of-honour', async (_req, res, next) => {
    try {
      const [a, r] = await Promise.all([
        query(
          `SELECT id, name, email, branch, current_city, is_registered, payment_status,
                  adults, children_under_10, children_10_plus,
                  (avatar IS NOT NULL AND avatar <> '') AS has_avatar
             FROM alumni`
        ),
        query(`SELECT email FROM rsvps`),
      ]);

      const alumni = a.rows.filter((x) => !DEMO_EMAILS.has(String(x.email || '').toLowerCase()));
      const registered = alumni.filter((x) => x.is_registered);
      const registeredEmails = new Set(registered.map((x) => String(x.email || '').toLowerCase()));

      const interestOnly = r.rows.filter((x) => {
        const e = String(x.email || '').toLowerCase();
        return e && !registeredEmails.has(e) && !DEMO_EMAILS.has(e);
      }).length;

      const famOf = (x) =>
        Math.max(0, (Number(x.adults || 1)) - 1) +
        Number(x.children_under_10 || 0) +
        Number(x.children_10_plus || 0);

      const byBranchMap = new Map(BRANCHES.map((b) => [b, { branch: b, signedUp: 0, paid: 0, heads: 0 }]));
      let paid = 0;
      let paidAny = 0; // verified or not (paid / pending-verification / confirmed)
      let heads = 0;
      for (const x of registered) {
        const fam = famOf(x);
        heads += 1 + fam;
        if (isPaid(x.payment_status)) paid += 1;
        if (PAID_ANY.has(x.payment_status)) paidAny += 1;
        const row = byBranchMap.get(x.branch);
        if (row) {
          row.signedUp += 1;
          row.heads += 1 + fam;
          if (isPaid(x.payment_status)) row.paid += 1;
        }
      }

      const byBranch = Array.from(byBranchMap.values()).sort(
        (p, q) => q.signedUp - p.signedUp || p.branch.localeCompare(q.branch)
      );

      const roster = registered
        .map((x) => ({
          id: x.id,
          name: String(x.name || '').trim() || 'Batchmate', // full name (public by request)
          branch: x.branch || '',
          city: x.current_city || '',
          paid: PAID_ANY.has(x.payment_status),
          verified: x.payment_status === 'confirmed',
          hasAvatar: Boolean(x.has_avatar), // fetch via /api/public/avatar/:id
        }))
        .sort((p, q) => p.name.localeCompare(q.name));

      res.set('Cache-Control', 'public, max-age=60');
      res.json({
        totals: { signedUp: registered.length, paid, paidAny, interestOnly, heads },
        byBranch,
        roster,
      });
    } catch (err) {
      next(err);
    }
  });

  // GET /api/public/avatar/:id — the profile picture of a REGISTERED alumnus,
  // served as an image (avatars are stored as data URLs) so the public roster
  // can show faces without shipping megabytes of base64 in the roster JSON.
  // Demo accounts and unregistered records 404. Long cache: avatars rarely change.
  app.get('/api/public/avatar/:id', async (req, res, next) => {
    try {
      const r = await query('SELECT email, is_registered, avatar FROM alumni WHERE id = $1', [req.params.id]);
      const x = r.rows[0];
      if (!x || !x.is_registered || !x.avatar || DEMO_EMAILS.has(String(x.email || '').toLowerCase())) {
        return res.status(404).end();
      }
      const m = /^data:([\w/+.-]+);base64,(.+)$/s.exec(x.avatar);
      res.set('Cache-Control', 'public, max-age=86400');
      if (m) {
        res.type(m[1]);
        return res.send(Buffer.from(m[2], 'base64'));
      }
      if (/^https?:\/\//.test(x.avatar)) return res.redirect(302, x.avatar);
      return res.status(404).end();
    } catch (err) {
      next(err);
    }
  });

  // GET /api/public/then-and-now — the two landing-page photo strips.
  // Only url/caption/era leave the server (no uploader identity). Capped per
  // era because photos are stored as data URLs: 12 × ~300 KB is already a
  // few MB, and this is unauthenticated traffic on a metered host.
  app.get('/api/public/then-and-now', async (_req, res, next) => {
    try {
      const LIMIT = 12;
      const pick = (rows) => rows.map((p) => ({ id: p.id, url: p.url, caption: p.caption || '', era: p.era }));
      const [now, then] = await Promise.all([
        query(`SELECT id, url, caption, era FROM photos WHERE era = 'now' ORDER BY created_at DESC LIMIT $1`, [LIMIT]),
        query(`SELECT id, url, caption, era FROM photos WHERE era IS DISTINCT FROM 'now' ORDER BY created_at DESC LIMIT $1`, [LIMIT]),
      ]);
      res.set('Cache-Control', 'public, max-age=300');
      res.json({ then: pick(then.rows), now: pick(now.rows) });
    } catch (err) {
      next(err);
    }
  });
}
