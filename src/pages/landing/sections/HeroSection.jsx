import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountdownTimer from '../../../components/shared/CountdownTimer';
import AnimatedCounter from '../../../components/shared/AnimatedCounter';
import FloatingPhotos from '../../../components/shared/FloatingPhotos';
import Button from '../../../components/ui/Button';
import { EVENT_CONFIG, STATS } from '../../../data/constants';
import { staggerContainer, staggerItem } from '../../../utils/animationVariants';

const HERO_BG_IMAGES = [
  'https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/NITC-Rajpath1.jpg',
  'https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/calicut%20mini%20canteen.avif',
  'https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/calicut%20railway%20station.jpg',
  'https://storage.googleapis.com/reconverge-2001-uat-bucket/landing_page_pictures/nitc-mainblock-1.jpeg',
];

export default function HeroSection() {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {HERO_BG_IMAGES.map((url, i) => (
          <div
            key={url}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === currentBg ? 'opacity-50' : 'opacity-0'
            }`}
          >
            <img
              src={url}
              alt={`Campus ${i}`}
              className="w-full h-full object-cover grayscale"
            />
          </div>
        ))}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      </div>

      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden z-[1]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <FloatingPhotos />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center py-20">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          {/* Badge */}
          <motion.div variants={staggerItem} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-400/20 text-gold-400 text-sm font-medium">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              25 Glorious Years
            </span>
          </motion.div>

          {/* Logo */}
          <motion.div variants={staggerItem} className="flex justify-center mb-6">
            <img src={EVENT_CONFIG.logoUrl} alt="REConverge 2001" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={staggerItem}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-4 leading-tight"
          >
            <span className="block"><span className="text-red-500">REC</span>onverge</span>
            <span className="block gradient-text">2001</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={staggerItem}
            className="text-lg md:text-xl text-gold-400 font-heading italic max-w-2xl mx-auto mb-2"
          >
            {EVENT_CONFIG.tagline}
          </motion.p>

          <motion.p
            variants={staggerItem}
            className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto mb-4"
          >
            {EVENT_CONFIG.heroQuote}
          </motion.p>

          {/* Venue info */}
          <motion.p variants={staggerItem} className="text-sm text-slate-400 mb-8">
            {EVENT_CONFIG.displayDates} | {EVENT_CONFIG.venue.name}
          </motion.p>

          {/* Countdown */}
          <motion.div variants={staggerItem} className="flex justify-center mb-10">
            <CountdownTimer targetDate={EVENT_CONFIG.eventDate} />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <Link to="/rsvp">
              <Button size="lg" className="animate-pulse-glow">RSVP Now</Button>
            </Link>
            <Link to="/yearbook">
              <Button size="lg" variant="outline">Yearbook</Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerItem}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="glass px-4 py-4">
                <div className="text-2xl md:text-3xl font-bold font-heading gradient-text">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs md:text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent z-[2]" />
    </section>
  );
}
