/**
 * A hand-drawn squiggle underline sized to sit under an inline word. Wrap the
 * word in a `relative inline-block` and drop this inside it.
 */
export function Underline({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute -bottom-2 -left-1 h-3.5 w-[calc(100%+8px)] ${className}`}
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M4 7 C 44 2, 100 13, 150 5 S 195 9, 196 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}
