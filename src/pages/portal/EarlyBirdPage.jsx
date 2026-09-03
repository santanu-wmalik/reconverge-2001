import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EVENT_CONFIG, EARLY_BIRD_DEADLINE } from '../../data/constants';
import { batchBankAccount } from '../../data/donationCampaigns';
import { pageTransition } from '../../utils/animationVariants';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SectionHeading from '../../components/shared/SectionHeading';

// Protected early-bird detail page. Everything price / bank / procedural
// sits here — the public landing page only teases the offer to push users
// through registration first.

const daysUntil = (target) =>
  Math.max(0, Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

function useCountdown(target) {
  const [tick, setTick] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setTick(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const total = Math.max(0, tick);
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    mins: Math.floor((total / (1000 * 60)) % 60),
    secs: Math.floor((total / 1000) % 60),
    over: total === 0,
  };
}

function CopyChip({ value, label, className = '' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignored */ }
  };
  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy ${label}`}
      className={`ml-2 text-[11px] px-2 py-0.5 rounded border transition ${className || 'border-forest-500/15 text-ink-soft hover:text-ink hover:border-forest-500/40'}`}
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  );
}

function Row({ label, value, mono, copyable }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-forest-500/15 last:border-b-0">
      <span className="text-xs text-ink-soft uppercase tracking-wider">{label}</span>
      <span className={`text-sm text-ink text-right break-all ${mono ? 'font-mono' : ''}`}>
        {value}
        {copyable && <CopyChip value={value} label={label} />}
      </span>
    </div>
  );
}

export default function EarlyBirdPage() {
  const { user } = useAuth();
  const { days, hours, mins, secs, over } = useCountdown(EARLY_BIRD_DEADLINE);

  const familyCount = Math.max(
    0,
    (Number(user?.adults || 1) - 1) +
      Number(user?.childrenUnder10 || 0) +
      Number(user?.children10Plus || 0)
  );
  const selfFee = EVENT_CONFIG.registrationFee;
  const familyFee = familyCount * EVENT_CONFIG.familyMemberFee;
  const totalDue = selfFee + familyFee;
  const alreadyPaid = user?.paymentStatus === 'confirmed' || user?.paymentStatus === 'paid';

  return (
    <motion.div {...pageTransition} className="max-w-4xl mx-auto">
      <SectionHeading
        title="Early Bird Registration"
        subtitle={
          over
            ? 'The early-bird window has closed. Standard registration continues.'
            : 'Full brochure details, your total due, and the batch bank account — all in one place.'
        }
      />

      {/* Countdown banner */}
      {!over ? (
        <GlassCard className="mb-8 border-gold-500/40 bg-gradient-to-br from-gold-500/[0.06] to-gold-500/[0.02]">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold-700 font-semibold mb-2">
              Offer ends 30 September
            </p>
            <p className="text-4xl md:text-5xl font-heading font-bold text-ink">
              ₹{selfFee.toLocaleString('en-IN')}{' '}
              <span className="text-lg font-normal text-ink-soft">/ alumnus</span>
            </p>
            <p className="text-sm text-ink-soft mt-1">
              + ₹{EVENT_CONFIG.familyMemberFee.toLocaleString('en-IN')} per additional family member
            </p>
            <div className="grid grid-cols-4 gap-3 mt-6 max-w-md mx-auto">
              {[
                { v: days, l: 'Days' },
                { v: hours, l: 'Hours' },
                { v: mins, l: 'Min' },
                { v: secs, l: 'Sec' },
              ].map((c) => (
                <div key={c.l} className="rounded-lg bg-white border border-forest-500/15 py-2">
                  <p className="text-2xl md:text-3xl font-heading font-bold text-gold-700">
                    {String(c.v).padStart(2, '0')}
                  </p>
                  <p className="text-[10px] text-ink-soft uppercase tracking-wider mt-0.5">{c.l}</p>
                </div>
              ))}
            </div>
            {alreadyPaid ? (
              <p className="mt-5 text-sm text-emerald-300">
                ✓ Your registration fee is already confirmed. Nothing to do here — see you in December.
              </p>
            ) : (
              <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/payments">
                  <Button size="lg" className="animate-pulse-glow">Pay now via My Payments</Button>
                </Link>
                <Link to="/profile/edit">
                  <Button size="lg" variant="ghost">Update family count first</Button>
                </Link>
              </div>
            )}
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="mb-8 border-forest-500/15">
          <p className="text-ink-soft">
            The early-bird pricing window closed on 30 September. Standard rates apply — see{' '}
            <Link to="/payments" className="text-gold-700 hover:text-gold-300 underline">
              My Payments
            </Link>{' '}
            for current amount and instructions.
          </p>
        </GlassCard>
      )}

      {/* Your amount */}
      <h2 className="text-xl font-heading font-bold text-ink mb-1">Your amount due</h2>
      <p className="text-ink-soft text-sm mb-4">
        Auto-calculated from your profile. If the family count is wrong, fix it in{' '}
        <Link to="/profile/edit" className="text-gold-700 hover:text-gold-300 underline">
          Edit Profile
        </Link>{' '}
        before paying so the Finance Committee reconciles correctly.
      </p>
      <GlassCard className="mb-10">
        <div className="text-sm text-ink-soft space-y-2">
          <div className="flex justify-between">
            <span>Self ({user?.name || 'you'})</span>
            <span className="font-mono">₹{selfFee.toLocaleString('en-IN')}</span>
          </div>
          {familyCount > 0 && (
            <div className="flex justify-between">
              <span>
                Family × {familyCount} @ ₹{EVENT_CONFIG.familyMemberFee.toLocaleString('en-IN')}
              </span>
              <span className="font-mono">₹{familyFee.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-forest-500/15 text-ink font-semibold">
            <span>Total due</span>
            <span className="font-mono text-gold-700 text-lg">
              ₹{totalDue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* What's included */}
      <h2 className="text-xl font-heading font-bold text-ink mb-1">What's included</h2>
      <p className="text-ink-soft text-sm mb-4">
        Straight from the printed brochure. Two days, three lifetimes.
      </p>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <IncludedCard
          badge="Day 1"
          title="Ice-Breaker"
          items={[
            'Registration & welcome',
            'Reunion souvenir kit',
            'Hosted ice-breaker evening',
            'Dinner',
            'Interactive entertainment',
          ]}
        />
        <IncludedCard
          badge="Day 2 · Morning"
          title="Campus Trip"
          items={[
            'Chendamelam welcome',
            'Kathakali artist & photo ops',
            'Batch & department photo zones',
            'Rajpath procession',
            'Traditional Kerala Sadhya',
            'Tea & snacks',
            'Reunion transport hotel ↔ campus',
          ]}
        />
        <IncludedCard
          badge="Day 2 · Night"
          title="The Gala"
          items={[
            'Grand reunion evening',
            'Hosted entertainment',
            'Live music',
            'Dance floor',
            'Photo moments',
            'Gala dinner',
          ]}
        />
        <IncludedCard
          badge="Day 3"
          title="One Last Coffee"
          items={[
            'Check-out',
            'Goodbyes',
            'A few more photos',
            'Promises to not leave it another 25 years',
          ]}
        />
        <IncludedCard
          badge="All 3 days"
          title="The Memories"
          items={[
            'Professional photography',
            'Videography',
            'Curated reunion film',
          ]}
        />
      </div>

      {/* Not included */}
      <GlassCard className="mb-10 border-forest-500/15">
        <h3 className="text-ink font-semibold mb-2">Not included (billed separately)</h3>
        <ul className="space-y-1.5 pl-4 text-sm text-ink-soft">
          <li className="list-disc">
            Hotel accommodation — book directly with Gokulam Grand or your preferred partner hotel
            (see <Link to="/stay" className="text-gold-700 hover:text-gold-300 underline">Stay</Link>).
          </li>
          <li className="list-disc">Travel to Calicut (flights / trains / cabs).</li>
          <li className="list-disc">
            Give Back contribution — separate voluntary channel via NITCAA (see{' '}
            <Link to="/give-back" className="text-gold-700 hover:text-gold-300 underline">
              Give Back
            </Link>
            ).
          </li>
        </ul>
      </GlassCard>

      {/* How to pay */}
      <h2 className="text-xl font-heading font-bold text-ink mb-1">How to pay</h2>
      <p className="text-ink-soft text-sm mb-4">
        Direct bank transfer to the batch account. NEFT / RTGS / IMPS / UPI all work.
      </p>
      <GlassCard className="mb-6 border-gold-500/30 bg-gold-500/[0.03]">
        <Row label="Beneficiary" value={batchBankAccount.beneficiary} />
        <Row label="Account No" value={batchBankAccount.accountNumber} mono copyable />
        <Row label="IFSC" value={batchBankAccount.ifsc} mono copyable />
        <Row label="Bank" value={batchBankAccount.bank} />
        <Row label="Branch" value={`${batchBankAccount.bankBranch} (${batchBankAccount.branchCode})`} />
        <Row label="Address" value={batchBankAccount.branchAddress} />
        <Row label="Supports" value={batchBankAccount.supports.join(' · ')} />
      </GlassCard>
      <p className="text-sm md:text-base text-ink bg-red-100 border border-red-300 rounded-xl px-4 py-3 mb-10">
        <span className="font-semibold text-red-700">Important:</span>{' '}
        {batchBankAccount.paymentReferenceHint}
        {user?.registrationId && (
          <>
            {' '}Yours is <span className="font-mono font-semibold text-emerald-700">{user.registrationId}</span>
            <CopyChip value={user.registrationId} label="Registration ID" className="bg-emerald-500 border-emerald-600 text-white font-semibold hover:bg-emerald-600" />
          </>
        )}
      </p>

      {/* Handoff to My Payments */}
      <GlassCard className="border-forest-500/15">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="text-sm min-w-0">
            <h4 className="text-ink font-semibold mb-1">Next step</h4>
            <p className="text-ink-soft">
              After you transfer, head to <span className="text-gold-700">My Payments</span> and paste
              the transaction reference so the Finance Committee can match it against the bank
              statement.
            </p>
          </div>
          <Link to="/payments" className="shrink-0 w-full sm:w-auto">
            <Button className="w-full sm:w-auto whitespace-nowrap">Go to My Payments →</Button>
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function IncludedCard({ badge, title, items }) {
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="gold" size="sm">{badge}</Badge>
        <h3 className="text-ink font-heading font-semibold">{title}</h3>
      </div>
      <ul className="text-sm text-ink-soft space-y-1 pl-4">
        {items.map((it) => (
          <li key={it} className="list-disc marker:text-gold-700">{it}</li>
        ))}
      </ul>
    </GlassCard>
  );
}
