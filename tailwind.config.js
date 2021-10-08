require("dotenv").config();
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: process.env.PRODUCTION && ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        pink: colors.fuchsia,
        purple: colors.purple,
        gray: colors.blueGray,
      },
    },
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui"],
      body: ["Inter", "ui-sans-serif", "system-ui"],
      display: ["Inter", "ui-sans-serif", "system-ui"],
      code: ["Fira Code", "monospace"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
