import SectionHeading from '../../../components/shared/SectionHeading';
import { sponsors } from '../../../data/sponsors';

export default function SponsorsSection() {
  const allSponsors = [...sponsors, ...sponsors]; // duplicate for marquee

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-950 via-primary-900/20 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Our Sponsors"
          subtitle="Grateful to our partners who make this reunion possible"
        />

        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10" />
          <div className="flex animate-marquee gap-12 items-center">
            {allSponsors.map((sponsor, i) => (
              <a
                key={`${sponsor.id}-${i}`}
                href={sponsor.website}
                className="flex-shrink-0 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
              >
                <img src={sponsor.logo} alt={sponsor.name} className="h-12 md:h-16 w-auto" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
