import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EVENT_CONFIG, STATS, EARLY_BIRD_DEADLINE } from '../../../data/constants';
import AnimatedCounter from '../../../components/shared/AnimatedCounter';
import { staggerContainer, staggerItem } from '../../../utils/animationVariants';
import { useAuth } from '../../../context/AuthContext';
import WidgetRail from '../../../components/shared/WidgetRail';

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

        {/* On ultra-wide screens the centred max-w-7xl container drifts the
            copy toward the diagonal — at xl+ the container becomes the green
            panel itself (58% wide) with the copy centred inside it, scaled up. */}
        <div className="relative z-10 max-w-7xl mx-auto xl:mx-0 xl:max-w-none xl:w-[58%] px-6 sm:px-10 xl:px-10 pt-6 pb-6 md:pt-12 md:pb-14 md:min-h-[44vh] flex items-center justify-center md:justify-start xl:justify-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-xl xl:max-w-2xl text-cream-50 text-center md:text-left flex flex-col items-center md:items-start"
          >
            {/* 25 star badge + logo */}
            <motion.div variants={staggerItem} className="mb-3 md:mb-4 flex items-center gap-3">
              <span className="relative inline-flex items-center justify-center w-11 h-11 xl:w-14 xl:h-14">
                <svg viewBox="0 0 24 24" className="w-11 h-11 xl:w-14 xl:h-14 drop-shadow-[0_0_6px_rgba(255,255,255,0.55)]" aria-hidden="true">
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
              <img src={EVENT_CONFIG.logoUrl} alt="REConverge 2001" className="w-11 h-11 xl:w-14 xl:h-14 rounded-full ring-1 ring-gold-400/60 object-contain bg-white/90" />
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="font-heading font-bold leading-none text-4xl sm:text-6xl md:text-7xl xl:text-8xl mb-2 md:mb-3 tracking-tight"
            >
              <span className="text-gold-400">REC</span>
              <span className="text-cream-50">onverge</span>
            </motion.h1>

            <motion.p variants={staggerItem} className="nav-caps xl:text-sm text-cream-200/90 mb-3 md:mb-4">
              Batch 2001 — Silver Jubilee Reunion
            </motion.p>

            <motion.p
              variants={staggerItem}
              className="font-heading italic text-xl sm:text-3xl md:text-4xl xl:text-5xl text-cream-50 mb-3 md:mb-4"
            >
              {EVENT_CONFIG.tagline}
            </motion.p>

            {/* thin gold rule — rect1an mobile detail; hidden on desktop */}
            <motion.span variants={staggerItem} className="md:hidden block h-px w-40 bg-gold-400/40 mb-3" aria-hidden="true" />

            <motion.p variants={staggerItem} className="nav-caps xl:text-sm text-cream-200/80 mb-5 md:mb-7">
              {EVENT_CONFIG.displayDates} · {EVENT_CONFIG.venue.city}
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 mb-3 md:mb-4"
            >
              {/* Always shown — signed-in visitors land on their profile. */}
              <Link
                to={isAuthenticated ? '/profile' : '/register'}
                className="nav-caps xl:text-sm w-[78%] max-w-[320px] sm:w-auto sm:max-w-none px-8 py-4 xl:px-10 xl:py-5 text-center border-2 border-transparent bg-gradient-to-b from-[#f7f9fb] via-[#cfd6de] to-[#9aa5b1] text-[#16202b] shadow-lg shadow-black/30 ring-1 ring-white/70 hover:from-white hover:via-[#dde3e9] hover:to-[#aab4bf] transition"
              >
                Sign Up
              </Link>
              <Link
                to="/project-cornerstone"
                className="nav-caps xl:text-sm w-[78%] max-w-[320px] sm:w-auto sm:max-w-none px-8 py-4 xl:px-10 xl:py-5 border-2 border-transparent bg-gradient-to-b from-[#f4effc] via-[#cdb8ec] to-[#9a76d0] text-[#2a1740] shadow-lg shadow-black/30 ring-1 ring-white/70 hover:from-white hover:via-[#dccdf2] hover:to-[#ab8ad9] transition inline-flex items-center justify-center gap-2.5"
              >
                {/* Philanthropy: heart held in an open hand */}
                <svg viewBox="0 0 24 24" className="w-7 h-7 xl:w-8 xl:h-8 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12.6 3.6c1-1 2.7-1 3.7 0 1 1 1 2.6 0 3.6l-3.7 3.7-3.7-3.7c-1-1-1-2.6 0-3.6 1-1 2.7-1 3.7 0z" fill="currentColor" stroke="none" />
                  <path d="M3 15.5h2.8c.6 0 1.2.2 1.7.5l2 1.3c.5.3 1.1.5 1.7.5h2.6a1.6 1.6 0 0 1 0 3.2H9.6" />
                  <path d="M14 20.6l5.2-1.6c.9-.3 1.9.2 2.2 1.1" />
                </svg>
                Give Back
              </Link>
            </motion.div>

            <motion.div variants={staggerItem} className="mb-3 md:mb-4">
              <a
                href="#event-highlights"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('event-highlights')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="nav-caps xl:text-sm text-cream-200/90 underline underline-offset-4 decoration-gold-400/60 hover:text-gold-300"
              >
                View Schedule
              </a>
            </motion.div>

            {/* Batch stats — moved up into the green panel */}
            <motion.div
              variants={staggerItem}
              className="mt-4 md:mt-6 w-full grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4 text-center md:text-left"
            >
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="font-heading text-2xl md:text-3xl text-gold-300">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="nav-caps text-cream-200/80 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

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

        {/* Countdown + quick links docked over the hero's bottom-right (md+) */}
        <div className="hidden md:block absolute bottom-3 right-4 z-20 w-[430px]">
          <WidgetRail inline />
        </div>
      </section>

      {/* Mobile-only campus photo block beneath the panel (rect1an layout) */}
      <div className="md:hidden w-full h-56 sm:h-72 overflow-hidden bg-forest-900">
        <img src={RIGHT_IMAGE} alt="NIT Calicut administrative building" className="w-full h-full object-cover" />
      </div>

      {/* Stats band — stats left, countdown + quick links docked right
          (the widget strip lives here on the landing page instead of
          floating over the content). */}
      {/* Countdown strip — overlays the hero's bottom-right corner on
          desktop (no band of its own); plain row on mobile. */}
      <div className="md:hidden px-4 py-2">
        <WidgetRail inline />
      </div>
    </>
  );
}
