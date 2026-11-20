/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        college: {
          primary: '#1e3a8a',    // Deep Royal Blue
          secondary: '#0f766e',  // Deep Teal
          accent: '#d97706',     // Amber / Golden
          dark: '#0f172a',       // Slate 900
          light: '#f8fafc',      // Slate 50
        }
      }
    },
  },
  plugins: [],
}
