import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '../../../data/testimonials';
import { BRANCHES, BRANCH_SHORT } from '../../../data/constants';

// "Echoes from the Halls" — rect1an's memory-wall carousel: dark tinted
// cards with a small-caps branch tag, a title, an italic excerpt and an
// author line. Renders nothing until real testimonials exist.
//
// Expected testimonial shape: { id, name, branch, title?, quote }.

const TINTS = ['#3b2a12', '#3b1a1f', '#1c1b3a', '#14252f', '#1f2f1f'];
const shortOf = (branch) => BRANCH_SHORT[BRANCHES.indexOf(branch)] || branch || '';

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const visibleCount = 4;

  useEffect(() => {
    if (testimonials.length <= visibleCount) return undefined;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  if (testimonials.length === 0) return null;

  const visible = Array.from({ length: Math.min(visibleCount, testimonials.length) }, (_, i) =>
    testimonials[(current + i) % testimonials.length]
  );

  return (
    <section className="py-16 md:py-20 bg-cream-200/60 border-y border-forest-500/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="eyebrow">Our Story</span>
          <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-heading font-medium italic text-forest-600">Echoes from the Halls</h2>
          <p className="mt-2 font-serif text-ink-muted">Share your memories · Relive the moments</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((t, i) => (
              <motion.article
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative text-cream-50 p-6 min-h-[240px] flex flex-col shadow-lg"
                style={{ background: TINTS[i % TINTS.length] }}
              >
                <span className="absolute top-3 right-3 text-gold-400/70">✦</span>
                <p className="nav-caps text-gold-400 mb-2">{shortOf(t.branch)}</p>
                {t.title && <h3 className="font-heading text-lg leading-snug mb-3">{t.title}</h3>}
                <p className="font-serif italic text-cream-100/90 text-[15px] leading-relaxed flex-1">{t.quote}</p>
                <p className="nav-caps text-cream-200 mt-4">— {t.name}</p>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {testimonials.length > visibleCount && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Show memory ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-gold-500 w-6' : 'bg-forest-500/30 hover:bg-forest-500/60 w-2'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
