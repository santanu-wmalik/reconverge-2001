/** @type {import('tailwindcss').Config} */
//
// Theme note (Aug 2026 redesign, modelled on rect1an.com):
//   Public pages  → cream paper background, forest-green display type, gold
//                   accents. Light theme is the DEFAULT.
//   Portal/Admin  → still the original dark navy/gold UI. Those layouts add a
//                   `dark` class on their root so every `dark:` variant below
//                   kicks in and the hundreds of existing components render
//                   exactly as before.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cream paper — page background for the public site.
        cream: {
          50: '#fdfcf9',
          100: '#faf7f0',
          200: '#f5f1e6',
          300: '#ede7d8',
          400: '#e2d9c3',
          500: '#d4c8a8',
        },
        // Forest / olive green — display headings, hero panel, primary UI.
        forest: {
          50: '#eef2ec',
          100: '#d6e0d1',
          200: '#adc2a4',
          300: '#83a378',
          400: '#5e8352',
          500: '#3f6238',
          600: '#34512e',
          700: '#2a4125',
          800: '#1f301b',
          900: '#141f12',
        },
        // Charcoal ink for body text on cream.
        ink: {
          DEFAULT: '#1f1f1f',
          soft: '#4a4a4a',
          muted: '#7a7a7a',
        },
        // `primary` kept as the legacy navy so dark-mode portal/admin styling
        // (which references primary-*) is untouched.
        primary: {
          50: '#e8eef5',
          100: '#c5d5e8',
          200: '#9fb8d9',
          300: '#799bca',
          400: '#5c85be',
          500: '#3f6fb3',
          600: '#2d5a8e',
          700: '#1e3a5f',
          800: '#142a45',
          900: '#0b1a2c',
        },
        gold: {
          50: '#fef9ec',
          100: '#fcefc5',
          200: '#f8e09e',
          300: '#f0cc6b',
          400: '#e8c468',
          500: '#d4a843',
          600: '#b8922a',
          700: '#8f7020',
          800: '#665018',
          900: '#3d3010',
        },
        accent: {
          DEFAULT: '#c45e3a',
          light: '#d4785a',
          dark: '#a84e30',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        serif: ['"Inter"', 'sans-serif'], // reverted to the original Inter body font
        body: ['"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        caps: '0.18em',
        wide2: '0.25em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0b1a2c 0%, #1e3a5f 50%, #2d5a8e 100%)',
        'forest-panel': 'linear-gradient(160deg, #2a4125 0%, #3f6238 55%, #34512e 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'film-scroll': 'filmScroll 120s linear infinite',
        'poem-drift': 'poemDrift 80s linear infinite',
      },
      keyframes: {
        poemDrift: {
          '0%':   { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 168, 67, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 168, 67, 0.6)' },
        },
        filmScroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
