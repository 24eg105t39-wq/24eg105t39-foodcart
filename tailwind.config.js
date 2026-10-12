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
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F5EFEB',
          300: '#EDE2D8',
          400: '#DFD1C3',
          500: '#C7B5A3',
        },
        brand: {
          red: '#E23744',
          'red-dark': '#C52B37',
          'red-light': '#FEECEE',
          orange: '#FF7A00',
          'orange-dark': '#E56D00',
          'orange-light': '#FFF3E8',
          charcoal: '#1C1917',
          muted: '#78716C',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(28, 25, 23, 0.06)',
        'hover': '0 12px 30px -4px rgba(226, 55, 68, 0.15)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
