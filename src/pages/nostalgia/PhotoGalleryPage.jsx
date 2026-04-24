import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { galleryPhotos, galleryCategories } from '../../data/galleryPhotos';
import { pageTransition } from '../../utils/animationVariants';
import PhotoGrid from '../../components/shared/PhotoGrid';
import Tabs from '../../components/ui/Tabs';
import SectionHeading from '../../components/shared/SectionHeading';
import Button from '../../components/ui/Button';
import UploadPhotoModal from '../../components/nostalgia/UploadPhotoModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { photoApi } from '../../services/api';

export default function PhotoGalleryPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [category, setCategory] = useState('all');
  const [uploads, setUploads] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  // Load alumni uploads alongside the curated gallery. Failures are silent —
  // the curated set below still renders, so a broken API doesn't take the
  // page down.
  useEffect(() => {
    photoApi.getAll().then(setUploads).catch((err) => {
      console.warn('Could not load alumni uploads:', err);
    });
  }, []);

  // Alumni uploads come first so a fresh contribution is immediately visible.
  const all = [...uploads, ...galleryPhotos];
  const filtered = category === 'all' ? all : all.filter((p) => p.category === category);

  // Only alumni uploads (those with an id that maps to our uploads list) and
  // owned by the current user are deletable. Super-admins can delete any
  // uploaded photo — curated gallery entries from galleryPhotos.js are not
  // touchable from the UI (they live in source).
  const isUpload = (photo) => uploads.some((u) => u.id === photo.id);
  const canDelete = (photo) => {
    if (!user || !isUpload(photo)) return false;
    if (user.role === 'super-admin') return true;
    const myId = user.id || user.alumniId;
    return photo.uploaderId && photo.uploaderId === myId;
  };

  const handleDelete = async (photo) => {
    // Optimistic remove — restore on failure so a transient API error doesn't
    // silently hide a photo until the next refetch.
    const prev = uploads;
    setUploads((list) => list.filter((p) => p.id !== photo.id));
    try {
      await photoApi.remove(photo.id);
      showToast('Photo removed.', 'success');
    } catch (err) {
      console.error('Photo delete failed', err);
      setUploads(prev);
      showToast('Could not delete photo. Try again.', 'error');
    }
  };

  return (
    <motion.div {...pageTransition}>
      <SectionHeading
        title="Photo Gallery"
        subtitle="A visual journey through campus life"
      />
      {user && (
        <div className="flex justify-end mb-4">
          <Button onClick={() => setUploadOpen(true)}>+ Upload Photo</Button>
        </div>
      )}

      <Tabs
        tabs={galleryCategories.map((c) => ({ id: c.id, label: c.label }))}
        activeTab={category}
        onChange={setCategory}
        className="mb-8"
      />
      <PhotoGrid
        photos={filtered}
        columns={3}
        canDelete={canDelete}
        onDelete={handleDelete}
      />

      <UploadPhotoModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={(p) => setUploads((prev) => [p, ...prev])}
      />
    </motion.div>
  );
}
