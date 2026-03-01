import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';
import QRCodeDisplay from '../../components/shared/QRCodeDisplay';

export default function RegistrationSuccess() {
  return (
    <motion.div {...pageTransition} className="max-w-lg mx-auto px-4 py-16 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} className="text-6xl mb-6">
        🎉
      </motion.div>
      <h1 className="text-3xl font-heading font-bold text-white mb-2">Registration Successful!</h1>
      <p className="text-slate-400 mb-8">Welcome to the Silver Jubilee Alumni Meet 2026</p>

      <GlassCard hover={false} className="mb-8">
        <p className="text-sm text-slate-400 mb-4">Your Digital Pass</p>
        <QRCodeDisplay value="SJ-2026-0001-RAJESH-KUMAR" label="Registration ID: SJ-2026-0001" />
      </GlassCard>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/profile"><Button>View Profile</Button></Link>
        <Link to="/events"><Button variant="outline">Browse Events</Button></Link>
      </div>
    </motion.div>
  );
}
