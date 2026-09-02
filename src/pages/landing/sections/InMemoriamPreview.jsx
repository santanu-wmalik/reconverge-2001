import { motion } from 'framer-motion';
import { inMemoriam, remembranceNote } from '../../../data/inMemoriam';

// "In Loving Memory" — quiet, dignified. Ink on cream, thin gold rules.
export default function InMemoriamPreview() {
  if (!inMemoriam || inMemoriam.length === 0) return null;

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="eyebrow">In Loving Memory</span>
        <h2 className="mt-3 text-3xl md:text-4xl font-heading font-medium italic text-forest-600">Batchmates we're carrying with us</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white border border-gold-500/40 p-6 md:p-8 shadow-sm"
      >
        <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {inMemoriam.map((p) => (
            <li key={p.name} className="text-center">
              <p className="font-heading text-ink text-lg leading-tight">{p.name}</p>
              <p className="nav-caps text-ink-muted mt-0.5">
                {p.branch}{p.year && ` · ${p.year}`}
              </p>
            </li>
          ))}
        </ul>
        <p className="font-serif text-sm text-ink-muted leading-relaxed text-center mt-6 max-w-2xl mx-auto">{remembranceNote}</p>
      </motion.div>
    </section>
  );
}
