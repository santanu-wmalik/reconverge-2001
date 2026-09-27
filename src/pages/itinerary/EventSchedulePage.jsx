import { useState } from 'react';
import { motion } from 'framer-motion';
import { useItinerary } from '../../context/ItineraryContext';
import { useToast } from '../../context/ToastContext';
import { eventSchedule, eventCategories, eventDays, galaSpotlight } from '../../data/events';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import { formatTime } from '../../utils/formatters';
import GlassCard from '../../components/ui/GlassCard';
import Tabs from '../../components/ui/Tabs';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SectionHeading from '../../components/shared/SectionHeading';

export default function EventSchedulePage() {
  const [activeDay, setActiveDay] = useState(1);
  const [activeCategory, setActiveCategory] = useState('all');
  const { toggleEvent, isEventSelected } = useItinerary();
  const { showToast } = useToast();

  const filtered = eventSchedule.filter((evt) => {
    if (evt.day !== activeDay) return false;
    if (activeCategory !== 'all' && evt.category !== activeCategory) return false;
    return true;
  });

  const handleToggle = (evt) => {
    toggleEvent(evt.id);
    showToast(
      isEventSelected(evt.id) ? `Removed "${evt.title}" from plan` : `Added "${evt.title}" to plan`,
      isEventSelected(evt.id) ? 'info' : 'success'
    );
  };

  return (
    <motion.div {...pageTransition}>
      <SectionHeading title="Event Schedule" subtitle="Two days of reunions, celebrations, and memories — checkout on the 29th" />

      <Tabs tabs={eventDays.map((d) => ({ id: d.day, label: d.label, icon: d.subtitle }))} activeTab={activeDay} onChange={setActiveDay} className="mb-6" />

      <div className="flex gap-2 flex-wrap mb-8">
        {eventCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeCategory === cat.id
                ? 'bg-gold-500/20 border-gold-400/30 text-gold-700'
                : 'bg-white border-forest-500/15 text-ink-soft hover:text-ink'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <motion.div
        key={`${activeDay}-${activeCategory}`}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filtered.map((evt) => (
          <motion.div key={evt.id} variants={staggerItem}>
            <GlassCard className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="text-3xl">{evt.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-ink font-semibold">{evt.title}</h3>
                  {evt.isFeatured && <Badge variant="gold" size="sm">Featured</Badge>}
                </div>
                <p className="text-ink-soft text-sm mt-1 line-clamp-2">{evt.description}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-ink-muted">
                  {evt.startTime && (
                    <span>🕐 {formatTime(evt.startTime)}{evt.endTime ? ` – ${formatTime(evt.endTime)}` : ''}</span>
                  )}
                  <span>📍 {evt.venue}</span>
                </div>
              </div>
              <Button
                variant={isEventSelected(evt.id) ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => handleToggle(evt)}
              >
                {isEventSelected(evt.id) ? '✓ In Plan' : '+ Add'}
              </Button>
            </GlassCard>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-ink-muted">No events in this category for Day {activeDay}</div>
        )}
      </motion.div>

      {/* ── Gala Night spotlight — theme + artist announcement ── */}
      <div className="mt-14 space-y-6">
        <div className="text-center">
          <span className="eyebrow">Gala Night Spotlight</span>
        </div>
        {[galaSpotlight.theme, galaSpotlight.artist].map((block) => (
          <GlassCard key={block.title} hover={false} className="border-gold-500/30">
            <h3 className="font-heading text-xl md:text-2xl font-bold text-forest-700 mb-4">
              {block.title.startsWith('Gala') ? '✨ ' : '🎤 '}{block.title}
            </h3>
            <div className="space-y-3 text-[15px] leading-relaxed text-ink-soft font-serif">
              {block.paragraphs.map((p, i) => (
                <p key={i}>
                  {p.split('**').map((chunk, j) =>
                    j % 2 === 1 ? <b key={j} className="text-ink">{chunk}</b> : chunk
                  )}
                </p>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}
