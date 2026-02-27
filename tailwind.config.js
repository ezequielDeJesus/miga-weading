/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#225373",
        "fendi": "#fdfbf7",
        "background-light": "#fdfbf7",
        "background-dark": "#211116",
        "user-bubble": "#ce9793",
        "miga-bubble": "#ce9793",
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"],
        "handwritten": ["Dancing Script", "cursive"],
        "sketch": ["Caveat", "cursive"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
