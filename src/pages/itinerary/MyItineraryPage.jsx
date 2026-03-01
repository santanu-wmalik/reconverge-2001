import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useItinerary } from '../../context/ItineraryContext';
import { pageTransition } from '../../utils/animationVariants';
import { formatTime } from '../../utils/formatters';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function MyItineraryPage() {
  const { myEvents, conflicts, removeEvent } = useItinerary();

  const byDay = [1, 2, 3].map((day) => ({
    day,
    events: myEvents.filter((e) => e.day === day),
  }));

  return (
    <motion.div {...pageTransition}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">My Itinerary</h1>
          <p className="text-slate-400 text-sm mt-1">{myEvents.length} events planned</p>
        </div>
        <Link to="/events"><Button variant="outline" size="sm">Browse Events</Button></Link>
      </div>

      {conflicts.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-400/20 text-yellow-300 text-sm">
          ⚠ You have {conflicts.length} schedule conflict(s). Some events overlap in time.
        </div>
      )}

      {myEvents.length === 0 ? (
        <GlassCard hover={false} className="text-center py-16">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-white font-semibold mb-2">No events in your plan yet</h3>
          <p className="text-slate-400 text-sm mb-6">Browse the event schedule and add events to your personal itinerary.</p>
          <Link to="/events"><Button>Browse Events</Button></Link>
        </GlassCard>
      ) : (
        <div className="space-y-8">
          {byDay.filter((d) => d.events.length > 0).map(({ day, events }) => (
            <div key={day}>
              <h2 className="text-lg font-semibold text-gold-400 mb-4">Day {day} - Dec {11 + day}, 2026</h2>
              <div className="space-y-3">
                {events.map((evt) => (
                  <GlassCard key={evt.id} className="flex items-center gap-4">
                    <div className="text-2xl">{evt.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{evt.title}</h3>
                      <p className="text-slate-400 text-sm">{formatTime(evt.startTime)} - {formatTime(evt.endTime)} | {evt.venue}</p>
                    </div>
                    <button onClick={() => removeEvent(evt.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                  </GlassCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
