import { palette as c } from '../config/site';

/**
 * The hero phone: a sketchy hand-drawn map (dot grid, blocks, a hatched park,
 * roads, animated avatar pins + the user's pulsing teardrop pin) above a
 * pull-up "lift card" showing a nearby profile. Ringed by hand-written doodles.
 */
export function PhoneMockup() {
  return (
    <div className="phone-wrap relative w-[220px] md:w-[300px]">
      <div
        className="relative z-[2] rounded-[34px] bg-ink p-3 md:rounded-[44px]"
        style={{ boxShadow: `0 40px 80px rgba(31,29,27,0.22), 0 0 0 1.5px ${c.line}` }}
      >
        <div className="relative h-[438px] w-full overflow-hidden rounded-[26px] bg-paper md:h-[596px] md:rounded-[34px]">
          {/* notch */}
          <div className="absolute left-1/2 top-3.5 z-10 h-7 w-[90px] -translate-x-1/2 rounded-[20px] bg-ink" />

          {/* map */}
          <div className="relative h-[60%] w-full overflow-hidden bg-paper2">
            <svg viewBox="0 0 276 372" width="100%" height="100%" className="block" aria-hidden>
              <defs>
                <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
                  <circle cx="0" cy="0" r="0.55" fill={c.line} opacity="0.16" />
                </pattern>
                <pattern
                  id="pkHatch"
                  width="5"
                  height="5"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line x1="0" y1="0" x2="0" y2="5" stroke={c.line} strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="276" height="372" fill={c.paper2} />
              <rect width="276" height="372" fill="url(#grid)" />

              {/* blocks */}
              <path d="M20 40 L 130 20 L 150 100 L 40 120 Z" fill={c.paper} opacity="0.6" />
              <path d="M160 140 L 280 120 L 280 210 L 160 220 Z" fill={c.paper} opacity="0.6" />
              <path d="M10 240 L 130 220 L 145 310 L 20 330 Z" fill={c.paper} opacity="0.5" />

              {/* park */}
              <path
                d="M185 30 C 230 22, 270 55, 270 100 C 270 145, 225 160, 190 145 C 160 130, 158 65, 185 30 Z"
                fill="url(#pkHatch)"
                stroke={c.line}
                strokeWidth="1"
                opacity="0.8"
              />
              <text
                x="216"
                y="95"
                textAnchor="middle"
                fontFamily="Caveat,cursive"
                fontSize="13"
                fill={c.ink2}
                opacity="0.65"
              >
                park
              </text>

              {/* roads */}
              {[
                'M-10 155 C 60 148, 130 162, 200 153 C 250 146, 280 158, 300 154',
                'M-10 265 C 70 275, 160 255, 240 268 C 270 273, 290 262, 310 265',
                'M120 -10 C 115 70, 128 150, 120 240 C 113 300, 118 340, 120 380',
              ].map((d, i) => (
                <g key={i} opacity="0.9">
                  <path d={d} stroke={c.paper3} strokeWidth="16" fill="none" strokeLinecap="round" />
                  <path d={d} stroke={c.paper} strokeWidth="13" fill="none" strokeLinecap="round" />
                  <path
                    d={d}
                    stroke={c.line}
                    strokeWidth="0.8"
                    strokeDasharray="2 5"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </g>
              ))}

              {/* avatar pins */}
              <g transform="translate(72, 118)" style={{ animation: 'pin-float 2.8s ease-in-out infinite' }}>
                <circle
                  cx="0"
                  cy="0"
                  r="22"
                  fill={c.accent}
                  opacity="0.06"
                  style={{ animation: 'pulse-ring 2s ease-out 0.5s infinite', transformOrigin: '0 0' }}
                />
                <circle cx="0" cy="0" r="22" fill={c.paper} stroke={c.line} strokeWidth="1.5" />
                <text x="0" y="8" textAnchor="middle" fontSize="20">
                  👩
                </text>
              </g>
              <g transform="translate(188, 200)">
                <circle cx="0" cy="0" r="20" fill={c.paper} stroke={c.line} strokeWidth="1.5" />
                <text x="0" y="7" textAnchor="middle" fontSize="18">
                  🧑
                </text>
              </g>
              <g transform="translate(55, 280)">
                <circle cx="0" cy="0" r="19" fill={c.paper} stroke={c.line} strokeWidth="1.5" />
                <text x="0" y="7" textAnchor="middle" fontSize="17">
                  👱
                </text>
              </g>

              {/* user's own pin */}
              <g transform="translate(138, 195)">
                <circle
                  cx="0"
                  cy="0"
                  r="26"
                  fill={c.accent}
                  opacity="0.12"
                  style={{ animation: 'pulse-ring 1.8s ease-out infinite', transformOrigin: '0 0' }}
                />
                <circle
                  cx="0"
                  cy="0"
                  r="18"
                  fill={c.accent}
                  opacity="0.18"
                  style={{ animation: 'pulse-ring 1.8s ease-out 0.4s infinite', transformOrigin: '0 0' }}
                />
                <path
                  d="M0 -30 C -14 -30, -22 -18, -20 -8 C -18 4, -8 14, 0 24 C 8 14, 18 4, 20 -8 C 22 -18, 14 -30, 0 -30 Z"
                  fill={c.accent}
                  stroke={c.line}
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="-10" r="6" fill={c.paper} />
              </g>

              {/* distance labels */}
              <text x="108" y="88" fontFamily="Caveat,cursive" fontSize="11" fill={c.muted} transform="rotate(-5 108 88)">
                0.3 km
              </text>
              <text x="195" y="178" fontFamily="Caveat,cursive" fontSize="11" fill={c.muted} transform="rotate(3 195 178)">
                0.5 km
              </text>
            </svg>
          </div>

          {/* lift card */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 rounded-t-[22px] border-t-[1.5px] border-paper3 bg-paper px-4 pb-2.5 pt-3.5">
            <div className="mx-auto mb-0.5 h-[3px] w-8 rounded-full bg-faint" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-faint bg-paper2 text-xl">
                👩
              </div>
              <div>
                <div className="font-head text-base font-bold text-ink">Priya, 26</div>
                <div className="font-body text-xs text-muted">0.3 km away · Koramangala</div>
              </div>
              <span className="ml-auto whitespace-nowrap rounded-full border border-accent bg-accent-soft px-2.5 py-1 text-[11px] font-semibold tracking-[0.3px] text-accent">
                Just dropped
              </span>
            </div>
            <div className="mt-0.5 flex gap-2">
              <div className="flex-1 rounded-[10px] border-[1.5px] border-line bg-ink p-2.5 text-center font-body text-[11px] font-bold uppercase tracking-[1px] text-paper">
                Like
              </div>
              <div className="flex-1 rounded-[10px] border-[1.5px] border-faint bg-paper p-2.5 text-center font-body text-[11px] font-bold uppercase tracking-[1px] text-ink">
                Skip
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* floating doodles */}
      <div className="absolute -left-14 -top-4 hidden -rotate-[8deg] whitespace-nowrap font-hand text-[15px] text-muted md:block">
        3 people nearby ✦
      </div>
      <div className="absolute -right-16 bottom-[120px] hidden rotate-[5deg] whitespace-nowrap font-hand text-sm text-faint md:block">
        matched at
        <br />
        that café →
      </div>
      <svg
        className="absolute -right-7 bottom-[155px] hidden md:block"
        width="34"
        height="44"
        viewBox="0 0 34 44"
        fill="none"
        aria-hidden
      >
        <path d="M4 4 C 2 20, 18 32, 28 40" stroke={c.faint} strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M22 38 L 28 40 L 26 32"
          stroke={c.faint}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
