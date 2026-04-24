// Client-side image resize + JPEG re-encode.
//
// Why: we persist alumni uploads as data-URL strings inside the shared JSONB
// blob (`app_state.data` in Postgres). Raw phone photos are 3–8 MB each — a
// handful would balloon the blob and make every debounced write-back slow.
// Resizing to 1600px max dimension at quality 0.82 lands most shots around
// 200–400 KB while still looking sharp in the gallery and lightbox.
//
// Returns: { dataUrl, width, height, bytes }

const DEFAULT_MAX_DIM = 1600;
const DEFAULT_QUALITY = 0.82;
const MAX_OUTPUT_BYTES = 1_500_000; // 1.5 MB hard cap — reject anything larger.

export async function resizeImageFile(
  file,
  { maxDim = DEFAULT_MAX_DIM, quality = DEFAULT_QUALITY } = {}
) {
  if (!file || !file.type?.startsWith('image/')) {
    throw new Error('Please select an image file.');
  }

  const bitmap = await loadBitmap(file);
  const { width: srcW, height: srcH } = bitmap;
  const scale = Math.min(1, maxDim / Math.max(srcW, srcH));
  const width = Math.round(srcW * scale);
  const height = Math.round(srcH * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, width, height);

  // Always re-encode as JPEG — PNG of a photo is 3-5× larger for no visible gain.
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const bytes = Math.ceil((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);

  if (bytes > MAX_OUTPUT_BYTES) {
    throw new Error(
      `Image is still ${(bytes / 1024 / 1024).toFixed(1)} MB after compression. Please pick a smaller photo.`
    );
  }

  // Release bitmap memory where supported (Safari < 16 lacks close()).
  if (typeof bitmap.close === 'function') bitmap.close();

  return { dataUrl, width, height, bytes };
}

async function loadBitmap(file) {
  // createImageBitmap is ~3× faster than <img> + FileReader where available,
  // and avoids the EXIF orientation quirks that plague the <img> path on iOS.
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      // Fall through to the <img> fallback below.
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image file.'));
    };
    img.src = url;
  });
}
