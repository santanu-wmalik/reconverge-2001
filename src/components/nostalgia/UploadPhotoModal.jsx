import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { photoApi } from '../../services/api';
import { resizeImageFile } from '../../utils/imageResize';

// Alumni-facing upload flow. Files never leave the browser as raw bytes: each
// is resized + re-encoded client-side, then persisted as a data URL through
// the existing `/photos` collection. Batch upload is sequential to avoid
// bursting the DB with parallel writes — this scales fine to a few dozen
// photos per session.

const CATEGORIES = [
  { value: 'batch', label: 'Batch Photos' },
  { value: 'hostel', label: 'Hostel Life' },
  { value: 'events', label: 'Events' },
  { value: 'campus', label: 'Campus' },
  { value: 'archive', label: 'Archive Scans' },
];

const MAX_BYTES_PER_FILE = 20 * 1024 * 1024; // 20 MB pre-resize sanity cap

// Each pending item goes through: processing → ready | error → uploading →
// done | uploadError. We keep failed items in the list so the user can retry
// only what didn't land, rather than re-picking the whole batch.
function newItem(file) {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
    file,
    preview: null,       // { dataUrl, width, height, bytes } after resize
    caption: '',         // per-photo override; blank = use shared caption
    status: 'processing',
    error: null,
  };
}

export default function UploadPhotoModal({ open, onClose, onUploaded }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileRef = useRef(null);

  const [items, setItems] = useState([]);       // array of pending items
  const [sharedCaption, setSharedCaption] = useState('');
  const [category, setCategory] = useState('batch');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, failed: 0 });

  const anyProcessing = items.some((it) => it.status === 'processing');
  const readyCount = items.filter((it) => it.status === 'ready').length;

  const reset = () => {
    setItems([]);
    setSharedCaption('');
    setCategory('batch');
    setProgress({ done: 0, total: 0, failed: 0 });
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleClose = () => {
    if (uploading) return; // Don't lose an in-flight batch on stray backdrop click.
    reset();
    onClose?.();
  };

  const updateItem = (id, patch) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const removeItem = (id) => {
    if (uploading) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleFiles = async (e) => {
    const picked = Array.from(e.target.files || []);
    if (fileRef.current) fileRef.current.value = ''; // allow re-picking same file
    if (!picked.length) return;

    const fresh = picked.map(newItem);
    setItems((prev) => [...prev, ...fresh]);

    // Resize in parallel — each item's row shows its own state.
    fresh.forEach(async (it) => {
      if (it.file.size > MAX_BYTES_PER_FILE) {
        updateItem(it.id, {
          status: 'error',
          error: `Too large (${(it.file.size / 1024 / 1024).toFixed(1)} MB). Max 20 MB.`,
        });
        return;
      }
      try {
        const resized = await resizeImageFile(it.file);
        updateItem(it.id, { preview: resized, status: 'ready' });
      } catch (err) {
        updateItem(it.id, {
          status: 'error',
          error: err.message || 'Could not process this image.',
        });
      }
    });
  };

  const handleSubmit = async () => {
    const toUpload = items.filter((it) => it.status === 'ready' || it.status === 'uploadError');
    if (!toUpload.length) {
      showToast('Pick at least one photo first.', 'error');
      return;
    }
    setUploading(true);
    setProgress({ done: 0, total: toUpload.length, failed: 0 });

    let done = 0;
    let failed = 0;

    // Sequential — one photo at a time. Prevents DB write bursts and keeps
    // failure attribution obvious (retry only what failed).
    for (const it of toUpload) {
      updateItem(it.id, { status: 'uploading', error: null });
      try {
        const captionText = (it.caption || sharedCaption).trim()
          || `Shared by ${user?.name || 'an alum'}`;
        const saved = await photoApi.create({
          url: it.preview.dataUrl,
          caption: captionText,
          category,
          uploaderId: user?.id || user?.alumniId || null,
          uploaderName: user?.name || 'Anonymous',
          width: it.preview.width,
          height: it.preview.height,
          bytes: it.preview.bytes,
          createdAt: new Date().toISOString(),
        });
        onUploaded?.(saved);
        updateItem(it.id, { status: 'done' });
        done += 1;
      } catch (err) {
        console.error('Photo upload failed', err);
        updateItem(it.id, {
          status: 'uploadError',
          error: err.message || 'Upload failed — try again.',
        });
        failed += 1;
      }
      setProgress({ done, total: toUpload.length, failed });
    }

    setUploading(false);

    if (failed === 0) {
      showToast(
        done === 1 ? 'Photo uploaded — thanks for sharing!' : `${done} photos uploaded — thanks!`,
        'success'
      );
      // Drop the completed items after a beat so the user sees the ✓ tick briefly.
      setTimeout(() => {
        setItems((prev) => prev.filter((it) => it.status !== 'done'));
        // If nothing left, close.
        setItems((prev) => {
          if (prev.length === 0) {
            reset();
            onClose?.();
          }
          return prev;
        });
      }, 700);
    } else {
      showToast(
        `Uploaded ${done} of ${done + failed}. ${failed} failed — retry from the list.`,
        'error'
      );
      // Remove successes; keep failures for retry.
      setItems((prev) => prev.filter((it) => it.status !== 'done'));
    }
  };

  const uploadLabel = uploading
    ? `Uploading ${progress.done + 1} of ${progress.total}…`
    : readyCount > 1
      ? `Upload ${readyCount} photos`
      : 'Upload';

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
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-primary-900/95 border border-white/10 shadow-2xl p-6"
          >
            <div className="flex items-start justify-between mb-5 sticky top-0 z-10 bg-primary-900/95 -mx-6 px-6 pb-3 border-b border-white/5">
              <div>
                <h2 className="text-xl font-heading font-bold text-white">Share Memories</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Pick one photo or many — upload them all in a single batch.
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

            {/* Picker — always shown so users can add more mid-batch */}
            <div
              className="relative rounded-xl border-2 border-dashed border-white/15 bg-white/5 py-6 flex items-center justify-center overflow-hidden mb-4 cursor-pointer hover:border-gold-400/40 transition-colors"
              onClick={() => !uploading && fileRef.current?.click()}
            >
              <div className="text-center px-4">
                <p className="text-slate-300 font-medium">
                  {items.length === 0
                    ? 'Tap to choose photos'
                    : 'Tap to add more photos'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  JPG or PNG · multiple selection allowed · auto-resized for faster upload
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFiles}
              />
            </div>

            {/* Shared caption & category — apply to all in this batch */}
            {items.length > 0 && (
              <div className="space-y-3 mb-5">
                <Input
                  label={
                    items.length > 1
                      ? 'Caption (applies to all — override per photo below)'
                      : 'Caption'
                  }
                  value={sharedCaption}
                  onChange={(e) => setSharedCaption(e.target.value)}
                  placeholder="Hostel D, farewell day 2001…"
                  maxLength={140}
                  disabled={uploading}
                />
                <Select
                  label="Category (applies to all)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={CATEGORIES}
                  disabled={uploading}
                />
              </div>
            )}

            {/* Thumbnail grid */}
            {items.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className={`relative rounded-lg overflow-hidden border ${
                      it.status === 'error' || it.status === 'uploadError'
                        ? 'border-red-500/40 bg-red-500/5'
                        : it.status === 'done'
                          ? 'border-emerald-500/40 bg-emerald-500/5'
                          : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="aspect-video bg-black/40 flex items-center justify-center">
                      {it.preview ? (
                        <img
                          src={it.preview.dataUrl}
                          alt={it.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">
                          {it.status === 'processing' ? 'Processing…' : 'No preview'}
                        </span>
                      )}
                    </div>

                    {/* Status pill */}
                    <div className="absolute top-1.5 left-1.5">
                      {it.status === 'processing' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-slate-200">Processing…</span>
                      )}
                      {it.status === 'uploading' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-500 text-navy-950 font-semibold">Uploading…</span>
                      )}
                      {it.status === 'done' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-navy-950 font-semibold">✓ Uploaded</span>
                      )}
                      {(it.status === 'error' || it.status === 'uploadError') && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500 text-white font-semibold">Failed</span>
                      )}
                    </div>

                    {/* Remove button */}
                    {!uploading && it.status !== 'done' && (
                      <button
                        type="button"
                        onClick={() => removeItem(it.id)}
                        aria-label="Remove"
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-500 text-white text-xs flex items-center justify-center transition"
                      >
                        ✕
                      </button>
                    )}

                    <div className="p-2 space-y-1">
                      <input
                        type="text"
                        value={it.caption}
                        onChange={(e) => updateItem(it.id, { caption: e.target.value })}
                        placeholder={sharedCaption || 'Caption for this photo (optional)'}
                        maxLength={140}
                        disabled={uploading || it.status === 'done'}
                        className="w-full text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500/40"
                      />
                      {it.preview && (
                        <p className="text-[10px] text-slate-500">
                          {it.preview.width}×{it.preview.height} · {(it.preview.bytes / 1024).toFixed(0)} KB
                        </p>
                      )}
                      {it.error && (
                        <p className="text-[10px] text-red-300 leading-snug">{it.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Progress bar during batch upload */}
            {uploading && progress.total > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>
                    Uploaded {progress.done} of {progress.total}
                    {progress.failed > 0 && ` · ${progress.failed} failed`}
                  </span>
                  <span>{Math.round((progress.done / progress.total) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 transition-all"
                    style={{ width: `${(progress.done / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-2 sticky bottom-0 bg-primary-900/95 -mx-6 px-6 pt-3 border-t border-white/5">
              <Button
                onClick={handleSubmit}
                loading={uploading}
                disabled={readyCount === 0 || anyProcessing}
              >
                {uploadLabel}
              </Button>
              <Button variant="ghost" onClick={handleClose} disabled={uploading}>
                {items.length > 0 ? 'Cancel' : 'Close'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
