/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#e6f1fb",
          100: "#cce3f7",
          500: "#2E75B6",
          600: "#1F4E79",
          700: "#1a3f61",
        },
        danger:  "#dc2626",
        warning: "#d97706",
        success: "#16a34a",
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}