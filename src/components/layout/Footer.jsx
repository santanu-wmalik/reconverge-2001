import { Link } from 'react-router-dom';
import { EVENT_CONFIG } from '../../data/constants';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={EVENT_CONFIG.logoUrl} alt="REConverge 2001" className="w-10 h-10 rounded-lg object-contain" />
              <div>
                <p className="text-white font-heading font-semibold">REConverge 2001</p>
                <p className="text-gold-400 text-xs">{EVENT_CONFIG.collegeName}</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {EVENT_CONFIG.tagline}. Join us for three unforgettable days of reunions, celebrations, and memories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'When & Where', path: '/when-where' },
                { label: 'Agenda', path: '/agenda' },
                { label: 'RSVP', path: '/rsvp' },
                { label: 'Committees', path: '/committees' },
                { label: 'Our Journey', path: '/our-journey' },
                { label: 'Groups', path: '/groups' },
                { label: 'Store', path: '/store' },
                { label: 'Yearbook', path: '/yearbook' },
                { label: 'FAQ', path: '/faq' },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="text-slate-400 hover:text-gold-400 text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Event Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Event Details</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p>{EVENT_CONFIG.displayDates}</p>
              <p>{EVENT_CONFIG.venue.name}</p>
              <p>{EVENT_CONFIG.venue.city}, {EVENT_CONFIG.venue.state}</p>
              <p className="pt-2">
                <a href={`mailto:${EVENT_CONFIG.contact.email}`} className="text-gold-400 hover:text-gold-300 transition-colors">
                  {EVENT_CONFIG.contact.email}
                </a>
              </p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {['Facebook', 'Instagram', 'LinkedIn'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-400/30 transition-all"
                >
                  <span className="text-xs font-medium">{platform[0]}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; 2026 Organizing Committee. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            REC Calicut Class of 2001 Silver Jubilee
          </p>
        </div>
      </div>
    </footer>
  );
}
