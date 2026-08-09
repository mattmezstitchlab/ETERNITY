import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A96E',
          light: '#E6CD9C',
          dark: '#9A7A42',
        },
        ink: '#0A0A0A',
        card: '#141414',
        raise: '#1E1E1E',
        mist: '#8E8E93',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        kicker: '3px',
      },
      maxWidth: {
        site: '1200px',
      },
      borderRadius: {
        card: '16px',
      },
      animation: {
        'spin-slow': 'spin 14s linear infinite',
        'pulse-soft': 'pulseSoft 3.2s ease-in-out infinite',
        float: 'float 7s ease-in-out infinite',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
