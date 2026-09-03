import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicApi, alumniApi } from '../../../services/api';
import { isDemoUser } from '../../../utils/isDemoUser';
import { BRANCHES, BRANCH_SHORT, STATS } from '../../../data/constants';
import { useAuth } from '../../../context/AuthContext';
import Avatar from '../../../components/ui/Avatar';

// "Roll of Honour" — rect1an's public registration board.
//
// Data comes from GET /api/public/roll-of-honour (server/public.js): counts,
// per-branch totals and the roster (full name · branch · city · paid · avatar).
// That endpoint is unauthenticated and PII-free, so the numbers populate for
// every visitor. Signed-in users get the same list from the auth-gated
// /api/alumni (and can open Who's Registered for details). Either way the
// list is paginated (25/50/100/200 per page) with First/Prev/Next/Last.

const BATCH_STRENGTH = STATS.find((s) => s.label === 'Batch Strength')?.value || 350;
// Paid & coming: verified (confirmed) or awaiting verification (paid / pending-verification).
const PAID_ANY = new Set(['paid', 'pending-verification', 'confirmed']);

const shortOf = (branch) => BRANCH_SHORT[BRANCHES.indexOf(branch)] || branch;

const EMPTY = { totals: { signedUp: 0, paid: 0, paidAny: 0, interestOnly: 0, heads: 0 }, byBranch: [], roster: [] };
const PAGE_SIZES = [25, 50, 100, 200];

const pagerBtn =
  'nav-caps px-1 sm:px-3 py-2 text-[9px] sm:text-[11px] tracking-[0.06em] sm:tracking-caps border border-forest-500/20 bg-white text-forest-700 hover:border-forest-500/50 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap';

export default function RollOfHonour() {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState(EMPTY);
  const [fullRoster, setFullRoster] = useState(null); // signed-in only
  const [q, setQ] = useState('');
  const [branch, setBranch] = useState('ALL');

  useEffect(() => {
    let cancelled = false;
    publicApi.rollOfHonour()
      .then((d) => { if (!cancelled && d && d.totals) setData(d); })
      .catch(() => { /* landing must never block on this */ });
    if (isAuthenticated) {
      alumniApi.getAll()
        .then((all) => {
          if (cancelled) return;
          setFullRoster(
            (all || [])
              .filter((x) => x.isRegistered && !isDemoUser(x))
              .map((x) => ({ id: x.id, name: (x.name || '').trim(), branch: x.branch || '', city: x.currentCity || '', avatar: x.avatar || '', paid: PAID_ANY.has(x.paymentStatus), verified: x.paymentStatus === 'confirmed' }))
              // Records with no saved name sort last and read "Batchmate".
              .sort((p, r) => (p.name ? 0 : 1) - (r.name ? 0 : 1) || p.name.localeCompare(r.name))
              .map((x) => ({ ...x, name: x.name || 'Batchmate' }))
          );
        })
        .catch(() => {});
    }
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const { totals, byBranch } = data;
  const departments = byBranch.filter((b) => b.signedUp > 0).length;
  const pct = Math.min(100, Math.round((totals.signedUp / BATCH_STRENGTH) * 100));

  // Pagination (rect1an style): page size selectable, First/Prev/Next/Last.
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const source = (isAuthenticated && fullRoster) ? fullRoster : data.roster;
    return source
      .filter((a) => branch === 'ALL' || shortOf(a.branch) === branch)
      .filter((a) => !q || a.name.toLowerCase().includes(q.toLowerCase()));
  }, [data.roster, fullRoster, branch, q, isAuthenticated]);

  // Any change to the filters or page size goes back to page 1.
  useEffect(() => { setPage(1); }, [branch, q, pageSize, isAuthenticated]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);
  const showingFrom = total === 0 ? 0 : start + 1;
  const showingTo = Math.min(total, start + pageSize);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <section id="roll-of-honour" className="scroll-mt-24 py-16 md:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <span className="eyebrow">Those who have answered the call</span>
        <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-heading font-medium italic text-forest-600">
          Roll of Honour
        </h2>
        <p className="mt-2 font-serif text-ink-muted">Batchmates who have signed up for REConverge</p>
      </div>

      {/* Headline stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10 text-center">
        {[
          { v: totals.signedUp, l: 'Alumni Signed Up' },
          { v: departments, l: 'Departments' },
          { v: `${pct}%`, l: 'Signed Up %' },
          { v: totals.paidAny ?? totals.paid, l: 'Total Paid' },
        ].map((s, i) => (
          <div key={s.l} className={i < 3 ? 'sm:border-r border-forest-500/15' : ''}>
            <p className="font-heading text-4xl md:text-5xl text-gold-600">{s.v}</p>
            <p className="nav-caps text-ink-muted mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Medal cards */}
      <div className="text-center mb-4">
        <span className="eyebrow">Branch Leaderboard</span>
        <p className="font-serif italic text-ink-muted text-sm mt-1">Top departments by paid registrations</p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid sm:grid-cols-3 gap-3 mb-8"
      >
        {[...byBranch].sort((p, q) => q.paid - p.paid || q.signedUp - p.signedUp).slice(0, 3).map((b, i) => (
          <div
            key={b.branch}
            className={`flex items-center justify-between px-5 py-4 bg-[#fbf7ea] border ${
              i === 0 ? 'border-gold-500/70' : 'border-forest-500/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{medals[i]}</span>
              <div>
                <p className="nav-caps text-gold-700">{shortOf(b.branch)}</p>
                <p className="font-heading text-ink text-sm">{b.branch}</p>
              </div>
            </div>
            <p className="font-heading text-3xl text-gold-600" title="Paid / signed up">{b.paid}<span className="text-lg text-ink-muted">/{b.signedUp}</span></p>
          </div>
        ))}
      </motion.div>

      {/* Search + chips */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name…"
        className="w-full bg-cream-200/70 border border-forest-500/15 px-4 py-2.5 text-sm text-ink placeholder-ink-muted outline-none focus:border-forest-500/50 mb-3"
      />
      {/* One row on every size: on phones the 8 chips share the width equally
          with tighter padding/tracking; from sm: they size to content. */}
      <div className="flex flex-nowrap gap-1 sm:gap-1.5 mb-4">
        {['ALL', ...BRANCH_SHORT].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setBranch(s)}
            className={`nav-caps flex-1 sm:flex-none min-w-0 px-0 sm:px-3 py-1.5 border text-[9px] sm:text-[11px] tracking-[0.06em] sm:tracking-caps whitespace-nowrap ${
              branch === s ? 'bg-[#fbf7ea] border-gold-500/70 text-gold-800' : 'bg-white border-forest-500/15 text-ink-soft hover:border-forest-500/40'
            }`}
          >
            {s.replace('.', '')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-forest-500/15">
        <table className="w-full text-sm">
          <thead className="bg-[#444] text-cream-50">
            <tr>
              <th className="nav-caps text-left px-4 py-2.5">Sr. No</th>
              <th className="nav-caps text-left px-4 py-2.5">Branch</th>
              <th className="nav-caps text-left px-4 py-2.5">Name</th>
              <th className="nav-caps text-left px-4 py-2.5 hidden sm:table-cell">Flying From</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => (
              <tr key={a.id} className={i % 2 ? 'bg-cream-200/60' : 'bg-white'}>
                <td className="px-4 py-2.5 text-ink-muted font-serif">{String(start + i + 1).padStart(2, '0')}</td>
                <td className="px-4 py-2.5">
                  {a.branch ? (
                    <span className="nav-caps px-1.5 py-0.5 border border-gold-500/60 text-gold-800 bg-[#fbf7ea]">{shortOf(a.branch).replace('.', '')}</span>
                  ) : (
                    <span className="text-ink-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 font-serif text-ink">
                  <span className="inline-flex items-center gap-2">
                    <Avatar
                      size="sm"
                      name={a.name}
                      src={a.avatar || (a.hasAvatar ? `/api/public/avatar/${a.id}` : '')}
                      className="w-7 h-7 text-[10px] ring-1 ring-forest-500/15"
                    />
                    <span>{a.name}</span>
                    {a.paid && (
                      <span
                        title={a.verified ? 'Paid & coming (verified)' : 'Paid & coming (verification pending)'}
                        aria-label={a.verified ? 'Paid and coming, verified' : 'Paid and coming, verification pending'}
                        className="text-sm leading-none"
                      >
                        ✅
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-serif text-ink-muted hidden sm:table-cell">{a.city || '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-ink-muted font-serif">No matches yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination bar — one row on desktop; on phones the summary + page
          size sit on the first line and the four buttons fill a second line. */}
      <div className="border border-t-0 border-forest-500/15 bg-cream-200/40 px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <p className="font-serif italic text-ink-soft text-sm">
            Showing {showingFrom}–{showingTo} of {total} signed up
          </p>
          <label className="flex items-center gap-2 text-xs text-ink-muted nav-caps">
            <span className="hidden sm:inline">Show</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Rows per page"
              className="nav-caps bg-white border border-forest-500/20 px-2 py-1.5 text-forest-700 outline-none focus:border-forest-500/50"
            >
              {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-[1fr_1fr_auto_1fr_1fr] sm:flex items-center gap-1.5 sm:gap-2">
          <button type="button" className={pagerBtn} disabled={safePage <= 1} onClick={() => setPage(1)}>« First</button>
          <button type="button" className={pagerBtn} disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>← Prev</button>
          <span className="nav-caps text-ink-soft px-1 sm:px-2 text-[10px] sm:text-[11px] text-center whitespace-nowrap">{safePage} / {pageCount}</span>
          <button type="button" className={pagerBtn} disabled={safePage >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>Next →</button>
          <button type="button" className={pagerBtn} disabled={safePage >= pageCount} onClick={() => setPage(pageCount)}>Last »</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 text-xs text-ink-muted font-serif">
        <span>✅ Paid &amp; coming · {totals.interestOnly} more have shown interest but not signed up yet.</span>
        {!isAuthenticated && (
          <Link to="/login" className="nav-caps text-forest-700 hover:text-gold-700">Sign in for travel plans &amp; more →</Link>
        )}
        {isAuthenticated && (
          <Link to="/whos-coming" className="nav-caps text-forest-700 hover:text-gold-700">Full roster →</Link>
        )}
      </div>
    </section>
  );
}
