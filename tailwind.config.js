require("dotenv").config();
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: process.env.PRODUCTION && ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.blueGray,
        pink: {
          ...colors.fuchsia,
          350: "#EC92FB",
        },
        purple: {
          ...colors.purple,
          350: "#CC9CFD",
        },
      },
    },
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui"],
      body: ["Inter", "ui-sans-serif", "system-ui"],
      display: ["Inter", "ui-sans-serif", "system-ui"],
      code: ["Roboto Mono", "monospace"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
