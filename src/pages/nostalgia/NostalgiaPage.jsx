import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import SectionHeading from '../../components/shared/SectionHeading';
import Badge from '../../components/ui/Badge';

const sections = [
  { title: 'Photo Gallery', description: 'Browse through hundreds of photos from campus life, events, and hostel days.', icon: '📸', path: '/nostalgia/photos' },
  { title: 'Video Gallery', description: 'Watch batch videos, event highlights, and the campus tour.', icon: '🎬', path: '/nostalgia/videos' },
];

const memories = [
  { id: 'm1', author: 'Rahul Verma', year: '2001', text: 'Spending rainy evenings at the OAT was the highlight of my college life. Reconnecting with the crew after 25 years feels surreal!', date: '2024-12-20' },
  { id: 'm2', author: 'Priya Nair', year: '2001', text: 'The mess food might have been questionable, but the friendships we made there are unbreakable. See you all at REConverge!', date: '2025-01-05' },
];

export default function NostalgiaPage() {
  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="The Yearbook"
        subtitle="Echoes and Images of 2001"
      />

      <div className="flex justify-center mb-8">
        <Badge variant="gold" size="lg">Coming Soon...</Badge>
      </div>

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
        <div className="space-y-4">
          {memories.map((m) => (
            <GlassCard key={m.id}>
              <p className="text-slate-300 text-sm italic leading-relaxed mb-3">"{m.text}"</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="text-gold-400 font-medium">{m.author} &middot; Class of {m.year}</span>
                <span>{m.date}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
