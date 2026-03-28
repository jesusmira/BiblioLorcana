/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      textShadow: {
        gold: '0 0 2px var(--title-outline), 0 0 4px var(--title-outline), 0 0 6px var(--title-outline), 0 0 10px var(--title-outline)',
      }
    }
  },
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        { 'text-shadow': value => ({ textShadow: value }) },
        { values: theme('textShadow') }
      )
    }
  ]
};
