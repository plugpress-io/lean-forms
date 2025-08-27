/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./includes/**/*.php"],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        secondary: "#666666",
        muted: "#999999",
        light: "#f8f9fa",
        border: "#e5e7eb",
        success: "#10b981",
        warning: "#f59e0b",
      },
      fontFamily: {
        wp: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Oxygen-Sans",
          "Ubuntu",
          "Cantarell",
          '"Helvetica Neue"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
