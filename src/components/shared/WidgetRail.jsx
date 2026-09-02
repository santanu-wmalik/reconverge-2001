import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCountdown } from '../../hooks/useCountdown';
import { EVENT_CONFIG } from '../../data/constants';

// Pinned widget strip — ONE horizontal row pinned to the bottom-right of the viewport.
//
//   Mobile  (<md): spans the full width.
//   Desktop (md+): 50% of the container width, right-aligned.
//
// Inside the strip the countdown takes 60% and the two tiles split the
// remaining 40% equally. Nothing ever wraps. The chevron at the right edge
// collapses the strip HORIZONTALLY — the content slides into the chevron
// (width → 0) and slides back out on expand.

function Tile({ to, icon, label }) {
  return (
    <Link
      to={to}
      title={label}
      aria-label={label}
      className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 sm:gap-1 bg-[#111a2b] text-cream-100 hover:bg-[#182338] transition-colors border border-white/5 shadow-lg"
    >
      <span className="text-base sm:text-lg leading-none" aria-hidden="true">{icon}</span>
      <span className="block text-[7px] lg:text-[9px] font-semibold uppercase tracking-wide text-center px-0.5 leading-tight whitespace-nowrap truncate max-w-full">
        {label}
      </span>
    </Link>
  );
}

export default function WidgetRail() {
  const [open, setOpen] = useState(true);
  const { days, hours, minutes, seconds, isExpired } = useCountdown(EVENT_CONFIG.eventDate);

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 pointer-events-none">
      <div className="w-full px-4 sm:px-6 flex justify-end">
        {/* Strip: full width on mobile, half width right-aligned on md+ */}
        <div className="pointer-events-auto w-full md:w-1/2 flex flex-nowrap items-stretch justify-end">
          {/* Collapsible content — animates its width to 0 (slides into the chevron) */}
          <div
            className="min-w-0 overflow-hidden transition-all duration-300 ease-in-out"
            style={{ flexBasis: open ? '100%' : '0%', opacity: open ? 1 : 0 }}
            aria-hidden={!open}
          >
            <div className="flex flex-nowrap items-stretch gap-1 sm:gap-1.5 h-full pr-1 sm:pr-1.5">
              {/* Countdown card — 60% */}
              <div className="basis-[60%] min-w-0 bg-[#111a2b] text-cream-100 px-2 sm:px-3 py-1.5 sm:py-2 shadow-xl border border-white/5 flex flex-col justify-center">
                <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-semibold uppercase tracking-wide2 text-gold-400/90 text-center mb-0.5 sm:mb-1 whitespace-nowrap">
                  Days until we meet
                </p>
                {isExpired ? (
                  <p className="text-center font-heading text-base sm:text-lg text-gold-300 whitespace-nowrap">We're live!</p>
                ) : (
                  <div className="flex items-end justify-center gap-1 sm:gap-1.5 lg:gap-2">
                    {[
                      { v: days, l: 'Days' },
                      { v: hours, l: 'Hrs' },
                      { v: minutes, l: 'Min' },
                      { v: seconds, l: 'Sec' },
                    ].map((u, i) => (
                      <div key={u.l} className="flex items-end gap-1 sm:gap-1.5 lg:gap-2">
                        <div className="text-center">
                          <p className="font-heading text-2xl sm:text-3xl lg:text-4xl leading-none text-cream-50 tabular-nums">
                            {String(u.v).padStart(2, '0')}
                          </p>
                          <p className="text-[7px] sm:text-[8px] lg:text-[9px] uppercase tracking-caps text-cream-300/70 mt-0.5 sm:mt-1">{u.l}</p>
                        </div>
                        {i < 3 && <span className="text-gold-500 text-lg sm:text-xl lg:text-2xl leading-none pb-3 sm:pb-4">:</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tiles — share the remaining 40% equally */}
              <div className="basis-[40%] min-w-0 flex flex-nowrap items-stretch gap-1 sm:gap-1.5">
                <Tile to="/yearbook"    icon="📖" label="Yearbook" />
                <Tile to="/our-journey" icon="🛤️" label="Our Journey" />
              </div>
            </div>
          </div>

          {/* Toggle: points right when open (collapse into the edge),
              left when collapsed (expand back out). */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="shrink-0 w-8 sm:w-9 min-h-[44px] flex items-center justify-center rounded-sm bg-[#111a2b] text-gold-400 border border-gold-500/40 hover:bg-[#182338] transition-colors"
            aria-expanded={open}
            aria-label={open ? 'Collapse widgets' : 'Expand widgets'}
            title={open ? 'Collapse widgets' : 'Expand widgets'}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-4 h-4 transition-transform duration-300 ${open ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
