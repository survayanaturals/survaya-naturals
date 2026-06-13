/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfaf5',
          100: '#faf6f0',
          200: '#f5ede0',
          300: '#ede0c8',
          400: '#dcc9a8',
        },
        olive: {
          50: '#f4f6ee',
          100: '#e5ead2',
          200: '#c9d4a5',
          300: '#a7ba6e',
          400: '#87a041',
          500: '#6b8530',
          600: '#4e6820',
          700: '#3d5016',
          800: '#2f3e12',
          900: '#232e0e',
        },
        bark: {
          50: '#fdf6f0',
          100: '#f9e8d8',
          200: '#f0ccaa',
          300: '#e5a872',
          400: '#d4804a',
          500: '#c26330',
          600: '#a34e22',
          700: '#7e3b1a',
          800: '#5c2c14',
          900: '#3d1e0e',
        },
        brown: {
          50: '#fdf8f5',
          100: '#f8ede5',
          200: '#efd5c0',
          300: '#e0b090',
          400: '#cc8558',
          500: '#b8642e',
          600: '#964d22',
          700: '#72381a',
          800: '#4f2812',
          900: '#311908',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        lato: ['Lato', 'system-ui', 'sans-serif'],
        dancing: ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        'warm': '0 4px 24px rgba(139, 94, 60, 0.15)',
        'warm-lg': '0 8px 40px rgba(139, 94, 60, 0.2)',
        'card': '0 2px 16px rgba(61, 80, 22, 0.1)',
        'card-hover': '0 8px 32px rgba(61, 80, 22, 0.18)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-green': 'pulseGreen 2s infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        fadeUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(37, 211, 102, 0)' },
        },
      },
    },
  },
  plugins: [],
}
