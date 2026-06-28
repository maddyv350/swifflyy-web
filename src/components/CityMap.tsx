import { palette as c } from '../config/site';

/** A larger hand-drawn city map — blocks, a hatched park, water, sketchy roads
 *  and avatar pins with the user's pulsing teardrop pin at the centre. */
export function CityMap() {
  const roads = [
    'M-10 185 C 100 176, 220 196, 340 182 C 420 172, 490 188, 530 183',
    'M-10 300 C 90 312, 190 290, 300 304 C 390 315, 470 300, 530 306',
    'M250 -10 C 245 90, 262 200, 250 320 C 242 380, 248 410, 250 440',
  ];

  return (
    <svg viewBox="0 0 520 420" width="100%" height="100%" className="block" style={{ background: c.paper2 }} aria-hidden>
      <defs>
        <pattern id="g2" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="0" cy="0" r="0.6" fill={c.line} opacity="0.15" />
        </pattern>
        <pattern id="pk2" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={c.line} strokeWidth="0.6" opacity="0.3" />
        </pattern>
      </defs>

      <rect width="520" height="420" fill={c.paper2} />
      <rect width="520" height="420" fill="url(#g2)" />

      {/* city blocks */}
      <path d="M20 30 L 180 10 L 210 120 L 50 140 Z" fill={c.paper} opacity="0.55" />
      <path d="M240 160 L 420 140 L 440 260 L 260 275 Z" fill={c.paper} opacity="0.55" />
      <path d="M20 280 L 200 260 L 220 380 L 30 400 Z" fill={c.paper} opacity="0.5" />
      <path d="M300 310 L 500 290 L 520 410 L 310 420 Z" fill={c.paper} opacity="0.45" />

      {/* park */}
      <path
        d="M340 20 C 410 10, 490 55, 495 130 C 500 200, 430 225, 370 200 C 320 180, 315 80, 340 20 Z"
        fill="url(#pk2)"
        stroke={c.line}
        strokeWidth="1.2"
        opacity="0.8"
      />
      <text x="410" y="115" textAnchor="middle" fontFamily="Caveat,cursive" fontSize="18" fill={c.ink2} opacity="0.6">
        park
      </text>

      {/* water */}
      <path
        d="M-10 395 C 60 382, 130 408, 220 390 C 310 372, 380 400, 520 388 L 520 430 L -10 430 Z"
        fill="#e8e0cc"
        stroke={c.line}
        strokeWidth="1.2"
        opacity="0.7"
      />

      {/* roads */}
      {roads.map((d, i) => (
        <g key={i} opacity="0.9">
          <path d={d} stroke={c.paper3} strokeWidth="22" fill="none" strokeLinecap="round" />
          <path d={d} stroke={c.paper} strokeWidth="18" fill="none" strokeLinecap="round" />
          <path
            d={d}
            stroke={c.line}
            strokeWidth="1"
            strokeDasharray="2 6"
            fill="none"
            strokeLinecap="round"
            opacity="0.3"
          />
        </g>
      ))}

      {/* avatar pins */}
      <g transform="translate(120, 150)" style={{ animation: 'pin-float 3.2s ease-in-out infinite' }}>
        <circle cx="0" cy="0" r="24" fill={c.paper} stroke={c.line} strokeWidth="1.5" />
        <text x="0" y="9" textAnchor="middle" fontSize="24">
          👩
        </text>
      </g>
      <g transform="translate(400, 300)" style={{ animation: 'pin-float 3.6s ease-in-out 0.4s infinite' }}>
        <circle cx="0" cy="0" r="22" fill={c.paper} stroke={c.line} strokeWidth="1.5" />
        <text x="0" y="8" textAnchor="middle" fontSize="22">
          🧑
        </text>
      </g>
      <g transform="translate(360, 70)">
        <circle cx="0" cy="0" r="21" fill={c.paper} stroke={c.line} strokeWidth="1.5" />
        <text x="0" y="8" textAnchor="middle" fontSize="20">
          👱
        </text>
      </g>

      {/* user's pulsing teardrop pin */}
      <g transform="translate(255, 215)">
        <circle
          cx="0"
          cy="0"
          r="34"
          fill={c.accent}
          opacity="0.12"
          style={{ animation: 'pulse-ring 1.9s ease-out infinite', transformOrigin: '0 0' }}
        />
        <circle
          cx="0"
          cy="0"
          r="24"
          fill={c.accent}
          opacity="0.18"
          style={{ animation: 'pulse-ring 1.9s ease-out 0.5s infinite', transformOrigin: '0 0' }}
        />
        <path
          d="M0 -38 C -18 -38, -28 -23, -25 -10 C -22 6, -10 18, 0 31 C 10 18, 22 6, 25 -10 C 28 -23, 18 -38, 0 -38 Z"
          fill={c.accent}
          stroke={c.line}
          strokeWidth="1.5"
        />
        <circle cx="0" cy="-13" r="8" fill={c.paper} />
      </g>

      {/* connection threads from user to others */}
      <g stroke={c.accent} strokeWidth="1.2" strokeDasharray="3 5" opacity="0.45" fill="none">
        <path d="M250 200 C 200 180, 160 165, 128 158" />
        <path d="M262 222 C 320 250, 360 275, 392 292" />
      </g>

      {/* labels */}
      <text x="150" y="125" fontFamily="Caveat,cursive" fontSize="14" fill={c.muted} transform="rotate(-5 150 125)">
        0.4 km
      </text>
      <text x="70" y="220" fontFamily="Caveat,cursive" fontSize="16" fill={c.muted} transform="rotate(-4 70 220)">
        match here?
      </text>
    </svg>
  );
}
