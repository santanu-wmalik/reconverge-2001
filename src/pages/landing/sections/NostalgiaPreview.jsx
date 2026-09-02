import { Link } from 'react-router-dom';
import ProtectedImage from '../../../components/shared/ProtectedImage';
import { galleryPhotos, scanThumb } from '../../../data/galleryPhotos';

// "Alumni Vault" — rect1an's two-row drifting photo wall of college-day
// photos. Rows move in opposite directions.
function Row({ urls, reverse }) {
  const loop = [...urls, ...urls];
  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-3 w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ animationDuration: '55s' }}
      >
        {loop.map((u, i) => (
          <div key={i} className="flex-shrink-0 bg-white p-1 shadow-md border border-forest-500/10">
            <ProtectedImage src={u} alt="" loading="eager" imgClassName="h-32 md:h-36 w-auto object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NostalgiaPreview() {
  const urls = galleryPhotos.map((p) => scanThumb(p.url));
  const half = Math.ceil(urls.length / 2);
  const rowA = urls.slice(0, half);
  const rowB = urls.slice(half).length ? urls.slice(half) : urls;

  return (
    <section className="py-16 md:py-20">
      <div className="text-center px-4 mb-8">
        <span className="eyebrow">Batch of 2001</span>
        <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-heading font-medium italic text-forest-600">Alumni Vault</h2>
        <p className="mt-2 font-serif text-ink-muted">Cherished photos from college days</p>
      </div>
      <div className="space-y-3">
        <Row urls={rowA} />
        <Row urls={rowB} reverse />
      </div>
      <div className="text-center mt-8">
        <Link to="/yearbook" className="nav-caps px-6 py-3 border-2 border-forest-600/60 text-forest-700 hover:bg-forest-600/8">
          Explore the Yearbook →
        </Link>
      </div>
    </section>
  );
}
