import { motion } from 'framer-motion';
import { galleryVideos } from '../../data/galleryPhotos';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import GlassCard from '../../components/ui/GlassCard';
import SectionHeading from '../../components/shared/SectionHeading';

export default function VideoGalleryPage() {
  return (
    <motion.div {...pageTransition}>
      <SectionHeading title="Video Gallery" subtitle="Watch and relive the memorable moments" />
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {galleryVideos.map((v) => (
          <motion.div key={v.id} variants={staggerItem}>
            <GlassCard>
              <div className="relative rounded-xl overflow-hidden mb-3">
                <img src={v.thumbnail} alt={v.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">▶️</div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{v.duration}</span>
              </div>
              <h3 className="text-white font-semibold text-sm">{v.title}</h3>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
