import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { AUTHOR } from '../config'
import './Boot.css'

// Pantalla de arranque: texto de BIOS, barra de carga y "PRESS START".
// El usuario tiene que apretar para entrar, como prender la consola.

const LINES = [
  'DARK CLOTHES BIOS v2.03  (C) 2026 DC ENTERTAINMENT',
  'EMOTION ENGINE ............ OK',
  'GRAPHICS SYNTHESIZER ...... OK',
  'MEMORY CARD (8MB) SLOT 1 .. DETECTED',
  'LOADING WARDROBE DATA ..... 08 ITEMS',
  'LOADING DROP 03 ........... SHADOW PROTOCOL',
  'CHECKING DISC ............. AUTHENTIC',
  `DEVELOPER ................. ${AUTHOR.name.toUpperCase()}`,
]

export default function Boot({ onDone }) {
  const root = useRef()
  const pctRef = useRef()
  const barRef = useRef()
  const leaving = useRef(false)
  const [ready, setReady] = useState(false)

  const { contextSafe } = useGSAP(
    () => {
      const counter = { v: 0 }
      gsap.set('.boot__start', { autoAlpha: 0 })

      gsap
        .timeline({ delay: 0.3 })
        .from('.boot__line', { autoAlpha: 0, duration: 0.01, stagger: 0.18 })
        .to(
          counter,
          {
            v: 100,
            duration: 1.8,
            ease: 'power2.inOut',
            onUpdate: () => {
              const v = Math.round(counter.v)
              pctRef.current.textContent = String(v).padStart(3, '0')
              barRef.current.style.transform = `scaleX(${v / 100})`
            },
          },
          0.2,
        )
        .to('.boot__start', { autoAlpha: 1, duration: 0.3 })
        .add(() => setReady(true))
    },
    { scope: root },
  )

  const start = contextSafe(() => {
    if (!ready || leaving.current) return
    leaving.current = true
    gsap
      .timeline({ onComplete: onDone })
      .to('.boot__flash', { autoAlpha: 1, duration: 0.06 })
      .set('.boot__body', { autoAlpha: 0 })
      .to('.boot__flash', { autoAlpha: 0, duration: 0.5, ease: 'power2.out' })
      .to(root.current, { autoAlpha: 0, duration: 0.4 }, '<0.1')
  })

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') start()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [start])

  return (
    <div className="boot" ref={root} onClick={start}>
      <div className="boot__body">
        <div className="boot__log mono">
          {LINES.map((l) => (
            <p className="boot__line" key={l}>
              {l}
            </p>
          ))}
        </div>

        <div className="boot__load">
          <div className="boot__bar">
            <span ref={barRef} />
          </div>
          <span className="mono">
            <span ref={pctRef}>000</span>%
          </span>
        </div>

        <button className="boot__start" type="button" onClick={start}>
          <span className="pad-btn">✕</span> Press start
        </button>
      </div>
      <div className="boot__flash" />
    </div>
  )
}
