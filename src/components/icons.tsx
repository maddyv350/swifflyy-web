/**
 * Hand-drawn-feeling inline icons. All stroke-based, inherit `currentColor`,
 * sized via the `size` prop. No OS emoji anywhere near app-UI mockups.
 */

interface IconProps {
  size?: number;
  className?: string;
}

export const PinIcon = ({ size = 16, className }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 21.5S4.5 15 4.5 9.8A7.5 7.5 0 0 1 12 2.5a7.5 7.5 0 0 1 7.5 7.3c0 5.2-7.5 11.7-7.5 11.7Z" />
    <circle cx="12" cy="9.8" r="2.8" />
  </svg>
);

/** Solid pin for map mockups. */
export const PinSolid = ({ size = 24, className }: IconProps) => (
  <svg className={className} width={size} height={(size * 30) / 24} viewBox="0 0 24 30" aria-hidden>
    <path
      d="M12 29S2.5 19.6 2.5 11.5A9.5 9.5 0 0 1 12 2a9.5 9.5 0 0 1 9.5 9.5C21.5 19.6 12 29 12 29Z"
      fill="currentColor"
      stroke="rgb(31 15 26)"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="11.5" r="3.4" fill="rgb(251 247 239)" stroke="rgb(31 15 26)" strokeWidth="1.5" />
  </svg>
);

export const HeartIcon = ({ size = 18, className }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 21c-.4 0-8.6-5.1-9.8-10.4C1.3 6.7 4 4 7 4c2 0 3.9 1 5 2.7C13.1 5 15 4 17 4c3 0 5.7 2.7 4.8 6.6C20.6 15.9 12.4 21 12 21Z" />
  </svg>
);

export const XMarkIcon = ({ size = 18, className }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    aria-hidden
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/** Selfie-verified badge: a wobbly rosette with a check. */
export const VerifiedIcon = ({ size = 16, className }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 2.2l2.5 1.9 3.1-.3 1 3 2.8 1.4-.9 3 1.6 2.7-2.3 2.1.1 3.1-3 .8-1.7 2.6-2.9-1-2.9 1-1.7-2.6-3-.8.1-3.1L2.5 14l1.6-2.7-.9-3L6 6.9l1-3 3.1.3L12 2.2Z"
      fill="currentColor"
    />
    <path
      d="M8.4 12.3l2.4 2.4 4.8-5"
      stroke="rgb(251 247 239)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const ShieldIcon = ({ size = 24, className }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 2.5c2.6 1.5 5.3 2.3 8 2.4 0 6.8-2.4 12.8-8 16.6-5.6-3.8-8-9.8-8-16.6 2.7-.1 5.4-.9 8-2.4Z" />
    <path d="M8.8 11.8l2.3 2.3 4.4-4.6" />
  </svg>
);

export const PinClockIcon = ({ size = 24, className }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M10 21.2S3.2 15.5 3.2 10.6A6.8 6.8 0 0 1 10 4a6.8 6.8 0 0 1 4.5 1.7" />
    <circle cx="16.5" cy="13.5" r="5.3" />
    <path d="M16.5 10.8v2.7l2 1.6" />
  </svg>
);

export const GpsCrossIcon = ({ size = 24, className }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="7" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
  </svg>
);

export const HandStopIcon = ({ size = 24, className }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11m0-6.5a1.5 1.5 0 0 1 3 0V11m0-4.5a1.5 1.5 0 0 1 3 0V13c0 4.5-2.6 8-7 8-3.2 0-4.9-1.5-6.2-4.1-.7-1.4-1.6-3.5-2-4.6-.3-.9.1-1.8 1-2.1.7-.3 1.5 0 2 .6L8 13.5" />
  </svg>
);

export const ArrowDownIcon = ({ size = 16, className }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 4v15m0 0l-6-6m6 6l6-6" />
  </svg>
);

export const InstagramIcon = ({ size = 18, className }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="3" width="18" height="18" rx="5.4" />
    <circle cx="12" cy="12" r="4.1" />
    <path d="M17.2 6.9h.01" />
  </svg>
);

export const LinkedInIcon = ({ size = 18, className }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="3" width="18" height="18" rx="4.2" />
    <path d="M7.6 10.4v6.4" />
    <path d="M7.6 7.4h.01" />
    <path d="M11.6 16.8v-6.4m0 1.7a2.7 2.7 0 0 1 4.8 1.7v3" />
  </svg>
);

export const ArrowRightIcon = ({ size = 16, className }: IconProps) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M4 12h15m0 0l-6-6m6 6l-6 6" />
  </svg>
);
