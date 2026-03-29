/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        black: '#000000',
        white: '#FFFFFF',
      },
      letterSpacing: {
        widest: '0.2em',
      },
    },
  },
  plugins: [],
}
