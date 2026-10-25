import { useId } from 'react'

// Prendas dibujadas en SVG: tela oscura con borde cromado,
// como los íconos de ítems en un inventario de PS2.

const DETAIL = 'rgba(200, 206, 255, 0.35)'

const SHAPES = {
  hoodie: (fill, rim) => (
    <>
      <path
        d="M72 34 Q100 6 128 34 L162 50 Q176 58 180 74 L194 148 L170 156 L152 96 L152 206 Q100 214 48 206 L48 96 L30 156 L6 148 L20 74 Q24 58 38 50 Z"
        fill={fill}
        stroke={rim}
        strokeWidth="2"
      />
      <path d="M80 40 Q100 20 120 40 Q112 64 100 66 Q88 64 80 40 Z" fill="#020208" />
      <path d="M94 64 L92 96 M106 64 L108 96" stroke={DETAIL} strokeWidth="2" />
      <path d="M70 150 L130 150 L138 184 L62 184 Z" fill="none" stroke={DETAIL} />
      <path d="M8 140 L32 148 M168 148 L192 140 M48 196 Q100 204 152 196" stroke={DETAIL} />
    </>
  ),
  jacket: (fill, rim) => (
    <>
      <path
        d="M70 28 L130 28 L166 44 Q180 52 184 70 L196 160 L170 166 L154 100 L154 196 L46 196 L46 100 L30 166 L4 160 L16 70 Q20 52 34 44 Z"
        fill={fill}
        stroke={rim}
        strokeWidth="2"
      />
      <path d="M70 28 Q100 48 130 28 L124 18 Q100 34 76 18 Z" fill="#020208" stroke={rim} />
      <path d="M100 42 L100 196" stroke={rim} strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M46 184 L154 184 M6 150 L30 156 M170 156 L194 150" stroke={DETAIL} />
      <rect x="160" y="78" width="16" height="22" fill="none" stroke={DETAIL} />
      <path d="M100 42 L100 60" stroke="#e0142e" strokeWidth="3" />
    </>
  ),
  tank: (fill, rim) => (
    <>
      <path
        d="M68 14 L84 14 Q100 52 116 14 L132 14 L136 62 Q152 74 150 98 L150 206 Q100 212 50 206 L50 98 Q48 74 64 62 Z"
        fill={fill}
        stroke={rim}
        strokeWidth="2"
      />
      <path d="M84 14 Q100 46 116 14" fill="none" stroke={DETAIL} strokeWidth="3" />
      <path d="M100 52 L100 92 M90 64 L110 64" stroke={rim} strokeWidth="2.5" />
    </>
  ),
  cargo: (fill, rim) => (
    <>
      <path d="M56 12 L144 12 L156 210 L112 210 L100 74 L88 210 L44 210 Z" fill={fill} stroke={rim} strokeWidth="2" />
      <path d="M56 26 L144 26" stroke={DETAIL} />
      <rect x="50" y="110" width="32" height="42" fill="none" stroke={DETAIL} />
      <rect x="118" y="110" width="32" height="42" fill="none" stroke={DETAIL} />
      <path d="M50 120 L82 120 M118 120 L150 120" stroke={rim} />
    </>
  ),
  jeans: (fill, rim) => (
    <>
      <path d="M58 12 L142 12 L170 212 L110 212 L100 78 L90 212 L30 212 Z" fill={fill} stroke={rim} strokeWidth="2" />
      <path d="M58 26 L142 26 M100 26 L100 70" stroke={DETAIL} />
      <path d="M62 34 Q74 48 88 34 M112 34 Q126 48 138 34" fill="none" stroke={DETAIL} />
      <path d="M70 90 L56 190 M132 90 L146 190" stroke="rgba(232,234,255,0.12)" strokeWidth="10" />
    </>
  ),
  track: (fill, rim) => (
    <>
      <path
        d="M58 12 L142 12 L150 196 Q142 210 124 206 L108 206 L100 78 L92 206 L76 206 Q58 210 50 196 Z"
        fill={fill}
        stroke={rim}
        strokeWidth="2"
      />
      <path d="M62 20 L53 194 M68 20 L59 194 M74 20 L65 194" stroke="#e8eaff" strokeWidth="2.5" />
      <path d="M138 20 L147 194 M132 20 L141 194 M126 20 L135 194" stroke="#e8eaff" strokeWidth="2.5" />
      <path d="M58 24 L142 24" stroke={DETAIL} />
    </>
  ),
  boots: (fill, rim) => (
    <>
      <path
        d="M62 20 L112 20 L114 128 Q150 138 176 156 Q192 168 190 184 L190 194 L44 194 L44 170 Q54 150 58 120 Z"
        fill={fill}
        stroke={rim}
        strokeWidth="2"
      />
      <rect x="40" y="190" width="154" height="18" rx="4" fill="#020208" stroke={rim} />
      <path d="M52 208 L60 200 L68 208 L76 200 L84 208 L92 200 L100 208 L108 200 L116 208 L124 200 L132 208 L140 200 L148 208 L156 200 L164 208 L172 200 L180 208" fill="none" stroke={DETAIL} />
      <path d="M70 36 L106 36 M70 52 L106 52 M70 68 L106 68 M70 84 L106 84 M70 100 L106 100 M70 116 L106 116" stroke={DETAIL} strokeWidth="2" />
    </>
  ),
  chain: (_fill, rim) => (
    <>
      <path d="M40 18 Q100 150 160 18" fill="none" stroke={rim} strokeWidth="5" strokeDasharray="7 4" />
      <path
        d="M92 118 L108 118 L108 140 L128 140 L128 156 L108 156 L108 204 L92 204 L92 156 L72 156 L72 140 L92 140 Z"
        fill={rim}
        stroke="#020208"
        strokeWidth="1.5"
      />
      <circle cx="100" cy="148" r="4" fill="#e0142e" />
    </>
  ),
}

export default function Garment({ type, className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const shape = SHAPES[type] ?? SHAPES.hoodie

  return (
    <svg className={`garment ${className}`} viewBox="0 0 200 220" aria-hidden="true">
      <defs>
        <linearGradient id={`fill${uid}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#2c2c52" />
          <stop offset="0.45" stopColor="#11112a" />
          <stop offset="1" stopColor="#05050c" />
        </linearGradient>
        <linearGradient id={`rim${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#9aa0c8" />
          <stop offset="0.5" stopColor="#3a3c5a" />
          <stop offset="0.65" stopColor="#d6dae6" />
          <stop offset="1" stopColor="#6b6f94" />
        </linearGradient>
      </defs>
      {shape(`url(#fill${uid})`, `url(#rim${uid})`)}
    </svg>
  )
}
