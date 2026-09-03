import { Link } from 'react-router-dom';
import ProtectedImage from '../../../components/shared/ProtectedImage';
import { galleryPhotos, scanThumb } from '../../../data/galleryPhotos';

// "Alumni Vault" — a STATIC wall of small college-day thumbnails (no
// marquee, per volunteer request): quick to scan, cheap on mobile data.
export default function NostalgiaPreview() {
  const urls = galleryPhotos.map((p) => scanThumb(p.url));

  return (
    <section className="py-16 md:py-20">
      <div className="text-center px-4 mb-8">
        <span className="eyebrow">Batch of 2001</span>
        <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-heading font-medium italic text-forest-600">Alumni Vault</h2>
        <p className="mt-2 font-serif text-ink-muted">Cherished photos from college days</p>
      </div>

      <div className="w-full px-1 sm:px-2">
        <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-[repeat(32,minmax(0,1fr))] gap-1">
          {urls.map((u, i) => (
            <div key={i} className="bg-white p-px shadow-sm border border-forest-500/10">
              <ProtectedImage src={u} alt="" className="block" imgClassName="aspect-square w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link to="/yearbook" className="nav-caps px-6 py-3 border-2 border-forest-600/60 text-forest-700 hover:bg-forest-600/8">
          Explore the Yearbook →
        </Link>
      </div>
    </section>
  );
}
