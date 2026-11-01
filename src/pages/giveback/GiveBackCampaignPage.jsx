import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import { publicApi } from '../../services/api';
import { FAQ_DATA } from '../../data/constants';

// Project Cornerstone — PUBLIC Give Back campaign page (main-menu link).
// Faithful port of the fundraising committee's standalone HTML (maroon
// theme): live progress card with KPIs, the room-by-room floor plan, the
// tier-share table, benchmark, tiers, timeline and FAQ. Live figures come
// from /api/public/giveback-summary (aggregates only — no names or
// per-person amounts). The intent-to-give form stays in the portal at /give-back.
//
// Differences from the original HTML (per committee, Oct 2026):
//   · Cornerstone Circle (₹25 L) retired — three tiers + any amount.
//   · ₹1 L+ earns a gift package shipped to the donor's address.
//   · Branch-vs-branch chart and the Give Back FAQ added.

const GOAL = 20000000; // ₹2 Cr
const FUNDS_DUE = new Date('2026-12-01T23:59:59+05:30');

// Original HTML layout, recoloured to the site's forest/gold/cream theme
// (the keys keep their original names; only the values changed).
const C = {
  maroon: '#3f6238', maroonD: '#2a4125', maroonL: '#e9efe6',
  gold: '#b8862b', goldL: '#f6ecd8',
  ink: '#1f1d1b', muted: '#6b6560', line: '#e6e0d8',
  bg: '#faf7f2', card: '#ffffff',
  tKey: '#2a4125', tPillar: '#6f9a63', tFound: '#d9a441', tOther: '#b9b1a6',
};

const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const short = (n) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1).replace(/\.0$/, '')} L`;
  return inr(n);
};
const pct = (a, b) => (b ? Math.min(100, (a / b) * 100) : 0);

const TIERS = [
  {
    id: 'keystone', name: 'Keystone Circle', min: 1000000, seats: 20, color: C.tKey, icon: '🏛️',
    perks: ['Room naming rights', 'Stage felicitation', 'Free Reunion Memento — shipped to you if you cannot attend'],
  },
  {
    id: 'pillar', name: 'Pillar Circle', min: 500000, color: C.tPillar, icon: '🏆',
    perks: ['Name on the donor wall', 'Stage felicitation', 'Free Reunion Memento — shipped to you if you cannot attend'],
  },
  {
    id: 'foundation', name: 'Foundation Circle', min: 200000, color: C.tFound, icon: '🌟',
    perks: ['Name on the donor wall', 'Free Reunion Memento — shipped to you if you cannot attend'],
  },
  {
    // Card only — the aggregate tier table/bar keeps the server's buckets
    // (keystone / pillar / foundation / supporter), so this is excluded there.
    id: 'memento', name: 'Supporter Circle', min: 100000, color: '#a0785a', icon: '🎁', cardOnly: true,
    perks: ['Free Reunion Memento — shipped to you if you cannot attend', 'Every rupee counts toward the ₹2 Cr goal'],
  },
  { id: 'supporter', name: 'Any amount', min: 0, color: C.tOther, icon: '🤝', hidden: true },
];

const GB_FAQS = FAQ_DATA.filter((f) => f.category === 'Give Back');

const Eyebrow = ({ children, light }) => (
  <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: light ? C.goldL : C.maroon }}>
    {children}
  </p>
);

const Card = ({ className = '', style, children }) => (
  <div
    className={`rounded-[14px] border p-6 ${className}`}
    style={{ background: C.card, borderColor: C.line, ...style }}
  >
    {children}
  </div>
);

function PledgeBtn({ children = 'Share intent to give', ghost, light, className = '', to = '/give-back' }) {
  const base = 'inline-block px-6 py-3 rounded-full font-semibold text-[15px] border-2 transition text-center';
  const style = light
    ? ghost
      ? { color: '#fff', borderColor: 'rgba(255,255,255,.6)' }
      : { background: '#fff', color: C.maroon, borderColor: '#fff' }
    : ghost
      ? { color: C.maroon, borderColor: C.maroon }
      : { background: C.maroon, color: '#fff', borderColor: C.maroon };
  return (
    <Link to={to} className={`${base} ${className}`} style={style}>
      {children}
    </Link>
  );
}

function FaqItem({ q, a, highlight }) {
  const [open, setOpen] = useState(Boolean(highlight)); // most-asked opens by default
  return (
    <Card className="!p-0 overflow-hidden" style={highlight ? { borderColor: C.gold, boxShadow: `0 0 0 1px ${C.gold}55`, background: C.goldL } : undefined}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold" style={{ color: open ? C.maroon : C.ink }}>
          {highlight && (
            <span className="inline-block align-middle text-[10px] font-bold uppercase tracking-wide text-white rounded px-1.5 py-0.5 mr-2" style={{ background: C.gold }}>
              Most asked
            </span>
          )}
          {q}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="shrink-0" style={{ color: C.muted }}>▾</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 pt-3 text-sm leading-relaxed border-t" style={{ color: '#4a4a4a', borderColor: C.line }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function GiveBackCampaignPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    publicApi.givebackSummary().then(setData).catch(() => setData(null));
  }, []);

  const pledged = data?.pledged || 0;
  const donors = data?.donors || 0;
  const roomsTaken = Math.min(20, data?.roomsTaken || 0);
  const daysLeft = Math.max(0, Math.ceil((FUNDS_DUE - Date.now()) / 864e5));
  const tiers = data?.tiers || {};

  // Branch leaderboard ranks by PARTICIPATION (donor count), not rupees —
  // amount stays visible as the secondary figure after the count.
  const branches = useMemo(() => {
    const rows = (data?.byBranch || []).slice().sort((a, b) => b.donors - a.donors || b.amount - a.amount);
    const max = Math.max(1, ...rows.map((r) => r.donors));
    return { rows, max };
  }, [data]);

  const serif = { fontFamily: 'Georgia, "Source Serif 4", serif' };

  return (
    <motion.div {...pageTransition} style={{ background: C.bg, color: C.ink }}>
      {/* ───── Hero ───── */}
      <header style={{ background: `linear-gradient(160deg, ${C.maroonD}, ${C.maroon} 60%, #4a7342)`, color: '#fff' }}>
        <div className="max-w-[1120px] mx-auto px-5 pt-28 pb-32">
          <Eyebrow light>REC Calicut · Batch of 2001 · Silver Jubilee</Eyebrow>
          <h1 className="font-bold mt-3 mb-4 text-[clamp(34px,5vw,56px)] leading-[1.15]" style={serif}>
            Project Cornerstone
          </h1>
          <p className="text-[19px] opacity-90 max-w-[640px] mb-7">
            Twenty-five years on, we're funding a 20-room Alumni Guest House on campus,
            built and named by the Class of 2001.
          </p>
          <div className="flex flex-wrap gap-3">
            <PledgeBtn light>Share intent to give</PledgeBtn>
            <a
              href="#tiers"
              className="inline-block px-6 py-3 rounded-full font-semibold text-[15px] border-2 transition hover:bg-white/10"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,.6)' }}
            >
              See giving tiers
            </a>
          </div>
        </div>
      </header>

      {/* ───── Live stats card ───── */}
      <section className="-mt-[88px] relative z-10">
        <div className="max-w-[1120px] mx-auto px-5">
          <Card className="!p-7 shadow-lg">
            <div className="flex flex-wrap justify-between items-baseline gap-3">
              <div>
                <Eyebrow>Campaign progress</Eyebrow>
                <p className="font-bold mt-1 text-[clamp(36px,5vw,52px)] leading-none" style={{ ...serif, color: C.maroon }}>
                  {data ? short(pledged) : '—'}{' '}
                  <span className="text-[0.42em] font-medium" style={{ color: C.muted }}>intents to give · goal ₹2 Cr</span>
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block text-lg md:text-xl font-bold px-4 py-1.5 rounded-full" style={{ background: C.goldL, color: '#7a5a17' }}>
                  {data ? `${pct(pledged, GOAL).toFixed(0)}% of goal` : '…'}
                </span>
                <p className="text-[15px] mt-1.5" style={{ color: C.muted }}>
                  {data?.updatedAt
                    ? `Updated ${new Date(data.updatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`
                    : 'Loading…'}
                </p>
              </div>
            </div>

            <div className="relative h-[22px] rounded-full overflow-hidden mt-4 mb-2" style={{ background: '#efe9e1' }} aria-label="Fundraising progress">
              <span
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                style={{ width: `${pct(pledged, GOAL)}%`, background: C.maroon }}
              />
            </div>
            <div className="flex justify-between text-xs" style={{ color: C.muted }}>
              <span>₹0</span><span>₹50 L</span><span>₹1 Cr</span><span>₹1.5 Cr</span><span>₹2 Cr</span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] mt-2.5" style={{ color: C.muted }}>
              <span><i className="inline-block w-3 h-3 rounded-[3px] mr-1.5 align-[-1px]" style={{ background: C.maroon }} />Intents to give <b>{data ? short(pledged) : '—'}</b></span>
              <span><i className="inline-block w-3 h-3 rounded-[3px] mr-1.5 align-[-1px] border" style={{ background: '#efe9e1', borderColor: '#ddd' }} />Remaining <b>{data ? short(Math.max(0, GOAL - pledged)) : '—'}</b></span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5">
              {[
                [data ? donors : '—', 'batchmates have shared intents'],
                [data ? short(Math.max(0, GOAL - pledged)) : '—', 'still to raise'],
                [data ? roomsTaken : '—', 'of 20 rooms named'],
                [daysLeft > 0 ? daysLeft : 'Closed', 'days until funds are due (Dec 1)'],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl px-4 py-4" style={{ background: C.bg }}>
                  <b className="block text-[26px]" style={serif}>{v}</b>
                  <span className="text-[13px]" style={{ color: C.muted }}>{l}</span>
                </div>
              ))}
            </div>

            {/* Tier share (left) + branch leaderboard (right) */}
            <div className="grid lg:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-xl font-bold" style={serif}>Where the money comes from</h3>
                <p className="text-[13px] mb-4" style={{ color: C.muted }}>Share of total intents to give, by tier.</p>
                <div className="flex h-[34px] rounded-lg overflow-hidden" style={{ background: '#efe9e1' }}>
                  {TIERS.filter((t) => !t.cardOnly).map((t) => (
                    <div
                      key={t.id}
                      title={`${t.name}: ${short(tiers[t.id]?.amount || 0)}`}
                      className="h-full transition-all duration-1000"
                      style={{ background: t.color, width: `${pct(tiers[t.id]?.amount || 0, pledged || 1)}%` }}
                    />
                  ))}
                </div>
                <table className="w-full border-collapse mt-4 text-sm">
                  <thead>
                    <tr className="text-xs font-semibold" style={{ color: C.muted }}>
                      <th className="text-left py-1.5 px-1 border-b" style={{ borderColor: C.line }}>Tier</th>
                      <th className="text-right py-1.5 px-1 border-b" style={{ borderColor: C.line }}>Donors</th>
                      <th className="text-right py-1.5 px-1 border-b" style={{ borderColor: C.line }}>Amount</th>
                      <th className="text-right py-1.5 px-1 border-b" style={{ borderColor: C.line }}>Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TIERS.filter((t) => !t.cardOnly).map((t) => {
                      const r = tiers[t.id] || { count: 0, amount: 0 };
                      return (
                        <tr key={t.id}>
                          <td className="py-2 px-1 border-b" style={{ borderColor: C.line }}>
                            {/* One badge: the tier icon on its bar color. */}
                            <span
                              className="inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 text-[12px] align-middle"
                              style={{ background: t.color }}
                              aria-hidden="true"
                            >{t.icon}</span>
                            {t.id === 'supporter' ? 'Any amount (< ₹2 L)' : <>{t.name} <span className="text-xs" style={{ color: C.muted }}>{short(t.min)}+</span></>}
                          </td>
                          <td className="py-2 px-1 border-b text-right tabular-nums" style={{ borderColor: C.line }}>{r.count}</td>
                          <td className="py-2 px-1 border-b text-right tabular-nums" style={{ borderColor: C.line }}>{short(r.amount)}</td>
                          <td className="py-2 px-1 border-b text-right tabular-nums" style={{ borderColor: C.line }}>{pct(r.amount, pledged || 1).toFixed(0)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="text-xs mt-3.5" style={{ color: C.muted }}>
                  Figures are aggregates only. No individual names or amounts are shown here.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold" style={serif}>How is your branch doing?</h3>
                <p className="text-[13px] mb-4" style={{ color: C.muted }}>Batchmates with an intent to give, per branch.</p>
                {branches.rows.length === 0 ? (
                  <p className="text-sm py-3" style={{ color: C.muted }}>Live branch totals will appear here as intents come in.</p>
                ) : (
                  <div className="space-y-3">
                    {branches.rows.map((b, i) => {
                      const lead = i === 0 && b.donors > 0;
                      return (
                        <div key={b.branch} className={`grid grid-cols-[72px_1fr_auto] items-center gap-3 ${lead ? 'font-bold' : ''}`}>
                          <span className="text-sm">{lead ? '🏆 ' : ''}{b.branch.replace('.', '')}</span>
                          <div className="h-3.5 rounded-full overflow-hidden" style={{ background: '#efe9e1' }}>
                            <div
                              className="h-full rounded-full transition-all duration-1000"
                              style={{ width: `${pct(b.donors, branches.max)}%`, background: lead ? C.gold : C.maroon }}
                            />
                          </div>
                          <span className="text-sm text-right tabular-nums whitespace-nowrap">
                            {b.donors > 0 ? b.donors : '—'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ───── Vision + approval ───── */}
      <section className="py-16">
        <div className="max-w-[1120px] mx-auto px-5 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow>The vision</Eyebrow>
            <h2 className="mt-2.5 mb-3.5 text-[clamp(28px,3.5vw,40px)] font-bold leading-[1.15]" style={serif}>
              Proper lodging on campus, with our name over the door.
            </h2>
            <p className="text-lg max-w-[680px]" style={{ color: C.muted }}>
              A 20-room guest house for placement reps, alumni, visiting families and guest
              faculty, steps from where we once lived. On reaching the ₹2 Cr goal, the building
              carries the Class of 2001's name, permanently.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {[['25', 'years since graduation'], ['₹2 Cr', 'batch-funded goal'], ['20', 'rooms']].map(([v, l]) => (
                <div key={l} className="pl-3" style={{ borderLeft: `3px solid ${C.gold}` }}>
                  <b className="block text-[28px]" style={serif}>{v}</b>
                  <span className="text-[13px]" style={{ color: C.muted }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <Card>
            <span className="inline-flex items-center gap-2 font-semibold text-[13px] px-3 py-1 rounded-full" style={{ color: '#2f6b3a', background: '#e6f2e8' }}>
              ✓ Approved by the Institute
            </span>
            <p className="text-sm mt-3.5 leading-relaxed">
              NIT Calicut has granted permission to develop and construct the Alumni Guest House
              on campus as a Silver Jubilee legacy initiative. Terms for execution, fund
              management, handover and maintenance will be set in an MoU between NIT Calicut and
              NITCAA before civil works begin.
            </p>
            <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-1.5 text-sm mt-4">
              <dt style={{ color: C.muted }}>Issued by</dt><dd>Prof. Prasad Krishna, Director</dd>
              <dt style={{ color: C.muted }}>Reference</dt><dd>NITC/Directorate/58/26-27</dd>
              <dt style={{ color: C.muted }}>Date</dt><dd>16 September 2026</dd>
            </dl>
          </Card>
        </div>
      </section>

      {/* ───── Why ───── */}
      <section className="pb-16">
        <div className="max-w-[1120px] mx-auto px-5">
          <Eyebrow>Why it matters</Eyebrow>
          <h2 className="mt-2.5 text-[clamp(28px,3.5vw,40px)] font-bold" style={serif}>Three reasons to build now</h2>
          <div className="grid md:grid-cols-3 gap-4.5 mt-7" style={{ gap: '18px' }}>
            {[
              ['A campus need', 'The existing guest house is decades old and too small. Visitors, alumni, parents and guest faculty are often turned away, and government funding rarely covers non-academic infrastructure.'],
              ['A legacy that lasts', 'A guest house alumni actually stay in keeps the Class of 2001 present on campus for decades. Room revenue helps fund upkeep.'],
              ['A batch, still building', 'This is something we can only do together, one gift at a time, at any tier.'],
            ].map(([t, p], i) => (
              <Card key={t}>
                <div className="w-[34px] h-[34px] rounded-full font-bold flex items-center justify-center mb-3" style={{ background: C.maroonL, color: C.maroon }}>{i + 1}</div>
                <h3 className="text-xl font-bold mb-2" style={serif}>{t}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: C.muted }}>{p}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Tiers ───── */}
      <section id="tiers" className="pb-16 scroll-mt-24">
        <div className="max-w-[1120px] mx-auto px-5">
          <Eyebrow>The ask</Eyebrow>
          <h2 className="mt-2.5 text-[clamp(28px,3.5vw,40px)] font-bold" style={serif}>Give at a tier, or pick your own amount</h2>
          <p className="text-lg mt-2.5 max-w-[680px]" style={{ color: C.muted }}>
            Not everyone can give the same amount. A few of us can give a lot, most land in the
            middle, and every contribution counts toward the goal.
          </p>

          {/* ≥ ₹1 L gift package */}
          <div className="mt-6 flex items-start gap-4 rounded-xl px-5 py-4" style={{ background: C.goldL, border: `1px solid ${C.gold}55` }}>
            <span className="text-3xl leading-none mt-0.5">🎁</span>
            <p className="text-[15px] leading-relaxed">
              <b>Give ₹1,00,000 or more and can't make it to the reunion? A free Reunion
              Memento ships to your address</b> — anywhere in the world. The memento is shipped
              only to batchmates who aren't attending in person: the reunion comes to you. Our
              thank-you for anchoring the campaign.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
            {TIERS.filter((t) => !t.hidden).map((t) => {
              const left = t.seats ? Math.max(0, t.seats - roomsTaken) : null;
              return (
                <Card key={t.id} className="flex flex-col" style={{ borderTop: `5px solid ${t.color}` }}>
                  <p className="text-[12px] font-bold uppercase tracking-[0.12em]" style={{ color: t.color }}>
                    <span className="text-xl mr-1.5 align-middle" aria-hidden="true">{t.icon}</span>{t.name}
                  </p>
                  <p className="font-bold text-[28px] my-2" style={serif}>{inr(t.min)}</p>
                  <p className="text-xs font-semibold mb-3 min-h-[16px]" style={{ color: C.maroon }}>
                    {t.seats ? (left > 0 ? `${left} of ${t.seats} rooms left · first come, first served` : 'All rooms taken') : ''}
                  </p>
                  <ul className="list-disc pl-[18px] mb-4 text-sm flex-1 space-y-1" style={{ color: C.muted }}>
                    {t.perks.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                  <PledgeBtn className="!py-2.5 w-full">Give {short(t.min)}</PledgeBtn>
                </Card>
              );
            })}
          </div>

          <div className="mt-4.5 rounded-xl px-5 py-4 text-[15px]" style={{ background: C.goldL, marginTop: '18px' }}>
            <b>Any amount helps.</b> Contributions below ₹2 L are welcome and count toward the
            goal. Funds raised beyond ₹2 Cr will set up a scholarship/fellowship for students in
            need, in coordination with NITCAA.
          </div>
        </div>
      </section>

      {/* ───── Timeline ───── */}
      <section className="pb-16">
        <div className="max-w-[1120px] mx-auto px-5">
          <Eyebrow>Timeline</Eyebrow>
          <h2 className="mt-2.5 text-[clamp(28px,3.5vw,40px)] font-bold" style={serif}>From today to ribbon-cutting</h2>
          <div className="grid md:grid-cols-5 gap-5 mt-8">
            {[
              ['2026-09-16', 'Now', 'Fundraising open', 'Intents to give and contributions from batchmates across all tiers.'],
              ['2026-12-01', 'Dec 1, 2026', 'All funds in', 'Campaign closes. Every intent to give converted to a contribution.'],
              ['2026-12-27', 'Dec 27, 2026', 'Foundation stone', 'At REConverge 2001: cheque handover, donors felicitated, stone laid.'],
              ['2027-03-01', 'Mar 2027', 'Construction starts', 'Civil works begin on campus.'],
              ['2028-01-01', '2028', 'Inauguration', "The guest house opens, carrying the Class of 2001's name."],
            ].map(([date, when, title, desc]) => {
              const done = new Date(date) <= new Date();
              return (
                <div key={title} className="relative pl-6 md:pl-0 md:pt-7 border-l-2 md:border-l-0 md:border-t-2" style={{ borderColor: C.line }}>
                  <span
                    className="absolute -left-[9px] top-0 md:left-0 md:-top-[9px] w-4 h-4 rounded-full"
                    style={done ? { background: C.maroon, border: `3px solid ${C.maroon}` } : { background: '#fff', border: `3px solid ${C.line}` }}
                  />
                  <b className="block text-[12px] uppercase tracking-[0.08em]" style={{ color: C.maroon }}>{when}</b>
                  <h4 className="font-semibold my-1">{title}</h4>
                  <p className="text-sm" style={{ color: C.muted }}>{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── How to contribute ───── */}
      <section className="pb-16">
        <div className="max-w-[1120px] mx-auto px-5">
          <Eyebrow>How to contribute</Eyebrow>
          <div className="grid md:grid-cols-3 mt-5" style={{ gap: '18px' }}>
            {[
              ['Share your intent', <>Sign in and fill the <Link to="/give-back" className="underline" style={{ color: C.maroon }}>intent-to-give form</Link> so your gift counts toward the goal. It's non-binding.</>],
              ['Volunteer', <>Join the fundraising committee and call your friends. We need all hands. <a href="mailto:asifetv@gmail.com,dheeraj.buduru@gmail.com?subject=Project%20Cornerstone%20-%20Volunteer" className="underline" style={{ color: C.maroon }}>Sign up by email</a>.</>],
              ['Give', <>Fund transfer details will be shared with everyone who shares an intent to give. All funds are due by <b>December 1, 2026</b>.</>],
            ].map(([t, p], i) => (
              <Card key={t}>
                <div className="w-[34px] h-[34px] rounded-full font-bold flex items-center justify-center mb-3" style={{ background: C.maroonL, color: C.maroon }}>{i + 1}</div>
                <h3 className="text-xl font-bold mb-2" style={serif}>{t}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: C.muted }}>{p}</p>
              </Card>
            ))}
          </div>
          <p className="text-[13px] mt-4.5" style={{ color: C.muted, marginTop: '18px' }}>
            Eligible for tax exemption under Section 80G. Check whether your employer matches
            donations (Benevity and similar). Alumni outside India may also have tax benefits;
            consult your tax advisor.
          </p>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="pb-16">
        <div className="max-w-[860px] mx-auto px-5">
          <div className="text-center mb-6">
            <Eyebrow>Questions, answered</Eyebrow>
            <h2 className="mt-2.5 text-[clamp(28px,3.5vw,40px)] font-bold" style={serif}>Give Back FAQ</h2>
          </div>
          <div className="space-y-3">
            {GB_FAQS.map((f) => <FaqItem key={f.id} q={f.question} a={f.answer} highlight={f.highlight} />)}
          </div>
        </div>
      </section>

      {/* ───── Final CTA ───── */}
      <section className="pb-16">
        <div className="max-w-[1120px] mx-auto px-5">
          <div className="rounded-[20px] text-center px-6 py-14" style={{ background: C.maroon, color: '#fff' }}>
            <h2 className="text-[clamp(28px,4vw,40px)] font-bold" style={serif}>Twenty-five years ago, this campus was home.</h2>
            <p className="opacity-85 mt-2 mb-7">This is our chance to leave our legacy.</p>
            <PledgeBtn light>Share your intent to give</PledgeBtn>
            <p className="text-[13px] mt-5" style={{ color: 'rgba(255,255,255,.75)' }}>
              Questions?{' '}
              <a href="mailto:asifetv@gmail.com" className="underline text-white">asifetv@gmail.com</a> ·{' '}
              <a href="mailto:dheeraj.buduru@gmail.com" className="underline text-white">dheeraj.buduru@gmail.com</a>
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
