import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import SectionHeading from '../../components/shared/SectionHeading';

const sections = [
  { title: 'Photo Gallery', description: 'Browse through hundreds of photos from campus life, events, and hostel days.', icon: '📸', path: '/nostalgia/photos' },
  { title: 'Video Gallery', description: 'Watch batch videos, event highlights, and the campus tour.', icon: '🎬', path: '/nostalgia/videos' },
];

// Shared Echoes are batchmate-submitted memories — we'll populate this once
// real submissions come in. Do not ship placeholder quotes.
const memories = [];

export default function NostalgiaPage() {
  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="The Yearbook"
        subtitle="Echoes and Images of 2001"
      />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
        {sections.map((s) => (
          <motion.div key={s.path} variants={staggerItem}>
            <Link to={s.path}>
              <GlassCard className="text-center py-12">
                <div className="text-5xl mb-4">{s.icon}</div>
                <h3 className="text-white font-heading font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.description}</p>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Shared Echoes */}
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-heading font-bold text-white mb-6">Shared Echoes</h3>
        {memories.length > 0 ? (
          <div className="space-y-4">
            {memories.map((m) => (
              <GlassCard key={m.id}>
                <p className="text-slate-300 text-sm italic leading-relaxed mb-3">&ldquo;{m.text}&rdquo;</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="text-gold-400 font-medium">{m.author} &middot; Class of {m.year}</span>
                  <span>{m.date}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard className="text-center border-gold-500/20">
            <div className="text-3xl mb-3">💬</div>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              This space is for your memories — a corridor anecdote, a hostel story, a professor you still quote. We&apos;re holding it empty until the first real submissions come in.
            </p>
            <p className="text-xs text-slate-500">
              Want to share one? Email it to <a href="mailto:crec2001reunion@gmail.com" className="text-gold-400 hover:text-gold-300">crec2001reunion@gmail.com</a> and we&apos;ll feature it here.
            </p>
          </GlassCard>
        )}
      </div>
    </motion.div>
  );
}
