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
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#e05a47', // Primary warm terracotta
          600: '#c84636',
          700: '#9f3226',
          800: '#7f2b23',
          900: '#682620',
        },
        tealbrand: {
          50: '#f0fdf4',
          100: '#ccfbf1',
          200: '#99f6e4',
          500: '#14b8a6',
          700: '#0f766e',
          900: '#134e4a',
        },
        warmbg: '#FAF8F5',
        warmcard: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
