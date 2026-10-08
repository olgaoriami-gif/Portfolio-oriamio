/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
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
          subtle: 'var(--color-accent-subtle)',
        },
        // Static colors — don't change with theme (for overlays on images/dark cards)
        'static-white': 'var(--color-static-white)',
        'static-light': 'var(--color-static-light)',
        'static-muted': 'var(--color-static-muted)',
        // Keep primary palette for backward compatibility
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      borderWidth: {
        DEFAULT: 'var(--border-width)',
        accent: 'var(--border-width-accent)',
      },
      borderRadius: {
        card: 'var(--radius-2xl)',
        button: 'var(--radius-full)',
        img: 'var(--radius-xl)',
        tag: 'var(--radius-full)',
      },
      spacing: {
        'header': 'var(--header-height)',
        'grid-gap': 'var(--grid-gap)',
        'container-pad': 'var(--container-padding)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
