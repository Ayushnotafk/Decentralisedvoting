/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          border: 'var(--border)',
          text: 'var(--text)',
          heading: 'var(--text-h)',
          muted: 'var(--muted)',
        },
        accent: {
          1: 'var(--accent)',
          2: 'var(--accent2)',
        },
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 18px 55px rgba(15, 23, 42, 0.10)',
      },
    },
  },
  plugins: [],
}

