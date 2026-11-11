/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111018',
        panel: '#1A1724',
        surface: '#242033',
        fg: '#F5F3FA',
        muted: '#A6A0B5',
        brand: { DEFAULT: '#8B5CF6', deep: '#6D28D9' },
        ok: '#34D399',
        warn: '#FBBF24',
        bad: '#F87171',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl: '14px', '2xl': '16px' },
    },
  },
  plugins: [],
};
