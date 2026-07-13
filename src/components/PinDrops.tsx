import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MAX_LIVE = 8;

/**
 * Click anywhere → a little map pin drops in with a bounce and a ripple, then
 * fades away. The product's core gesture ("drop a pin"), made physical across
 * the whole page. Skips interactive elements and anything marked
 * [data-no-pin], and is disabled entirely for reduced-motion users.
 */
export function PinDrops({ enabled }: { enabled: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const live = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const spawn = (x: number, y: number) => {
      const root = host.current;
      if (!root || live.current >= MAX_LIVE) return;
      live.current++;

      const wrap = document.createElement('div');
      wrap.style.cssText = `position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-100%);`;
      wrap.innerHTML = `
        <svg width="26" height="32" viewBox="0 0 26 32" style="display:block;transform-origin:50% 100%" data-pin>
          <path d="M13 1 C6 1 1 6 1 12.5 C1 21 13 31 13 31 C13 31 25 21 25 12.5 C25 6 20 1 13 1 Z" fill="#e25b3e" stroke="#1f0f1a" stroke-width="1.5"/>
          <circle cx="13" cy="12.5" r="4.5" fill="#fbf7ef" stroke="#1f0f1a" stroke-width="1.5"/>
        </svg>
        <span data-ring style="position:absolute;left:50%;bottom:-4px;width:26px;height:10px;transform:translateX(-50%);border:1.5px solid #e25b3e;border-radius:50%;opacity:0"></span>`;
      root.appendChild(wrap);

      const pin = wrap.querySelector('[data-pin]');
      const ring = wrap.querySelector('[data-ring]');
      gsap
        .timeline({
          onComplete: () => {
            wrap.remove();
            live.current--;
          },
        })
        .fromTo(pin, { y: -44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'bounce.out' })
        .fromTo(pin, { scaleY: 1 }, { scaleY: 0.88, duration: 0.08, yoyo: true, repeat: 1 }, '-=0.3')
        .fromTo(
          ring,
          { scale: 0.4, opacity: 0.7 },
          { scale: 2.4, opacity: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.45',
        )
        .to(wrap, { opacity: 0, duration: 0.35, ease: 'power1.in', delay: 0.4 });
    };

    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest('a,button,input,textarea,select,label,summary,[data-no-pin]')) return;
      spawn(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, [enabled]);

  return <div ref={host} className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden />;
}
