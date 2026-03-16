/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 220ms ease-out",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["winter", "night"],
  },
};

