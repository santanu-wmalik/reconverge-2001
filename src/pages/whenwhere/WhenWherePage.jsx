import { motion } from 'framer-motion';
import { EVENT_CONFIG, CAMPUS_PHOTOS } from '../../data/constants';
import { pageTransition, staggerContainer, staggerItem } from '../../utils/animationVariants';
import SectionHeading from '../../components/shared/SectionHeading';
import GlassCard from '../../components/ui/GlassCard';

/* Inline SVG Icons */

const CalendarIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#d4a843" strokeWidth="2" />
    <path d="M16 2V6" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 2V6" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 10H21" stroke="#d4a843" strokeWidth="2" />
    <rect x="7" y="14" width="4" height="4" rx="0.5" fill="#d4a843" opacity="0.6" />
  </svg>
);

const MapPinIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
      stroke="#d4a843"
      strokeWidth="2"
    />
    <circle cx="12" cy="9" r="3" fill="#d4a843" opacity="0.6" />
  </svg>
);

const HotelIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 21V7L12 2L21 7V21" stroke="#d4a843" strokeWidth="2" strokeLinejoin="round" />
    <path d="M9 21V13H15V21" stroke="#d4a843" strokeWidth="2" strokeLinejoin="round" />
    <rect x="10" y="8" width="4" height="3" rx="0.5" fill="#d4a843" opacity="0.6" />
  </svg>
);
/* Styles */

const styles = {
  page: {
    minHeight: '100vh',
    paddingTop: '7rem',
    paddingBottom: '4rem',
    background: 'linear-gradient(180deg, #0a0e1a 0%, #101629 40%, #0d1220 100%)',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '3.5rem',
  },
  cardInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
  },
  iconWrap: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'rgba(212, 168, 67, 0.08)',
    border: '1px solid rgba(212, 168, 67, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.25rem',
  },
  cardTitle: {
    fontSize: '1.35rem',
    fontWeight: 700,
    color: '#d4a843',
    letterSpacing: '0.02em',
  },
  cardPrimary: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#e2e8f0',
    lineHeight: 1.5,
  },
  cardSecondary: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    lineHeight: 1.6,
  },
  badge: {
    display: 'inline-block',
    padding: '0.3rem 0.9rem',
    borderRadius: '9999px',
    background: 'rgba(212, 168, 67, 0.12)',
    border: '1px solid rgba(212, 168, 67, 0.25)',
    color: '#d4a843',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
  },
  mapFrame: {
    width: '100%',
    height: '220px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    marginTop: '0.75rem',
  },
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.25rem',
    maxWidth: '820px',
    margin: '0 auto',
  },
  photoWrapper: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    aspectRatio: '4 / 3',
    cursor: 'pointer',
  },
  photoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.4s ease',
  },
  photoOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '1rem 1.25rem',
    opacity: 0,
    transition: 'opacity 0.35s ease',
  },
  photoTitle: {
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
};
/* Component */

export default function WhenWherePage() {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      style={styles.page}
    >
      <div style={styles.container}>
        {/* Page heading */}
        <SectionHeading
          title="When & Where"
          subtitle="The reunion of a lifetime at the heart of Kozhikode."
          light
        />

        {/* Info cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={styles.grid}
        >
          {/* The Date */}
          <motion.div variants={staggerItem}>
            <GlassCard className="h-full" padding="p-8">
              <div style={styles.cardInner}>
                <div style={styles.iconWrap}>
                  <CalendarIcon />
                </div>
                <h3 style={styles.cardTitle}>The Date</h3>
                <p style={styles.cardPrimary}>{EVENT_CONFIG.displayDates}</p>
                <p style={styles.cardSecondary}>
                  Check-in on {EVENT_CONFIG.checkinDate}
                  <br />
                  Checkout on {EVENT_CONFIG.checkoutDate}
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* The Venue */}
          <motion.div variants={staggerItem}>
            <GlassCard className="h-full" padding="p-8">
              <div style={styles.cardInner}>
                <div style={styles.iconWrap}>
                  <MapPinIcon />
                </div>
                <h3 style={styles.cardTitle}>The Venue</h3>
                <p style={styles.cardPrimary}>{EVENT_CONFIG.venue.name}</p>
                <p style={styles.cardSecondary}>
                  {EVENT_CONFIG.venue.address}, {EVENT_CONFIG.venue.state}{' '}
                  {EVENT_CONFIG.venue.pincode}
                </p>
                <iframe
                  src={EVENT_CONFIG.venue.mapEmbed}
                  style={styles.mapFrame}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="REC Calicut Campus Map"
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Stay */}
          <motion.div variants={staggerItem}>
            <GlassCard className="h-full" padding="p-8">
              <div style={styles.cardInner}>
                <div style={styles.iconWrap}>
                  <HotelIcon />
                </div>
                <h3 style={styles.cardTitle}>Stay</h3>
                <p style={styles.cardPrimary}>{EVENT_CONFIG.stay.description}</p>
                <p style={styles.cardSecondary}>
                  Booking Code:{' '}
                  <span style={styles.badge}>{EVENT_CONFIG.stay.bookingCode}</span>
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
        {/* Echoes of Calicut */}
        <SectionHeading
          title="Echoes of Calicut"
          subtitle="A visual journey back to REC Calicut"
          light
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={styles.photoGrid}
        >
          {CAMPUS_PHOTOS.map((photo) => (
            <motion.div
              key={photo.src}
              variants={staggerItem}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              style={styles.photoWrapper}
              onMouseEnter={(e) => {
                const overlay = e.currentTarget.querySelector('[data-overlay]');
                const img = e.currentTarget.querySelector('img');
                if (overlay) overlay.style.opacity = 1;
                if (img) img.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                const overlay = e.currentTarget.querySelector('[data-overlay]');
                const img = e.currentTarget.querySelector('img');
                if (overlay) overlay.style.opacity = 0;
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              <img
                src={EVENT_CONFIG.storageBaseUrl + photo.src}
                alt={photo.title}
                style={styles.photoImg}
                loading="lazy"
              />
              <div data-overlay="" style={styles.photoOverlay}>
                <span style={styles.photoTitle}>{photo.title}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
