/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens mapped to CSS variables
        bg: {
          DEFAULT: 'var(--color-bg)',
          elevated: 'var(--color-bg-elevated)',
          card: 'var(--color-bg-card)',
        },
        fg: {
          DEFAULT: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
        },
        // Static colors — don't change with theme (for overlays on images/dark cards)
        'static-white': 'var(--color-static-white)',
      },
      borderWidth: {
        DEFAULT: 'var(--border-width)',
      },
    },
  },
  plugins: [],
}
