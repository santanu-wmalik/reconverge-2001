import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { pageTransition } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import QRCodeDisplay from '../../components/shared/QRCodeDisplay';
import Avatar from '../../components/ui/Avatar';

export default function DigitalPass() {
  const { user } = useAuth();

  return (
    <motion.div {...pageTransition} className="max-w-md mx-auto">
      <h1 className="text-3xl font-heading font-bold text-white mb-8 text-center">Digital Pass</h1>
      <GlassCard hover={false} className="text-center glass-gold">
        <div className="mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center font-heading font-bold text-primary-900 text-lg mx-auto mb-2">25</div>
          <p className="text-gold-400 font-heading font-bold text-sm">SILVER JUBILEE ALUMNI MEET 2026</p>
        </div>
        <Avatar src={user?.avatar} name={user?.name} size="xl" className="mx-auto mb-3" />
        <h2 className="text-2xl font-heading font-bold text-white">{user?.name}</h2>
        <p className="text-slate-400 text-sm">{user?.branch} | Batch {user?.batch}</p>
        <p className="text-slate-500 text-xs mt-1">{user?.company}</p>
        <div className="my-6">
          <QRCodeDisplay value={`SJ-2026-${user?.registrationId}-${user?.name}`} size={180} label={`ID: ${user?.registrationId}`} />
        </div>
        <p className="text-xs text-slate-500">Dec 12-14, 2026 | NIT Campus, Trichy</p>
      </GlassCard>
    </motion.div>
  );
}
