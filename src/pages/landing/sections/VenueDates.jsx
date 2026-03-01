import SectionHeading from '../../../components/shared/SectionHeading';
import ScrollReveal from '../../../components/shared/ScrollReveal';
import GlassCard from '../../../components/ui/GlassCard';
import { EVENT_CONFIG } from '../../../data/constants';
import { fadeInLeft, fadeInRight } from '../../../utils/animationVariants';

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
                {[
                  { day: 'Day 1 - Dec 27', title: 'Check-in & Gala', items: ['Hotel Check-in & Relaxation', 'Registration & Goodies', 'REConverge Gala Program', 'Musical Evening & Gala Dinner'] },
                  { day: 'Day 2 - Dec 28', title: 'Campus Day', items: ['Bus to NITC Campus', 'Batch Procession @ Rajpath', 'Alumni Day Function', 'Kerala Traditional Sadhya', 'Campus Tour & Branch Dinner'] },
                  { day: 'Day 3 - Dec 29', title: 'Departure', items: ['Relaxed Breakfast', 'Checkout & Optional Kerala Tour'] },
                ].map((d) => (
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
