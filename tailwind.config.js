/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 30px -12px rgba(15, 23, 42, 0.2)'
      },
      colors: {
        surface: {
          light: '#ffffff',
          dark: '#0f172a'
        }
      }
    }
  },
  plugins: []
};

