import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EVENT_CONFIG } from '../../../data/constants';
import { fadeInUp } from '../../../utils/animationVariants';
import { formatCurrency } from '../../../utils/formatters';

export default function CTASection() {
  return (
    <section className="py-20 md:py-24 relative overflow-hidden bg-forest-panel text-cream-50">
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:26px_26px]" />
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto px-4 text-center"
      >
        <span className="eyebrow !text-gold-300">Rewind · Relive · Replay</span>
        <h2 className="mt-3 text-4xl md:text-5xl font-heading font-medium italic mb-4">Don't Miss the Reunion of a Lifetime</h2>
        <p className="font-serif text-lg text-cream-200/90 mb-8 max-w-xl mx-auto">
          Early Bird pricing runs until 30 September. Registration closes {EVENT_CONFIG.registrationDeadline}.
        </p>
        <div className="flex justify-center">
          <Link to="/register" className="btn-silver-glitter nav-caps px-7 py-3.5">
            Buy Tickets — {formatCurrency(EVENT_CONFIG.registrationFee)}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
