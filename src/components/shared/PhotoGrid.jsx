import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../utils/animationVariants';
import ProtectedImage from './ProtectedImage';

// Stable signature for the grid container's remount key. Using photo count +
// first/last ids means: filter change, new upload, or delete all trigger a
// clean re-render of the stagger animation — without thrashing on unrelated
// parent re-renders (which would be the case with Math.random / Date.now).
function gridKey(photos) {
  if (!photos.length) return 'empty';
  return `${photos.length}-${photos[0].id}-${photos[photos.length - 1].id}`;
}

// Optional props:
//   canEditEra(photo) → bool   show the Then/Now switch in the lightbox
//   onSetEra(photo, era)       persist a change ('then' | 'now')
export default function PhotoGrid({ photos, columns = 3, canDelete, onDelete, canEditEra, onSetEra }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [savingEra, setSavingEra] = useState(false);

  const handleDelete = async () => {
    if (!selectedPhoto || !onDelete) return;
    if (!window.confirm('Remove this photo? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await onDelete(selectedPhoto);
      setSelectedPhoto(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleSetEra = async (era) => {
    if (!selectedPhoto || !onSetEra || selectedPhoto.era === era) return;
    setSavingEra(true);
    try {
      await onSetEra(selectedPhoto, era);
      setSelectedPhoto((p) => (p ? { ...p, era } : p));
    } finally {
      setSavingEra(false);
    }
  };

  const columnClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <>
      <motion.div
        key={gridKey(photos)}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={`grid ${columnClass[columns] || columnClass[3]} gap-3 md:gap-4`}
      >
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            variants={staggerItem}
            whileHover={{ scale: 1.03 }}
            className="relative group cursor-pointer rounded-xl overflow-hidden aspect-square"
            onClick={() => setSelectedPhoto(photo)}
          >
            <ProtectedImage
              src={photo.url}
              alt={photo.caption}
              imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Era badge — only alumni uploads carry `era`; curated entries don't. */}
            {photo.era && (
              <span
                className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                  photo.era === 'now'
                    ? 'bg-emerald-500/90 text-white'
                    : 'bg-black/60 text-gold-300 border border-gold-400/40'
                }`}
              >
                {photo.era === 'now' ? 'Now' : 'Then'}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="absolute bottom-3 left-3 right-3 text-sm text-white font-medium">
                {photo.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <ProtectedImage
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                imgClassName="max-w-full max-h-[70vh] object-contain rounded-xl"
              />
              <p className="text-center text-white mt-3 text-sm">{selectedPhoto.caption}</p>

              {canEditEra?.(selectedPhoto) && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 mr-1">Shown as</span>
                  {[
                    { v: 'then', l: 'Then' },
                    { v: 'now', l: 'Now' },
                  ].map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      disabled={savingEra}
                      onClick={() => handleSetEra(o.v)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition disabled:opacity-50 ${
                        (selectedPhoto.era || 'then') === o.v
                          ? 'bg-gold-500 text-primary-900 border-gold-500'
                          : 'bg-white/10 text-slate-200 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              )}

              {canDelete?.(selectedPhoto) && (
                <div className="text-center mt-3">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 text-sm rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 disabled:opacity-50"
                  >
                    {deleting ? 'Deleting…' : 'Delete photo'}
                  </button>
                </div>
              )}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/20"
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
