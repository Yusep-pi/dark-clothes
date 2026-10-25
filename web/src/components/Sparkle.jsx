import './Sparkle.css'

// Destello de 4 puntas (estilo Y2K / Frutiger Aero) que titila.
// Se posiciona con style={{ top, left }} desde afuera.

export default function Sparkle({ size = 24, delay = 0, style, className = '' }) {
  return (
    <svg
      className={`sparkle ${className}`}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={{ animationDelay: `${delay}s`, ...style }}
      aria-hidden="true"
    >
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill="#fff" />
    </svg>
  )
}
