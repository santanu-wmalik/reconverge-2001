/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
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
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0b1a2c 0%, #1e3a5f 50%, #2d5a8e 100%)',
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
      },
      keyframes: {
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
