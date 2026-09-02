import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleryPhotos } from '../../../data/galleryPhotos';
import { publicApi } from '../../../services/api';
import ProtectedImage from '../../../components/shared/ProtectedImage';
import { useAuth } from '../../../context/AuthContext';

// "Then & Now" — two horizontal film strips fed by GET /api/public/then-and-now
// (server/public.js; unauthenticated, url/caption/era only).
//   THEN — the curated scanned prints (galleryPhotos.js) + uploads tagged 'then'
//   NOW  — uploads tagged 'now' (recent photos)
// Every upload defaults to 'then'; admins re-tag from the gallery lightbox.

function Strip({ label, sub, urls, reverse = false, empty }) {
  if (urls.length === 0) {
    return (
      <div className="px-4">
        <div className="max-w-3xl mx-auto border border-dashed border-forest-500/30 bg-cream-200/50 px-6 py-8 text-center">
          <p className="nav-caps text-gold-700 mb-1">{label}</p>
          <p className="font-serif text-ink-muted">{empty}</p>
        </div>
      </div>
    );
  }
  const loop = [...urls, ...urls];
  return (
    <div>
      <div className="flex items-baseline justify-center gap-3 mb-2 px-4">
        <span className="nav-caps text-gold-700">{label}</span>
        <span className="font-serif italic text-ink-muted text-sm">{sub}</span>
      </div>
      <div className="film-strip-h py-5">
        <div
          className={`flex items-center gap-4 w-max px-4 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
          style={{ animationDuration: `${Math.max(40, urls.length * 6)}s` }}
        >
          {loop.map((url, i) => (
            <div key={i} className="flex-shrink-0 border border-white/10 bg-black p-1">
              <ProtectedImage src={url} alt="" imgClassName="h-28 md:h-32 w-auto object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ThenAndNow() {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState({ then: [], now: [] });

  useEffect(() => {
    let cancelled = false;
    publicApi.thenAndNow()
      .then((d) => { if (!cancelled && d) setData({ then: d.then || [], now: d.now || [] }); })
      .catch(() => { /* strips still render from the curated set */ });
    return () => { cancelled = true; };
  }, []);

  const thenUrls = [...galleryPhotos.map((p) => p.url), ...data.then.map((p) => p.url)];
  const nowUrls = data.now.map((p) => p.url);

  return (
    <section className="py-16 md:py-20">
      <div className="text-center px-4 mb-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-medium italic text-forest-600">Then &amp; Now</h2>
        <p className="mt-2 font-serif text-ink-muted">Upload a pair — one from 2001, one from today</p>
        <Link
          to={isAuthenticated ? '/nostalgia/photos' : '/login'}
          className="nav-caps inline-block mt-4 px-6 py-3 border-2 border-gold-500 text-gold-800 bg-[#fbf7ea] hover:bg-gold-500/15 min-w-[320px]"
        >
          + Upload / modify Then &amp; Now photos
        </Link>
      </div>

      <div className="space-y-8">
        <Strip
          label="Then · 2001"
          sub="the college days"
          urls={thenUrls}
          empty="No photos yet."
        />
        <Strip
          label="Now · 2026"
          sub="twenty-five years on"
          urls={nowUrls}
          reverse
          empty="No 'Now' photos yet — upload a recent one and tag it Now to be the first."
        />
      </div>
    </section>
  );
}
