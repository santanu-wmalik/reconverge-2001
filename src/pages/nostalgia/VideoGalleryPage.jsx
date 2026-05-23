import { motion } from 'framer-motion';
import { galleryVideos } from '../../data/galleryPhotos';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import SectionHeading from '../../components/shared/SectionHeading';
import { formatDate } from '../../utils/formatters';

// Pull the 11-char id out of any common YouTube URL shape:
//   https://www.youtube.com/watch?v=ID
//   https://youtu.be/ID
//   https://www.youtube.com/embed/ID
// Returns null if we can't find one — the card then falls back to a plain
// link instead of breaking the iframe with garbage.
function youtubeIdFrom(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null;
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const m = u.pathname.match(/\/embed\/([\w-]{6,})/);
    if (m) return m[1];
  } catch {
    // not a valid URL — ignore
  }
  return null;
}

export default function VideoGalleryPage() {
  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="Video Gallery"
        subtitle="Watch and relive the memorable moments"
      />

      {galleryVideos.length === 0 ? (
        <p className="text-center text-slate-400 py-12">
          No videos yet — check back as more clips are added.
        </p>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-5"
        >
          {galleryVideos.map((v) => {
            const id = youtubeIdFrom(v.youtubeUrl);
            return (
              <motion.div key={v.id} variants={staggerItem}>
                <GlassCard hover={false}>
                  {id ? (
                    // 16:9 responsive wrapper — works on phones without the
                    // iframe overflowing or getting clipped.
                    <div
                      className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 mb-3"
                      style={{ paddingTop: '56.25%' }}
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${id}?rel=0`}
                        title={v.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  ) : (
                    <a
                      href={v.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-gold-400 underline mb-3"
                    >
                      Watch on YouTube ↗
                    </a>
                  )}
                  <h3 className="text-white font-heading font-semibold">{v.title}</h3>
                  {v.description && (
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{v.description}</p>
                  )}
                  {v.publishedAt && (
                    <p className="text-[11px] uppercase tracking-wider text-slate-500 mt-2">
                      {formatDate(v.publishedAt, { month: 'short' })}
                    </p>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
