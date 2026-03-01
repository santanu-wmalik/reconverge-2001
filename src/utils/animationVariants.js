// === ENTRANCE ANIMATIONS ===

export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

// === STAGGER CONTAINER ===

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// === PAGE TRANSITIONS ===

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

// === FLIP CARD ===

export const flipCardFront = {
  front: { rotateY: 0 },
  back: { rotateY: 180 },
};

export const flipCardBack = {
  front: { rotateY: -180 },
  back: { rotateY: 0 },
};

// === HOVER MICRO-INTERACTIONS ===

export const hoverScale = {
  whileHover: { scale: 1.05, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};

export const hoverLift = {
  whileHover: { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
  transition: { duration: 0.3 },
};

export const hoverGlow = {
  whileHover: {
    boxShadow: '0 0 30px rgba(212, 168, 67, 0.4)',
    transition: { duration: 0.3 },
  },
};

// === FLOATING ANIMATION ===

export const floatingAnimation = (delay = 0) => ({
  y: [0, -15, 0],
  rotate: [-2, 2, -2],
  transition: {
    duration: 4 + Math.random() * 2,
    repeat: Infinity,
    ease: 'easeInOut',
    delay,
  },
});

// === COUNTER (spring config) ===

export const counterSpring = {
  type: 'spring',
  stiffness: 50,
  damping: 30,
};

// === MODAL ===

export const modalOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalContent = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// === SLIDE ANIMATIONS ===

export const slideInFromLeft = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { x: '-100%', opacity: 0, transition: { duration: 0.2 } },
};

export const slideInFromRight = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
};

export const slideInFromBottom = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.2 } },
};
