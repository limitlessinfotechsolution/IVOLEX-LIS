/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f8f4ef",
          100: "#efe6d9",
          200: "#e1cfb3",
          300: "#cfae86",
          400: "#b7895f",
          500: "#8e623f", /* primary brown */
          600: "#6f4b30",
          700: "#563a25",
          800: "#3d291a",
          900: "#2b1c12"
        }
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)"
      },
      borderRadius: {
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
}
