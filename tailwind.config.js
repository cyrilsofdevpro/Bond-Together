/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#FFFFFF',
        bg: '#F8FAFC',
        night: '#0F172A',
        purple: '#7C3AED',
        amber: '#F59E0B',
      },
      boxShadow: {
        soft: '0 40px 120px rgba(15, 23, 42, 0.08)',
        glow: '0 24px 80px rgba(124, 58, 237, 0.18)',
      },
    },
  },
  plugins: [],
}
