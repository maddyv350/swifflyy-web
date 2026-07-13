import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { shareLink } from '../lib/referral';
import { burstConfetti } from '../lib/confetti';

const SHARE_TEXT =
  'I just grabbed early access to Swifflyy — a location-first dating app. Drop a pin, meet people where you actually are. Join with my link:';

/**
 * Post-signup "napkin ticket": confirms the spot and hands the person a
 * referral link with copy / native-share / X / WhatsApp actions. The share
 * loop is the growth engine — every friend who joins with this link is
 * attributed to them.
 */
export function WaitlistTicket({ code, city }: { code: string; city?: string }) {
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const link = shareLink(code);

  // Getting on the list is the site's conversion moment — celebrate it.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    burstConfetti(el, 44);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.from(el, { y: 26, opacity: 0, rotation: -1.5, duration: 0.6, ease: 'back.out(1.6)' });
    }
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the field is selectable as a fallback */
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Swifflyy early access', text: SHARE_TEXT, url: link });
      } catch {
        /* user dismissed */
      }
    } else {
      copy();
    }
  };

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(link)}`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${link}`)}`;

  const chip =
    'cursor-pointer rounded-full border-[1.5px] border-cream-50/25 px-4 py-2 text-[13px] font-semibold text-cream-50/80 no-underline transition-colors duration-200 hover:border-cream-50/60 hover:text-cream-50';

  return (
    <div ref={rootRef} className="relative mx-auto mt-10 max-w-md text-left">
      {/* the ticket */}
      <div className="overflow-hidden rounded-3xl border-[1.5px] border-cream-50/25 bg-cream-50/[0.05] backdrop-blur-sm">
        <div className="flex items-center justify-between px-7 pt-6">
          <span className="-rotate-1 font-hand text-2xl text-coral-300">early access ✦</span>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--coral-300))" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 21.5S4.5 15 4.5 9.8A7.5 7.5 0 0 1 12 2.5a7.5 7.5 0 0 1 7.5 7.3c0 5.2-7.5 11.7-7.5 11.7Z" />
            <circle cx="12" cy="9.8" r="2.8" />
          </svg>
        </div>
        <div className="px-7 pb-6 pt-3">
          <div className="font-display text-[27px] font-semibold leading-tight text-cream-50">
            You’re on the list.
          </div>
          <p className="mt-2 text-[15px] leading-[1.55] text-cream-50/65">
            {city ? (
              <>
                We’ll email you the moment Swifflyy lands in{' '}
                <span className="font-semibold text-cream-50/90">{city}</span>.
              </>
            ) : (
              <>We’ll email you the moment Swifflyy lands in your neighbourhood.</>
            )}
          </p>
        </div>

        {/* perforated divider */}
        <div className="relative">
          <div className="absolute left-0 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-plum-950" />
          <div className="absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 translate-x-1/2 rounded-full bg-plum-950" />
          <div className="mx-5 border-t-[1.5px] border-dashed border-cream-50/25" />
        </div>

        {/* referral stub */}
        <div className="px-7 py-6">
          <div className="font-hand text-xl text-cream-50/75">want in sooner?</div>
          <p className="mt-1 text-[14px] leading-[1.55] text-cream-50/55">
            Friends who join with your link jump the line right alongside you.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              aria-label="Your referral link"
              className="min-w-0 flex-1 rounded-full border-[1.5px] border-cream-50/20 bg-cream-50/[0.04] px-4 py-3 text-[13px] text-cream-50/85 outline-none"
            />
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-full border-[1.5px] border-cream-50/25 px-4 py-3 text-[13px] font-bold text-cream-50 transition-colors duration-200 hover:border-cream-50/60"
            >
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={nativeShare} className={chip}>
              Share ↗
            </button>
            <a href={xUrl} target="_blank" rel="noopener noreferrer" className={chip}>
              Post on X
            </a>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className={chip}>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
