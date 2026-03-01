import { galleryPhotos } from '../../data/galleryPhotos';
import ProtectedImage from './ProtectedImage';

// Use all photos for both strips (duplicated for seamless loop)
const allPhotos = galleryPhotos.map((p) => p.url);

const photoClass = 'w-full aspect-[4/3] object-cover rounded-sm shadow-inner opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300';

function FilmPhoto({ url, keyPrefix, index }) {
  return (
    <div key={`${keyPrefix}-${index}`} className="px-5 mb-3">
      <ProtectedImage
        src={url}
        alt="nostalgia"
        imgClassName={photoClass}
      />
    </div>
  );
}

export default function FloatingPhotos() {
  return (
    <>
      {/* Left film strip - scrolls down */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-44 film-strip z-10">
        <div className="flex flex-col animate-film-scroll py-4">
          {allPhotos.map((url, i) => (
            <FilmPhoto key={`l1-${i}`} url={url} keyPrefix="l1" index={i} />
          ))}
          {allPhotos.map((url, i) => (
            <FilmPhoto key={`l2-${i}`} url={url} keyPrefix="l2" index={i} />
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
            <FilmPhoto key={`r1-${i}`} url={url} keyPrefix="r1" index={i} />
          ))}
          {allPhotos.map((url, i) => (
            <FilmPhoto key={`r2-${i}`} url={url} keyPrefix="r2" index={i} />
          ))}
        </div>
      </div>
    </>
  );
}
