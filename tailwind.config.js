/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fitrex: {
          dark: '#05070d',
          darker: '#020305',
          surface: '#0a0e18',
          card: '#0e1424',
          cardHover: '#141d33',
          border: 'rgba(255, 255, 255, 0.08)',
          red: '#ef4444',
          redLight: '#f87171',
          redDark: '#dc2626',
          redGlow: 'rgba(239, 68, 68, 0.35)',
          amber: '#f59e0b',
          cyan: '#06b6d4',
          purple: '#a855f7'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-red': '0 0 25px -4px rgba(239, 68, 68, 0.45)',
        'glow-red-sm': '0 0 15px -2px rgba(239, 68, 68, 0.35)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
      }
    },
  },
  plugins: [],
}
