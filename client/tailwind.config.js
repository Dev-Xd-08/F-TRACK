/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#080B11',
          pure: '#04060A',
          lighter: '#0D131F',
        },
        obsidian: {
          DEFAULT: '#0F172A',
          surface: '#141E33',
          border: '#1E293B',
        },
        violet: {
          neon: '#8B5CF6',
          glow: '#A78BFA',
          dark: '#6D28D9',
        },
        cyan: {
          neon: '#00F5FF',
          glow: '#38BDF8',
          dark: '#0284C7',
        },
        crimson: {
          aura: '#FF2A5F',
          glow: '#FB7185',
          dark: '#E11D48',
        },
        gold: {
          mythic: '#FFB800',
          glow: '#FCD34D',
          dark: '#D97706',
        },
        matrix: {
          neon: '#10B981',
          glow: '#34D399',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.45)',
        'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.45)',
        'glow-crimson': '0 0 20px rgba(255, 42, 95, 0.45)',
        'glow-gold': '0 0 20px rgba(255, 184, 0, 0.45)',
        'inner-glow': 'inset 0 0 15px rgba(0, 245, 255, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow-cycle': 'glowCycle 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowCycle: {
          '0%': { filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))' },
          '100%': { filter: 'drop-shadow(0 0 16px rgba(0, 245, 255, 0.8))' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
