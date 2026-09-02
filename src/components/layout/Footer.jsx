import { Link } from 'react-router-dom';
import { EVENT_CONFIG } from '../../data/constants';

// Compact centred footer (rect1an style): wordmark · tagline · one row of
// caps links · contact · copyright. Same block on public, portal and admin.
const LINKS = [
  { label: 'Our Journey', path: '/our-journey' },
  { label: 'Schedule', path: '/when-where' },
  { label: 'Roll of Honour', path: '/#roll-of-honour' },
  { label: 'Committees', path: '/committees' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Sign Up', path: '/register' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0b1a12] text-cream-100 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-32 md:pb-32 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <img src={EVENT_CONFIG.logoUrl} alt="" className="w-9 h-9 rounded-full object-contain ring-1 ring-gold-500/40" />
          <p className="font-heading text-lg sm:text-3xl tracking-wide text-cream-50 whitespace-nowrap">
            <span className="text-gold-400">REC</span>onverge <span className="text-cream-300/60">·</span> REC Calicut 2026
          </p>
        </div>
        <p className="font-heading italic text-cream-300/85 text-base sm:text-lg">
          Batch of 2001 · Twenty-Five Years Strong
        </p>

        <nav className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-0 sm:gap-y-2" aria-label="Footer">
          {LINKS.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className="nav-caps text-cream-100 hover:text-gold-400 transition-colors py-2 sm:py-0"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <p className="mt-5">
          <a
            href={`mailto:${EVENT_CONFIG.contact.email}`}
            className="nav-caps inline-block py-2 sm:py-0 text-gold-400 hover:text-gold-300 transition-colors"
          >
            Contact Us
          </a>
        </p>

        <p className="mt-4 font-serif text-sm text-cream-300/70">
          &copy; 2026 REC Calicut Class of 2001 · All Rights Reserved
        </p>
        <p className="mt-1 font-serif text-xs text-cream-300/50">
          {EVENT_CONFIG.displayDates} · {EVENT_CONFIG.venue.city}, {EVENT_CONFIG.venue.state}
        </p>
      </div>
    </footer>
  );
}
