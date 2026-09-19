import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { pledgeApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { pageTransition } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import SectionHeading from '../../components/shared/SectionHeading';

// Project Cornerstone — pledge review for admins holding the `giveback`
// permission (route + API both enforce it). Shows who pledged what and when,
// including anonymous pledges (anonymity is for PUBLIC surfaces only; the
// committee needs the identity for payment follow-up).

const GOAL = 20000000; // ₹2 Cr
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const TIER_ORDER = ['Cornerstone Circle', 'Keystone Circle', 'Pillar Circle', 'Foundation Circle', 'Custom'];

const fmtDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
      })
    : '—';

export default function AdminPledgesPage() {
  const { showToast } = useToast();
  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [tier, setTier] = useState('');

  useEffect(() => {
    pledgeApi.all()
      .then((list) => setPledges(Array.isArray(list) ? list : []))
      .catch((err) => showToast(err.message || 'Failed to load pledges', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return pledges
      .filter((p) => !tier || p.tier === tier)
      .filter((p) => !needle ||
        [p.name, p.email, p.branch, p.location, p.companyName, p.message]
          .some((v) => String(v || '').toLowerCase().includes(needle)));
  }, [pledges, q, tier]);

  const stats = useMemo(() => {
    const total = pledges.reduce((n, p) => n + (Number(p.amount) || 0), 0);
    const byTier = Object.fromEntries(TIER_ORDER.map((t) => [t, pledges.filter((p) => p.tier === t).length]));
    return { total, count: pledges.length, byTier, pct: Math.min(100, Math.round((total / GOAL) * 100)) };
  }, [pledges]);

  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="Give Back Pledges"
        subtitle="Project Cornerstone — who pledged what, and when. Anonymous pledges are visible here for payment follow-up but must never be published."
      />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <GlassCard padding="p-4" hover={false}>
          <p className="text-[11px] uppercase tracking-wider text-ink-soft">Total pledged</p>
          <p className="text-2xl font-heading font-bold text-gold-700">{inr(stats.total)}</p>
          <p className="text-[11px] text-ink-muted mt-0.5">{stats.pct}% of the ₹2 Cr goal</p>
        </GlassCard>
        <GlassCard padding="p-4" hover={false}>
          <p className="text-[11px] uppercase tracking-wider text-ink-soft">Pledges</p>
          <p className="text-2xl font-heading font-bold text-ink">{stats.count}</p>
        </GlassCard>
        <GlassCard padding="p-4" hover={false}>
          <p className="text-[11px] uppercase tracking-wider text-ink-soft">Cornerstone / Keystone</p>
          <p className="text-2xl font-heading font-bold text-ink">
            {stats.byTier['Cornerstone Circle']}<span className="text-ink-muted text-base">/2</span>
            {' · '}
            {stats.byTier['Keystone Circle']}<span className="text-ink-muted text-base">/20</span>
          </p>
        </GlassCard>
        <GlassCard padding="p-4" hover={false}>
          <p className="text-[11px] uppercase tracking-wider text-ink-soft">Pillar / Foundation / Custom</p>
          <p className="text-2xl font-heading font-bold text-ink">
            {stats.byTier['Pillar Circle']} · {stats.byTier['Foundation Circle']} · {stats.byTier['Custom']}
          </p>
        </GlassCard>
      </div>

      {/* Filters */}
      <div className="grid gap-3 md:grid-cols-[1fr_auto] mb-5">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, branch, company, note…"
        />
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          aria-label="Tier filter"
          className="bg-white border border-forest-500/15 rounded-xl px-3 py-2.5 text-sm text-ink outline-none focus:border-forest-500/40"
        >
          <option value="">All tiers</option>
          {TIER_ORDER.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <GlassCard hover={false} padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest-500/15 text-left">
                {['Alumnus', 'Tier', 'Amount', 'Flags', 'Note', 'Pledged at', 'Updated'].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-wider text-ink-soft whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-ink-muted">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-ink-muted">No pledges match.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-b border-forest-500/15 last:border-b-0 hover:bg-forest-600/5 align-top">
                  <td className="px-4 py-3">
                    <p className="text-ink font-medium leading-tight">{p.name || '—'}</p>
                    <p className="text-xs text-ink-muted break-all">{p.email}</p>
                    <p className="text-xs text-ink-muted">{[p.branch, p.location].filter(Boolean).join(' · ')}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft whitespace-nowrap">{p.tier}</td>
                  <td className="px-4 py-3 font-mono text-ink whitespace-nowrap">{inr(p.amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.anonymous && <Badge variant="warning" size="sm">Anonymous</Badge>}
                      {p.companyMatch && <Badge variant="gold" size="sm" title={p.companyName || ''}>Match{p.companyName ? `: ${p.companyName}` : ''}</Badge>}
                      {p.taxInterest && <Badge size="sm">Tax info</Badge>}
                      {p.volunteerInterest && <Badge variant="success" size="sm">Volunteer</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-soft max-w-[220px]">{p.message || '—'}</td>
                  <td className="px-4 py-3 text-xs text-ink-soft whitespace-nowrap">{fmtDateTime(p.createdAt)}</td>
                  <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">
                    {p.updatedAt && p.updatedAt !== p.createdAt ? fmtDateTime(p.updatedAt) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
