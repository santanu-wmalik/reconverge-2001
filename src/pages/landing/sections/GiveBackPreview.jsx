import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Give Back — Project Cornerstone teaser. The pledge form itself lives in
// the portal (/give-back, login required) so every pledge is saved against
// the signed-in alumnus.
export default function GiveBackPreview() {
  return (
    <section id="giving" className="scroll-mt-24 py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="eyebrow">Project Cornerstone · Legacy</span>
        <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-heading font-medium italic text-forest-600">
          Give Back
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-white border border-gold-500/40 shadow-sm px-6 py-10"
        >
          <p className="font-heading text-2xl md:text-3xl italic text-forest-700 mb-2">
            The Alumni Guest House
          </p>
          <p className="font-serif text-ink-muted max-w-md mx-auto">
            Twenty-five years since we walked in as strangers. Let's give the Class of 2001 a
            place to walk back into.
          </p>

          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-7">
            {[
              { num: '₹2 Cr', label: 'Campaign goal' },
              { num: '20', label: 'Rooms funded' },
              { num: 'Dec 1', label: 'Pledges due by' },
            ].map((g) => (
              <div key={g.label} className="text-center">
                <p className="font-heading text-2xl md:text-3xl text-gold-600">{g.num}</p>
                <p className="nav-caps text-ink-muted mt-1">{g.label}</p>
              </div>
            ))}
          </div>

          <Link
            to="/give-back"
            className="nav-caps inline-block mt-8 px-8 py-3.5 bg-gradient-to-b from-gold-400 to-gold-600 text-forest-900 shadow hover:from-gold-300 hover:to-gold-500"
          >
            Make your pledge →
          </Link>
          <p className="text-xs text-ink-muted mt-3">Sign in required — your pledge is saved to your profile.</p>
        </motion.div>
      </div>
    </section>
  );
}
