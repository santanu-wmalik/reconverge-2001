import { sponsors } from '../../../data/sponsors';
import { EVENT_CONFIG } from '../../../data/constants';

export default function SponsorsSection() {
  const allSponsors = [...sponsors, ...sponsors];

  return (
    <section className="py-16 md:py-20 bg-cream-200/60 border-y border-forest-500/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="eyebrow">Partners</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-heading font-medium italic text-forest-600">Our Sponsors</h2>
          <p className="mt-2 font-serif text-ink-muted">Grateful to the partners who make this reunion possible</p>
        </div>

        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-cream-200 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-cream-200 to-transparent z-10" />
          <div className="flex animate-marquee gap-12 items-center">
            {allSponsors.map((sponsor, i) => (
              <a
                key={`${sponsor.id}-${i}`}
                href={sponsor.website}
                className="flex-shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <img src={sponsor.logo} alt={sponsor.name} className="h-12 md:h-16 w-auto" />
              </a>
            ))}
          </div>
        </div>

        <p className="text-center mt-8 font-serif text-ink-muted text-sm">
          Want to sponsor? Write to{' '}
          <a href={`mailto:${EVENT_CONFIG.contact.email}`} className="inline-block py-2 sm:py-0 text-forest-700 underline underline-offset-4 decoration-gold-500/60">
            {EVENT_CONFIG.contact.email}
          </a>
        </p>
      </div>
    </section>
  );
}
