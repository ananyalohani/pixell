require("dotenv").config();
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: process.env.PRODUCTION && ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        104: "26rem",
        112: "28rem",
        120: "30rem",
        128: "32rem",
      },
      width: {
        104: "26rem",
        112: "28rem",
        120: "30rem",
        128: "32rem",
      },
      maxWidth: {
        "2xs": "18rem",
        "3xs": "16rem",
        "4xs": "14rem",
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1" }],
      },
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
