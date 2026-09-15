import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import ProtectedImage from '../../components/shared/ProtectedImage';

// Public "Event" page — the current announcement poster (2nd Town Hall,
// 19 & 20 Sept 2026). Swap POSTER when the next event poster comes along.
const POSTER = '/images/townhall-2-poster.jpg';

export default function EventPosterPage() {
  return (
    <motion.div {...pageTransition} className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-6">
        <span className="eyebrow">Up next</span>
        <h1 className="mt-3 text-4xl md:text-5xl font-heading font-medium italic text-forest-600">
          2nd Town Hall
        </h1>
        <p className="mt-2 font-serif text-ink-muted">
          Sat 19 Sept · 8–9 PM IST &nbsp;·&nbsp; Sun 20 Sept · 10–11 AM IST — scan the QR on the
          poster to join via Google Meet.
        </p>
      </div>

      <div className="bg-white border border-forest-500/15 shadow-lg p-2 sm:p-3">
        <ProtectedImage
          src={POSTER}
          alt="REConverge 2001 — 2nd Town Hall poster: Session 1 Saturday 19 September 8-9 PM IST, Session 2 Sunday 20 September 10-11 AM IST, join via Google Meet QR codes. Early bird ₹13,500 ends 30 September."
          loading="eager"
          imgClassName="w-full h-auto"
        />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/townhalls" className="nav-caps px-6 py-3 border-2 border-forest-600/60 text-forest-700 hover:bg-forest-600/8">
          Past townhall recordings (sign in) →
        </Link>
        <Link to="/register" className="nav-caps px-6 py-3 bg-gradient-to-b from-gold-400 to-gold-600 text-forest-900 shadow hover:from-gold-300 hover:to-gold-500">
          Sign Up — ₹13,500 before 30 Sept
        </Link>
      </div>
    </motion.div>
  );
}
