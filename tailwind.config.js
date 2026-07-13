/** @type {import('tailwindcss').Config} */

/**
 * All colors resolve through the CSS-variable token scale defined in
 * src/index.css (`:root`). Variables hold space-separated RGB triplets so
 * Tailwind opacity modifiers (e.g. `bg-cream-50/60`) keep working.
 */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

const scale = (family, steps) =>
  Object.fromEntries(steps.map((s) => [s, token(`${family}-${s}`)]));

export default {
  content: ['./index.html', './privacy.html', './terms.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: scale('coral', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        plum: scale('plum', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        cream: scale('cream', [25, 50, 100, 200, 300, 400]),
        // Semantic aliases — prefer these in components.
        ink: token('ink'),
        'ink-2': token('ink-2'),
        'ink-3': token('ink-3'),
        line: token('line'),
        paper: token('cream-50'),
        brand: token('coral-500'),
        'brand-deep': token('coral-700'),
      },
      fontFamily: {
        display: ['"Fraunces Variable"', '"Fraunces Fallback"', 'Georgia', 'serif'],
        body: ['"Hanken Grotesk Variable"', '"Hanken Fallback"', 'Arial', 'sans-serif'],
        hand: ['"Caveat Variable"', '"Caveat Fallback"', 'cursive'],
      },
      boxShadow: {
        // Soft, warm elevation (plum-tinted, never gray).
        lift: '0 1px 2px rgb(31 15 26 / 0.05), 0 10px 30px -10px rgb(31 15 26 / 0.16)',
        'lift-lg': '0 2px 4px rgb(31 15 26 / 0.05), 0 24px 60px -16px rgb(31 15 26 / 0.24)',
        // The napkin DNA: crisp offset "letterpress stamp" shadows, used sparingly.
        stamp: '3px 4px 0 rgb(var(--ink) / 1)',
        'stamp-sm': '2px 3px 0 rgb(var(--ink) / 1)',
        ring: '0 0 0 4px rgb(var(--coral-500) / 0.18)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'pin-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'mesh-drift': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(4%, -3%, 0) scale(1.08)' },
        },
        'mesh-drift-2': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(-5%, 4%, 0) scale(1.12)' },
        },
        'radar-ping': {
          '0%': { transform: 'scale(0.35)', opacity: '0.65' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        blink: { '50%': { opacity: '0' } },
      },
      animation: {
        'pin-float': 'pin-float 3s ease-in-out infinite',
        'mesh-drift': 'mesh-drift 22s ease-in-out infinite',
        'mesh-drift-2': 'mesh-drift-2 26s ease-in-out infinite',
        'radar-ping': 'radar-ping 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        blink: 'blink 1.1s step-end infinite',
      },
    },
  },
  plugins: [],
};
