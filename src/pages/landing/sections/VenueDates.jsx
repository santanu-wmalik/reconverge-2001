import SectionHeading from '../../../components/shared/SectionHeading';
import ScrollReveal from '../../../components/shared/ScrollReveal';
import GlassCard from '../../../components/ui/GlassCard';
import { EVENT_CONFIG } from '../../../data/constants';
import { eventSchedule, eventDays } from '../../../data/events';
import { fadeInLeft, fadeInRight } from '../../../utils/animationVariants';

// Derive the landing-page schedule strip from the single source of truth
// (`data/events.js`) so we don't drift from the Itinerary page. We surface
// only `isFeatured` events to keep the landing block scannable; days with
// nothing featured fall back to all events for that day.
const schedule = eventDays.map((d) => {
  const featured = eventSchedule.filter((e) => e.day === d.day && e.isFeatured);
  const items = (featured.length ? featured : eventSchedule.filter((e) => e.day === d.day)).map(
    (e) => e.title
  );
  return { day: d.label, title: d.subtitle, items };
});

export default function VenueDates() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-950 via-primary-900/20 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="When & Where"
          subtitle="The reunion of a lifetime at the heart of Kozhikode"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <ScrollReveal variants={fadeInLeft}>
            <GlassCard className="h-full" hover={false}>
              <div className="text-3xl mb-4">📍</div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">The Venue</h3>
              <div className="space-y-2 text-slate-300 text-sm">
                <p className="font-semibold text-gold-400">{EVENT_CONFIG.venue.name}</p>
                <p>{EVENT_CONFIG.venue.address}</p>
                <p>{EVENT_CONFIG.venue.city}, {EVENT_CONFIG.venue.state} - {EVENT_CONFIG.venue.pincode}</p>
              </div>
              <div className="mt-4 h-40 rounded-xl overflow-hidden border border-white/5">
                <iframe
                  src={EVENT_CONFIG.venue.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="NIT Calicut Location"
                  className="grayscale opacity-80"
                />
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal variants={fadeInRight}>
            <GlassCard className="h-full" hover={false}>
              <div className="text-3xl mb-4">📅</div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">The Schedule</h3>
              <div className="space-y-4">
                {schedule.map((d) => (
                  <div key={d.day} className="border-l-2 border-gold-500/30 pl-4">
                    <p className="text-gold-400 font-semibold text-sm">{d.day}</p>
                    <p className="text-white text-sm font-medium">{d.title}</p>
                    <p className="text-slate-400 text-xs mt-1">{d.items.join(' \u2022 ')}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
