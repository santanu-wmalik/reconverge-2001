import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import { activityApi } from '../../services/api';
import GlassCard from '../../components/ui/GlassCard';

// User Activity — usage-audit dashboard (super-admin tab).
// From/To + user filters, KPI cards, daily-active and logins charts, most
// visited pages, per-user breakdown, and a sessionised log (30-min gap =
// new session). Data: server activity_log; demo accounts excluded there.

const isoDay = (d) => d.toISOString().slice(0, 10);
const fmtDur = (ms) => {
  if (!ms || ms < 60000) return `${Math.max(0, Math.round(ms / 1000))}s`;
  const m = Math.round(ms / 60000);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};
const fmtDT = (iso) =>
  iso ? new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' }) : '—';
const shortDay = (day) => new Date(`${day}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const PAGE_LABEL = {
  '/': 'Home', '/profile': 'My Profile', '/give-back': 'Give Back form',
  '/project-cornerstone': 'Campaign page', '/gallery': 'Gallery', '/whos-coming': "Who's Coming",
  '/admin': 'Event Dashboard', '/admin/giveback-tracking': 'GB Tracking', '/admin/pledges': 'Intents to Give',
  '/admin/users': 'Users', '/admin/payments': 'Payments', '/admin/registrations': 'Alumni Registration',
};
const pageLabel = (p) => PAGE_LABEL[p] || p;

// ── tiny chart primitives (site theme, no chart lib) ───────────────────────
function BarChart({ data, xKey, yKey, title }) {
  const max = Math.max(1, ...data.map((d) => d[yKey]));
  return (
    <div>
      <div className="flex items-end gap-[3px] h-36">
        {data.map((d) => (
          <div key={d[xKey]} className="flex-1 flex flex-col items-center justify-end min-w-0" title={`${shortDay(d[xKey])} — ${d[yKey]} ${title}`}>
            <span className="text-[9px] text-ink-muted leading-none mb-0.5">{d[yKey]}</span>
            <div className="w-full rounded-t bg-gradient-to-t from-forest-700 to-forest-500" style={{ height: `${(d[yKey] / max) * 100}%`, minHeight: d[yKey] > 0 ? 3 : 0 }} />
          </div>
        ))}
      </div>
      <div className="flex gap-[3px] mt-1">
        {data.map((d, i) => (
          <span key={d[xKey]} className="flex-1 text-center text-[8px] text-ink-muted overflow-hidden whitespace-nowrap">
            {data.length <= 12 || i % Math.ceil(data.length / 10) === 0 ? shortDay(d[xKey]) : ''}
          </span>
        ))}
      </div>
    </div>
  );
}

function LineChart({ data }) {
  const W = 600; const H = 130; const P = 14;
  const max = Math.max(1, ...data.map((d) => d.count));
  const pts = data.map((d, i) => [
    P + (data.length === 1 ? (W - 2 * P) / 2 : (i / (data.length - 1)) * (W - 2 * P)),
    H - P - (d.count / max) * (H - 2 * P),
  ]);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-36" preserveAspectRatio="none" aria-label="Logins over time">
        <polyline fill="none" stroke="#b8862b" strokeWidth="2" points={pts.map((p) => p.join(',')).join(' ')} />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r="3" fill="#b8862b" />
            <text x={p[0]} y={p[1] - 7} textAnchor="middle" fontSize="9" fill="#6b6257">{data[i].count}</text>
          </g>
        ))}
      </svg>
      <div className="flex justify-between text-[9px] text-ink-muted mt-0.5">
        <span>{data.length ? shortDay(data[0].day) : ''}</span>
        <span>{data.length > 1 ? shortDay(data[data.length - 1].day) : ''}</span>
      </div>
    </div>
  );
}

const BAR_COLORS = ['#2a4125', '#4a7342', '#6f9a63', '#b8862b', '#d9a441', '#8a9a5b', '#5b7553', '#b9b1a6', '#3f6238', '#a4854a'];

export default function UserActivityPage() {
  const today = isoDay(new Date());
  const monthAgo = isoDay(new Date(Date.now() - 30 * 24 * 3600 * 1000));
  const [from, setFrom] = useState(monthAgo);
  const [to, setTo] = useState(today);
  const [user, setUser] = useState('');
  const [applied, setApplied] = useState({ from: monthAgo, to: today, user: '' });
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const PER = 15;

  useEffect(() => {
    setLoading(true);
    activityApi.list(applied)
      .then((d) => { setData(d); setPage(0); })
      .catch((e) => setError(e.message || 'Could not load activity'))
      .finally(() => setLoading(false));
  }, [applied]);

  const k = data?.kpis;
  const sessions = data?.sessions || [];
  const pageCount = Math.max(1, Math.ceil(sessions.length / PER));
  const pageRows = sessions.slice(page * PER, (page + 1) * PER);
  const maxPage = Math.max(1, ...(data?.topPages || []).map((p) => p.count));
  const maxUser = Math.max(1, ...(data?.byUser || []).map((u) => u.events));

  const Card = ({ title, children, className = '' }) => (
    <GlassCard hover={false} className={className}>
      <p className="nav-caps text-[10px] text-ink-muted mb-3">{title}</p>
      {children}
    </GlassCard>
  );

  return (
    <motion.div {...pageTransition}>
      <div className="mb-5">
        <h1 className="text-3xl font-heading font-bold text-ink">User Activity</h1>
        <p className="text-ink-soft mt-1">Usage audit — sign-ins, page views, and actions after login. Demo accounts excluded.</p>
      </div>

      {/* Filters */}
      <GlassCard hover={false} className="mb-5 !py-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-ink-soft">From
            <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)}
              className="block mt-1 bg-white border border-forest-500/15 rounded-xl px-3 py-2 text-sm outline-none focus:border-forest-500/40" />
          </label>
          <label className="text-xs text-ink-soft">To
            <input type="date" value={to} min={from} max={today} onChange={(e) => setTo(e.target.value)}
              className="block mt-1 bg-white border border-forest-500/15 rounded-xl px-3 py-2 text-sm outline-none focus:border-forest-500/40" />
          </label>
          <label className="text-xs text-ink-soft">User
            <select value={user} onChange={(e) => setUser(e.target.value)}
              className="block mt-1 bg-white border border-forest-500/15 rounded-xl px-3 py-2 text-sm outline-none focus:border-forest-500/40 min-w-[200px]">
              <option value="">All users</option>
              {(data?.users || []).map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </label>
          <button
            onClick={() => setApplied({ from, to, user })}
            className="nav-caps px-6 py-2.5 bg-gradient-to-b from-gold-400 to-gold-600 text-forest-900 shadow hover:from-gold-300 hover:to-gold-500"
          >
            Apply
          </button>
          {error && <span className="text-sm text-red-700">{error}</span>}
        </div>
      </GlassCard>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
        {[
          [k?.totalUsers, 'total users'],
          [k?.activeUsers, 'active users'],
          [k ? fmtDur(k.avgSessionMs) : null, 'avg session'],
          [k?.pageViews, 'page views'],
          [k?.logins, 'sign-ins'],
          [k?.actions, 'actions'],
        ].map(([v, l]) => (
          <GlassCard key={l} hover={false} className="!p-4 text-center">
            <p className="font-heading text-2xl text-forest-700">{loading || v == null ? '—' : v}</p>
            <p className="text-[11px] text-ink-muted mt-0.5">{l}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card title="Daily active users">
          {data?.daily?.length
            ? <BarChart data={data.daily} xKey="day" yKey="users" title="active" />
            : <p className="text-sm text-ink-muted py-10 text-center">No activity in this window yet.</p>}
        </Card>
        <Card title="Most visited pages">
          {data?.topPages?.length ? (
            <div className="space-y-2">
              {data.topPages.map((p, i) => (
                <div key={p.path} className="flex items-center gap-2" title={p.path}>
                  <span className="w-36 shrink-0 text-xs text-ink-soft truncate text-right">{pageLabel(p.path)}</span>
                  <div className="flex-1 h-4 bg-cream-200 rounded overflow-hidden">
                    <div className="h-full rounded" style={{ width: `${(p.count / maxPage) * 100}%`, background: BAR_COLORS[i % BAR_COLORS.length] }} />
                  </div>
                  <span className="w-8 text-xs tabular-nums text-ink">{p.count}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-ink-muted py-10 text-center">Page views start recording once this build is deployed.</p>}
        </Card>
        <Card title="Logins over time">
          {data?.logins?.length
            ? <LineChart data={data.logins} />
            : <p className="text-sm text-ink-muted py-10 text-center">No sign-ins in this window yet.</p>}
        </Card>
        <Card title="User activity breakdown">
          {data?.byUser?.length ? (
            <div className="flex items-end gap-2 h-40">
              {data.byUser.map((u, i) => (
                <div key={u.email} className="flex-1 min-w-0 flex flex-col items-center justify-end" title={`${u.name || u.email} — ${u.events} events (${u.pageViews} page views)`}>
                  <span className="text-[9px] text-ink-muted mb-0.5">{u.events}</span>
                  <div className="w-full rounded-t" style={{ height: `${(u.events / maxUser) * 100}%`, minHeight: 3, background: BAR_COLORS[i % BAR_COLORS.length] }} />
                  <span className="mt-1 w-full text-center text-[8px] text-ink-muted truncate">{(u.name || u.email).split(' ')[0]}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-ink-muted py-10 text-center">No activity in this window yet.</p>}
        </Card>
      </div>

      {/* Session log */}
      <GlassCard hover={false} className="!p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-forest-500/10 flex flex-wrap items-baseline justify-between gap-2">
          <p className="nav-caps text-[10px] text-ink-muted">Session log</p>
          <div className="flex items-center gap-2 text-[11px] text-ink-muted">
            <span>Page {page + 1} of {pageCount} — {sessions.length} sessions</span>
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-2 py-1 rounded border border-forest-500/15 disabled:opacity-40 hover:bg-cream-100">← Prev</button>
            <button disabled={page >= pageCount - 1} onClick={() => setPage((p) => p + 1)} className="px-2 py-1 rounded border border-forest-500/15 disabled:opacity-40 hover:bg-cream-100">Next →</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-200/70 text-left nav-caps text-[10px] text-ink-muted">
                <th className="px-3 py-2">User</th>
                <th className="px-2 py-2">Login time</th>
                <th className="px-2 py-2">Last active</th>
                <th className="px-2 py-2 text-right">Duration</th>
                <th className="px-2 py-2 text-right">Pages</th>
                <th className="px-2 py-2">IP</th>
                <th className="px-2 py-2">Browser</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((s, i) => (
                <tr key={i} className="border-t border-forest-500/10">
                  <td className="px-3 py-2 max-w-[200px]">
                    <span className="block truncate text-ink" title={s.email}>{s.name || s.email}</span>
                    {s.name && <span className="block text-[11px] text-ink-muted truncate">{s.email}</span>}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-ink-soft">{fmtDT(s.login)}</td>
                  <td className="px-2 py-2 whitespace-nowrap text-ink-soft">{fmtDT(s.lastActive)}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{fmtDur(s.durationMs)}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{s.pages}</td>
                  <td className="px-2 py-2 whitespace-nowrap text-ink-muted text-xs">{s.ip || '—'}</td>
                  <td className="px-2 py-2 text-ink-soft text-xs">{s.browser}</td>
                  <td className="px-2 py-2">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.active ? 'bg-emerald-500/15 text-emerald-800' : 'bg-cream-200 text-ink-muted'}`}>
                      {s.active ? 'Active' : 'Ended'}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && sessions.length === 0 && (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-ink-muted text-sm">
                  No sessions yet — recording starts with the first login after this feature is deployed.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
