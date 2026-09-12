import { useMemo, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { BRANCHES } from '../../data/constants';
import { adminApi } from '../../services/api';

// Finance export: filter the registered list → pick columns → download .xlsx.
// The xlsx library (~400 KB) is imported lazily on the actual download click
// so it never weighs down the normal admin bundle.

const STATUS_FILTERS = [
  { id: 'all',          label: 'All registered' },
  { id: 'awaiting_uid', label: 'Awaiting UID' },
  { id: 'under_review', label: 'Under verification' },
  { id: 'paid',         label: 'Paid' },
  { id: 'rejected',     label: 'Rejected' },
];

// Column catalog: label → value extractor. `on` marks the default set.
const COLUMNS = [
  { id: 'registrationId', label: 'Registration ID', on: true,  get: (a) => a.registrationId },
  { id: 'name',           label: 'Name',            on: true,  get: (a) => a.name },
  { id: 'email',          label: 'Email',           on: true,  get: (a) => a.email },
  { id: 'phone',          label: 'Phone',           on: true,  get: (a) => a.phone },
  { id: 'branch',         label: 'Branch',          on: true,  get: (a) => a.branch },
  { id: 'hostel',         label: 'Hostel',          on: false, get: (a) => a.hostel },
  { id: 'rollNumber',     label: 'Roll Number',     on: false, get: (a) => a.rollNumber },
  { id: 'currentCity',    label: 'City',            on: true,  get: (a) => a.currentCity },
  { id: 'state',          label: 'State / Country', on: false, get: (a) => a.state },
  { id: 'company',        label: 'Company',         on: false, get: (a) => a.company },
  { id: 'adults',         label: 'Adults',          on: true,  get: (a) => Number(a.adults || 1) },
  { id: 'childrenUnder10',label: 'Children <10',    on: true,  get: (a) => Number(a.childrenUnder10 || 0) },
  { id: 'children10Plus', label: 'Children 10+',    on: true,  get: (a) => Number(a.children10Plus || 0) },
  { id: 'amountDue',      label: 'Amount Due (₹)',  on: true,  get: (a, ctx) => ctx.amountDueFor(a) },
  { id: 'paymentStatus',  label: 'Payment Status',  on: true,  get: (a) => a.paymentStatus || 'unpaid' },
  { id: 'paymentUid',     label: 'Payment UID',     on: true,  get: (a) => a.paymentUid },
  { id: 'paymentAmount',  label: 'Amount Received (₹)', on: true, get: (a) => a.paymentAmount != null ? Number(a.paymentAmount) : '' },
  { id: 'paymentVerifiedAt', label: 'Verified At',  on: false, get: (a) => a.paymentVerifiedAt },
  // Stored as the internal user id; the export resolves it to the admin's
  // real name via /api/admin/verifier-names at download time.
  { id: 'paymentVerifiedBy', label: 'Verified By',  on: false, get: (a, ctx) => ctx.verifierNames[a.paymentVerifiedBy] || a.paymentVerifiedBy },
  { id: 'paymentNotes',   label: 'Finance Notes',   on: false, get: (a) => a.paymentNotes },
  { id: 'arrivalDate',    label: 'Arrival',         on: false, get: (a) => a.arrivalDate },
  { id: 'departureDate',  label: 'Departure',       on: false, get: (a) => a.departureDate },
  { id: 'travelMode',     label: 'Travel Mode',     on: false, get: (a) => a.travelMode },
  { id: 'roomPreference', label: 'Room Preference', on: false, get: (a) => a.roomPreference },
  { id: 'dietaryPref',    label: 'Dietary Pref',    on: false, get: (a) => a.dietaryPref },
  { id: 'tshirtSize',     label: 'T-shirt Size',    on: false, get: (a) => a.tshirtSize },
  { id: 'specialRequests',label: 'Special Requests',on: false, get: (a) => a.specialRequests },
];

const defaultCols = () => new Set(COLUMNS.filter((c) => c.on).map((c) => c.id));

export default function ExportRegistrationsModal({ open, onClose, registered, statusOf, amountDueFor }) {
  const [status, setStatus] = useState('all');
  const [branch, setBranch] = useState('');
  const [cols, setCols] = useState(defaultCols);
  const [busy, setBusy] = useState(false);

  const rows = useMemo(
    () => registered
      .filter((a) => status === 'all' || statusOf(a) === status)
      .filter((a) => !branch || a.branch === branch)
      .sort((x, y) => String(x.registrationId || '').localeCompare(String(y.registrationId || ''))),
    [registered, status, branch, statusOf]
  );

  const toggle = (id) =>
    setCols((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const download = async () => {
    if (cols.size === 0 || rows.length === 0) return;
    setBusy(true);
    try {
      const XLSX = await import('xlsx');
      const chosen = COLUMNS.filter((c) => cols.has(c.id));
      // Only pay the lookup cost when the Verified By column is included.
      let verifierNames = {};
      if (cols.has('paymentVerifiedBy')) {
        try { verifierNames = await adminApi.verifierNames(); } catch { /* fall back to raw ids */ }
      }
      const ctx = { amountDueFor, verifierNames };
      const data = rows.map((a) =>
        Object.fromEntries(chosen.map((c) => [c.label, c.get(a, ctx) ?? '']))
      );
      const ws = XLSX.utils.json_to_sheet(data);
      ws['!cols'] = chosen.map((c) => ({ wch: Math.max(12, c.label.length + 2) }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
      const statusLabel = STATUS_FILTERS.find((f) => f.id === status)?.label.replace(/\s+/g, '-') || 'All';
      const stamp = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `REConverge-registrations-${statusLabel}-${stamp}.xlsx`);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="⬇ Download registrations">
      <div className="space-y-5">
        {/* Filters */}
        <div>
          <p className="text-sm font-medium text-ink mb-2">1 · Choose who to include</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatus(f.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  status === f.id
                    ? 'bg-gold-500/15 border-gold-500/60 text-gold-800 font-semibold'
                    : 'bg-white border-forest-500/15 text-ink-soft hover:border-forest-500/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            aria-label="Branch filter"
            className="w-full bg-white border border-forest-500/15 rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-forest-500/40"
          >
            <option value="">All branches</option>
            {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <p className="text-xs text-ink-muted mt-2">{rows.length} alumni match this selection.</p>
        </div>

        {/* Column picker */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-ink">2 · Columns to include</p>
            <div className="flex gap-3 text-xs">
              <button type="button" className="text-gold-700 hover:underline" onClick={() => setCols(new Set(COLUMNS.map((c) => c.id)))}>Select all</button>
              <button type="button" className="text-ink-soft hover:underline" onClick={() => setCols(defaultCols())}>Defaults</button>
              <button type="button" className="text-ink-soft hover:underline" onClick={() => setCols(new Set())}>None</button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1.5 max-h-56 overflow-y-auto border border-forest-500/15 rounded-lg p-3 bg-white">
            {COLUMNS.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-xs text-ink-soft cursor-pointer">
                <input
                  type="checkbox"
                  checked={cols.has(c.id)}
                  onChange={() => toggle(c.id)}
                  className="accent-[#b8922a]"
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={download} disabled={busy || cols.size === 0 || rows.length === 0}>
            {busy ? 'Preparing…' : `Download Excel (${rows.length} rows · ${cols.size} cols)`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
