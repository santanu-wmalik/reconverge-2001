import { useState, useEffect } from 'react';

const BG_IMAGES = [
  'https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/NITC-Rajpath1.jpg',
  'https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/calicut%20mini%20canteen.avif',
  'https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/calicut%20railway%20station.jpg',
  'https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/nitc-mainblock-1.jpeg',
];

export default function BackgroundSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {BG_IMAGES.map((url, i) => (
        <div
          key={url}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? 'opacity-20' : 'opacity-0'
          }`}
        >
          <img
            src={url}
            alt=""
            className="w-full h-full object-cover grayscale"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
    </div>
  );
}
