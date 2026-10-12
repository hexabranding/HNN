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
          DEFAULT: "#ff4c60",
          hover: "#e03e51",
          red: "#c91f26",
          darkRed: "#a8191f",
          light: "rgba(255, 76, 96, 0.15)",
        },
        theme: {
          green: "#548f6f",
          purple: "#917090",
          peach: "#de8b76",
          tan: "#d99374",
          bgOne: "#f2f2de",
          bgTwo: "#fff6ef",
          darkBg: "#111111",
          darkCard: "#1a1a2e",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        prompt: ["Prompt", "sans-serif"],
      },
    },
  },
  plugins: [],
}
