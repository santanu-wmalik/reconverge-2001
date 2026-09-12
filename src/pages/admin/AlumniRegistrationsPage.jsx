import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { alumniApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import SectionHeading from '../../components/shared/SectionHeading';
import ExportRegistrationsModal from '../../components/admin/ExportRegistrationsModal';
import { EVENT_CONFIG, BRANCHES } from '../../data/constants';
import { isDemoUser } from '../../utils/isDemoUser';

// Alumni Registration — finance-gated master list of everyone who completed
// registration, with standard filters and the Excel export (filter → column
// picker → .xlsx download).

const STATUS_FILTERS = [
  { id: 'all',          label: 'All' },
  { id: 'awaiting_uid', label: 'Awaiting UID' },
  { id: 'under_review', label: 'Under Verification' },
  { id: 'paid',         label: 'Paid' },
  { id: 'rejected',     label: 'Rejected' },
];

function statusOf(a) {
  const s = a.paymentStatus;
  if (s === 'confirmed' || s === 'paid') return 'paid';
  if (s === 'rejected') return 'rejected';
  if (a.paymentUid) return 'under_review';
  if (a.isRegistered) return 'awaiting_uid';
  return null;
}

const STATUS_BADGE = {
  paid:         { label: 'Paid',               variant: 'success' },
  under_review: { label: 'Under Verification', variant: 'gold' },
  rejected:     { label: 'Rejected',           variant: 'danger' },
  awaiting_uid: { label: 'Awaiting UID',       variant: 'warning' },
};

function familyOf(a) {
  return Math.max(
    0,
    (Number(a.adults || 1) - 1) +
      Number(a.childrenUnder10 || 0) +
      Number(a.children10Plus || 0)
  );
}

function amountDueFor(a) {
  return EVENT_CONFIG.registrationFee + familyOf(a) * EVENT_CONFIG.familyMemberFee;
}

// Grid column catalog — every field captured at registration is available in
// the Configure-columns menu; `on` marks the default set (email and the rest
// are opt-in). `val` feeds sorting; `render` defaults to the value or an
// em-dash. `className` carries responsive hiding for the default columns.
const dash = (v) => (v === null || v === undefined || v === '' ? '—' : v);
const textCell = 'text-ink-soft whitespace-nowrap';
const GRID_COLUMNS = [
  { id: 'regId',  label: 'Reg. ID', sortKey: 'registrationId', on: true,  cellClass: 'font-mono text-xs text-ink-soft whitespace-nowrap', val: (a) => String(a.registrationId || ''), render: (a) => dash(a.registrationId) },
  { id: 'name',   label: 'Alumnus', sortKey: 'name',           on: true,  cellClass: 'text-ink font-medium', val: (a) => String(a.name || '').toLowerCase(), render: (a) => dash(a.name) },
  { id: 'email',  label: 'Email',   sortKey: 'email',          on: false, cellClass: 'text-xs text-ink-soft break-all', val: (a) => String(a.email || '').toLowerCase(), render: (a) => dash(a.email) },
  { id: 'phone',  label: 'Phone',   sortKey: 'phone',          on: false, cellClass: textCell, val: (a) => String(a.phone || ''), render: (a) => dash(a.phone) },
  { id: 'branch', label: 'Branch',  sortKey: 'branch',         on: true,  className: 'hidden md:table-cell', cellClass: 'text-ink-soft', val: (a) => String(a.branch || ''), render: (a) => dash(a.branch) },
  { id: 'hostel', label: 'Hostel',  sortKey: 'hostel',         on: false, cellClass: textCell, val: (a) => String(a.hostel || ''), render: (a) => dash(a.hostel) },
  { id: 'rollNumber', label: 'Roll No.', sortKey: 'rollNumber', on: false, cellClass: 'font-mono text-xs text-ink-soft whitespace-nowrap', val: (a) => String(a.rollNumber || ''), render: (a) => dash(a.rollNumber) },
  { id: 'city',   label: 'City',    sortKey: 'currentCity',    on: true,  className: 'hidden lg:table-cell', cellClass: 'text-ink-soft', val: (a) => String(a.currentCity || '').toLowerCase(), render: (a) => dash(a.currentCity) },
  { id: 'state',  label: 'State / Country', sortKey: 'state',  on: false, cellClass: textCell, val: (a) => String(a.state || '').toLowerCase(), render: (a) => dash(a.state) },
  { id: 'company', label: 'Company', sortKey: 'company',       on: false, cellClass: textCell, val: (a) => String(a.company || '').toLowerCase(), render: (a) => dash(a.company) },
  { id: 'designation', label: 'Designation', sortKey: 'designation', on: false, cellClass: textCell, val: (a) => String(a.designation || '').toLowerCase(), render: (a) => dash(a.designation) },
  { id: 'adults', label: 'Adults',  sortKey: 'adults',         on: false, align: 'text-center', cellClass: 'text-center text-ink-soft', val: (a) => Number(a.adults || 1), render: (a) => Number(a.adults || 1) },
  { id: 'childrenUnder10', label: 'Children <10', sortKey: 'childrenUnder10', on: false, align: 'text-center', cellClass: 'text-center text-ink-soft', val: (a) => Number(a.childrenUnder10 || 0), render: (a) => Number(a.childrenUnder10 || 0) },
  { id: 'children10Plus', label: 'Children 10+', sortKey: 'children10Plus', on: false, align: 'text-center', cellClass: 'text-center text-ink-soft', val: (a) => Number(a.children10Plus || 0), render: (a) => Number(a.children10Plus || 0) },
  { id: 'family', label: 'Family',  sortKey: 'family',         on: true,  align: 'text-center', cellClass: 'text-center text-ink-soft', val: (a) => familyOf(a), render: (a) => (familyOf(a) > 0 ? `+${familyOf(a)}` : '—') },
  { id: 'due',    label: 'Due',     sortKey: 'due',            on: true,  align: 'text-right', cellClass: 'text-right font-mono text-ink whitespace-nowrap', val: (a) => amountDueFor(a), render: (a) => `₹${amountDueFor(a).toLocaleString('en-IN')}` },
  { id: 'paymentUid', label: 'Payment UID', sortKey: 'paymentUid', on: false, cellClass: 'font-mono text-xs text-ink-soft break-all', val: (a) => String(a.paymentUid || ''), render: (a) => dash(a.paymentUid) },
  { id: 'paymentAmount', label: 'Amount Received', sortKey: 'paymentAmount', on: false, align: 'text-right', cellClass: 'text-right font-mono text-ink whitespace-nowrap', val: (a) => (a.paymentAmount != null ? Number(a.paymentAmount) : -1), render: (a) => (a.paymentAmount != null ? `₹${Number(a.paymentAmount).toLocaleString('en-IN')}` : '—') },
  { id: 'paymentVerifiedAt', label: 'Verified At', sortKey: 'paymentVerifiedAt', on: false, cellClass: textCell, val: (a) => String(a.paymentVerifiedAt || ''), render: (a) => (a.paymentVerifiedAt ? new Date(a.paymentVerifiedAt).toLocaleDateString('en-IN') : '—') },
  { id: 'travelMode', label: 'Travel Mode', sortKey: 'travelMode', on: false, cellClass: textCell, val: (a) => String(a.travelMode || ''), render: (a) => dash(a.travelMode) },
  { id: 'arrivalDate', label: 'Arrival', sortKey: 'arrivalDate', on: false, cellClass: textCell, val: (a) => String(a.arrivalDate || ''), render: (a) => dash(a.arrivalDate) },
  { id: 'departureDate', label: 'Departure', sortKey: 'departureDate', on: false, cellClass: textCell, val: (a) => String(a.departureDate || ''), render: (a) => dash(a.departureDate) },
  { id: 'roomPreference', label: 'Room Pref', sortKey: 'roomPreference', on: false, cellClass: textCell, val: (a) => String(a.roomPreference || ''), render: (a) => dash(a.roomPreference) },
  { id: 'preferredRoommate', label: 'Roommate', sortKey: 'preferredRoommate', on: false, cellClass: textCell, val: (a) => String(a.preferredRoommate || '').toLowerCase(), render: (a) => dash(a.preferredRoommate) },
  { id: 'tshirtSize', label: 'T-shirt', sortKey: 'tshirtSize', on: false, align: 'text-center', cellClass: 'text-center text-ink-soft', val: (a) => String(a.tshirtSize || ''), render: (a) => dash(a.tshirtSize) },
  { id: 'dietaryPref', label: 'Dietary', sortKey: 'dietaryPref', on: false, cellClass: textCell, val: (a) => String(a.dietaryPref || ''), render: (a) => dash(a.dietaryPref) },
  { id: 'specialRequests', label: 'Special Requests', sortKey: 'specialRequests', on: false, cellClass: 'text-xs text-ink-soft max-w-[240px]', val: (a) => String(a.specialRequests || '').toLowerCase(), render: (a) => dash(a.specialRequests) },
  { id: 'status', label: 'Status',  sortKey: 'status',         on: true,  val: (a) => statusOf(a) || '', render: (a) => {
      const badge = STATUS_BADGE[statusOf(a)] || { label: '—', variant: 'default' };
      return <Badge variant={badge.variant} size="sm">{badge.label}</Badge>;
    } },
];

const GRID_COLS_STORAGE = 'admin-registrations-columns';
const defaultGridCols = () => new Set(GRID_COLUMNS.filter((c) => c.on).map((c) => c.id));
const loadGridCols = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(GRID_COLS_STORAGE) || 'null');
    if (Array.isArray(saved) && saved.length) {
      const valid = saved.filter((id) => GRID_COLUMNS.some((c) => c.id === id));
      if (valid.length) return new Set(valid);
    }
  } catch { /* fall through to defaults */ }
  return defaultGridCols();
};

function SortHeader({ label, col, sort, onSort, className = '', align = 'text-left' }) {
  const active = sort.key === col;
  return (
    <th className={`px-4 py-3 ${className}`} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        onClick={() => onSort(col)}
        className={`w-full ${align} text-[11px] uppercase tracking-wider inline-flex items-center gap-1 ${
          align === 'text-right' ? 'justify-end' : align === 'text-center' ? 'justify-center' : ''
        } ${active ? 'text-forest-700 font-semibold' : 'text-ink-soft hover:text-ink'}`}
      >
        {label}
        <span className={`text-[9px] ${active ? '' : 'opacity-30'}`} aria-hidden="true">
          {active ? (sort.dir === 'asc' ? '▲' : '▼') : '▲▼'}
        </span>
      </button>
    </th>
  );
}

export default function AlumniRegistrationsPage() {
  const { showToast } = useToast();

  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [branch, setBranch] = useState('');
  const [exportOpen, setExportOpen] = useState(false);

  // Grid column visibility (persisted per browser; email hidden by default).
  const [gridCols, setGridCols] = useState(loadGridCols);
  const [colsMenuOpen, setColsMenuOpen] = useState(false);
  const shownCols = GRID_COLUMNS.filter((c) => gridCols.has(c.id));
  const toggleGridCol = (id) =>
    setGridCols((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size > 1) next.delete(id); } else next.add(id);
      try { localStorage.setItem(GRID_COLS_STORAGE, JSON.stringify([...next])); } catch { /* per-viewer convenience only */ }
      return next;
    });

  useEffect(() => {
    let cancelled = false;
    alumniApi.getAll()
      .then((list) => { if (!cancelled) setAlumni(Array.isArray(list) ? list : []); })
      .catch((err) => { if (!cancelled) showToast(err.message || 'Failed to load alumni', 'error'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [showToast]);

  const registered = useMemo(
    () => alumni.filter((a) => a.isRegistered && !isDemoUser(a)),
    [alumni]
  );

  // Column sorting — click a header to sort, click again to flip direction.
  const [sort, setSort] = useState({ key: 'registrationId', dir: 'asc' });
  const toggleSort = (key) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));

  // Sorting is derived from the column catalog: sortKey → val().
  const SORTERS = Object.fromEntries(GRID_COLUMNS.map((c) => [c.sortKey, c.val]));

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const keyOf = SORTERS[sort.key] || SORTERS.registrationId;
    const flip = sort.dir === 'desc' ? -1 : 1;
    return registered
      .filter((a) => status === 'all' || statusOf(a) === status)
      .filter((a) => !branch || a.branch === branch)
      .filter((a) => {
        if (!needle) return true;
        return [a.name, a.email, a.registrationId, a.currentCity, a.paymentUid, a.branch]
          .some((v) => String(v || '').toLowerCase().includes(needle));
      })
      .sort((x, y) => {
        const kx = keyOf(x);
        const ky = keyOf(y);
        const cmp = typeof kx === 'number' ? kx - ky : String(kx).localeCompare(String(ky));
        // Stable tie-break on Reg ID so equal values keep a predictable order.
        return flip * cmp || String(x.registrationId || '').localeCompare(String(y.registrationId || ''));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registered, q, status, branch, sort]);

  const totalHeads = useMemo(
    () => filtered.reduce((n, a) => n + 1 + familyOf(a), 0),
    [filtered]
  );

  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="Alumni Registration"
        subtitle="The full sign-up list — filter it down, then download exactly the columns you need as Excel."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 -mt-2">
        <p className="text-sm text-ink-soft">
          <span className="font-semibold text-ink">{filtered.length}</span> of {registered.length} registrations
          <span className="text-ink-muted"> · {totalHeads} heads incl. family</span>
        </p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setColsMenuOpen((o) => !o)} aria-expanded={colsMenuOpen}>
              ⚙ Configure columns
            </Button>
            {colsMenuOpen && (
              <>
                {/* click-away backdrop */}
                <div className="fixed inset-0 z-30" onClick={() => setColsMenuOpen(false)} aria-hidden="true" />
                <div className="absolute right-0 top-full mt-2 z-40 w-56 bg-white border border-forest-500/20 rounded-xl shadow-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-ink-muted mb-2">Columns in the grid</p>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {GRID_COLUMNS.map((c) => (
                      <label key={c.id} className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gridCols.has(c.id)}
                          onChange={() => toggleGridCol(c.id)}
                          className="accent-[#b8922a]"
                        />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            ⬇ Download registrations (Excel)
          </Button>
        </div>
      </div>

      <ExportRegistrationsModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        registered={registered}
        statusOf={statusOf}
        amountDueFor={amountDueFor}
      />

      {/* Standard filters */}
      <div className="grid gap-3 md:grid-cols-[1fr_auto] mb-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, Registration ID, city, UTR…"
        />
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          aria-label="Branch filter"
          className="bg-white border border-forest-500/15 rounded-xl px-3 py-2.5 text-sm text-ink outline-none focus:border-forest-500/40"
        >
          <option value="">All branches</option>
          {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
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

      {/* Table */}
      <GlassCard hover={false} padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest-500/15 text-left">
                {shownCols.map((c) => (
                  <SortHeader key={c.id} label={c.label} col={c.sortKey} sort={sort} onSort={toggleSort} className={c.className || ''} align={c.align} />
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={shownCols.length} className="px-4 py-8 text-center text-ink-muted">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={shownCols.length} className="px-4 py-8 text-center text-ink-muted">No registrations match the current filters.</td></tr>
              ) : filtered.map((a) => (
                <tr key={a.id} className="border-b border-forest-500/15 last:border-b-0 hover:bg-forest-600/5">
                  {shownCols.map((c) => (
                    <td key={c.id} className={`px-4 py-3 ${c.cellClass || ''} ${c.className || ''}`}>{c.render(a)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
