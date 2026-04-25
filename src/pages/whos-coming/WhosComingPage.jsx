import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import { alumniApi, rsvpApi } from '../../services/api';
import { BRANCHES } from '../../data/constants';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

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

const DEMO_EMAILS = new Set([
  'admin@email.com',
  'alumni@email.com',
  'superuser@email.com',
]);

const looksLikeDemo = (a) => {
  if (!a) return true;
  if (a.email && DEMO_EMAILS.has(a.email.toLowerCase())) return true;
  if (!a.email) return true;
  if ((a.rollNumber || '').toUpperCase().includes('DEMO')) return true;
  return false;
};

const fmtDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
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
  }, [entries, search, branch, hostel, kind]);

  const stats = useMemo(() => {
    const reg = entries.filter((e) => e.kind === 'registered').length;
    const rsv = entries.filter((e) => e.kind === 'rsvp').length;
    const branches = new Set(entries.map((e) => e.branch).filter(Boolean)).size;
    // Headcount is only meaningful for registered (full party size known).
    // RSVPs only carry a loose "familyJoining" string; we add 1 (the alum)
    // plus any numeric family count we managed to parse.
    const headcount = entries.reduce(
      (n, e) => n + 1 + (Number(e.family) || 0),
      0
    );
    return { reg, rsv, branches, headcount };
  }, [entries]);

  return (
    <motion.div {...pageTransition} className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
          Who's Registered 🙋
        </h1>
        <p className="text-slate-400 text-sm">
          Everyone signalling intent for REConverge 2001 — full registrations
          plus quick RSVPs. Refresh as more come in.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatPill label="Registered" value={stats.reg} />
        <StatPill label="RSVPed" value={stats.rsv} />
        <StatPill label="Branches" value={stats.branches} />
        <StatPill label="Total headcount (incl. family)" value={stats.headcount} />
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
        <p className="text-center text-slate-400 py-12">Loading the roster…</p>
      ) : filtered.length === 0 ? (
        <GlassCard hover={false} className="text-center">
          <p className="text-slate-300 font-medium">No matches yet.</p>
          <p className="text-xs text-slate-500 mt-1">
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

function StatPill({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
      <p className="text-2xl font-bold text-gold-400 leading-none">{value}</p>
      <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">{label}</p>
    </div>
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
          className="w-14 h-14 rounded-full border border-white/10 bg-white/5 object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold leading-tight truncate">{a.name || '—'}</p>
            <KindBadge kind={a.kind} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5 truncate">
            {a.branch || '—'}
            {a.hostel ? ` · Hostel ${a.hostel}` : ''}
          </p>
        </div>
        {a.family > 0 && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-300 border border-gold-400/30 flex-shrink-0">
            +{a.family}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-slate-300">
        {(a.designation || a.company) && (
          <p>
            <span className="text-slate-500">Now: </span>
            {[a.designation, a.company].filter(Boolean).join(' · ')}
          </p>
        )}
        {(a.currentCity || a.state) && (
          <p>
            <span className="text-slate-500">Based in: </span>
            {[a.currentCity, a.state].filter(Boolean).join(', ')}
          </p>
        )}
        {(arr || dep) && (
          <p>
            <span className="text-slate-500">Reunion days: </span>
            {arr || '—'} {arr || dep ? '→' : ''} {dep || '—'}
          </p>
        )}
        {a.kind === 'rsvp' && (a.foodPreference || a.volunteer) && (
          <p>
            <span className="text-slate-500">RSVP: </span>
            {[a.foodPreference, a.volunteer ? 'volunteering' : null]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
      </div>
    </GlassCard>
  );
}
