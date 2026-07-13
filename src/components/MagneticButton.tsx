import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** Disable the magnetic pull (reduced motion / touch). */
  enabled?: boolean;
  ariaLabel?: string;
}

/**
 * An anchor that subtly leans toward the cursor while hovered — a playful,
 * premium micro-interaction. Falls back to a plain link when disabled.
 */
export function MagneticButton({
  href,
  children,
  className = '',
  enabled = true,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(ref.current, { x: x * 0.28, y: y * 0.38, duration: 0.4, ease: 'power3.out' });
  };

  const reset = () => {
    if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
    >
      {children}
    </a>
  );
}
