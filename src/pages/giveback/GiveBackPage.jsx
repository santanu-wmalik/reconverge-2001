import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import SectionHeading from '../../components/shared/SectionHeading';

// Give Back — the previous NITCAA Health Centre campaign content has been
// retired while the batch plans a new initiative. Keep the route alive so
// old links land on this teaser instead of a 404.
export default function GiveBackPage() {
  return (
    <motion.div {...pageTransition} className="max-w-3xl mx-auto">
      <SectionHeading
        title="Give Back"
        subtitle="A batch legacy initiative for REConverge 2001"
      />

      <GlassCard className="text-center py-14 border-gold-500/30">
        <p className="text-5xl mb-4" aria-hidden="true">💛</p>
        <h2 className="font-heading text-3xl md:text-4xl text-forest-700 italic mb-3">
          Coming Soon…
        </h2>
        <p className="font-serif text-ink-soft max-w-md mx-auto leading-relaxed">
          We're planning something new for the batch's Give Back initiative.
          Details will be announced here and on the WhatsApp groups — watch this space.
        </p>
      </GlassCard>
    </motion.div>
  );
}
