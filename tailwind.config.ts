import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base': 'var(--bg-base)',
        'bg-elevated': 'var(--bg-elevated)',
        'brand': {
          DEFAULT: 'var(--brand-primary)',
          light: 'var(--brand-light)',
          accent: 'var(--brand-accent)',
        },
        'text': {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
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
