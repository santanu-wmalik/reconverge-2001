import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EVENT_CONFIG } from '../../data/constants';
import { pledgeApi } from '../../services/api';

// Shared payment-completion helpers + the persistent portal banner.
//
// Tiers (mirrors the 3-tier language used everywhere else):
//   paid      → payment verified, show nothing
//   pending   → reference submitted, verification in progress (calm note)
//   unpaid    → signed up but not paid: registration is NOT complete (amber)

export function paymentTierOf(user) {
  if (!user?.isRegistered) return null;
  // Give-back-only supporters are their own category — never nudged to pay.
  if (user.participation === 'giveback-only') return 'giveback';
  const s = user.paymentStatus;
  if (s === 'paid' || s === 'confirmed') return 'paid';
  if (s === 'pending-verification' || user.paymentUid) return 'pending';
  return 'unpaid';
}

export function totalDueFor(user) {
  // Already paid → what was actually received (or the fee locked at
  // sign-up), not today's rate.
  if (user?.paymentStatus === 'confirmed' || user?.paymentStatus === 'paid') {
    const actual = Number(user?.paymentAmount) || Number(user?.registrationFee);
    if (actual > 0) return actual;
  }
  const family = Math.max(
    0,
    (Number(user?.adults || 1) - 1) +
      Number(user?.childrenUnder10 || 0) +
      Number(user?.children10Plus || 0)
  );
  return EVENT_CONFIG.registrationFee + family * EVENT_CONFIG.familyMemberFee;
}

export const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

// Slim strip under the portal binder tabs. Rendered on every My Portal page
// for a signed-in, registered, not-yet-verified user.
// Shared hook: does the signed-in user have a pledge on file? null = loading.
export function useMyPledge(enabled) {
  const [pledge, setPledge] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    pledgeApi.mine()
      .then(({ pledge: p }) => setPledge(p || null))
      .catch(() => setPledge(null))
      .finally(() => setLoaded(true));
  }, [enabled]);
  return { pledge, loaded };
}

export default function PaymentNudgeBanner() {
  const { user } = useAuth();
  const tier = paymentTierOf(user);
  const { pledge, loaded } = useMyPledge(tier === 'giveback');
  if (!tier || tier === 'paid') return null;

  // Give Back supporter: remind about the pledge instead of payment.
  if (tier === 'giveback') {
    if (!loaded || pledge) return null; // quiet once pledged
    return (
      <div className="bg-[#fbf7ea] border-b border-gold-500/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-sm text-ink">
          <span>🏛️ You're here for <b>Give Back</b> — share your Project Cornerstone intent to give to complete your part.</span>
          <Link to="/give-back" className="nav-caps shrink-0 px-3 py-1.5 rounded-md bg-gold-500 text-white hover:bg-gold-600 shadow-sm">
            Share your intent →
          </Link>
        </div>
      </div>
    );
  }

  if (tier === 'pending') {
    return (
      <div className="bg-sky-50 border-b border-sky-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-sm text-sky-900">
          <span>⏳ Payment reference received — the Finance Committee is verifying it. No action needed.</span>
          <Link to="/payments" className="nav-caps text-sky-800 hover:text-sky-950 underline underline-offset-4">Check status →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-sm text-amber-900">
        <span>
          ⚠ <b>Your sign-up is incomplete</b> until payment is received — transfer {inr(totalDueFor(user))} and add your
          payment reference.
        </span>
        <Link
          to="/payments"
          className="nav-caps shrink-0 px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
        >
          Pay {inr(totalDueFor(user))} →
        </Link>
      </div>
    </div>
  );
}

// 3-step registration tracker (Signed Up → Payment → Verified) for the
// profile dashboard.
export function RegistrationTracker() {
  const { user } = useAuth();
  const tier = paymentTierOf(user);
  const { pledge, loaded } = useMyPledge(tier === 'giveback');
  if (!tier) return null;

  if (tier === 'giveback') {
    return (
      <div className="rounded-2xl border border-gold-500/40 bg-[#fbf7ea] p-5 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="nav-caps text-gold-700">Give Back Supporter</p>
          <p className="text-sm text-ink-soft mt-1">
            {pledge
              ? `Intent to give on file: ${pledge.tier === 'Custom' ? '' : pledge.tier + ' — '}₹${Number(pledge.amount || 0).toLocaleString('en-IN')}. Thank you!`
              : 'No registration fee for you — your one step is the Project Cornerstone intent to give.'}
          </p>
        </div>
        {loaded && !pledge && (
          <Link to="/give-back" className="nav-caps px-3 py-1.5 rounded-md bg-gold-500 text-white hover:bg-gold-600 shadow-sm">
            Share your intent →
          </Link>
        )}
      </div>
    );
  }

  const steps = [
    { label: 'Signed Up', done: true },
    { label: 'Payment', done: tier !== 'unpaid', current: tier === 'unpaid' },
    { label: 'Verified', done: tier === 'paid', current: tier === 'pending' },
  ];

  return (
    <div className="rounded-2xl border border-forest-500/15 bg-white p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="nav-caps text-forest-700">Registration status</p>
        {tier === 'paid' ? (
          <span className="text-sm text-emerald-700 font-semibold">✓ Complete — see you in December!</span>
        ) : tier === 'pending' ? (
          <span className="text-sm text-sky-800">Verification in progress</span>
        ) : (
          <Link to="/payments" className="nav-caps px-3 py-1.5 rounded-md bg-amber-500 text-white hover:bg-amber-600 shadow-sm">
            Complete payment — {inr(totalDueFor(user))} →
          </Link>
        )}
      </div>
      <ol className="flex items-center gap-2">
        {steps.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2 flex-1 min-w-0 last:flex-none">
            <span
              className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                s.done
                  ? 'bg-emerald-500 border-emerald-600 text-white'
                  : s.current
                    ? 'bg-amber-100 border-amber-400 text-amber-800 animate-pulse'
                    : 'bg-cream-200 border-forest-500/20 text-ink-muted'
              }`}
            >
              {s.done ? '✓' : i + 1}
            </span>
            <span className={`text-xs sm:text-sm whitespace-nowrap ${s.done ? 'text-ink' : s.current ? 'text-amber-800 font-semibold' : 'text-ink-muted'}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && <span className={`h-px flex-1 ${s.done ? 'bg-emerald-400' : 'bg-forest-500/15'}`} />}
          </li>
        ))}
      </ol>
      {tier === 'unpaid' && (
        <p className="text-xs text-ink-muted mt-3">
          Bank transfer to the batch account, then paste your transaction reference on My Payments so the Finance
          Committee can verify it. Quoting your Registration ID in the remarks helps but isn't mandatory.
        </p>
      )}
    </div>
  );
}
