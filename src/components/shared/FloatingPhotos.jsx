import { galleryPhotos } from '../../data/galleryPhotos';

// Use all photos for both strips (duplicated for seamless loop)
const allPhotos = galleryPhotos.map((p) => p.url);

export default function FloatingPhotos() {
  return (
    <>
      {/* Left film strip - scrolls down */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-44 film-strip z-10">
        <div className="flex flex-col animate-film-scroll py-4">
          {allPhotos.map((url, i) => (
            <div key={`l1-${i}`} className="px-5 mb-3">
              <img
                src={url}
                alt="nostalgia"
                className="w-full aspect-[4/3] object-cover rounded-sm shadow-inner opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
          {allPhotos.map((url, i) => (
            <div key={`l2-${i}`} className="px-5 mb-3">
              <img
                src={url}
                alt="nostalgia"
                className="w-full aspect-[4/3] object-cover rounded-sm shadow-inner opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right film strip - scrolls up (reversed) */}
      <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-44 film-strip z-10">
        <div
          className="flex flex-col animate-film-scroll py-4"
          style={{ animationDirection: 'reverse' }}
        >
          {allPhotos.map((url, i) => (
            <div key={`r1-${i}`} className="px-5 mb-3">
              <img
                src={url}
                alt="nostalgia"
                className="w-full aspect-[4/3] object-cover rounded-sm shadow-inner opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
          {allPhotos.map((url, i) => (
            <div key={`r2-${i}`} className="px-5 mb-3">
              <img
                src={url}
                alt="nostalgia"
                className="w-full aspect-[4/3] object-cover rounded-sm shadow-inner opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
