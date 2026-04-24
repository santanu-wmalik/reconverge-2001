import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { photoApi } from '../../services/api';
import { resizeImageFile } from '../../utils/imageResize';

// Alumni-facing upload flow. The file never leaves the browser as raw bytes:
// we resize + re-encode client-side, then persist a data URL through the
// existing json-server-backed `/photos` collection. This keeps the stack
// unchanged (no object store, no multer) at the cost of a fatter JSONB blob —
// acceptable at reunion scale (a few hundred photos × ~300 KB each).

const CATEGORIES = [
  { value: 'batch', label: 'Batch Photos' },
  { value: 'hostel', label: 'Hostel Life' },
  { value: 'events', label: 'Events' },
  { value: 'campus', label: 'Campus' },
  { value: 'archive', label: 'Archive Scans' },
];

export default function UploadPhotoModal({ open, onClose, onUploaded }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileRef = useRef(null);

  const [preview, setPreview] = useState(null); // { dataUrl, bytes }
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('batch');
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const reset = () => {
    setPreview(null);
    setCaption('');
    setCategory('batch');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleClose = () => {
    if (uploading) return; // Don't lose an in-flight upload on stray backdrop click.
    reset();
    onClose?.();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    try {
      const resized = await resizeImageFile(file);
      setPreview(resized);
    } catch (err) {
      showToast(err.message || 'Could not process that image.', 'error');
      if (fileRef.current) fileRef.current.value = '';
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (!preview) {
      showToast('Pick a photo first.', 'error');
      return;
    }
    setUploading(true);
    try {
      const saved = await photoApi.create({
        url: preview.dataUrl,
        caption: caption.trim() || `Shared by ${user?.name || 'an alum'}`,
        category,
        uploaderId: user?.id || user?.alumniId || null,
        uploaderName: user?.name || 'Anonymous',
        width: preview.width,
        height: preview.height,
        bytes: preview.bytes,
        createdAt: new Date().toISOString(),
      });
      showToast('Photo uploaded — thanks for sharing!', 'success');
      onUploaded?.(saved);
      reset();
      onClose?.();
    } catch (err) {
      console.error('Photo upload failed', err);
      showToast('Upload failed. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-primary-900/95 border border-white/10 shadow-2xl p-6"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-heading font-bold text-white">Share a Memory</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Upload an old photo for the whole batch to see.
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={uploading}
                className="text-slate-400 hover:text-white transition-colors disabled:opacity-40"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Preview / picker */}
            <div
              className="relative rounded-xl border-2 border-dashed border-white/15 bg-white/5 aspect-video flex items-center justify-center overflow-hidden mb-4 cursor-pointer hover:border-gold-400/40 transition-colors"
              onClick={() => !processing && !uploading && fileRef.current?.click()}
            >
              {preview ? (
                <img
                  src={preview.dataUrl}
                  alt="preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center px-4">
                  <p className="text-slate-300 font-medium">
                    {processing ? 'Processing photo…' : 'Tap to choose a photo'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    JPG or PNG · auto-resized for faster upload
                  </p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </div>

            {preview && (
              <p className="text-xs text-slate-500 mb-3">
                {preview.width}×{preview.height} · {(preview.bytes / 1024).toFixed(0)} KB after compression
              </p>
            )}

            <div className="space-y-3">
              <Input
                label="Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Hostel D, farewell day 2001…"
                maxLength={140}
              />
              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={CATEGORIES}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSubmit}
                loading={uploading}
                disabled={!preview || processing}
              >
                Upload
              </Button>
              <Button variant="ghost" onClick={handleClose} disabled={uploading}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
