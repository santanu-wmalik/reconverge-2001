import { motion } from 'framer-motion';

// Give Back teaser — the earlier campaign content is retired while the batch
// plans a new initiative. Public page shows only a Coming Soon card.
export default function GiveBackPreview() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="eyebrow">Legacy</span>
        <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-heading font-medium italic text-forest-600">
          Give Back
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-white border border-gold-500/40 shadow-sm px-6 py-12"
        >
          <p className="text-4xl mb-3" aria-hidden="true">💛</p>
          <p className="font-heading text-2xl md:text-3xl italic text-forest-700 mb-2">Coming Soon…</p>
          <p className="font-serif text-ink-muted max-w-md mx-auto">
            We're planning something new for the batch's legacy initiative. Stay tuned.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
