import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import { alumniApi, rsvpApi } from '../../services/api';
import { BRANCHES, BRANCH_SHORT } from '../../data/constants';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { DEMO_EMAILS } from '../../utils/isDemoUser';

// "Track Registration" — detailed, sortable roster (Details grant required) of everyone signalling intent to
// attend REConverge 2001. Two sources are merged into a single browsable
// list, with a badge so the difference is obvious:
//
//   - Registered  → completed the full sign-up flow (alumni table). Has
//                   travel dates, family count, career details, etc.
//   - RSVPed      → submitted the lightweight public RSVP form (rsvps
//                   table). Has only name, branch, food pref, family count.
//
// We dedupe by email so an alum who first RSVPed and later registered shows
// once with the richer "Registered" card.
//
// What we share / hide is unchanged from before — see field comments below.

const looksLikeDemo = (a) => {
  if (!a) return true;
  if (a.email && DEMO_EMAILS.has(a.email.toLowerCase())) return true;
  if (!a.email) return true;
  if ((a.rollNumber || '').toUpperCase().includes('DEMO')) return true;
  return false;
};

// Engagement tier of an entry (matches the Roll of Honour "paid" rule):
//   interest → quick RSVP only · signedUp → account, not paid · paid → any
//   paid status (paid / pending-verification / confirmed).
const PAID_ANY = new Set(['paid', 'pending-verification', 'confirmed']);
const tierOf = (e) => {
  if (e.kind !== 'registered') return 'interest';
  if (e.participation === 'giveback-only') return 'giveback';
  return PAID_ANY.has(e.paymentStatus) ? 'paid' : 'signedUp';
};

const fmtDate = (iso) => {
  if (!iso) return null;
  // The DB stores arrival/departure as plain 'YYYY-MM-DD' strings — calendar
  // days, not instants. `new Date('2026-12-25')` would parse that as UTC
  // midnight, and anyone viewing from a timezone west of UTC sees the
  // *previous* day after toLocaleDateString. Parse as local-time instead so
  // the displayed day matches what the user typed in the form, regardless
  // of where they (or the viewer) happen to be.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso).trim());
  const d = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

// Normalise a registered alumnus into the shared "entry" shape the UI
// renders. Carries enough data to drive the card and all filters.
const fromAlumni = (a) => ({
  kind: 'registered',
  id: `alum:${a.id}`,
  name: (a.name || '').trim(),
  email: (a.email || '').trim().toLowerCase(),
  branch: a.branch || '',
  hostel: a.hostel || '',
  avatar: a.avatar || '',
  designation: a.designation || '',
  company: a.company || '',
  currentCity: a.currentCity || '',
  state: a.state || '',
  arrivalDate: a.arrivalDate || '',
  departureDate: a.departureDate || '',
  paymentStatus: a.paymentStatus || null,
  participation: a.participation || 'attending',
  registeredAt: a.createdAt || '',
  paidAt: a.paymentVerifiedAt || '',
  // family = extra adults + children
  family:
    Math.max(0, (Number(a.adults) || 1) - 1) +
    (Number(a.childrenUnder10) || 0) +
    (Number(a.children10Plus) || 0),
});

// Normalise a public RSVP submission. Few fields, so the card auto-collapses.
// RSVPs store the SHORT branch code ('Mech.', 'CSE', …) while registered
// profiles and the Branch filter use the full name — normalise here so the
// filter catches both kinds of entries.
const fullBranchOf = (b) => BRANCHES[BRANCH_SHORT.indexOf(b)] || b || '';

const fromRsvp = (r) => {
  // `familyJoining` was historically a free-text field; sometimes the literal
  // string '[object Object]' from a buggy old client. Try to coerce a number,
  // otherwise show 0.
  const fj = parseInt(r.familyJoining, 10);
  return {
    kind: 'rsvp',
    id: `rsvp:${r.id}`,
    name: (r.fullName || '').trim(),
    email: (r.email || '').trim().toLowerCase(),
    branch: fullBranchOf(r.branch),
    hostel: '',
    avatar: '',
    designation: '',
    company: '',
    currentCity: '',
    state: '',
    arrivalDate: '',
    departureDate: '',
    family: Number.isFinite(fj) && fj > 0 ? fj : 0,
    registeredAt: r.submittedAt || '',
    paidAt: '',
    foodPreference: r.foodPreference || '',
    volunteer: Boolean(r.volunteer),
  };
};

const TIER_BADGE = {
  paid:     { label: 'Paid & Attending', icon: '✅', cls: 'bg-emerald-500/15 text-emerald-700 border-emerald-400/40' },
  signedUp: { label: 'Signed Up',        icon: '📝', cls: 'bg-amber-500/15 text-amber-700 border-amber-400/40' },
  giveback: { label: 'Give Back',        icon: '💛', cls: 'bg-gold-500/15 text-gold-700 border-gold-400/40' },
  interest: { label: 'Shown Interest',   icon: '🙋', cls: 'bg-sky-500/15 text-sky-700 border-sky-400/40' },
};

const shortBranch = (full) => BRANCH_SHORT[BRANCHES.indexOf(full)]?.replace('.', '') || full || '';

const Stamp = ({ iso }) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return <span>{d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>;
};

function SortHeader({ label, col, sort, onSort, className = '', align = 'text-left' }) {
  const active = sort.key === col;
  return (
    <th className={`px-3 py-3 ${className}`} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        onClick={() => onSort(col)}
        className={`w-full ${align} text-[11px] uppercase tracking-wider inline-flex items-center gap-1 whitespace-nowrap ${
          align === 'text-center' ? 'justify-center' : ''
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

export default function TrackRegistrationPage() {
  const [registered, setRegistered] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [kind, setKind] = useState('all'); // all | registered | rsvp
  // Engagement tiers chosen by clicking stat cards — MULTI-select (e.g.
  // Shown Interest + Signed Up together). Empty set = no tier filter.
  const [tiers, setTiers] = useState(() => new Set());
  const toggleTier = (t) =>
    setTiers((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });

  useEffect(() => {
    Promise.allSettled([alumniApi.getAll(), rsvpApi.getAll()])
      .then(([alumniRes, rsvpRes]) => {
        if (alumniRes.status === 'fulfilled') {
          setRegistered(
            alumniRes.value
              .filter((a) => a.isRegistered && !looksLikeDemo(a))
              .map(fromAlumni)
          );
        }
        if (rsvpRes.status === 'fulfilled') {
          setRsvps((rsvpRes.value || []).map(fromRsvp));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Merge + dedupe. Registered wins over RSVP for the same email.
  const entries = useMemo(() => {
    const byEmail = new Map();
    for (const e of registered) if (e.email) byEmail.set(e.email, e);
    for (const e of rsvps) {
      if (!e.email || byEmail.has(e.email)) continue;
      byEmail.set(e.email, e);
    }
    // Give-back-only profiles are excluded from this page entirely — they
    // are tracked on the admin Pledges tab instead.
    return [...byEmail.values()].filter((e) => tierOf(e) !== 'giveback');
  }, [registered, rsvps]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((a) => {
      if (tiers.size > 0 && !tiers.has(tierOf(a))) return false;
      if (kind !== 'all' && a.kind !== kind) return false;
      if (branch && a.branch !== branch) return false;
      if (!q) return true;
      const hay = [a.name, a.currentCity, a.state, a.company, a.designation]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [entries, search, branch, kind, tiers]);

  // Column sorting — default chronological by registration, oldest first,
  // so a brand-new sign-up or payment is always at the end of the list.
  const [sort, setSort] = useState({ key: 'registeredAt', dir: 'asc' });
  const toggleSort = (key) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));

  const SORTERS = {
    name:         (a) => a.name.toLowerCase(),
    branch:       (a) => a.branch || '',
    now:          (a) => [a.designation, a.company].filter(Boolean).join(' ').toLowerCase(),
    based:        (a) => [a.currentCity, a.state].filter(Boolean).join(', ').toLowerCase(),
    days:         (a) => a.arrivalDate || '9999',
    family:       (a) => Number(a.family) || 0,
    tier:         (a) => tierOf(a),
    registeredAt: (a) => a.registeredAt || '9999',
    paidAt:       (a) => a.paidAt || '9999',
  };
  const sorted = useMemo(() => {
    const keyOf = SORTERS[sort.key] || SORTERS.registeredAt;
    const flip = sort.dir === 'desc' ? -1 : 1;
    return [...filtered].sort((x, y) => {
      const kx = keyOf(x); const ky = keyOf(y);
      const cmp = typeof kx === 'number' ? kx - ky : String(kx).localeCompare(String(ky));
      return flip * cmp || String(x.registeredAt).localeCompare(String(y.registeredAt));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, sort]);

  const filteredFamily = useMemo(
    () => filtered.reduce((n, e) => n + (Number(e.family) || 0), 0),
    [filtered]
  );

  const stats = useMemo(() => {
    // Three-tier engagement model — see utils/interestState.js and tierOf().
    const paid = entries.filter((e) => tierOf(e) === 'paid').length;
    const signedUp = entries.filter((e) => tierOf(e) === 'signedUp').length;
    const interest = entries.filter((e) => tierOf(e) === 'interest').length;
    const headcount = entries.reduce(
      (n, e) => n + 1 + (Number(e.family) || 0),
      0
    );
    return { interest, signedUp, paid, headcount };
  }, [entries]);

  return (
    <motion.div {...pageTransition} className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-2">
          Track Registration 📊
        </h1>
        <p className="text-ink-soft text-sm">
          Full registration and payment timeline for every alumnus: sort any
          column to see who registered or paid, and when.
        </p>
      </div>

      {/* Stats — click tier cards to filter the roster below; multi-select
          (e.g. Shown Interest + Signed Up). Click again to deselect; the
          headcount card clears every tier. */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatPill label="Shown Interest" value={stats.interest} active={tiers.has('interest')} onClick={() => toggleTier('interest')} />
        <StatPill label="Signed Up (Not Paid)" value={stats.signedUp} active={tiers.has('signedUp')} onClick={() => toggleTier('signedUp')} />
        <StatPill label="Paid & Attending" value={stats.paid} active={tiers.has('paid')} onClick={() => toggleTier('paid')} />
        <StatPill
          label="Total headcount (incl. family)"
          value={stats.headcount}
          active={tiers.size === 0 || tiers.size === 3}
          onClick={() => setTiers(new Set(['interest', 'signedUp', 'paid']))}
        />
      </div>

      {/* Live tally of the current selection, incl. the family plus-ones */}
      <p className="text-sm text-ink-soft mb-6 -mt-2">
        Showing <span className="font-semibold text-ink">{filtered.length}</span> alumni
        {' '}+ <span className="font-semibold text-ink">{filteredFamily}</span> family
        {' '}= <span className="font-semibold text-gold-700">{filtered.length + filteredFamily} heads</span>
      </p>

      {/* Filters */}
      <GlassCard hover={false} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            label="Search"
            placeholder="Name, city, company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            label="Type"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            options={[
              { value: 'all', label: 'All entries' },
              { value: 'registered', label: 'Registered only' },
              { value: 'rsvp', label: 'RSVP only' },
            ]}
          />
          <Select
            label="Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            options={BRANCHES}
            placeholder="All branches"
          />
        </div>
      </GlassCard>

      {loading ? (
        <p className="text-center text-ink-soft py-12">Loading the roster…</p>
      ) : filtered.length === 0 ? (
        <GlassCard hover={false} className="text-center">
          <p className="text-ink-soft font-medium">No matches yet.</p>
          <p className="text-xs text-ink-muted mt-1">
            Try clearing the filters, or check back as more batchmates register.
          </p>
        </GlassCard>
      ) : (
        <GlassCard hover={false} padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-forest-500/15 text-left">
                  <SortHeader label="Alumnus" col="name" sort={sort} onSort={toggleSort} />
                  <SortHeader label="Branch" col="branch" sort={sort} onSort={toggleSort} className="" />
                  <SortHeader label="Now" col="now" sort={sort} onSort={toggleSort} className="" />
                  <SortHeader label="Based in" col="based" sort={sort} onSort={toggleSort} className="" />
                  <SortHeader label="Reunion days" col="days" sort={sort} onSort={toggleSort} className="" />
                  <SortHeader label="Family" col="family" sort={sort} onSort={toggleSort} align="text-center" />
                  <SortHeader label="Status" col="tier" sort={sort} onSort={toggleSort} align="text-center" />
                  <SortHeader label="Registered on" col="registeredAt" sort={sort} onSort={toggleSort} />
                  <SortHeader label="Paid on" col="paidAt" sort={sort} onSort={toggleSort} />
                </tr>
              </thead>
              <tbody>
                {sorted.map((a) => {
                  const tier = tierOf(a);
                  const badge = TIER_BADGE[tier] || TIER_BADGE.interest;
                  const arr = fmtDate(a.arrivalDate); const dep = fmtDate(a.departureDate);
                  return (
                    <tr key={a.id} className="border-b border-forest-500/15 last:border-b-0 hover:bg-forest-600/5 align-top">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={a.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(a.name || 'alum')}`}
                            alt=""
                            className="w-8 h-8 rounded-full border border-forest-500/15 bg-white object-cover flex-shrink-0"
                          />
                          <span className="text-ink font-medium whitespace-nowrap">{a.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-ink-soft whitespace-nowrap">
                        {shortBranch(a.branch)}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-ink-soft max-w-[170px]">
                        {[a.designation, a.company].filter(Boolean).join(' · ')}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-ink-soft max-w-[140px]">
                        {[a.currentCity, a.state].filter(Boolean).join(', ')}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-ink-soft whitespace-nowrap">
                        {arr && dep
                          ? (arr.split(' ')[1] === dep.split(' ')[1]
                              ? `${arr.split(' ')[0]}–${dep}`
                              : `${arr}–${dep}`)
                          : arr || dep || ''}
                      </td>
                      <td className="px-3 py-2.5 text-center text-ink-soft">{a.family > 0 ? `+${a.family}` : ''}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span title={badge.label} aria-label={badge.label} className="text-base cursor-default">
                          {badge.icon}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-ink-soft whitespace-nowrap"><Stamp iso={a.registeredAt} /></td>
                      <td className="px-3 py-2.5 text-xs text-ink-soft whitespace-nowrap"><Stamp iso={a.paidAt} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-2.5 border-t border-forest-500/15 text-[11px] text-ink-muted flex flex-wrap gap-x-4 gap-y-1">
            {['paid', 'signedUp', 'interest'].map((k) => TIER_BADGE[k]).map((b) => (
              <span key={b.label}>{b.icon} {b.label}</span>
            ))}
          </p>
        </GlassCard>
      )}
    </motion.div>
  );
}

function StatPill({ label, value, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border px-4 py-3 text-center transition-colors ${
        active
          ? 'bg-[#fbf7ea] border-gold-500/70 ring-1 ring-gold-500/40'
          : 'bg-white border-forest-500/15 hover:border-forest-500/40'
      }`}
    >
      <p className="text-2xl font-bold text-gold-700 leading-none">{value}</p>
      <p className="text-[11px] text-ink-soft uppercase tracking-wider mt-1">{label}</p>
    </button>
  );
}

function TierBadge({ tier }) {
  const cfg =
    tier === 'paid'
      ? { label: 'Paid & Attending', cls: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/40' }
      : tier === 'signedUp'
        ? { label: 'Signed Up', cls: 'bg-amber-500/15 text-amber-700 border-amber-500/40' }
        : { label: 'Shown Interest', cls: 'bg-sky-500/15 text-sky-700 border-sky-500/40' };
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.cls} flex-shrink-0 whitespace-nowrap`}
    >
      {cfg.label}
    </span>
  );
}

function AttendeeCard({ a }) {
  const arr = fmtDate(a.arrivalDate);
  const dep = fmtDate(a.departureDate);
  return (
    <GlassCard hover={false} className="h-full">
      <div className="flex items-start gap-3">
        <img
          src={a.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(a.name || 'alum')}`}
          alt={a.name}
          className="w-14 h-14 rounded-full border border-forest-500/15 bg-white object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-ink font-semibold leading-tight truncate">{a.name || '—'}</p>
            <TierBadge tier={tierOf(a)} />
          </div>
          <p className="text-xs text-ink-soft mt-0.5 truncate">
            {a.branch || '—'}
            {a.hostel ? ` · Hostel ${a.hostel}` : ''}
          </p>
        </div>
        {a.family > 0 && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-700 border border-gold-400/30 flex-shrink-0">
            +{a.family}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-ink-soft">
        {(a.designation || a.company) && (
          <p>
            <span className="text-ink-muted">Now: </span>
            {[a.designation, a.company].filter(Boolean).join(' · ')}
          </p>
        )}
        {(a.currentCity || a.state) && (
          <p>
            <span className="text-ink-muted">Based in: </span>
            {[a.currentCity, a.state].filter(Boolean).join(', ')}
          </p>
        )}
        {(arr || dep) && (
          <p>
            <span className="text-ink-muted">Reunion days: </span>
            {arr || '—'} {arr || dep ? '→' : ''} {dep || '—'}
          </p>
        )}
        {a.kind === 'rsvp' && (a.foodPreference || a.volunteer) && (
          <p>
            <span className="text-ink-muted">RSVP: </span>
            {[a.foodPreference, a.volunteer ? 'volunteering' : null]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
      </div>
    </GlassCard>
  );
}
