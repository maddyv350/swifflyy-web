import type { ReactNode } from 'react';

/**
 * Swifflyy's hand-drawn doodle set — the site's illustration language.
 *
 * Every doodle is a wobbly, stroke-only inline SVG: `currentColor` stroke
 * (color them with text classes, e.g. `text-coral-500`), strokeWidth 2.5–3,
 * round caps/joins, deliberately imperfect paths. Every stroke element
 * carries `data-draw`, so any doodle placed inside a `useDrawOn` container
 * draws itself on like pen on a napkin. Without `useDrawOn` they render
 * fully drawn (reduced-motion / prerender safe).
 *
 * Usage: `<DoodleHeart size={28} className="text-coral-500" />`
 */

export interface DoodleProps {
  /** Rendered width in px (height keeps the doodle's aspect). Default 48. */
  size?: number;
  className?: string;
}

interface SketchProps extends DoodleProps {
  /** viewBox width (default 48). */
  vb?: number;
  /** viewBox height (defaults to `vb` — square). */
  vbH?: number;
  strokeWidth?: number;
  children: ReactNode;
}

/** Shared wobbly-stroke SVG shell. */
function Sketch({ size = 48, vb = 48, vbH, className, strokeWidth = 2.75, children }: SketchProps) {
  const h = vbH ?? vb;
  return (
    <svg
      width={size}
      height={(size * h) / vb}
      viewBox={`0 0 ${vb} ${h}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** A slightly lopsided heart that doesn't quite close — drawn in one stroke. */
export const DoodleHeart = (p: DoodleProps) => (
  <Sketch {...p}>
    <path
      data-draw
      d="M24.2 41.2 C 16.6 35.4, 7.4 28.2, 6 19.4 C 4.9 12.4, 9.8 6.6, 15.9 6.9 C 20.2 7.1, 23 10.1, 24.4 13.8 C 25.6 10.2, 28.6 6.9, 32.8 6.7 C 39 6.4, 43.6 12.1, 42.5 19 C 41.1 27.7, 31.9 34.9, 25.1 40.6"
    />
  </Sketch>
);

/** A wobbly map pin with an off-center hole. */
export const DoodlePin = (p: DoodleProps) => (
  <Sketch {...p}>
    <path
      data-draw
      d="M24.2 43.6 C 23.4 42.8, 9.8 29.8, 9.3 19.1 C 8.9 10.9, 15.6 4.3, 23.7 4.5 C 31.9 4.7, 38.7 11.1, 38.5 19.4 C 38.2 29.7, 25.4 42.5, 24.6 43.3"
    />
    <circle data-draw cx="23.9" cy="18.7" r="4.7" />
  </Sketch>
);

/** A five-point star drawn fast — jittered points, round joins. */
export const DoodleStar = (p: DoodleProps) => (
  <Sketch {...p}>
    <path
      data-draw
      d="M24.2 5.6 L 29.3 17.1 L 42.1 18.5 L 32.6 27.2 L 35.7 39.9 L 24.4 33.2 L 12.9 40.3 L 15.4 27.4 L 5.9 19.2 L 18.8 17.5 L 24.4 6.4"
    />
  </Sketch>
);

/** A four-point twinkle — the ✦ glyph, hand-drawn. */
export const DoodleSparkle = (p: DoodleProps) => (
  <Sketch {...p}>
    <path
      data-draw
      d="M24 6.2 C 25.7 15, 28.9 20.6, 41.3 23.7 C 29.1 27.1, 25.8 31.4, 24.3 41.8 C 22.4 31.5, 19 27, 6.7 24.2 C 18.7 20.9, 22.3 15.5, 23.8 6.6"
    />
  </Sketch>
);

/** A steaming cup — body, rim, ear-shaped handle, two curls of steam. */
export const DoodleCoffee = (p: DoodleProps) => (
  <Sketch {...p}>
    <path data-draw d="M9.6 20.2 C 9.9 26.9, 11.2 33.4, 14 36.5 C 16.3 39, 27.7 39.3, 30.3 36.3 C 33 33.2, 34.2 26.8, 34.5 20.4" />
    <path data-draw d="M8.2 19.9 C 15.8 17.7, 28.2 17.9, 35.9 20.3" />
    <path data-draw d="M34.8 23.2 C 39.7 21.9, 42.9 25.5, 41 29.1 C 39.5 31.9, 36 32.7, 33.5 31.6" />
    <path data-draw d="M18.3 13.4 C 17 11, 19.5 9.3, 18.2 6.6" />
    <path data-draw d="M25.9 13.7 C 24.5 11.2, 27.2 9.5, 25.8 6.5" />
  </Sketch>
);

/** A chat bubble with a droopy tail and two scribbled lines of "text". */
export const DoodleChatBubble = (p: DoodleProps) => (
  <Sketch {...p}>
    <path
      data-draw
      d="M9.2 8.7 C 19.8 6.9, 33.1 7.1, 39.5 8.9 C 42 9.7, 42.7 12.1, 42.5 15.6 C 42.3 20.1, 42.6 24.4, 41.1 27.3 C 39.7 30, 29.2 30.7, 21.7 30.2 C 19.2 33.2, 16 36.2, 12.7 38.4 C 13.2 35.4, 13.5 32.6, 13.4 29.8 C 10.6 29.3, 7.5 28.6, 6.4 26.4 C 5.1 23.8, 5.5 18.1, 6 13.7 C 6.3 10.9, 7.2 9.1, 9.2 8.7"
    />
    <path data-draw d="M14.8 16.4 C 20 15.9, 27.2 15.9, 33.2 16.5" />
    <path data-draw d="M14.9 21.7 C 19.4 21.2, 24 21.3, 27.6 21.8" />
  </Sketch>
);

/** A lopsided smiley — dot-dash eyes and a big warm grin. */
export const DoodleSmiley = (p: DoodleProps) => (
  <Sketch {...p}>
    <path
      data-draw
      d="M23.6 4.9 C 33.6 4.2, 42.5 12.1, 42.9 21.9 C 43.3 31.9, 35.3 41.2, 25 41.6 C 14.8 42, 5.6 34.1, 5.3 23.8 C 5 13.9, 13.7 5.5, 23.2 5"
    />
    <path data-draw d="M17.3 18.1 C 17.5 19.3, 17.4 20.4, 17.2 21.5" />
    <path data-draw d="M30.7 17.9 C 30.9 19.1, 30.8 20.2, 30.6 21.3" />
    <path data-draw d="M15.4 27.1 C 18.3 31.6, 24.4 33.7, 29.1 31.7 C 31 30.8, 32.5 29.3, 33.2 27.5" />
  </Sketch>
);

/** A folded paper plane — outline, crease to the nose, little under-flap. */
export const DoodlePaperPlane = (p: DoodleProps) => (
  <Sketch {...p}>
    <path
      data-draw
      d="M6.2 24.9 C 18.1 20, 30.4 13.6, 42.1 7.4 C 39.6 18.3, 36.5 29.5, 33.1 40.1 C 30.1 36.3, 27.2 32.6, 24.3 29 C 18.3 27.7, 12.2 26.4, 6.2 24.9"
    />
    <path data-draw d="M42.1 7.4 C 36.1 14.5, 30.2 21.7, 24.3 29" />
    <path data-draw d="M24.3 29 C 23.8 31.7, 23.4 34.3, 23.7 36.9 C 25.7 34.8, 27.7 32.7, 29.6 30.5" />
  </Sketch>
);

/** A wide horizontal squiggle — uneven waves, like a pen warming up. */
export const DoodleSquiggle = ({ size = 64, className }: DoodleProps) => (
  <Sketch vb={64} vbH={20} size={size} className={className}>
    <path
      data-draw
      d="M3 12.8 C 7.8 5.2, 13 5.1, 17.8 11.5 C 22.7 17.9, 27.8 18.2, 32.3 11.6 C 36.9 5, 42 4.9, 46.9 11.3 C 51.8 17.7, 56.7 17.5, 61 10.8"
    />
  </Sketch>
);

/** A curly hand arrow — swoops, loops once, lands on a flicked head. */
export const DoodleArrow = (p: DoodleProps) => (
  <Sketch {...p}>
    <path
      data-draw
      d="M6.4 8.8 C 18.6 13.3, 26.9 20.4, 26.2 28.1 C 25.7 32.9, 20.3 34.7, 17.9 31.1 C 15.7 27.7, 19.5 23.5, 24.9 23.8 C 31.9 24.2, 37.5 29.7, 40.7 38.3"
    />
    <path data-draw d="M34.6 34.2 C 36.7 35.6, 38.7 36.9, 40.7 38.3 C 41 36, 41.5 33.7, 42.3 31.5" />
  </Sketch>
);

/** A hand asterisk — three quick crossing strokes, none quite through center. */
export const DoodleAsterisk = (p: DoodleProps) => (
  <Sketch {...p}>
    <path data-draw d="M24.3 7.4 C 24.5 18.3, 24.3 29.4, 23.8 40.5" />
    <path data-draw d="M9.7 15.5 C 19.1 21, 28.7 26.3, 38.5 31.3" />
    <path data-draw d="M38.2 15.9 C 28.5 21.2, 19.1 26.6, 9.9 32" />
  </Sketch>
);

/** A five-petal daisy — one asymmetric petal, spun at uneven angles. */
export const DoodleFlower = (p: DoodleProps) => {
  const petal =
    'M24 20.9 C 22.2 16.6, 21.8 11.5, 23.7 8.7 C 25.2 6.5, 27.8 7.1, 28.5 9.7 C 29.5 13.3, 27.4 17.7, 25.3 20.8';
  return (
    <Sketch {...p}>
      {[0, 68, 141, 217, 289].map((a) => (
        <path key={a} data-draw d={petal} transform={`rotate(${a} 24 25)`} />
      ))}
      <path
        data-draw
        d="M24.1 21.3 C 26.5 21.5, 27.9 23.4, 27.5 25.6 C 27.1 27.7, 24.9 28.9, 22.9 28.2 C 21 27.5, 20.2 25.2, 21.1 23.4 C 21.8 22.1, 22.9 21.3, 24.1 21.3"
      />
    </Sketch>
  );
};

/**
 * An ellipse scribbled ~1.5 turns around — for circling a word or number.
 * Absolutely position it over the word (`inset-0 h-full w-full`); it stretches
 * (`preserveAspectRatio="none"`) and the stroke stays crisp
 * (`vector-effect: non-scaling-stroke`).
 */
export const DoodleCircleScribble = ({ size = 120, className }: DoodleProps) => (
  <svg
    width={size}
    height={size * 0.475}
    viewBox="0 0 120 57"
    preserveAspectRatio="none"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path
      data-draw
      vectorEffect="non-scaling-stroke"
      d="M84.6 8.4 C 60.2 2.6, 22.4 6.4, 11.6 19.8 C 1.8 32.8, 13.2 49.3, 42 53.4 C 71.8 57.5, 103.6 50.1, 110.3 35.6 C 116.9 21.2, 100.4 7.7, 72.4 5.6 C 45.6 3.6, 16.4 10.2, 9.2 23.9 C 3 35.9, 16.2 49.6, 39.8 52.3"
    />
  </svg>
);
