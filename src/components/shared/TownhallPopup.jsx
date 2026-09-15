import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Announcement popup: "2nd Town Hall next week". Shows on the home page
// until the last session ends (20 Sept 2026), reappearing at most once per
// HOUR per browser; the Event page carries the full poster. Delete this component (or
// swap the EXPIRES/copy) for the next announcement.
const EXPIRES = new Date(2026, 8, 20, 23, 59, 59); // 20 Sept 2026 IST-ish local
const STORAGE_KEY = 'townhall2-popup-seen';

export default function TownhallPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (Date.now() > EXPIRES.getTime()) return;
    try {
      // Re-show hourly: suppress only if dismissed less than an hour ago.
      const last = parseInt(localStorage.getItem(STORAGE_KEY), 10);
      if (Number.isFinite(last) && Date.now() - last < 60 * 60 * 1000) return;
    } catch { /* storage unavailable — still show */ }
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch { /* ignore */ }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="relative max-w-md w-full bg-cream-50 border-2 border-gold-500/60 shadow-2xl p-6 sm:p-8 text-center"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="2nd Town Hall announcement"
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close announcement"
              className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center text-ink-soft hover:text-ink text-xl"
            >
              ✕
            </button>

            <p className="text-3xl mb-2" aria-hidden="true">📣</p>
            <p className="eyebrow">Next week</p>
            <h2 className="mt-2 text-3xl font-heading font-medium italic text-forest-600">
              2nd Town Hall
            </h2>
            <p className="mt-3 font-serif text-ink-soft text-sm leading-relaxed">
              Two sessions so every time zone makes it:<br />
              <b className="text-ink">Sat 19 Sept · 8–9 PM IST</b> and{' '}
              <b className="text-ink">Sun 20 Sept · 10–11 AM IST</b> on Google Meet.
              Updates, plans taking shape, and what's next.
            </p>

            <div className="mt-5 flex flex-col gap-2.5">
              <Link
                to="/event"
                onClick={dismiss}
                className="nav-caps px-6 py-3 bg-gradient-to-b from-gold-400 to-gold-600 text-forest-900 shadow hover:from-gold-300 hover:to-gold-500"
              >
                See the poster &amp; join info →
              </Link>
              <button type="button" onClick={dismiss} className="nav-caps text-ink-muted hover:text-ink py-2">
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
