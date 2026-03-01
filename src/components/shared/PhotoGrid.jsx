import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../utils/animationVariants';
import ProtectedImage from './ProtectedImage';

export default function PhotoGrid({ photos, columns = 3 }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const columnClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
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
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-3 -right-3 w-8 h-8 bg-white/10 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/20"
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
