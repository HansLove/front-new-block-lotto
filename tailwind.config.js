import { type Config } from 'tailwindcss'

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {
      dropShadow: {
        'green': '0 10px 10px rgba(35,175,90, 0.5)',
        'blue': '0 10px 10px rgba(0,182,255, 0.5)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'border': 'border 4s linear infinite',
      },
      keyframes: {
        border: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        crawl: {
          "0%": {
            top: "-100px",
            transform: "rotateX(20deg) translateZ(0)",
          },
          "100%": {
            top: "-6000px",
            transform: "rotateX(25deg) translateZ(-2500px)",
          },
        },
      },
      colors: {
        // Semantic surface tokens
        surface: {
          base: '#07070a',      // bg-surface-base     → fondo global de todas las paginas
          elevated: '#0e0e14',  // bg-surface-elevated → cards, modals, panels
        },
        // Semantic action tokens
        action: {
          primary: '#f59e0b',   // bg-action-primary / text-action-primary → CTA principal
          hover: '#fbbf24',     // bg-action-hover  → hover del CTA
        },
        // Block Lotto color palette
        lotto: {
          green: {
            DEFAULT: '#22c55e',
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          teal: {
            DEFAULT: '#14b8a6',
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
          },
          blue: {
            DEFAULT: '#06b6d4',
            50: '#ecfeff',
            100: '#cffafe',
            200: '#a5f3fc',
            300: '#67e8f9',
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
            700: '#0e7490',
            800: '#155e75',
            900: '#164e63',
          },
          orange: {
            DEFAULT: '#f97316',
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
          },
        },
      },
      backgroundImage: {
        // Custom background images here
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
} satisfies Config
