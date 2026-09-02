import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventSchedule, eventDays } from '../../../data/events';
import { staggerContainer, staggerItem } from '../../../utils/animationVariants';

// "Event Highlights" — rect1an programme layout:
//   Day 0 banner centred on top (single column), Day 1 / Day 2 side by side.
//   Each item is a cream tile: time · title · venue; featured ones get a
//   gold left rule and ✦.

function fmt(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hn = Number(h);
  const suffix = hn >= 12 ? 'PM' : 'AM';
  const hh = hn === 0 ? 12 : hn > 12 ? hn - 12 : hn;
  return `${String(hh).padStart(2, '0')}:${m} ${suffix}`;
}

function itemsForDay(day) {
  return eventSchedule
    .filter((e) => e.day === day)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

function DayBanner({ label, date }) {
  const d = new Date(`${date}T00:00:00`);
  const pretty = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="bg-forest-700 text-cream-50 text-center py-3 px-4 shadow-md">
      <p className="font-heading text-lg tracking-wide">{label}</p>
      <p className="nav-caps text-cream-200/80">{pretty}</p>
    </div>
  );
}

function Tile({ it }) {
  return (
    <motion.li
      variants={staggerItem}
      className={`flex gap-3 px-4 py-3 border ${
        it.isFeatured
          ? 'bg-[#fbf7ea] border-gold-500/40 border-l-4 border-l-gold-500'
          : 'bg-cream-200/70 border-forest-500/10'
      }`}
    >
      <span className="nav-caps text-gold-700 pt-0.5 whitespace-nowrap">{fmt(it.startTime)}</span>
      <div className="min-w-0">
        <p className="font-heading text-ink text-[15px] leading-snug">
          {it.isFeatured && <span className="text-gold-600 mr-1">✦</span>}
          {it.title}
        </p>
        <p className="text-xs text-ink-muted font-serif mt-0.5">{it.venue}</p>
      </div>
    </motion.li>
  );
}

export default function SchedulePreview() {
  const [d0, d1, d2] = eventDays;
  return (
    <section id="event-highlights" className="scroll-mt-24 py-16 md:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <span className="eyebrow">The Day's Programme</span>
        <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-heading font-medium italic text-forest-600">
          Event Highlights
        </h2>
        <p className="mt-2 font-serif text-ink-muted">{d0.date.slice(8)}, {d1.date.slice(8)}, {d2.date.slice(8)} December 2026</p>
      </div>

            <div className="max-w-2xl mx-auto mb-8">
        <DayBanner label={d0.label.split(' - ')[0]} date={d0.date} />
        <motion.ul variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-2 space-y-2">
          {itemsForDay(d0.day).map((it) => <Tile key={it.id} it={it} />)}
        </motion.ul>
      </div>

      {/* Day 1, then Day 2 stacked below it — one column */}
      <div className="max-w-2xl mx-auto space-y-8">
        {[d1, d2].map((d) => (
          <div key={d.day}>
            <DayBanner label={d.label.split(' - ')[0]} date={d.date} />
            <motion.ul variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-2 space-y-2">
              {itemsForDay(d.day).map((it) => <Tile key={it.id} it={it} />)}
            </motion.ul>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link to="/agenda" className="nav-caps px-6 py-3 border-2 border-forest-600/60 text-forest-700 hover:bg-forest-600/8">
          Full agenda →
        </Link>
      </div>
    </section>
  );
}
