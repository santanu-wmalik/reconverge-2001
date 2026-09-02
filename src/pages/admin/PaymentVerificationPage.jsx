import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { alumniApi, adminApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import SectionHeading from '../../components/shared/SectionHeading';
import { EVENT_CONFIG } from '../../data/constants';
import { isDemoUser } from '../../utils/isDemoUser';

// Payment verification — Finance Committee marks alumni Paid / Rejected
// against the bank statement. Available to any admin (see route guard +
// backend gate). Every action records the acting admin + timestamp for
// an audit trail on the alumnus row.

const FILTERS = [
  { id: 'awaiting_uid',  label: 'Awaiting UID',        emoji: '⏳' },
  { id: 'under_review',  label: 'Under Verification',  emoji: '🔎' },
  { id: 'paid',          label: 'Paid',                emoji: '✅' },
  { id: 'rejected',      label: 'Rejected',            emoji: '⚠️' },
  { id: 'all',           label: 'All Registered',      emoji: '📋' },
];

function statusOf(a) {
  const s = a.paymentStatus;
  if (s === 'confirmed' || s === 'paid') return 'paid';
  if (s === 'rejected') return 'rejected';
  if (a.paymentUid) return 'under_review';
  if (a.isRegistered) return 'awaiting_uid';
  return null;
}

function amountDueFor(a) {
  const family = Math.max(
    0,
    (Number(a.adults || 1) - 1) +
      Number(a.childrenUnder10 || 0) +
      Number(a.children10Plus || 0)
  );
  return EVENT_CONFIG.registrationFee + family * EVENT_CONFIG.familyMemberFee;
}

export default function PaymentVerificationPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('under_review');
  const [q, setQ] = useState('');

  const [actionOpen, setActionOpen] = useState(false);
  const [actionKind, setActionKind] = useState('confirmed'); // 'confirmed' | 'rejected' | 'reset'
  const [target, setTarget] = useState(null);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    alumniApi.getAll()
      .then((list) => { if (!cancelled) setAlumni(Array.isArray(list) ? list : []); })
      .catch((err) => { if (!cancelled) showToast(err.message || 'Failed to load alumni', 'error'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [showToast]);

  // Only registered alumni are candidates for verification — an alumnus who
  // hasn't finished registration hasn't owed us anything yet. Demo accounts
  // are excluded from every count and row so bucket numbers reflect real
  // alumni only.
  const registered = useMemo(
    () => alumni.filter((a) => a.isRegistered && !isDemoUser(a)),
    [alumni]
  );

  const buckets = useMemo(() => {
    const b = { awaiting_uid: 0, under_review: 0, paid: 0, rejected: 0, all: registered.length };
    for (const a of registered) {
      const s = statusOf(a);
      if (s && b[s] !== undefined) b[s] += 1;
    }
    return b;
  }, [registered]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return registered.filter((a) => {
      if (filter !== 'all') {
        if (statusOf(a) !== filter) return false;
      }
      if (!needle) return true;
      return (
        String(a.name || '').toLowerCase().includes(needle) ||
        String(a.email || '').toLowerCase().includes(needle) ||
        String(a.registrationId || '').toLowerCase().includes(needle) ||
        String(a.paymentUid || '').toLowerCase().includes(needle) ||
        String(a.branch || '').toLowerCase().includes(needle)
      );
    }).sort((x, y) => {
      // Recent first for verified; alphabetical otherwise for stable scanning.
      if (filter === 'paid' || filter === 'rejected') {
        return String(y.paymentVerifiedAt || '').localeCompare(String(x.paymentVerifiedAt || ''));
      }
      return String(x.name || '').localeCompare(String(y.name || ''));
    });
  }, [registered, filter, q]);

  const openAction = (a, kind) => {
    setTarget(a);
    setActionKind(kind);
    // Prefill amount with the expected number so a one-tap confirmation is
    // possible for the common case of "paid exactly what they owed".
    setAmount(
      kind === 'confirmed' && !a.paymentAmount
        ? String(amountDueFor(a))
        : (a.paymentAmount != null ? String(a.paymentAmount) : '')
    );
    setNotes(a.paymentNotes || '');
    setActionOpen(true);
  };

  const closeAction = () => {
    if (saving) return;
    setActionOpen(false);
    setTarget(null);
    setNotes('');
    setAmount('');
  };

  const handleSave = async () => {
    if (!target) return;
    setSaving(true);
    try {
      const payload = {
        alumniId: target.id,
        status: actionKind,
      };
      if (actionKind !== 'reset') {
        if (amount !== '') payload.amount = Number(amount);
        if (notes.trim()) payload.notes = notes.trim();
      }
      const { alumnus } = await adminApi.verifyPayment(payload);
      setAlumni((prev) => prev.map((a) => (a.id === alumnus.id ? alumnus : a)));
      showToast(
        actionKind === 'confirmed' ? 'Marked as Paid.'
        : actionKind === 'rejected' ? 'Marked as Rejected — the alumnus will see the note.'
        : 'Verification reset.',
        'success'
      );
      closeAction();
    } catch (err) {
      showToast(err.message || 'Could not save', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="Payment Verification"
        subtitle="Reconcile alumnus-supplied transaction references against the batch bank statement."
      />

      {/* Bucket cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-lg border p-3 text-left transition ${
              filter === f.id
                ? 'border-gold-400/60 bg-gold-500/10'
                : 'border-forest-500/15 bg-white hover:border-forest-500/40'
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider text-ink-soft flex items-center gap-1">
              <span>{f.emoji}</span> {f.label}
            </p>
            <p className="text-2xl font-heading font-bold text-ink mt-1">{buckets[f.id]}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, Registration ID, UTR, branch…"
        />
      </div>

      {/* Table */}
      <GlassCard hover={false} padding="p-0">
        {loading ? (
          <p className="text-ink-soft text-sm p-6">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-ink-soft text-sm p-6">
            {registered.length === 0
              ? 'No registered alumni yet.'
              : 'Nothing matches this filter.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-ink-soft border-b border-forest-500/15">
                <tr>
                  <th className="text-left py-3 px-4">Alumnus</th>
                  <th className="text-left py-3 px-4">Reg. ID</th>
                  <th className="text-right py-3 px-4">Owed</th>
                  <th className="text-left py-3 px-4">Payment UID</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const s = statusOf(a);
                  return (
                    <tr key={a.id} className="border-b border-forest-500/15 hover:bg-forest-600/5">
                      <td className="py-3 px-4">
                        <div className="text-ink">{a.name || '—'}</div>
                        <div className="text-xs text-ink-muted">{a.email}</div>
                        {a.branch && <div className="text-[11px] text-ink-muted mt-0.5">{a.branch}</div>}
                      </td>
                      <td className="py-3 px-4 text-ink-soft font-mono text-xs">
                        {a.registrationId || '—'}
                      </td>
                      <td className="py-3 px-4 text-right text-ink-soft font-mono">
                        ₹{amountDueFor(a).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-ink-soft font-mono text-xs break-all">
                        {a.paymentUid || <span className="text-ink-muted italic">not entered</span>}
                        {a.paymentAmount != null && (
                          <div className="text-[10px] text-ink-muted mt-0.5">
                            Received: ₹{Number(a.paymentAmount).toLocaleString('en-IN')}
                          </div>
                        )}
                        {a.paymentNotes && (
                          <div className="text-[10px] text-amber-300/80 mt-0.5">
                            Note: {a.paymentNotes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusPill status={s} verifiedAt={a.paymentVerifiedAt} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex gap-1.5 flex-wrap justify-end">
                          <button
                            type="button"
                            onClick={() => openAction(a, 'confirmed')}
                            className="text-xs px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/25 transition"
                          >
                            ✓ Paid
                          </button>
                          <button
                            type="button"
                            onClick={() => openAction(a, 'rejected')}
                            className="text-xs px-2.5 py-1 rounded bg-red-500/15 border border-red-500/30 text-red-200 hover:bg-red-500/25 transition"
                          >
                            ✕ Reject
                          </button>
                          {(s === 'paid' || s === 'rejected') && (
                            <button
                              type="button"
                              onClick={() => openAction(a, 'reset')}
                              className="text-xs px-2.5 py-1 rounded border border-forest-500/15 text-ink-soft hover:text-ink hover:border-forest-500/40 transition"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      <p className="text-[11px] text-ink-muted mt-3">
        Signed in as <span className="text-ink-soft">{user?.name}</span>. Every action is recorded
        with your user id + timestamp on the alumnus record.
      </p>

      {/* Action modal */}
      <Modal
        isOpen={actionOpen}
        onClose={closeAction}
        title={
          actionKind === 'confirmed' ? '✓ Mark as Paid'
          : actionKind === 'rejected' ? '✕ Reject Payment'
          : '↺ Reset Verification'
        }
        size="md"
      >
        {target && (
          <div className="space-y-4 text-sm text-ink-soft">
            <div className="rounded-lg border border-forest-500/15 bg-white p-3 text-xs">
              <div className="text-ink font-semibold">{target.name || target.email}</div>
              <div className="text-ink-soft">{target.email}</div>
              <div className="text-ink-muted mt-1">
                Reg. ID: <span className="font-mono text-ink-soft">{target.registrationId || '—'}</span> ·
                Owed: <span className="font-mono text-gold-700">₹{amountDueFor(target).toLocaleString('en-IN')}</span>
              </div>
              {target.paymentUid && (
                <div className="text-ink-muted mt-1">
                  UID: <span className="font-mono text-ink-soft break-all">{target.paymentUid}</span>
                </div>
              )}
            </div>

            {actionKind === 'reset' ? (
              <p>
                This will clear the current verification (status, amount, note, verifier, timestamp)
                and set the alumnus back to <span className="text-ink">Under Verification</span>{' '}
                if their UID is still on file, or <span className="text-ink">Awaiting UID</span>{' '}
                otherwise. The Payment UID itself is not touched.
              </p>
            ) : (
              <>
                <Input
                  label={`Amount received (₹) — ${actionKind === 'confirmed' ? 'optional; defaults to expected' : 'optional'}`}
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={String(amountDueFor(target))}
                />
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-1.5">
                    Note {actionKind === 'rejected' ? '(shown to the alumnus — say why)' : '(optional — shown to the alumnus if set)'}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder={
                      actionKind === 'rejected'
                        ? 'e.g. UTR could not be matched on the bank statement — please double-check and update.'
                        : 'e.g. Received ₹15,000 — ₹1,500 above the fee will be receipted as Give Back.'
                    }
                    className="w-full bg-white border border-forest-500/15 rounded-xl px-4 py-2.5 text-sm text-ink placeholder-ink-muted outline-none focus:border-gold-400/50 focus:ring-2 focus:ring-gold-400/20 focus:bg-white transition-all"
                  />
                  <p className="text-[11px] text-ink-muted mt-1">
                    Whatever you write here appears on the alumnus's My Payments page — no separate
                    email needed for the rejection reason.
                  </p>
                </div>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleSave}
                loading={saving}
                className={
                  actionKind === 'confirmed' ? '' :
                  actionKind === 'rejected' ? '!bg-red-500 hover:!bg-red-400' : ''
                }
              >
                {actionKind === 'confirmed' ? 'Confirm as Paid'
                 : actionKind === 'rejected' ? 'Confirm rejection'
                 : 'Reset verification'}
              </Button>
              <Button variant="ghost" onClick={closeAction} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

function StatusPill({ status, verifiedAt }) {
  const meta = {
    paid:         { variant: 'success', label: '✓ Paid' },
    rejected:     { variant: 'danger',  label: '✕ Rejected' },
    under_review: { variant: 'gold',    label: 'Under Verification' },
    awaiting_uid: { variant: 'warning', label: 'Awaiting UID' },
  }[status] || { variant: 'default', label: '—' };
  return (
    <div>
      <Badge variant={meta.variant} size="sm">{meta.label}</Badge>
      {verifiedAt && (
        <div className="text-[10px] text-ink-muted mt-1">
          {new Date(verifiedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
      )}
    </div>
  );
}
