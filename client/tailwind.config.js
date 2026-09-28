/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Warrior Primary Surfaces
        void: {
          DEFAULT: '#070707',
          pure: '#040404',
          lighter: '#0D0F12',
        },
        obsidian: {
          DEFAULT: '#0D0F12',
          surface: '#15181C',
          border: '#20252B',
        },
        charcoal: {
          DEFAULT: '#15181C',
          surface: '#1B1F24',
          border: '#2A3038',
        },
        gunmetal: '#20252B',
        steel: {
          DEFAULT: '#30363D',
          muted: '#252B32',
          border: '#3D444D',
          light: '#484F58',
        },
        ash: {
          DEFAULT: '#8B929A',
          light: '#A8AFB7',
          dark: '#5B626A',
        },
        bone: '#D4D0C8',
        offwhite: '#ECE9E2',

        // Blood Crimson Accents
        crimson: {
          DEFAULT: '#8F1D2C',
          blood: '#8F1D2C',
          dark: '#651522',
          muted: '#B83245',
          glow: '#B83245',
          aura: '#8F1D2C',
        },

        // Muted Secondary Tactical Accents (Restrained, not neon)
        violet: {
          DEFAULT: '#66528A',
          neon: '#66528A',
          glow: '#8E77B8',
          dark: '#453560',
        },
        cyan: {
          DEFAULT: '#397D83',
          neon: '#397D83',
          glow: '#54A8B0',
          dark: '#245256',
        },
        gold: {
          DEFAULT: '#A8873A',
          mythic: '#A8873A',
          glow: '#C4A452',
          dark: '#735B22',
        },
        matrix: {
          DEFAULT: '#2E7D5B',
          neon: '#3B9E73',
          glow: '#4ECB94',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'steel-card': '0 12px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
        'steel-hover': '0 16px 36px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'crimson-edge': '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 12px rgba(143, 29, 44, 0.3)',
        'glow-crimson': '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 12px rgba(143, 29, 44, 0.3)',
        'glow-cyan': '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 8px rgba(57, 125, 131, 0.25)',
        'glow-violet': '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 8px rgba(102, 82, 138, 0.25)',
        'glow-gold': '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 8px rgba(168, 135, 58, 0.25)',
        'glow-matrix': '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 8px rgba(46, 125, 91, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
