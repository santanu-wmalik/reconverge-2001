import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import { EVENT_CONFIG } from '../../../data/constants';
import { fadeInUp } from '../../../utils/animationVariants';
import { formatCurrency } from '../../../utils/formatters';

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,67,0.15),transparent_70%)]" />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto px-4 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
          Don't Miss the Reunion of a Lifetime
        </h2>
        <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
          RSVP now to secure your spot for REConverge 2001.
          Registration closes {EVENT_CONFIG.registrationDeadline}.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/rsvp">
            <Button size="lg" className="animate-pulse-glow">RSVP Now - {formatCurrency(EVENT_CONFIG.registrationFee)}</Button>
          </Link>
          <Link to="/store">
            <Button size="lg" variant="outline">Browse Merchandise</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
