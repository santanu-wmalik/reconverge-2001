import ScrollReveal from '../../../components/shared/ScrollReveal';
import { EVENT_CONFIG } from '../../../data/constants';
import { fadeInLeft, fadeInRight } from '../../../utils/animationVariants';

export default function VenueDates() {
  return (
    <section className="py-16 md:py-20 bg-cream-200/60 border-y border-forest-500/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="eyebrow">When &amp; Where</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-heading font-medium italic text-forest-600">Back to where it began</h2>
          <p className="mt-2 font-serif text-ink-muted">The reunion of a lifetime at the heart of Kozhikode</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ScrollReveal variants={fadeInLeft}>
            <div className="h-full bg-white border border-forest-500/15 p-6 shadow-sm">
              <p className="nav-caps text-gold-700 mb-2">📍 The Venue</p>
              <p className="font-heading text-xl text-forest-700 mb-1">{EVENT_CONFIG.venue.name}</p>
              <p className="font-serif text-ink-soft text-sm">{EVENT_CONFIG.venue.address}</p>
              <p className="font-serif text-ink-soft text-sm">{EVENT_CONFIG.venue.city}, {EVENT_CONFIG.venue.state} - {EVENT_CONFIG.venue.pincode}</p>
              <div className="mt-4 h-44 overflow-hidden border border-forest-500/15">
                <iframe
                  src={EVENT_CONFIG.venue.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="NIT Calicut Location"
                />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variants={fadeInRight}>
            <div className="h-full bg-white border border-forest-500/15 p-6 shadow-sm">
              <p className="nav-caps text-gold-700 mb-2">📅 The Dates</p>
              <p className="font-heading text-xl text-forest-700 mb-3">{EVENT_CONFIG.displayDates}</p>
              <dl className="font-serif text-ink-soft text-sm space-y-2">
                <div className="flex justify-between border-b border-forest-500/10 pb-2"><dt>Check-in</dt><dd className="text-ink">{EVENT_CONFIG.checkinDate}</dd></div>
                <div className="flex justify-between border-b border-forest-500/10 pb-2"><dt>Check-out</dt><dd className="text-ink">{EVENT_CONFIG.checkoutDate}</dd></div>
                <div className="flex justify-between border-b border-forest-500/10 pb-2"><dt>Stay</dt><dd className="text-ink">{EVENT_CONFIG.stay.primaryHotel}</dd></div>
                <div className="flex justify-between"><dt>Block code</dt><dd className="text-ink">{EVENT_CONFIG.stay.bookingCode}</dd></div>
              </dl>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
