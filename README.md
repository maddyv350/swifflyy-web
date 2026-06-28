# Swifflyy — Marketing Site

A high-end, **interactive, Gen-Z-friendly** landing page for **Swifflyy**, the
location-based dating app (*"Meet people where you are"*). It keeps the app's
signature **napkin-sketch** aesthetic — cream paper, ink text, a coral accent,
hand-drawn squiggles, hard offset "sketch" shadows, and the Bricolage / Hanken /
Caveat font system pulled straight from the Flutter app — and layers genuinely
playful, interactive sections on top (a real swipe deck, a marquee, count-up
stats, a word-cycler, a vibe picker, flip cards, an FAQ accordion).

> **Brand name:** the original design was branded *findly* (the pre-rebrand
> name). This build uses **Swifflyy** — a single value, `name` in
> [`src/config/site.ts`](src/config/site.ts). Flip it to `findly` to switch.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

`npm run build` (type-check + prod build) · `npm run preview` · `npm run typecheck`.
Requires Node 18+ (developed on Node 26).

---

## Tech stack

| Concern            | Library                               |
| ------------------ | ------------------------------------- |
| Build / dev server | **Vite** + **React** + **TypeScript** |
| Styling            | **Tailwind CSS** (napkin design tokens) |
| Scroll animation   | **GSAP** + **ScrollTrigger** (staggered reveals) |
| Smooth scrolling   | **Lenis** (synced to the GSAP ticker) |

No WebGL / Three.js — the artwork is hand-drawn SVG, which is what makes it feel
like the app rather than a generic template.

---

## The page, top to bottom

1. **Hero** — headline + coral squiggle, floating sticker badges, a *magnetic*
   CTA, and the hand-drawn phone with an animated map (pointer-parallax tilt).
2. **Marquee** — an infinite scrolling statement band (pauses on hover).
3. **Stats bar** — numbers that **count up** when scrolled into view.
4. **How it works** — three numbered step cards.
5. **Swipe deck** (`#try`) — a fully **draggable** Tinder-style deck. Swipe or tap
   the buttons to like/pass; matches trigger an "it's a match!" overlay + confetti.
6. **Statement** — a bold dark section with a **cycling interest word**.
7. **Features** — four **flip cards** (hover on desktop, tap on touch).
8. **Vibe picker** — tap interest chips to build "your vibe"; copy reacts live.
9. **Map section** — "the city is your matchmaker" + a big hand-drawn city map.
10. **FAQ** — an accordion.
11. **Download CTA** + **Footer** (dark).
12. A thin coral **scroll-progress bar** pinned to the top throughout.

---

## Project structure

```
src/
├── App.tsx                 # Section composition + reduced-motion / smooth-scroll wiring
├── main.tsx · index.css    # Entry + Tailwind layers & napkin design system
├── config/
│   └── site.ts             # ⭐ Brand name + ALL copy & data (nav, stats, steps,
│                           #    swipe profiles, features, vibes, faqs, marquee, cycler)
├── lib/
│   └── confetti.ts         # GSAP confetti burst (used by the match overlay)
├── hooks/
│   ├── usePrefersReducedMotion.ts
│   ├── useSmoothScroll.ts          # Lenis + GSAP ticker + ScrollTrigger
│   ├── useReveal.ts                # staggered fade-up for [data-reveal] children
│   └── useCountUp.ts               # count-up-on-scroll for the stats
└── components/
    ├── ScrollProgress.tsx · Navbar.tsx · Wordmark.tsx · Underline.tsx
    ├── Hero.tsx · PhoneMockup.tsx · MagneticButton.tsx
    ├── Marquee.tsx · StatsBar.tsx · HowItWorks.tsx
    ├── SwipeDeck.tsx               # ⭐ the draggable deck + match overlay
    ├── Statement.tsx · WordCycler.tsx
    ├── Features.tsx                # ⭐ flip cards
    ├── VibePicker.tsx · MapSection.tsx · CityMap.tsx · FAQ.tsx
    ├── DownloadCTA.tsx · Footer.tsx · icons.tsx
```

---

## Customizing

- **Copy & data** — almost everything is in
  [`src/config/site.ts`](src/config/site.ts): brand `name`, nav links, stats, the
  three steps, the **swipe-deck profiles** (set `match: true` to force a match),
  the four features (each with a `back` for the flip side), the **vibe chips**,
  the **FAQ**, the marquee phrases, and the hero word-cycler list.
- **Colors & fonts** — the napkin palette is defined in **two synced places**:
  [`tailwind.config.js`](tailwind.config.js) (`theme.extend.colors`, for classes
  like `bg-paper`/`text-accent`/`shadow-sketch`) and
  [`src/config/site.ts`](src/config/site.ts) (`palette`, used directly by inline
  `<svg>` art since CSS vars don't reach SVG `fill`s). Values come from the app's
  `lib/src/core/theme/app_colors.dart`. Fonts are loaded in [`index.html`](index.html).
- **The hand-drawn maps** — edit [`PhoneMockup.tsx`](src/components/PhoneMockup.tsx)
  and [`CityMap.tsx`](src/components/CityMap.tsx) directly; pins animate via the
  `pulse-ring` / `pin-float` keyframes in [`index.css`](src/index.css).

---

## Performance & accessibility

- **Reduced motion** — with `prefers-reduced-motion`, Lenis, GSAP reveals, the
  marquee, count-ups, word-cycler and confetti all stand down; every section
  renders immediately. (The swipe deck still works — it's user-driven.)
- **Touch-friendly** — the swipe deck uses `touch-action: pan-y` so you can swipe
  cards horizontally while the page still scrolls vertically; flip cards tap.
- **Lean bundle** — ~110 KB gzip JS (React + GSAP), no 3D engine.
- **Accessible** — semantic landmarks, labelled nav / buttons / chips
  (`aria-pressed`, `aria-expanded`), `aria-hidden` on decorative SVG, visible
  focus rings, AA-contrast ink-on-cream text.
- **Responsive** — every section collapses to a single column on mobile.

---

## Notes / next steps

- App-store buttons are placeholders linking to `#download`; swap the `href`s
  once the app ships.
- The swipe deck is a demo with sample profiles in `site.ts` — not wired to a backend.
