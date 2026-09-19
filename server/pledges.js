// Project Cornerstone pledges (Alumni Guest House fundraising).
//
//   POST /api/pledges        — signed-in alumni only. One pledge per alumnus:
//                              re-submitting updates the existing pledge.
//                              alumni_id always comes from the session.
//   GET  /api/pledges/mine   — the caller's own pledge (or null).
//   GET  /api/pledges        — finance permission only (amounts + contact
//                              details are sensitive; `anonymous` rows must
//                              never reach a public surface).

import { query } from './db.js';
import { sessionCan } from './auth.js';

const TIERS = new Set([
  'Cornerstone Circle', 'Keystone Circle', 'Pillar Circle', 'Foundation Circle', 'Custom',
]);
// First-come-first-serve caps on the naming tiers.
const TIER_CAPS = {
  'Cornerstone Circle': 2,
  'Keystone Circle': 20,
};

const TIER_AMOUNTS = {
  'Cornerstone Circle': 2500000,
  'Keystone Circle': 1000000,
  'Pillar Circle': 500000,
  'Foundation Circle': 200000,
};

const toJson = (r) => r && ({
  id: r.id,
  alumniId: r.alumni_id,
  name: r.name,
  email: r.email,
  phone: r.phone,
  location: r.location,
  linkedin: r.linkedin,
  branch: r.branch,
  tier: r.tier,
  amount: r.amount != null ? Number(r.amount) : null,
  companyMatch: r.company_match,
  companyName: r.company_name,
  taxInterest: r.tax_interest,
  anonymous: r.anonymous,
  volunteerInterest: r.volunteer_interest,
  message: r.message,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export function mountPledges(app) {
  app.get('/api/pledges/mine', async (req, res, next) => {
    try {
      const session = req.auth;
      if (!session?.alumniId) return res.status(401).json({ error: 'Authentication required' });
      const r = await query('SELECT * FROM pledges WHERE alumni_id = $1', [session.alumniId]);
      // Tier availability so the form can show remaining seats (FCFS).
      const counts = await query(
        `SELECT tier, COUNT(*)::int AS n FROM pledges WHERE tier = ANY($1) GROUP BY tier`,
        [Object.keys(TIER_CAPS)]
      );
      const availability = Object.fromEntries(Object.entries(TIER_CAPS).map(([tier, cap]) => {
        const taken = counts.rows.find((x) => x.tier === tier)?.n || 0;
        return [tier, { cap, taken, left: Math.max(0, cap - taken) }];
      }));
      res.json({ pledge: toJson(r.rows[0]) || null, availability });
    } catch (err) { next(err); }
  });

  app.get('/api/pledges', async (req, res, next) => {
    try {
      const session = req.auth;
      if (!session) return res.status(401).json({ error: 'Authentication required' });
      if (!sessionCan(session, 'finance')) {
        return res.status(403).json({ error: 'Finance permission required' });
      }
      const r = await query('SELECT * FROM pledges ORDER BY created_at DESC');
      res.json(r.rows.map(toJson));
    } catch (err) { next(err); }
  });

  app.post('/api/pledges', async (req, res, next) => {
    try {
      const session = req.auth;
      if (!session?.alumniId) return res.status(401).json({ error: 'Authentication required' });

      const b = req.body || {};
      const tier = TIERS.has(b.tier) ? b.tier : null;
      if (!tier) return res.status(400).json({ error: 'Please choose a pledge tier' });
      let amount = TIER_AMOUNTS[tier] ?? null;
      if (tier === 'Custom') {
        amount = Number(b.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
          return res.status(400).json({ error: 'Please enter a valid pledge amount' });
        }
      }
      // First-come-first-serve cap on the naming tiers (own existing pledge
      // doesn't count against itself on an update).
      const cap = TIER_CAPS[tier];
      if (cap) {
        const c = await query(
          'SELECT COUNT(*)::int AS n FROM pledges WHERE tier = $1 AND alumni_id <> $2',
          [tier, session.alumniId]
        );
        if (c.rows[0].n >= cap) {
          return res.status(409).json({ error: `${tier} is fully subscribed (first come, first served) — please pick another tier.` });
        }
      }
      const t = (v, max = 500) => (v == null ? null : String(v).slice(0, max).trim() || null);

      const r = await query(
        `INSERT INTO pledges (id, alumni_id, name, email, phone, location, linkedin, branch,
                              tier, amount, company_match, company_name, tax_interest,
                              anonymous, volunteer_interest, message)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         ON CONFLICT (alumni_id) DO UPDATE SET
           name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone,
           location = EXCLUDED.location, linkedin = EXCLUDED.linkedin, branch = EXCLUDED.branch,
           tier = EXCLUDED.tier, amount = EXCLUDED.amount,
           company_match = EXCLUDED.company_match, company_name = EXCLUDED.company_name,
           tax_interest = EXCLUDED.tax_interest, anonymous = EXCLUDED.anonymous,
           volunteer_interest = EXCLUDED.volunteer_interest, message = EXCLUDED.message,
           updated_at = NOW()
         RETURNING *`,
        [
          `pledge-${Date.now().toString(36)}`,
          session.alumniId,
          t(b.name, 200), t(b.email, 200), t(b.phone, 50), t(b.location, 200),
          t(b.linkedin, 300), t(b.branch, 50),
          tier, amount,
          Boolean(b.companyMatch), b.companyMatch ? t(b.companyName, 200) : null,
          Boolean(b.taxInterest), Boolean(b.anonymous), Boolean(b.volunteerInterest),
          t(b.message, 2000),
        ]
      );
      res.status(201).json({ pledge: toJson(r.rows[0]) });
    } catch (err) { next(err); }
  });
}
