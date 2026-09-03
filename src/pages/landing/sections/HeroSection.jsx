import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EVENT_CONFIG, STATS, EARLY_BIRD_DEADLINE } from '../../../data/constants';
import AnimatedCounter from '../../../components/shared/AnimatedCounter';
import { staggerContainer, staggerItem } from '../../../utils/animationVariants';
import { useAuth } from '../../../context/AuthContext';

// rect1an-style hero.
//   Desktop (md+): split — Rajpath under a forest tint on the left with a
//     diagonal edge; Admin building full-bleed on the right; left-aligned copy.
//   Mobile (<md): mimics rect1an's phone layout — a full-width solid green
//     panel with CENTRED copy, no diagonal, and the Admin-building photo as
//     its own block directly beneath the panel.
// Both images are fixed (no rotation).

const RIGHT_IMAGE = '/images/campus/Admin-building-web.jpg'; // 1600px web build of the 3 MB PNG
const LEFT_IMAGE  = '/images/campus/Rajpath-web.jpg';

export default function HeroSection() {
  const { isAuthenticated } = useAuth();
  const daysLeft = Math.max(0, Math.ceil((EARLY_BIRD_DEADLINE - Date.now()) / 86400000));
  const earlyBirdOver = daysLeft === 0;

  return (
    <>
      <section className="relative overflow-hidden bg-forest-800">
        {/* Right: Admin building — desktop only as the backdrop */}
        <div className="hidden md:block absolute inset-0">
          <img src={RIGHT_IMAGE} alt="NIT Calicut administrative building" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-900/40 via-transparent to-transparent" />
        </div>

        {/* Left: forest panel — full width on mobile, 58% + diagonal on md+ */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[58%] md:clip-diagonal-right overflow-hidden">
          <img src={LEFT_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-forest-panel opacity-85" />
          <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:26px_26px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-6 pb-6 md:pt-24 md:pb-32 md:min-h-[64vh] flex items-center justify-center md:justify-start">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-xl text-cream-50 text-center md:text-left flex flex-col items-center md:items-start"
          >
            {/* 25 star badge + logo */}
            <motion.div variants={staggerItem} className="mb-3 md:mb-4 flex items-center gap-3">
              <span className="relative inline-flex items-center justify-center w-11 h-11">
                <svg viewBox="0 0 24 24" className="w-11 h-11 drop-shadow-[0_0_6px_rgba(255,255,255,0.55)]" aria-hidden="true">
                  <defs>
                    <linearGradient id="silverStar" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="35%" stopColor="#dfe4ea" />
                      <stop offset="55%" stopColor="#f7f9fb" />
                      <stop offset="80%" stopColor="#aab4bf" />
                      <stop offset="100%" stopColor="#8f9aa7" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#silverStar)" stroke="#ffffff" strokeWidth="0.6" d="M12 2l2.9 6.6 7.1.7-5.3 4.8 1.6 7L12 17.6 5.7 21.1l1.6-7L2 9.3l7.1-.7L12 2z" />
                </svg>
                <span className="absolute text-[10px] font-bold text-forest-900">25</span>
              </span>
              <img src={EVENT_CONFIG.logoUrl} alt="REConverge 2001" className="w-11 h-11 rounded-full ring-1 ring-gold-400/60 object-contain bg-white/90" />
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="font-heading font-bold leading-none text-4xl sm:text-6xl md:text-7xl mb-2 md:mb-3 tracking-tight"
            >
              <span className="text-gold-400">REC</span>
              <span className="text-cream-50">onverge</span>
            </motion.h1>

            <motion.p variants={staggerItem} className="nav-caps text-cream-200/90 mb-3 md:mb-4">
              Batch 2001 — Silver Jubilee Reunion
            </motion.p>

            <motion.p
              variants={staggerItem}
              className="font-heading italic text-xl sm:text-3xl md:text-4xl text-cream-50 mb-3 md:mb-4"
            >
              {EVENT_CONFIG.tagline}
            </motion.p>

            {/* thin gold rule — rect1an mobile detail; hidden on desktop */}
            <motion.span variants={staggerItem} className="md:hidden block h-px w-40 bg-gold-400/40 mb-3" aria-hidden="true" />

            <motion.p variants={staggerItem} className="nav-caps text-cream-200/80 mb-5 md:mb-7">
              {EVENT_CONFIG.displayDates} · {EVENT_CONFIG.venue.city}
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 mb-3 md:mb-4"
            >
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="nav-caps w-[78%] max-w-[320px] sm:w-auto sm:max-w-none px-8 py-4 text-center border-2 border-transparent bg-gradient-to-b from-[#f7f9fb] via-[#cfd6de] to-[#9aa5b1] text-[#16202b] shadow-lg shadow-black/30 ring-1 ring-white/70 hover:from-white hover:via-[#dde3e9] hover:to-[#aab4bf] transition"
                >
                  Sign Up
                </Link>
              )}
              <a
                href="#event-highlights"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('event-highlights')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="nav-caps w-[78%] max-w-[320px] sm:w-auto sm:max-w-none px-8 py-4 text-center border-2 border-cream-100/80 text-cream-50 hover:bg-cream-100/10 transition"
              >
                View Schedule
              </a>
            </motion.div>

            {!isAuthenticated && (
            <motion.div variants={staggerItem} className="mb-3 md:mb-4">
              <Link
                to="/rsvp"
                className="nav-caps text-cream-200/90 underline underline-offset-4 decoration-gold-400/60 hover:text-gold-300"
              >
                Show Interest
              </Link>
            </motion.div>
          )}

            {!earlyBirdOver && (
              <motion.div variants={staggerItem}>
                <Link
                  to={isAuthenticated ? '/early-bird' : '/register'}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 min-h-[44px] sm:min-h-0 text-[11px] font-semibold bg-cream-50/10 border border-gold-400/50 text-gold-200 hover:bg-cream-50/15"
                >
                  <span>🎟</span>
                  <span>Early Bird ends 30 Sept · {daysLeft} day{daysLeft === 1 ? '' : 's'} left</span>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Mobile-only campus photo block beneath the panel (rect1an layout) */}
      <div className="md:hidden w-full h-56 sm:h-72 overflow-hidden bg-forest-900">
        <img src={RIGHT_IMAGE} alt="NIT Calicut administrative building" className="w-full h-full object-cover" />
      </div>

      {/* Stats band */}
      <section className="bg-cream-200 border-y border-forest-500/10">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="font-heading text-3xl md:text-4xl text-gold-600">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="nav-caps text-ink-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
