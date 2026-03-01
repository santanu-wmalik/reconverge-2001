import { motion } from 'framer-motion';
import { pageTransition } from '../utils/animationVariants';

export default function PlaceholderPage({ title, description }) {
  return (
    <motion.div {...pageTransition} className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-6">
        🚧
      </div>
      <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">{title}</h1>
      <p className="text-slate-400 max-w-md">{description || 'This page is coming soon. Check back later!'}</p>
    </motion.div>
  );
}
