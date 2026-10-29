import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicApi } from '../../../services/api';

// Give Back — Project Cornerstone teaser. The pledge form itself lives in
// the portal (/give-back, login required) so every pledge is saved against
// the signed-in alumnus. Live progress comes from the public PII-free
// aggregate endpoint (fails silently — the section still renders without it).

const GOAL = 20000000; // ₹2 Cr
const short = (n) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1).replace(/\.0$/, '')} L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
};

// Segment colors for the by-branch contributor bar — forest/gold family so
// it sits quietly under the main progress bar.
const BRANCH_COLORS = ['#2a4125', '#4a7342', '#6f9a63', '#b8862b', '#d9a441', '#8a9a5b', '#5b7553', '#b9b1a6'];

export default function GiveBackPreview() {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    publicApi.givebackSummary().then(setSummary).catch(() => {});
  }, []);
  const pledged = summary?.pledged || 0;
  const pct = Math.min(100, (pledged / GOAL) * 100);
  const donors = summary?.donors || 0;
  // Branches sorted by contribution count; the ones with contributions drive
  // the stacked bar, zero-count branches still show (muted) in the legend.
  const branchRows = (summary?.byBranch || []).slice().sort((a, b) => b.donors - a.donors || b.amount - a.amount);
  const activeBranches = branchRows.filter((b) => b.donors > 0);

  return (
    <section id="giving" className="scroll-mt-24 py-10 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <span className="eyebrow">Project Cornerstone · Legacy</span>
        <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-heading font-medium italic text-forest-600">
          Give Back
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-white border border-gold-500/40 shadow-sm px-6 sm:px-10 py-10"
        >
          <p className="font-heading text-2xl md:text-3xl italic text-forest-700 mb-2">
            The Alumni Guest House
          </p>
          <p className="font-serif text-ink-muted max-w-xl mx-auto">
            Twenty-five years since we walked in as strangers. Let's give the Class of 2001 a
            place to walk back into.
          </p>

          {/* Stats — spread across the full card width on larger screens,
              wrap gracefully on phones. */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 mt-8 max-w-3xl mx-auto">
            {[
              { num: '₹2 Cr', label: 'Campaign goal' },
              { num: summary ? short(pledged) : '—', label: 'Intents to give so far' },
              { num: '20', label: 'Rooms funded' },
              { num: 'Dec 1', label: 'Intents due by' },
            ].map((g) => (
              <div key={g.label} className="text-center">
                <p className="font-heading text-2xl md:text-3xl text-gold-600">{g.num}</p>
                <p className="nav-caps text-ink-muted mt-1">{g.label}</p>
              </div>
            ))}
          </div>

          {/* Live progress bar */}
          <div className="mt-8 text-left">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <p className="text-sm text-ink-soft">
                <span className="font-heading text-xl text-forest-700">{summary ? short(pledged) : '—'}</span>
                {' '}in intents to give of ₹2 Cr
              </p>
              {summary && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-700">
                  {pct.toFixed(0)}% of goal
                </span>
              )}
            </div>
            <div className="relative h-6 sm:h-8 rounded-full bg-cream-200 overflow-hidden" aria-label="Fundraising progress">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-forest-700 to-forest-500 transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs text-ink-muted mt-1.5">
              <span>₹0</span><span>₹50 L</span><span>₹1 Cr</span><span>₹1.5 Cr</span><span>₹2 Cr</span>
            </div>
          </div>

          {/* Second scale — how many have contributed, split by branch */}
          <div className="mt-7 text-left">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
              <p className="text-sm text-ink-soft">
                <span className="font-heading text-xl text-forest-700">{summary ? donors : '—'}</span>
                {' '}batchmates have shared an intent to give
              </p>
              {summary && activeBranches.length > 0 && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-500/10 text-forest-700">
                  {activeBranches.length} branch{activeBranches.length === 1 ? '' : 'es'} in
                </span>
              )}
            </div>
            <div className="relative h-6 sm:h-8 rounded-full bg-cream-200 overflow-hidden flex" aria-label="Contributions by branch">
              {activeBranches.map((b, i) => (
                <span
                  key={b.branch}
                  title={`${b.branch.replace('.', '')} — ${b.donors} intent${b.donors === 1 ? '' : 's'}`}
                  className="h-full transition-all duration-1000"
                  style={{
                    width: `${donors ? (b.donors / donors) * 100 : 0}%`,
                    background: BRANCH_COLORS[i % BRANCH_COLORS.length],
                  }}
                />
              ))}
            </div>
            {/* Branch labels centred under their own segment of the bar */}
            <div className="flex text-[10px] sm:text-xs text-ink-muted mt-1.5">
              {activeBranches.map((b, i) => {
                const w = donors ? (b.donors / donors) * 100 : 0;
                return (
                  <span
                    key={b.branch}
                    className="text-center overflow-hidden whitespace-nowrap"
                    style={{ width: `${w}%` }}
                    title={`${b.branch.replace('.', '')} — ${b.donors}`}
                  >
                    {w >= 7 ? <>{b.branch.replace('.', '')} <b>({b.donors})</b></> : w >= 4 ? b.branch.replace('.', '') : ''}
                  </span>
                );
              })}
            </div>
          </div>

          {/* CTA — bottom of the card */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/give-back"
              className="nav-caps inline-block px-8 py-3.5 bg-gradient-to-b from-gold-400 to-gold-600 text-forest-900 shadow hover:from-gold-300 hover:to-gold-500"
            >
              Share your intent to give →
            </Link>
            <Link
              to="/project-cornerstone"
              className="nav-caps inline-block px-8 py-3.5 border-2 border-forest-500/30 text-forest-700 hover:bg-forest-500/5"
            >
              Learn more
            </Link>
          </div>
          <p className="text-xs text-ink-muted mt-3">Sign in required — your intent to give is saved to your profile.</p>
        </motion.div>
      </div>
    </section>
  );
}
