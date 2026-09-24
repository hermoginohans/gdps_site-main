/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0914',
          card: '#151124',
          cardLight: '#1E1933',
          cardBorder: '#2E274D',
          gold: '#F5A623',
          goldLight: '#FFD15C',
          goldDark: '#D48806',
          cyan: '#00F0FF',
          purple: '#8B5CF6',
          pink: '#EC4899',
          green: '#10B981',
          red: '#EF4444',
          muted: '#8E8A9F',
          text: '#F3F4F6'
        }
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(245, 166, 35, 0.25)',
        'gold-glow-lg': '0 0 40px rgba(245, 166, 35, 0.4)',
        'cyan-glow': '0 0 25px rgba(0, 240, 255, 0.3)',
        'purple-glow': '0 0 25px rgba(139, 92, 246, 0.3)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at 50% 20%, rgba(245, 166, 35, 0.12) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), linear-gradient(180deg, #0B0914 0%, #110D20 50%, #0B0914 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F5A623 0%, #FFD15C 50%, #D48806 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(30, 25, 51, 0.8) 0%, rgba(21, 17, 36, 0.95) 100%)',
        'badge-gradient': 'linear-gradient(135deg, rgba(245, 166, 35, 0.2) 0%, rgba(245, 166, 35, 0.05) 100%)'
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Rajdhani"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
