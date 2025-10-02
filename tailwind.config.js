/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'vintage-beige-light': '#f1e4c3',
        'vintage-beige': '#e6d7b8',
        'vintage-tan': '#d1c1a0',
        'vintage-brown-light': '#cab394',
        'vintage-brown': '#a8956b',
        'vintage-brown-dark': '#8b7a54',
        'vintage-dark': '#3a2f25',
      },
      fontFamily: {
        'national-park': ['var(--font-national-park)', 'serif'],
        'dyna-puff': ['var(--font-dyna-puff)', 'sans-serif'],
        'steven': ['var(--font-steven)', 'cursive'],
        'pagaki': ['var(--font-pagaki)', 'display'],
      },
    },
  },
  plugins: [],
}
