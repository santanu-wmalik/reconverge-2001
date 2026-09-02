import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Lightweight, site-wide announcement banner. Reads the `announcements`
// collection from json-server (/api/announcements) and shows the most recent
// active entry. Users can dismiss individual announcements per-session.
//
// A volunteer with admin access can POST a new announcement to the API, or the
// db.json can be edited directly. Fields:
//   { id, title, body, level ('info'|'warning'|'success'), active, createdAt,
//     ctaLabel?, ctaHref? }

const LEVEL_STYLES = {
  info: 'bg-primary-900/70 border-primary-400/30 text-primary-100',
  warning: 'bg-amber-900/60 border-amber-500/30 text-amber-100',
  success: 'bg-emerald-900/60 border-emerald-500/30 text-emerald-100',
};

export default function AnnouncementsBanner() {
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('dismissedAnnouncements') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/announcements')
      .then((r) => (r.ok ? r.json() : []))
      .then((items) => {
        if (cancelled) return;
        const active = (items || [])
          .filter((a) => a.active !== false)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAnnouncement(active[0] || null);
      })
      .catch(() => setAnnouncement(null));
    return () => { cancelled = true; };
  }, []);

  const handleDismiss = () => {
    if (!announcement) return;
    const next = [...dismissed, announcement.id];
    setDismissed(next);
    try { sessionStorage.setItem('dismissedAnnouncements', JSON.stringify(next)); } catch { /* ignore */ }
  };

  if (!announcement || dismissed.includes(announcement.id)) return null;

  const style = LEVEL_STYLES[announcement.level] || LEVEL_STYLES.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative z-40 overflow-hidden"
      >
        <div className={`border-b backdrop-blur-xl ${style}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-3">
            <span className="flex-shrink-0 text-base">📣</span>
            <div className="flex-1 min-w-0 text-sm">
              <span className="font-semibold">{announcement.title}</span>
              {announcement.body && <span className="opacity-90"> — {announcement.body}</span>}
              {announcement.ctaLabel && announcement.ctaHref && (
                <a
                  href={announcement.ctaHref}
                  className="ml-2 underline font-medium hover:opacity-80"
                  target={announcement.ctaHref.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                >
                  {announcement.ctaLabel}
                </a>
              )}
            </div>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss announcement"
              className="flex-shrink-0 p-1 rounded-md hover:bg-forest-600/8 dark:hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
