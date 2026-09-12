import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EVENT_CONFIG } from '../../data/constants';

// Shared payment-completion helpers + the persistent portal banner.
//
// Tiers (mirrors the 3-tier language used everywhere else):
//   paid      → payment verified, show nothing
//   pending   → reference submitted, verification in progress (calm note)
//   unpaid    → signed up but not paid: registration is NOT complete (amber)

export function paymentTierOf(user) {
  if (!user?.isRegistered) return null;
  const s = user.paymentStatus;
  if (s === 'paid' || s === 'confirmed') return 'paid';
  if (s === 'pending-verification' || user.paymentUid) return 'pending';
  return 'unpaid';
}

export function totalDueFor(user) {
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
export default function PaymentNudgeBanner() {
  const { user } = useAuth();
  const tier = paymentTierOf(user);
  if (!tier || tier === 'paid') return null;

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
  if (!tier) return null;

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
