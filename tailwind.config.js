/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cv: {
          dark:   '#0f111a',
          card:   '#161824',
          input:  '#1e2235',
          border: '#2a2d3e',
          muted:  '#9ba3c0',
          dim:    '#5c6080',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
