import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeading from '../../../components/shared/SectionHeading';
import ProtectedImage from '../../../components/shared/ProtectedImage';
import Button from '../../../components/ui/Button';
import { EVENT_CONFIG, CAMPUS_PHOTOS } from '../../../data/constants';
import { staggerContainer, staggerItem } from '../../../utils/animationVariants';

export default function NostalgiaPreview() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Echoes of Calicut"
          subtitle="A visual journey back to REC Calicut"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8"
        >
          {CAMPUS_PHOTOS.map((photo, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="relative group rounded-xl overflow-hidden aspect-square"
            >
              <ProtectedImage
                src={EVENT_CONFIG.storageBaseUrl + photo.src}
                alt={photo.title}
                imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <p className="text-white font-semibold text-sm">{photo.title}</p>
                  <p className="text-slate-300 text-xs">{photo.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center">
          <Link to="/yearbook">
            <Button variant="outline" size="lg">Explore Yearbook</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
