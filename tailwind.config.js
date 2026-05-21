/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian:     '#0a0a0a',
        charcoal:     '#141414',
        'mocha-cream': '#e8dcc4',
        burlywood:    '#deb887',
        platinum:     '#f4f4f5',
      },
      fontFamily: {
        serif:     ['"Cinzel"', 'Georgia', 'serif'],
        display:   ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono:  ['"Space Mono"', 'monospace'],
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
