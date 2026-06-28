/** Small inline icons used in CTAs. They inherit `currentColor`. */

export const DownloadIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M8 12l4 4 4-4M12 8v8" />
  </svg>
);

export const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

export const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3.18 23.76c.28.15.59.2.91.14l12.93-7.47-2.79-2.79-11.05 10.12zm-.77-20.69C2.14 3.42 2 3.77 2 4.2v15.6c0 .43.14.78.41 1.04l.06.06 8.74-8.74v-.2L2.41 3.01l-.06.06zm19.05 8.62L18.6 9.45l-3.06 3.06 3.06 3.06 2.9-1.67c.83-.48.83-1.26-.04-1.74v.03zM4.1.24L17.03 7.7l-2.79 2.79L4.1.24z" />
  </svg>
);
