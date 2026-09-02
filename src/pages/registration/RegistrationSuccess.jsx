import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';

export default function RegistrationSuccess() {
  return (
    <motion.div {...pageTransition} className="max-w-lg mx-auto px-4 py-16 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} className="text-6xl mb-6">
        🎉
      </motion.div>
      <h1 className="text-3xl font-heading font-bold text-ink dark:text-white mb-2">Registration Successful!</h1>
      <p className="text-ink-muted dark:text-slate-400 mb-8">Welcome to REConverge 2001 — Silver Jubilee Alumni Meet 2026</p>

      <GlassCard hover={false} className="mb-8 text-left">
        <h3 className="text-ink dark:text-white font-heading font-semibold mb-2 text-center">What happens next</h3>
        <ul className="text-sm text-ink-soft dark:text-slate-300 space-y-2">
          <li className="flex gap-2"><span className="text-gold-700 dark:text-gold-400 mt-0.5">›</span><span>Your profile is live — head to <b>My Profile</b> to update any field at any time.</span></li>
          <li className="flex gap-2"><span className="text-gold-700 dark:text-gold-400 mt-0.5">›</span><span>Registration payment goes via bank transfer / SWIFT (not on the site). Paste the Payment UID onto your profile once you've paid; the Finance Committee verifies and flips your status to <b>Paid</b>.</span></li>
          <li className="flex gap-2"><span className="text-gold-700 dark:text-gold-400 mt-0.5">›</span><span>Accommodation is booked separately with Gokulam Grand via the AFC. See the <b>Stay</b> page for room types, rates and the booking contact.</span></li>
          <li className="flex gap-2"><span className="text-gold-700 dark:text-gold-400 mt-0.5">›</span><span>Giving Back contributions are separate and routed through NITCAA — see the <b>Give Back</b> page.</span></li>
        </ul>
      </GlassCard>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/profile"><Button>View Profile</Button></Link>
        <Link to="/agenda"><Button variant="outline">Browse Events</Button></Link>
      </div>
    </motion.div>
  );
}
