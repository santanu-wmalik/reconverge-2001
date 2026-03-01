import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function ProgressBar({ value, max = 100, color = 'gold', animated = true, className }) {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    gold: 'bg-gradient-to-r from-gold-500 to-gold-400',
    primary: 'bg-gradient-to-r from-primary-500 to-primary-400',
    green: 'bg-gradient-to-r from-green-500 to-green-400',
    accent: 'bg-gradient-to-r from-accent to-accent-light',
  };

  return (
    <div className={cn('w-full bg-white/10 rounded-full h-2 overflow-hidden', className)}>
      <motion.div
        initial={animated ? { width: 0 } : false}
        whileInView={animated ? { width: `${percentage}%` } : false}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        className={cn('h-full rounded-full', colors[color] || colors.gold)}
        style={!animated ? { width: `${percentage}%` } : undefined}
      />
    </div>
  );
}
