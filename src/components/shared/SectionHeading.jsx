import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animationVariants';

export default function SectionHeading({ title, subtitle, centered = true, light = false }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 ${
          light ? 'text-white' : 'gradient-text'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="h-0.5 w-12 bg-gold-500/50 rounded-full" />
        <div className="h-1.5 w-1.5 bg-gold-500 rounded-full" />
        <div className="h-0.5 w-12 bg-gold-500/50 rounded-full" />
      </div>
    </motion.div>
  );
}
