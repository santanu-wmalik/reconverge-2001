import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animationVariants';
import ProtectedImage from '../../components/shared/ProtectedImage';
import { EVENT_CONFIG, buddyOfferActive } from '../../data/constants';

// Public "Event" page — the current announcement poster (2nd Town Hall,
// 19 & 20 Sept 2026). Swap POSTER when the next event poster comes along.
const POSTER = '/images/townhall-2-poster.jpg';

export default function EventPosterPage() {
  return (
    <motion.div {...pageTransition} className="max-w-3xl mx-auto px-4 py-10">
      {buddyOfferActive() && (
        <div className="mb-8 rounded-2xl border-2 border-gold-500/60 bg-[#fbf7ea] px-5 py-4 text-center shadow">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold mb-1">👯 Best Buddy Pricing</p>
          <p className="text-ink font-semibold">
            Bring your buddy — both pay <span className="text-gold-700">₹{EVENT_CONFIG.buddyFee.toLocaleString('en-IN')}</span> each
            <span className="text-ink-muted font-normal"> (instead of ₹{EVENT_CONFIG.registrationFee.toLocaleString('en-IN')})</span>
          </p>
          <p className="text-sm text-ink-soft mt-1">
            Register together with one or more batchmates who haven't paid yet, and everyone gets the old
            early-bird price. All of you must register &amp; initiate payment by <b>{EVENT_CONFIG.buddyDeadlineLabel}</b>.
          </p>
          <Link to="/register" className="inline-block mt-3 nav-caps px-6 py-2.5 bg-gradient-to-b from-gold-400 to-gold-600 text-forest-900 shadow hover:from-gold-300 hover:to-gold-500">
            Grab the Buddy price →
          </Link>
        </div>
      )}

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
          alt="REConverge 2001 — 2nd Town Hall poster: Session 1 Saturday 19 September 8-9 PM IST, Session 2 Sunday 20 September 10-11 AM IST, join via Google Meet QR codes. Early bird ₹13,500 ended 30 September."
          loading="eager"
          imgClassName="w-full h-auto"
        />
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/townhalls" className="nav-caps px-6 py-3 border-2 border-forest-600/60 text-forest-700 hover:bg-forest-600/8">
          Past townhall recordings (sign in) →
        </Link>
        <Link to="/register" className="nav-caps px-6 py-3 bg-gradient-to-b from-gold-400 to-gold-600 text-forest-900 shadow hover:from-gold-300 hover:to-gold-500">
          Sign Up — ₹15,000
        </Link>
      </div>
    </motion.div>
  );
}
