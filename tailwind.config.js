/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Napkin-sketch palette, straight from the Swifflyy app
        //    (lib/src/core/theme/app_colors.dart) ──
        paper: '#fbf8f1', // primary cream background  (kPaper)
        paper2: '#f3eee2', // secondary fill           (kPaper2)
        paper3: '#ede7d6', // tertiary / hairlines
        ink: '#1f1d1b', // primary text / dark         (kInk)
        ink2: '#3a3733', // secondary text             (kInk2)
        muted: '#7a766f', // tertiary text             (kMuted)
        faint: '#bbb6ac', // dividers / faint lines     (kFaint)
        line: '#2a2724', // sketchy 1.5px border       (kSketchLine)
        accent: '#d94f3a', // coral accent             (kAccent)
        'accent-soft': '#f2c9c0', // coral tint        (kAccentSoft)
      },
      fontFamily: {
        // Same three-font system as the app.
        head: ['"Bricolage Grotesque"', '"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        // Hard, offset "sketch" shadows — no blur, like ink on paper.
        sketch: '4px 5px 0 #2a2724',
        'sketch-sm': '3px 4px 0 #2a2724',
        'sketch-lg': '6px 7px 0 #2a2724',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'translate(-50%,-50%) scale(0.6)', opacity: '0.5' },
          '100%': { transform: 'translate(-50%,-50%) scale(2.8)', opacity: '0' },
        },
        'pin-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        blink: {
          '50%': { opacity: '0' },
        },
      },
      animation: {
        'pin-float': 'pin-float 2.8s ease-in-out infinite',
        blink: 'blink 1.1s step-end infinite',
      },
    },
  },
  plugins: [],
};
