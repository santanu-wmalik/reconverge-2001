import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';
import { totalDueFor, inr } from '../../components/shared/PaymentNudge';

// Post-registration page. Deliberately framed around the ONE remaining step:
// sign-up is not complete until the payment lands and is verified.
export default function RegistrationSuccess() {
  const { user } = useAuth();
  const due = totalDueFor(user);

  return (
    <motion.div {...pageTransition} className="max-w-lg mx-auto px-4 py-16 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} className="text-6xl mb-6">
        ✍️
      </motion.div>
      <h1 className="text-3xl font-heading font-bold text-ink dark:text-white mb-2">
        You're signed up — one step left
      </h1>
      <p className="text-ink-muted dark:text-slate-400 mb-6">
        Your registration for REConverge 2001 is <b>not complete until payment is received</b>.
      </p>

      <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 mb-8 text-left text-sm text-amber-900">
        ⚠ Complete the bank transfer of <b>{inr(due)}</b> and add your transaction reference on My Payments —
        that's what moves you from <i>Signed Up</i> to <i>Paid &amp; Attending</i>.
      </div>

      <GlassCard hover={false} className="mb-8 text-left">
        <h3 className="text-ink dark:text-white font-heading font-semibold mb-2 text-center">How to finish</h3>
        <ul className="text-sm text-ink-soft dark:text-slate-300 space-y-2">
          <li className="flex gap-2"><span className="text-gold-700 dark:text-gold-400 mt-0.5">1.</span><span>Open <b>My Payments</b> — it shows your exact amount due and the batch bank account (bank transfer; we're working on a UPI ID).</span></li>
          <li className="flex gap-2"><span className="text-gold-700 dark:text-gold-400 mt-0.5">2.</span><span>Transfer {inr(due)} and paste the transaction reference (UTR) back on the same page. Quoting your Registration ID in the remarks helps but isn't mandatory.</span></li>
          <li className="flex gap-2"><span className="text-gold-700 dark:text-gold-400 mt-0.5">3.</span><span>The Finance Committee matches it against the bank statement and flips your status to <b>Paid &amp; Attending</b>.</span></li>
          <li className="flex gap-2"><span className="text-gold-700 dark:text-gold-400 mt-0.5">›</span><span>Accommodation is separate — the Gokulam Grand block is fully booked; see the <b>Stay</b> page for backup hotels and the waitlist.</span></li>
        </ul>
      </GlassCard>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/payments"><Button size="lg">Complete Payment — {inr(due)}</Button></Link>
        <Link to="/profile"><Button variant="outline">View Profile</Button></Link>
      </div>
    </motion.div>
  );
}
