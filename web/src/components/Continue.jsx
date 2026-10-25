import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { AUTHOR, CONTACT_URL } from '../config'
import './Continue.css'

// Pantalla final para clientes: "GAME OVER? / CONTINUE" con la cuenta
// regresiva de los arcades. Es la llamada a la acción del portfolio.

export default function Continue({ onCaseStudy }) {
  const root = useRef()
  const [count, setCount] = useState(9)
  const [active, setActive] = useState(false)

  // la cuenta solo corre cuando la sección está en pantalla
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setCount((c) => (c === 0 ? 9 : c - 1)), 1000)
    return () => clearInterval(id)
  }, [active])

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 70%',
        end: 'bottom top',
        onToggle: (self) => setActive(self.isActive),
      })
      gsap.from('.continue__inner > *', {
        y: 50,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
    },
    { scope: root },
  )

  // pequeño "golpe" en cada número
  useGSAP(() => {
    gsap.fromTo('.continue__count', { scale: 1.25 }, { scale: 1, duration: 0.5, ease: 'expo.out' })
  }, { dependencies: [count], scope: root })

  const links = [
    ['Portfolio', AUTHOR.portfolio],
    ['GitHub', AUTHOR.github],
    ['Instagram', AUTHOR.instagram],
    ['LinkedIn', AUTHOR.linkedin],
  ].filter(([, url]) => url)

  return (
    <section className="continue" id="continue" ref={root}>
      <div className="continue__inner">
        <p className="eyebrow">Fin de la demo · Player 2 press start</p>
        <h2 className="continue__title">Continue?</h2>
        <div className="continue__count" aria-hidden="true">
          {count}
        </div>
        <p className="continue__copy">
          ¿Querés una web así para tu marca? Diseño y desarrollo experiencias que la gente no cierra a los tres segundos.
        </p>
        <div className="continue__actions">
          <a className="btn continue__yes" href={CONTACT_URL}>
            <span className="pad-btn">✕</span> Continue · Hablemos
          </a>
          <button className="btn continue__case" onClick={onCaseStudy}>
            <span className="pad-btn">□</span> Ver case study
          </button>
        </div>
        <p className="continue__sig mono">
          {AUTHOR.name} — {AUTHOR.role}
          {links.map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noreferrer">
              {label} ↗
            </a>
          ))}
        </p>
      </div>
    </section>
  )
}
