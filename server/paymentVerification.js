// Payment verification endpoint — Finance Committee marks alumni as Paid /
// Rejected against the bank statement.
//
// Access: any signed-in admin OR super-admin. NOT open to plain alumni.
// (An alumnus can still update their OWN paymentUid via /api/alumni/:id, but
// verification of that UID against the bank ledger is admin-only.)
//
// Endpoint:
//   POST /api/admin/verify-payment
//     Body: { alumniId, status, amount?, notes? }
//       status ∈ 'confirmed' | 'rejected' | 'reset'
//         confirmed → Finance saw the money, alumnus is Paid
//         rejected  → couldn't match; notes should say why so the alumnus
//                     can fix it (wrong UTR, wrong amount, wrong account)
//         reset     → clear all verification fields; alumnus goes back to
//                     "Under Verification" (or "Awaiting Payment" if UID
//                     is also blank). Useful if a mark-paid was a mistake.
//     Returns the updated alumnus row.
//
// Every write records verifier + timestamp so we have an audit trail. If
// notes is set on a `confirmed` row, alumni.payment_notes is populated too
// so the alumnus sees "Verified with note: paid ₹15,000, receipted the
// ₹1,500 extra as give-back" or similar.

import { query } from './db.js';
import { rowToJson } from './columns.js';
import { sessionCan } from './auth.js';

const ALLOWED_STATUS = new Set(['confirmed', 'rejected', 'reset']);

export function mountPaymentVerification(app) {
  app.post('/api/admin/verify-payment', async (req, res, next) => {
    try {
      const session = req.auth;
      if (!session) return res.status(401).json({ error: 'Authentication required' });
      if (!sessionCan(session, 'finance')) {
        return res.status(403).json({ error: 'Finance permission required' });
      }

      const { alumniId, status, amount, notes } = req.body || {};
      if (!alumniId || typeof alumniId !== 'string') {
        return res.status(400).json({ error: 'alumniId is required' });
      }
      if (!ALLOWED_STATUS.has(status)) {
        return res.status(400).json({
          error: `status must be one of: ${[...ALLOWED_STATUS].join(', ')}`,
        });
      }

      // Amount is only meaningful for confirmed / rejected — but always
      // stored if the admin supplied one; null / undefined is fine too.
      let parsedAmount = null;
      if (amount !== undefined && amount !== null && amount !== '') {
        const n = Number(amount);
        if (!Number.isFinite(n) || n < 0) {
          return res.status(400).json({ error: 'amount must be a non-negative number' });
        }
        parsedAmount = n;
      }
      const cleanNotes = notes == null ? null : String(notes).slice(0, 2000);

      // Confirm the alumnus exists so we return a 404 rather than a silent
      // no-op UPDATE.
      const existing = await query('SELECT id FROM alumni WHERE id = $1', [alumniId]);
      if (!existing.rows.length) {
        return res.status(404).json({ error: 'Alumnus not found' });
      }

      let updated;
      if (status === 'reset') {
        // Wipe every verification field. Leave payment_uid alone — that's
        // the alumnus's own input, we shouldn't discard it on a reset.
        updated = await query(
          `UPDATE alumni SET
             payment_status      = NULL,
             payment_amount      = NULL,
             payment_notes       = NULL,
             payment_verified_at = NULL,
             payment_verified_by = NULL
           WHERE id = $1
           RETURNING *`,
          [alumniId]
        );
      } else {
        updated = await query(
          `UPDATE alumni SET
             payment_status      = $2,
             payment_amount      = $3,
             payment_notes       = $4,
             payment_verified_at = NOW(),
             payment_verified_by = $5
           WHERE id = $1
           RETURNING *`,
          [alumniId, status, parsedAmount, cleanNotes, session.userId || null]
        );
      }

      return res.json({
        alumnus: rowToJson('alumni', updated.rows[0]),
      });
    } catch (err) {
      next(err);
    }
  });
}
