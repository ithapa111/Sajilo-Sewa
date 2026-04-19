/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        blush: '#fff1f7',
        sand: '#fff8ef',
      },
      boxShadow: {
        glass: '0 18px 50px rgba(109, 40, 217, 0.12)',
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'dashboard-gradient':
          'radial-gradient(circle at top left, rgba(168, 85, 247, 0.22), transparent 30%), radial-gradient(circle at top right, rgba(251, 113, 133, 0.18), transparent 34%), linear-gradient(180deg, #faf7ff 0%, #f8f7ff 42%, #f3f4ff 100%)',
      },
    },
  },
  plugins: [],
};
