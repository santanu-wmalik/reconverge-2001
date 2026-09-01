import { useState, useEffect, useMemo } from 'react';

// Campus photos live at /images/campus/*.png (see public/images/campus).
// Add / rename files there and update this list. Kept as a plain array so
// Vite's static asset pipeline serves them directly with long-cache headers.
const BG_IMAGES = [
  '/images/campus/Admin-building.png',
  '/images/campus/Drone-view-1.png',
  '/images/campus/Drone-view.png',
  '/images/campus/Front-gate.png',
  '/images/campus/Front-view.png',
  '/images/campus/Rajpath.png',
];

// Fisher-Yates — deterministic per component-mount so the same session
// doesn't reshuffle on every state change, but each page load starts with
// a different opener image.
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BackgroundSlideshow() {
  const [current, setCurrent] = useState(0);
  const images = useMemo(() => shuffled(BG_IMAGES), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {images.map((url, i) => (
        <div
          key={url}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? 'opacity-60' : 'opacity-0'
          }`}
        >
          <img
            src={url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      {/* Softer gradient so the photo shows through more than the previous
          heavy black wash. Vignette-ish top/bottom to keep header + footer
          text legible. */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60" />
    </div>
  );
}
