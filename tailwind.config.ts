import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'var(--font-sarabun)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'var(--font-sarabun)', 'Georgia', 'serif'],
      },
      keyframes: {
        tripsFilterIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        tripsFilterIn: 'tripsFilterIn 150ms ease-out',
      },
      colors: {
        navy: { DEFAULT: '#0d1b2a', light: '#1a3a5a', dark: '#080f17' },
        teal: { DEFAULT: '#4dd8a0', dark: '#0F6E56', light: '#E1F5EE' },
        gold: { DEFAULT: '#d4af37', dark: '#9a7d1e' },
        companion: {
          dark: '#0D0D0D',
          surface: '#1A1A2E',
          accent: '#2DD4BF',
          'accent-warm': '#F59E0B',
          card: '#FFFFFF',
          'text-dark': '#111827',
        },
      },
    },
  },
  plugins: [],
};

export default config;
