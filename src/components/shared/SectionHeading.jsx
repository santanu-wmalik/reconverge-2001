import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animationVariants';

// rect1an-style section heading:
//   ─── EYEBROW IN SMALL CAPS ───
//   Italic serif title in forest green
//   Muted subtitle
//
// `eyebrow` is optional. In dark shells (portal/admin) the title falls back
// to the original gold gradient via .gradient-text's dark: variant.
export default function SectionHeading({ title, subtitle, eyebrow, centered = true, light = false }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      {eyebrow && (
        <div className={`mb-3 ${centered ? 'flex justify-center' : ''}`}>
          <span className="eyebrow">{eyebrow}</span>
        </div>
      )}
      <h2
        className={`text-4xl md:text-5xl lg:text-6xl font-heading font-medium italic mb-3 leading-tight ${
          light ? 'text-white' : 'gradient-text'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-ink-muted dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-serif">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
