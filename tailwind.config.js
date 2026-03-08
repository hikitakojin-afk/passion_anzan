/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kids-green': '#b6d124',
        'kids-pink': '#f290d8',
        'kids-blue': '#77b9f0',
        'kids-darkblue': '#145d9d',
        'kids-yellow': '#ffd41a',
        'kids-black': '#000000',
        'kids-gray': '#7c7c7c',
        'pop-red': '#ff4757',
      },
      fontFamily: {
        'sans': ['"Noto Sans JP"', 'sans-serif'],
        'display': ['"Rammetto One"', '"Noto Sans JP"', 'sans-serif'],
        'pixel': ['"DotGothic16"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
