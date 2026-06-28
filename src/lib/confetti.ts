import { gsap } from 'gsap';

const COLORS = ['#d94f3a', '#f2c9c0', '#f5a623', '#7a766f', '#1f1d1b'];

/**
 * Fires a quick burst of small confetti dots from a host element's centre.
 * Pure DOM + GSAP, cleans up after itself. No-op for reduced-motion users.
 */
export function burstConfetti(host: HTMLElement, count = 36): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    const size = gsap.utils.random(6, 12);
    Object.assign(dot.style, {
      position: 'absolute',
      left: '50%',
      top: '45%',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      background: COLORS[i % COLORS.length],
      pointerEvents: 'none',
      zIndex: '50',
    });
    host.appendChild(dot);
    gsap.fromTo(
      dot,
      { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0 },
      {
        x: gsap.utils.random(-260, 260),
        y: gsap.utils.random(-220, 160),
        rotation: gsap.utils.random(-220, 220),
        opacity: 0,
        scale: gsap.utils.random(0.4, 1.4),
        duration: gsap.utils.random(0.7, 1.3),
        ease: 'power3.out',
        onComplete: () => dot.remove(),
      },
    );
  }
}
