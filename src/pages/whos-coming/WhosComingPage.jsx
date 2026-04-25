import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import { alumniApi } from '../../services/api';
import { BRANCHES } from '../../data/constants';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

// "Who's Coming" — alumni-facing roster of confirmed attendees. Pulls from
// the same `alumni` collection as the directory but trims to the safe-to-share
// fields and filters out demo / placeholder accounts so the batch sees real
// faces.
//
// What we share (and why):
//   - Name + avatar           → identity, recognition
//   - Branch + hostel         → instant nostalgia anchor
//   - City / state            → "we're in the same city, let's pre-meet"
//   - Company + designation   → 25-years-on career update, conversation starter
//   - Travel window           → arrival/departure date only (no times) so people
//                               can plan shared cabs / overlap dinners
//   - Family count            → "+2" badge so others know to expect kids/spouse
//
// What we deliberately HIDE on this page:
//   - Email, phone            → contact methods stay opt-in (directory has them)
//   - Roll number, ID number  → identifiers, not interesting to others
//   - Room preference / preferred roommate → logistics, not a public signal
//   - T-shirt size, dietary pref → org-team data, not social
//   - Payment UID / status    → finance internal
//   - Special requests, notes → private to the user

const DEMO_EMAILS = new Set([
  'admin@email.com',
  'alumni@email.com',
  'superuser@email.com',
]);

const looksLikeDemo = (a) => {
  if (!a) return true;
  if (a.email && DEMO_EMAILS.has(a.email.toLowerCase())) return true;
  // Placeholder rows from earlier seeds frequently used 'DEMO' in the roll
  // number or had no email — drop both.
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

export default function WhosComingPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [hostel, setHostel] = useState('');

  useEffect(() => {
    alumniApi
      .getAll()
      .then((rows) => setAlumni(rows.filter((a) => a.isRegistered && !looksLikeDemo(a))))
      .catch((err) => console.warn('Could not load attendee list', err))
      .finally(() => setLoading(false));
  }, []);

  // Hostel options derived from the data — keeps the dropdown in sync with
  // whatever values registrations actually contain (no hardcoded H1/H2 list).
  const hostelOptions = useMemo(() => {
    const set = new Set(alumni.map((a) => a.hostel).filter(Boolean));
    return [...set].sort().map((h) => ({ value: h, label: `Hostel ${h}` }));
  }, [alumni]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return alumni.filter((a) => {
      if (branch && a.branch !== branch) return false;
      if (hostel && a.hostel !== hostel) return false;
      if (!q) return true;
      const hay = [a.name, a.currentCity, a.state, a.company, a.designation]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [alumni, search, branch, hostel]);

  const stats = useMemo(() => {
    const total = alumni.length;
    const branches = new Set(alumni.map((a) => a.branch).filter(Boolean)).size;
    const cities = new Set(alumni.map((a) => a.currentCity).filter(Boolean)).size;
    const family = alumni.reduce(
      (n, a) =>
        n +
        (Number(a.adults) || 0) +
        (Number(a.childrenUnder10) || 0) +
        (Number(a.children10Plus) || 0),
      0
    );
    return { total, branches, cities, family };
  }, [alumni]);

  return (
    <motion.div {...pageTransition} className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
          Who's Coming 🙋
        </h1>
        <p className="text-slate-400 text-sm">
          The batch members confirmed for REConverge 2001 — refresh anytime as more registrations
          come in.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatPill label="Confirmed" value={stats.total} />
        <StatPill label="Branches" value={stats.branches} />
        <StatPill label="Cities" value={stats.cities} />
        <StatPill label="Total headcount (incl. family)" value={stats.family} />
      </div>

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

function AttendeeCard({ a }) {
  const family =
    (Number(a.adults) || 1) - 1 + (Number(a.childrenUnder10) || 0) + (Number(a.children10Plus) || 0);
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
          <p className="text-white font-semibold leading-tight truncate">{a.name}</p>
          <p className="text-xs text-slate-400 mt-0.5 truncate">
            {a.branch || '—'}
            {a.hostel ? ` · Hostel ${a.hostel}` : ''}
          </p>
        </div>
        {family > 0 && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-300 border border-gold-400/30 flex-shrink-0">
            +{family}
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
      </div>
    </GlassCard>
  );
}
