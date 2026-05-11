/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx,mdx}", "./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      textShadow: {
        gold: '0 0 2px var(--title-outline), 0 0 4px var(--title-outline), 0 0 6px var(--title-outline), 0 0 10px var(--title-outline)',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--ink)',
            '--tw-prose-headings': 'var(--ink)',
            '--tw-prose-lead': 'var(--muted)',
            '--tw-prose-links': 'var(--accent)',
            '--tw-prose-bold': 'var(--ink)',
            '--tw-prose-counters': 'var(--muted)',
            '--tw-prose-bullets': 'var(--accent)',
            '--tw-prose-hr': 'var(--stroke)',
            '--tw-prose-quotes': 'var(--ink)',
            '--tw-prose-quote-borders': 'var(--accent)',
            '--tw-prose-captions': 'var(--muted)',
            '--tw-prose-code': 'var(--ink)',
            '--tw-prose-pre-code': 'var(--ink)',
            '--tw-prose-pre-bg': 'var(--surface)',
            '--tw-prose-th-borders': 'var(--stroke)',
            '--tw-prose-td-borders': 'var(--stroke)',
          },
        },
      }),
    }
  },
  plugins: [
    require("@tailwindcss/typography"),
    function ({ matchUtilities, theme }) {
      matchUtilities(
        { 'text-shadow': value => ({ textShadow: value }) },
        { values: theme('textShadow') }
      )
    }
  ]
};
