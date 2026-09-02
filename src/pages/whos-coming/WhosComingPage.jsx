import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import { alumniApi, rsvpApi } from '../../services/api';
import { BRANCHES } from '../../data/constants';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { DEMO_EMAILS } from '../../utils/isDemoUser';

// "Who's Registered" — alumni-facing roster of everyone signalling intent to
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
  // family = extra adults + children
  family:
    Math.max(0, (Number(a.adults) || 1) - 1) +
    (Number(a.childrenUnder10) || 0) +
    (Number(a.children10Plus) || 0),
});

// Normalise a public RSVP submission. Few fields, so the card auto-collapses.
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
    branch: r.branch || '',
    hostel: '',
    avatar: '',
    designation: '',
    company: '',
    currentCity: '',
    state: '',
    arrivalDate: '',
    departureDate: '',
    family: Number.isFinite(fj) && fj > 0 ? fj : 0,
    foodPreference: r.foodPreference || '',
    volunteer: Boolean(r.volunteer),
  };
};

export default function WhosComingPage() {
  const [registered, setRegistered] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [hostel, setHostel] = useState('');
  const [kind, setKind] = useState('all'); // all | registered | rsvp
  // Engagement tier chosen by clicking a stat card: all | interest | signedUp | paid
  const [tier, setTier] = useState('all');

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
    return [...byEmail.values()];
  }, [registered, rsvps]);

  const hostelOptions = useMemo(() => {
    const set = new Set(entries.map((a) => a.hostel).filter(Boolean));
    return [...set].sort().map((h) => ({ value: h, label: `Hostel ${h}` }));
  }, [entries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((a) => {
      if (tier !== 'all' && tierOf(a) !== tier) return false;
      if (kind !== 'all' && a.kind !== kind) return false;
      if (branch && a.branch !== branch) return false;
      if (hostel && a.hostel !== hostel) return false;
      if (!q) return true;
      const hay = [a.name, a.currentCity, a.state, a.company, a.designation]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [entries, search, branch, hostel, kind, tier]);

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
    <motion.div {...pageTransition} className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-ink mb-2">
          Who's Registered 🙋
        </h1>
        <p className="text-ink-soft text-sm">
          Everyone signalling intent for REConverge 2001 — full registrations
          plus quick RSVPs. Refresh as more come in.
        </p>
      </div>

      {/* Stats — click a tier card to filter the roster below; click again to clear */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatPill label="Shown Interest" value={stats.interest} active={tier === 'interest'} onClick={() => setTier((t) => (t === 'interest' ? 'all' : 'interest'))} />
        <StatPill label="Signed Up (Not Paid)" value={stats.signedUp} active={tier === 'signedUp'} onClick={() => setTier((t) => (t === 'signedUp' ? 'all' : 'signedUp'))} />
        <StatPill label="Paid & Attending" value={stats.paid} active={tier === 'paid'} onClick={() => setTier((t) => (t === 'paid' ? 'all' : 'paid'))} />
        <StatPill label="Total headcount (incl. family)" value={stats.headcount} active={tier === 'all'} onClick={() => setTier('all')} />
      </div>

      {/* Filters */}
      <GlassCard hover={false} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
          <Select
            label="Hostel"
            value={hostel}
            onChange={(e) => setHostel(e.target.value)}
            options={hostelOptions}
            placeholder="All hostels"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <AttendeeCard key={a.id} a={a} />
          ))}
        </div>
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

function KindBadge({ kind }) {
  const cfg =
    kind === 'registered'
      ? { label: 'Registered', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' }
      : { label: 'RSVP', cls: 'bg-sky-500/15 text-sky-300 border-sky-400/30' };
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.cls} flex-shrink-0`}
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
            <KindBadge kind={a.kind} />
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
