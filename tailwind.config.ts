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
        luxuryShimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        tripsFilterIn: 'tripsFilterIn 150ms ease-out',
        luxuryShimmer: 'luxuryShimmer 4s ease-in-out infinite',
      },
      colors: {
        luxury: {
          bg: '#050505',
          surface: '#0f0f11',
          elevated: '#16161a',
          border: 'rgba(201, 169, 98, 0.22)',
          gold: '#c9a962',
          'gold-bright': '#e8d5a3',
          'gold-dim': '#8a7342',
          ink: '#f5f2eb',
          'ink-muted': '#b8b0a6',
        },
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
