import { site } from '../config/site';

/**
 * The hand-written brand wordmark with a coral squiggle underline. Size is
 * driven by the `text-*` class you pass. `tone` flips it for dark surfaces.
 */
export function Wordmark({
  className = '',
  tone = 'light',
}: {
  className?: string;
  tone?: 'light' | 'dark';
}) {
  return (
    <span
      className={`relative inline-block font-hand font-bold leading-none tracking-[-1px] ${
        tone === 'light' ? 'text-coral-600' : 'text-coral-300'
      } ${className}`}
    >
      {site.name}
      <svg
        className="pointer-events-none absolute -bottom-1.5 left-0 w-full"
        viewBox="0 0 120 12"
        height="10"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M2 6 C 25 2, 55 10, 85 4 S 115 8, 118 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </span>
  );
}
