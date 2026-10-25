// Nubes generadas con un filtro SVG de ruido (feTurbulence):
// no necesitan ninguna imagen y cada "seed" da nubes distintas.

export default function Clouds({ seed = 3, className = '' }) {
  const id = `clouds-${seed}`
  return (
    <svg className={`clouds ${className}`} viewBox="0 0 1600 700" preserveAspectRatio="none" aria-hidden="true">
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.0032 0.0075" numOctaves="5" seed={seed} />
        {/* blanco puro; la opacidad sale del ruido → manchas de nube */}
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  3.6 0 0 0 -1.55" />
        <feGaussianBlur stdDeviation="1.2" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  )
}
