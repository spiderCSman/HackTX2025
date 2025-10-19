/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  ttheme: {
  extend: {
    animation: {
      float: "float 4s ease-in-out infinite",
    },
    keyframes: {
      float: {
        "0%, 100%": { transform: "translateY(0px)" },
        "50%": { transform: "translateY(-15px)" },
      },
    },
  },
},
  plugins: [],
};

