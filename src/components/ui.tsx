/** Tiny shared presentational primitives. */

const TONES = [
  'linear-gradient(135deg, rgb(var(--coral-400)), rgb(var(--coral-600)))',
  'linear-gradient(135deg, rgb(var(--plum-400)), rgb(var(--plum-700)))',
  'linear-gradient(135deg, rgb(var(--coral-300)), rgb(var(--plum-500)))',
  'linear-gradient(135deg, rgb(var(--plum-300)), rgb(var(--coral-500)))',
  'linear-gradient(135deg, rgb(var(--coral-500)), rgb(var(--plum-600)))',
] as const;

/**
 * Initial-on-gradient avatar — the stand-in for profile photos in every fake
 * app UI on the site (no stock photos, no OS emoji).
 */
export function Avatar({
  name,
  tone = 0,
  size = 48,
  className = '',
}: {
  name: string;
  tone?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-body font-bold text-cream-25 ring-2 ring-cream-25 ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: TONES[tone % TONES.length],
      }}
    >
      {name.charAt(0)}
    </span>
  );
}
