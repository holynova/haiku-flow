/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3E946A",
        "primary-dark": "#2E6F4F",
        "primary-light": "#E2F3E7",
        background: "#F6FCF8",
        surface: "#FFFFFF",
        "text-primary": "#1A2E24",
        "text-secondary": "#5C766A",
        danger: "#FF6B6B",
        "danger-light": "#FFF0F0"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        serif: ["Noto Serif JP", "serif"],
      },
      boxShadow: {
        'card': '0 20px 40px -10px rgba(62, 148, 106, 0.15)',
      }
    },
  },
  plugins: [],
}
