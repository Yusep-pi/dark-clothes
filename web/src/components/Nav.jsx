import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import './Nav.css'

const LINKS = [
  { id: 'drop', label: 'Drop' },
  { id: 'lookbook', label: 'Lookbook' },
  { id: 'roster', label: 'Roster' },
  { id: 'manifesto', label: 'Manifiesto' },
  { id: 'save', label: 'Save' },
]

export default function Nav({ visible, cartCount, onNavigate }) {
  const root = useRef()
  const countRef = useRef()

  useGSAP(
    () => {
      if (!visible) return gsap.set(root.current, { autoAlpha: 0, y: -20 })
      gsap.to(root.current, { autoAlpha: 1, y: 0, duration: 0.8, delay: 1.6, ease: 'expo.out' })
    },
    { dependencies: [visible], scope: root },
  )

  // el contador "salta" cada vez que sumás algo
  useGSAP(() => {
    if (cartCount === 0) return
    gsap.fromTo(countRef.current, { scale: 1.8, color: '#e0142e' }, { scale: 1, color: '#e8eaff', duration: 0.6, ease: 'back.out(3)' })
  }, [cartCount])

  return (
    <header className="nav" ref={root}>
      <button className="nav__logo" onClick={() => onNavigate(0)} aria-label="Volver al inicio">
        DC<sub>03</sub>
      </button>
      <nav className="nav__links">
        {LINKS.map((l, i) => (
          <button key={l.id} onClick={() => onNavigate(`#${l.id}`)}>
            <span className="mono">0{i + 1}</span>
            {l.label}
          </button>
        ))}
      </nav>
      <div className="nav__cart mono">
        ITEMS <b ref={countRef}>{String(cartCount).padStart(2, '0')}</b>
      </div>
    </header>
  )
}
