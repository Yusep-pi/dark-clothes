import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Garment from './Garment'
import './Trophy.css'

// Notificación "You have earned a trophy" cada vez que sumás algo.

export default function Trophy({ trophy }) {
  const root = useRef()

  useGSAP(
    () => {
      if (!trophy) return
      gsap
        .timeline()
        .fromTo(root.current, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'expo.out' })
        .to(root.current, { autoAlpha: 0, x: 60, duration: 0.4, ease: 'power2.in' }, '+=2.6')
    },
    { dependencies: [trophy], revertOnUpdate: true },
  )

  return (
    <div className="trophy" ref={root} role="status" aria-live="polite">
      {trophy && (
        <>
          <div className="trophy__icon">
            <Garment type={trophy.type} />
          </div>
          <div>
            <p>You have earned a trophy.</p>
            <p className="trophy__name">
              <span className="trophy__cup">🏆</span> {trophy.title ?? 'Fashion Junkie'} · {trophy.name}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
