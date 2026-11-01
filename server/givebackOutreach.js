// Give Back outreach tracker (Project Cornerstone).
//
// Admin tool for the fundraising committee: the "Giving Back Master List"
// spreadsheet moved into Postgres so outreach assignments, soft commits and
// call comments live in one editable place instead of a gsheet.
//
//   GET    /api/giveback-outreach      — full list
//   POST   /api/giveback-outreach      — add a person
//   PATCH  /api/giveback-outreach/:id  — update editable fields
//   DELETE /api/giveback-outreach/:id  — remove a row
//
// All routes require an admin holding the 'gbtracking' permission
// (super-admin implicitly). This data is sensitive — names, phones and
// commitment amounts — and must never reach a public surface.

import { query } from './db.js';
import { sessionCan } from './auth.js';

// Match sheet rows to live alumni records by normalised full name — the
// sheet's Registered/Paid columns were a point-in-time snapshot; the website
// is the source of truth now.
const normName = (n) => String(n || '').toLowerCase().replace(/[^a-z]+/g, ' ').trim();
const PAID_ANY = new Set(['paid', 'pending-verification', 'confirmed']);
const DEMO_EMAILS = new Set(['alumni@email.com', 'admin@email.com', 'superuser@email.com']);

// Fuzzy name matching: people register as "Padmaraj V Ramachandran" while the
// sheet says "PADMARAJ V R". Tokenise both; the shorter name must be a subset
// of the longer, where a single letter matches as an initial, with at least
// one full-word token in common. A row only takes a match when it is
// UNAMBIGUOUS (exactly one candidate) — "MANOJ KUMAR" twice matches nothing.
const nameTokens = (n) =>
  normName(n).split(' ').filter(Boolean).filter((t) => !['er', 'mr', 'dr', 'ms'].includes(t));
// One-edit tolerance for longer tokens — catches "Pritwiraj" vs "Prithwiraj".
const near = (a, b) => {
  if (a === b) return true;
  if (a.length < 5 || b.length < 5 || Math.abs(a.length - b.length) > 1) return false;
  // Levenshtein distance ≤ 1 check.
  if (a.length === b.length) {
    let diff = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i] && ++diff > 1) return false;
    return true;
  }
  const [s, l] = a.length < b.length ? [a, b] : [b, a];
  let i = 0, j = 0, skipped = false;
  while (i < s.length && j < l.length) {
    if (s[i] === l[j]) { i++; j++; continue; }
    if (skipped) return false;
    skipped = true; j++;
  }
  return true;
};

const tokenSubset = (A, B) => {
  const used = new Array(B.length).fill(false);
  for (const t of A) {
    let ok = false;
    for (let i = 0; i < B.length; i++) {
      if (used[i]) continue;
      const b = B[i];
      if (t === b || (t.length === 1 && b[0] === t) || (b.length === 1 && t[0] === b) || near(t, b)) {
        used[i] = true; ok = true; break;
      }
    }
    if (!ok) return false;
  }
  return true;
};
const namesMatch = (T1, T2) => {
  const [S, L] = T1.length <= T2.length ? [T1, T2] : [T2, T1];
  const strong = S.filter((t) => t.length > 1 && L.some((b) => t === b || near(t, b))).length;
  return strong >= 1 && tokenSubset(S, L);
};
// Canonical branch code — the sheet says "Mech"/"CompSci"/"Production" while
// profiles carry "Mechanical Engineering" etc. Used to break name ties.
const canonBranch = (b) => {
  const s = String(b || '').toLowerCase();
  if (!s.trim()) return null;
  if (s.includes('arch')) return 'arch';
  if (s.includes('civil')) return 'civil';
  if (s.includes('comp') || /\bcse?\b/.test(s)) return 'cse';
  if (s.includes('ece') || s.includes('communication')) return 'ece';
  if (s.includes('eee') || s.includes('electrical')) return 'eee';
  if (s.includes('mech')) return 'mech';
  if (s.includes('prod')) return 'prod';
  return null;
};

// Find the single unambiguous candidate for `tokens` among `pool`
// ([{T, bc, ...}]). Exact normalised equality wins outright; when several
// names fit, the row's branch breaks the tie.
const findUnique = (tokens, norm, pool, bc) => {
  const narrow = (cands) => {
    if (cands.length === 1) return cands[0];
    if (cands.length > 1 && bc) {
      const same = cands.filter((x) => x.bc === bc);
      if (same.length === 1) return same[0];
    }
    return null;
  };
  const exact = pool.filter((x) => x.norm === norm);
  if (exact.length) return narrow(exact);
  return narrow(pool.filter((x) => namesMatch(tokens, x.T)));
};

const toJson = (r) => ({
  id: r.id,
  fullName: r.full_name,
  branch: r.branch,
  location: r.location,
  homeState: r.home_state,
  onWhatsapp: r.on_whatsapp,
  registered: r.registered,
  paid: r.paid,
  phone: r.phone,
  poc: r.poc,
  commitLakhs: r.commit_lakhs != null ? Number(r.commit_lakhs) : null,
  companyMatch: r.company_match,
  intentSubmitted: r.intent_submitted,
  moneySent: r.money_sent,
  comments: r.comments,
  matchedAlumniId: r.matched_alumni_id,
  matchedRegistrationId: r.matched_registration_id,
  sortOrder: r.sort_order,
  updatedBy: r.updated_by,
  updatedAt: r.updated_at,
});

// camelCase body field -> column. Everything is editable except id/timestamps.
const FIELDS = {
  fullName: 'full_name',
  branch: 'branch',
  location: 'location',
  homeState: 'home_state',
  onWhatsapp: 'on_whatsapp',
  registered: 'registered',
  paid: 'paid',
  phone: 'phone',
  poc: 'poc',
  commitLakhs: 'commit_lakhs',
  companyMatch: 'company_match',
  intentSubmitted: 'intent_submitted',
  moneySent: 'money_sent',
  comments: 'comments',
  matchedAlumniId: 'matched_alumni_id',
};

// ─── Change history ───────────────────────────────────────────────────────
// One log row per changed field (plus one per add/delete). Fire-and-forget:
// a logging failure must never fail the edit itself.
const logChange = (entries) => {
  if (!entries.length) return;
  const vals = [];
  const tuples = entries.map((e) => {
    vals.push(e.rowId || null, e.fullName || null, e.author || null, e.action,
      e.field || null, e.oldValue ?? null, e.newValue ?? null);
    const n = vals.length;
    return `($${n - 6}, $${n - 5}, $${n - 4}, $${n - 3}, $${n - 2}, $${n - 1}, $${n})`;
  });
  query(
    `INSERT INTO giveback_outreach_log (row_id, full_name, author, action, field, old_value, new_value)
     VALUES ${tuples.join(', ')}`,
    vals
  ).catch((err) => console.error('gbo log failed:', err.message));
};
// Normalise a column value for comparison/storage — numerics via Number so
// "5" vs 5.00 isn't a phantom change.
const asLogText = (v) => (v == null ? null : String(v));
const sameVal = (a, b) => {
  const as = asLogText(a) ?? '';
  const bs = asLogText(b) ?? '';
  if (as === bs) return true;
  // pg returns NUMERIC as "5.00" while the body sends 5 — not a change.
  const an = Number(as);
  return as !== '' && bs !== '' && Number.isFinite(an) && an === Number(bs);
};

const guard = (req, res) => {
  const session = req.auth;
  if (!session) { res.status(401).json({ error: 'Authentication required' }); return null; }
  const isAdmin = session.role === 'admin' || session.role === 'super-admin';
  if (!isAdmin || !sessionCan(session, 'gbtracking')) {
    res.status(403).json({ error: 'GB Tracking permission (admin) required' });
    return null;
  }
  return session;
};

// ─── Public campaign summary (PII-free) ──────────────────────────────────
// The GB Tracking sheet is the committee's source of truth, so the public
// Project Cornerstone page totals come from here: each tracker row counts
// its soft commit (₹ lakhs), or failing that the website pledge amount it
// name-matches; website pledges from people NOT on the tracker are added on
// top so no intent is ever dropped. Aggregates only — no names leave.
const CANON_TO_SHORT = { arch: 'Arch.', civil: 'Civil', cse: 'CSE', ece: 'ECE', eee: 'EEE', mech: 'Mech.', prod: 'Prod.' };

export async function computeGivebackSummary() {
  const [r, p] = await Promise.all([
    query('SELECT full_name, branch, commit_lakhs, updated_at FROM giveback_outreach'),
    query('SELECT name, email, branch, amount, updated_at FROM pledges'),
  ]);
  const pledgePool = p.rows
    .filter((x) => !DEMO_EMAILS.has(String(x.email || '').toLowerCase()))
    .map((x) => ({
      norm: normName(x.name), T: nameTokens(x.name), bc: canonBranch(x.branch),
      amount: x.amount != null ? Number(x.amount) : 0,
      updatedAt: x.updated_at, used: false,
    }));

  let pledged = 0;
  let donors = 0;
  let updatedAt = null;
  const tiers = {
    keystone: { count: 0, amount: 0 }, pillar: { count: 0, amount: 0 },
    foundation: { count: 0, amount: 0 }, supporter: { count: 0, amount: 0 },
  };
  const byBranchMap = new Map(Object.values(CANON_TO_SHORT).map((b) => [b, { branch: b, donors: 0, amount: 0 }]));
  byBranchMap.set('Other', { branch: 'Other', donors: 0, amount: 0 });
  const bump = (amt, bc, at) => {
    if (at && (!updatedAt || at > updatedAt)) updatedAt = at;
    if (!(amt > 0)) return;
    pledged += amt;
    donors += 1;
    const bucket = amt >= 1000000 ? 'keystone' : amt >= 500000 ? 'pillar' : amt >= 200000 ? 'foundation' : 'supporter';
    tiers[bucket].count += 1;
    tiers[bucket].amount += amt;
    const row = byBranchMap.get(CANON_TO_SHORT[bc] || 'Other');
    row.donors += 1;
    row.amount += amt;
  };

  for (const row of r.rows) {
    const norm = normName(row.full_name);
    const hit = findUnique(nameTokens(row.full_name), norm, pledgePool.filter((x) => !x.used), canonBranch(row.branch));
    if (hit) hit.used = true;
    const sheet = Number(row.commit_lakhs);
    const amt = sheet > 0 ? sheet * 100000 : (hit?.amount || 0);
    bump(amt, canonBranch(row.branch) || hit?.bc, row.updated_at);
  }
  for (const x of pledgePool) if (!x.used) bump(x.amount, x.bc, x.updatedAt);

  return {
    goal: 20000000,
    pledged,
    donors,
    // Raw website intents (demo users excluded, ANONYMOUS INCLUDED) — an
    // aggregate only, so anonymity is preserved. The GB Tracking stat cards
    // use this instead of summing grid rows, which omit anonymous intents.
    webIntents: {
      count: pledgePool.length,
      amount: pledgePool.reduce((s, x) => s + (x.amount > 0 ? x.amount : 0), 0),
    },
    roomsTaken: Math.min(20, tiers.keystone.count),
    tiers,
    byBranch: Array.from(byBranchMap.values()).filter((b) => b.branch !== 'Other' || b.donors > 0),
    updatedAt,
  };
}

export function mountGivebackOutreach(app) {
  app.get('/api/giveback-outreach', async (req, res, next) => {
    try {
      if (!guard(req, res)) return;
      const [r, a, p, rs] = await Promise.all([
        query('SELECT * FROM giveback_outreach ORDER BY sort_order NULLS LAST, full_name'),
        query(`SELECT id, name, email, phone, branch, current_city, registration_id, is_registered,
                      payment_status, payment_amount, payment_uid, registration_fee, participation,
                      adults, children_under_10, children_10_plus, created_at
                 FROM alumni`),
        query('SELECT name, email, branch, amount, anonymous FROM pledges'),
        query('SELECT full_name, email, branch, family_joining, food_preference, volunteer, submitted_at FROM rsvps'),
      ]);
      const alumniPool = a.rows
        .filter((x) => !DEMO_EMAILS.has(String(x.email || '').toLowerCase()) && normName(x.name))
        .map((x) => ({ ...x, norm: normName(x.name), T: nameTokens(x.name), bc: canonBranch(x.branch) }));
      const pledgePool = p.rows
        .filter((x) => normName(x.name))
        .map((x) => ({ norm: normName(x.name), T: nameTokens(x.name), bc: canonBranch(x.branch), amount: x.amount != null ? Number(x.amount) : null, anonymous: Boolean(x.anonymous) }));
      const rsvpPool = rs.rows
        .filter((x) => normName(x.full_name))
        .map((x) => ({ ...x, name: x.full_name, norm: normName(x.full_name), T: nameTokens(x.full_name), bc: canonBranch(x.branch) }));
      // Pass 1: each sheet row finds its unique profile candidate.
      const alumniById = new Map(alumniPool.map((x) => [x.id, x]));
      const prelim = r.rows.map((row) => {
        const norm = normName(row.full_name);
        const T = nameTokens(row.full_name);
        const bc = canonBranch(row.branch);
        // An explicit link (set from the editor's dropdown) beats fuzzy
        // name matching — it's how same-named alumni get told apart.
        const pinned = row.matched_alumni_id ? alumniById.get(row.matched_alumni_id) : null;
        return { row, norm, pinned: Boolean(pinned), hit: pinned || findUnique(T, norm, alumniPool, bc), intent: findUnique(T, norm, pledgePool, bc) };
      });
      // Pass 2: one profile, one row. When two sheet rows claim the same
      // profile, keep only the exact-name row — otherwise trust neither.
      const claims = new Map(); // profile norm -> [prelim entries]
      for (const e of prelim) {
        if (!e.hit) continue;
        const k = e.hit.id || e.hit.norm; // profile identity, not just name
        if (!claims.has(k)) claims.set(k, []);
        claims.get(k).push(e);
      }
      for (const [k, es] of claims) {
        if (es.length <= 1) continue;
        // Explicitly pinned rows always keep their link; a pinned claim also
        // evicts fuzzy claims on the same profile.
        const pinnedClaims = es.filter((e) => e.pinned);
        if (pinnedClaims.length) {
          for (const e of es) if (!e.pinned) e.hit = null;
          continue;
        }
        const exact = es.filter((e) => e.norm === e.hit.norm);
        for (const e of es) if (!(exact.length === 1 && e === exact[0])) e.hit = null;
      }
      // One pledge, one row: when two sheet rows fuzzy-match the same website
      // intent (e.g. "MATHEW THOMAS" vs "MANOJ THOMAS MATHEW"), only the
      // exact-name row keeps it.
      const intentClaims = new Map();
      for (const e of prelim) {
        if (!e.intent) continue;
        if (!intentClaims.has(e.intent)) intentClaims.set(e.intent, []);
        intentClaims.get(e.intent).push(e);
      }
      for (const [pl, es] of intentClaims) {
        if (es.length <= 1) continue;
        const exact = es.filter((e) => e.norm === pl.norm);
        for (const e of es) if (!(exact.length === 1 && e === exact[0])) e.intent = null;
      }
      // Anonymity: a batchmate whose website intent is ANONYMOUS is dropped
      // from the tracker entirely — their wish not to be identified with a
      // contribution wins over outreach convenience.
      const visible = prelim.filter((e) => !(e.intent && e.intent.anonymous));
      res.json(visible.map(({ row, norm, hit, intent, pinned }) => {
        const j = toJson(row);
        if (hit) {
          j.registered = hit.is_registered ? 'Yes' : j.registered;
          j.paid = PAID_ANY.has(hit.payment_status) ? 'Yes' : j.paid;
          j.liveMatch = true; // matched a website profile by name
          j.liveName = hit.name; // the profile it matched, for the UI tooltip
          // Live status, most advanced first.
          j.status = PAID_ANY.has(hit.payment_status) ? 'Paid'
            : hit.participation === 'giveback-only' && hit.is_registered ? 'Give Back'
            : hit.is_registered ? 'Registered'
            : null;
          // Registration details for the "In Website" popup.
          j.live = {
            name: hit.name,
            email: hit.email,
            phone: hit.phone,
            city: hit.current_city,
            regId: hit.registration_id,
            registered: Boolean(hit.is_registered),
            participation: hit.participation,
            paymentStatus: hit.payment_status,
            paymentUid: hit.payment_uid,
            paymentAmount: hit.payment_amount != null ? Number(hit.payment_amount) : null,
            registrationFee: hit.registration_fee != null ? Number(hit.registration_fee) : null,
            family: Math.max(0, Number(hit.adults || 1) - 1) + Number(hit.children_under_10 || 0) + Number(hit.children_10_plus || 0),
            since: hit.created_at,
          };
        }
        if (pinned) j.pinned = true;
        if (!j.status && !pinned) {
          // No profile (or an unregistered one) — an RSVP under this name
          // still counts as interest shown. Pinned rows never fall back to
          // the RSVP guess — their truth is the linked profile.
          const rsvp = findUnique(nameTokens(row.full_name), norm, rsvpPool, null);
          if (rsvp) {
            j.status = 'Shown Interest';
            if (!j.liveMatch) { j.liveMatch = true; j.liveName = rsvp.name; }
            if (!j.live) {
              j.live = {
                name: rsvp.name,
                rsvpOnly: true,
                email: rsvp.email,
                familyJoining: rsvp.family_joining,
                foodPreference: rsvp.food_preference,
                volunteer: Boolean(rsvp.volunteer),
                since: rsvp.submitted_at,
              };
            }
          }
        }
        if (intent) {
          j.intentSubmitted = 'Yes';
          // Anonymous intents never surface their amount here — only the
          // fact that one exists. (Aggregate totals still include it.)
          if (intent.amount > 0 && !intent.anonymous) j.intentAmount = intent.amount;
        }
        return j;
      }));
    } catch (err) { next(err); }
  });

  // Registered-alumni roster for the tracker's name combobox — includes the
  // registration id so same-named alumni can be told apart.
  app.get('/api/giveback-outreach/roster', async (req, res, next) => {
    try {
      if (!guard(req, res)) return;
      const r = await query(
        `SELECT id, name, branch, registration_id, payment_status, payment_uid
           FROM alumni WHERE is_registered = TRUE ORDER BY name`
      );
      res.json(r.rows
        .filter((x) => normName(x.name))
        .map((x) => ({
          id: x.id,
          name: x.name,
          branch: x.branch,
          regId: x.registration_id,
          paid: PAID_ANY.has(x.payment_status),
          paymentUid: x.payment_uid,
        })));
    } catch (err) { next(err); }
  });

  app.post('/api/giveback-outreach', async (req, res, next) => {
    try {
      const session = guard(req, res);
      if (!session) return;
      const b = req.body || {};
      const name = String(b.fullName || '').trim();
      if (!name) return res.status(400).json({ error: 'Name is required' });
      const t = (v, max = 500) => (v == null ? null : String(v).slice(0, max).trim() || null);
      const commit = b.commitLakhs === '' || b.commitLakhs == null ? null : Number(b.commitLakhs);
      const r = await query(
        `INSERT INTO giveback_outreach
           (id, full_name, branch, location, home_state, on_whatsapp, registered, paid,
            phone, poc, commit_lakhs, company_match, intent_submitted, money_sent, comments, updated_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
         RETURNING *`,
        [
          `gbo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          name.slice(0, 200), t(b.branch, 50), t(b.location, 200), t(b.homeState, 50),
          t(b.onWhatsapp, 20), t(b.registered, 20), t(b.paid, 50),
          t(b.phone, 50), t(b.poc, 200),
          Number.isFinite(commit) ? commit : null,
          t(b.companyMatch, 200), t(b.intentSubmitted, 50), t(b.moneySent, 50),
          t(b.comments, 4000), session.email || null,
        ]
      );
      logChange([{
        rowId: r.rows[0].id, fullName: r.rows[0].full_name, author: session.email,
        action: 'added', newValue: [t(b.branch, 50), t(b.poc, 200)].filter(Boolean).join(' · ') || null,
      }]);
      res.status(201).json(toJson(r.rows[0]));
    } catch (err) { next(err); }
  });

  app.patch('/api/giveback-outreach/:id', async (req, res, next) => {
    try {
      const session = guard(req, res);
      if (!session) return;
      const b = req.body || {};
      const oldQ = await query('SELECT * FROM giveback_outreach WHERE id = $1', [req.params.id]);
      const old = oldQ.rows[0];
      if (!old) return res.status(404).json({ error: 'Not found' });
      const changes = []; // [field, oldValue, newValue]
      const sets = [];
      const vals = [];
      for (const [field, col] of Object.entries(FIELDS)) {
        if (!(field in b)) continue;
        let v = b[field];
        if (field === 'commitLakhs') {
          v = v === '' || v == null ? null : Number(v);
          if (v != null && !Number.isFinite(v)) continue;
        } else if (v != null) {
          v = String(v).slice(0, field === 'comments' ? 4000 : 500).trim() || null;
        }
        vals.push(v);
        sets.push(`${col} = $${vals.length}`);
        if (!sameVal(old[col], v)) changes.push([field, asLogText(old[col]), asLogText(v)]);
      }
      if (!sets.length) return res.status(400).json({ error: 'Nothing to update' });
      // When (un)pinning a profile, keep its registration id (SJ-2026-####)
      // as a stored reference next to the alumni id.
      if ('matchedAlumniId' in b) {
        let regId = null;
        if (b.matchedAlumniId) {
          const al = await query('SELECT registration_id FROM alumni WHERE id = $1', [b.matchedAlumniId]);
          if (!al.rows[0]) return res.status(400).json({ error: 'Unknown alumni profile for pinning' });
          regId = al.rows[0].registration_id || null;
        }
        vals.push(regId);
        sets.push(`matched_registration_id = $${vals.length}`);
      }
      vals.push(session.email || null);
      sets.push(`updated_by = $${vals.length}`);
      sets.push('updated_at = NOW()');
      vals.push(req.params.id);
      const r = await query(
        `UPDATE giveback_outreach SET ${sets.join(', ')} WHERE id = $${vals.length} RETURNING *`,
        vals
      );
      if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
      logChange(changes.map(([field, oldValue, newValue]) => ({
        rowId: old.id, fullName: r.rows[0].full_name, author: session.email,
        action: 'updated', field, oldValue, newValue,
      })));
      res.json(toJson(r.rows[0]));
    } catch (err) { next(err); }
  });

  app.delete('/api/giveback-outreach/:id', async (req, res, next) => {
    try {
      const session = guard(req, res);
      if (!session) return;
      const r = await query('DELETE FROM giveback_outreach WHERE id = $1 RETURNING id, full_name, poc, commit_lakhs', [req.params.id]);
      if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
      const d = r.rows[0];
      logChange([{
        rowId: d.id, fullName: d.full_name, author: session.email, action: 'deleted',
        oldValue: [d.poc && `POC ${d.poc}`, Number(d.commit_lakhs) > 0 && `commit ₹${Number(d.commit_lakhs)}L`].filter(Boolean).join(' · ') || null,
      }]);
      res.json({ ok: true });
    } catch (err) { next(err); }
  });

  // Change history for the "Changes" popup — most recent first. Append-only
  // log written by the create/update/delete handlers above.
  app.get('/api/giveback-outreach/log', async (req, res, next) => {
    try {
      if (!guard(req, res)) return;
      const r = await query(
        `SELECT id, row_id, full_name, author, action, field, old_value, new_value, created_at
           FROM giveback_outreach_log ORDER BY created_at DESC, id DESC LIMIT 2000`
      );
      res.json(r.rows.map((x) => ({
        id: Number(x.id),
        rowId: x.row_id,
        fullName: x.full_name,
        author: x.author,
        action: x.action,
        field: x.field,
        oldValue: x.old_value,
        newValue: x.new_value,
        at: x.created_at,
      })));
    } catch (err) { next(err); }
  });
}
