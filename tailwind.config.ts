import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base': '#0f1011',
        'bg-elevated': '#1a1b1e',
        'bg-card': '#1a1b1e',
        'brand': {
          DEFAULT: '#8b5cf6',
          deep: '#7c3aed',
          light: '#a78bfa',
          lime: '#d3fd50',
          accent: '#a855f7',
        },
        'lime': {
          DEFAULT: '#d3fd50',
          glow: 'rgba(211, 253, 80, 0.4)',
        },
        'text': {
          primary: '#ffffff',
          secondary: '#9ca3af',
          muted: '#6b7280',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'typing': 'typing 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { 
          from: { opacity: '0', transform: 'translateY(10px)' }, 
          to: { opacity: '1', transform: 'translateY(0)' } 
        },
        slideDown: { 
          from: { opacity: '0', transform: 'translateY(-10px)' }, 
          to: { opacity: '1', transform: 'translateY(0)' } 
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px var(--brand-glow)' },
          '50%': { boxShadow: '0 0 40px var(--brand-glow)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        typing: {
          '0%, 60%, 100%': { opacity: '0.3' },
          '30%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
