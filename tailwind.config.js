/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2F855A", // Darker green for better visibility
        "primary-dark": "#22543D",
        "primary-light": "#E6FFFA",
        background: "#F0FDF4", // Slightly more saturated background
        surface: "#FFFFFF",
        "text-primary": "#111827", // Nearly black for main text
        "text-secondary": "#4B5563", // Darker gray for secondary text
        danger: "#EF4444",
        "danger-light": "#FEF2F2"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        serif: ["Noto Serif JP", "serif"],
      },
      boxShadow: {
        'card': '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 15px -3px rgba(0, 0, 0, 0.05)', // Softer, multi-layered shadow
      }
    },
  },
  plugins: [],
}
