import { useState } from 'react';
import { motion } from 'framer-motion';
import { galleryPhotos, galleryCategories } from '../../data/galleryPhotos';
import { pageTransition } from '../../utils/animationVariants';
import PhotoGrid from '../../components/shared/PhotoGrid';
import Tabs from '../../components/ui/Tabs';
import SectionHeading from '../../components/shared/SectionHeading';

export default function PhotoGalleryPage() {
  const [category, setCategory] = useState('all');

  const filtered = category === 'all' ? galleryPhotos : galleryPhotos.filter((p) => p.category === category);

  return (
    <motion.div {...pageTransition}>
      <SectionHeading title="Photo Gallery" subtitle="A visual journey through campus life" />
      <Tabs tabs={galleryCategories.map((c) => ({ id: c.id, label: c.label }))} activeTab={category} onChange={setCategory} className="mb-8" />
      <PhotoGrid photos={filtered} columns={3} />
    </motion.div>
  );
}
