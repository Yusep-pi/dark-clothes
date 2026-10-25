import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { AUTHOR } from '../config'
import './Footer.css'

// Footer como pantalla de "guardar partida": newsletter en la memory card,
// slots con los drops anteriores y el logo gigante.

const SLOTS = [
  { n: '01', name: 'Drop 01 · Ghost Signal', status: 'Completado' },
  { n: '02', name: 'Drop 02 · Black Ice', status: 'Completado' },
  { n: '03', name: 'Drop 03 · Shadow Protocol', status: 'En progreso', live: true },
]

const COLS = [
  { title: 'Tienda', links: ['Drop 03', 'Roster', 'Accesorios', 'Archivo'] },
  { title: 'Info', links: ['Envíos', 'Cambios', 'Guía de talles', 'Contacto'] },
  { title: 'Social', links: ['Instagram', 'TikTok', 'Pinterest', 'Discord'] },
]

export default function Footer({ onTrophy, onTop }) {
  const root = useRef()
  const [saved, setSaved] = useState(false)

  useGSAP(
    () => {
      gsap.from('.footer__giant span', {
        yPercent: 100,
        stagger: 0.04,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.footer__giant', start: 'top 95%' },
      })
      gsap.from('.footer__slot', {
        x: -40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.footer__slots', start: 'top 85%' },
      })
    },
    { scope: root },
  )

  const onSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    onTrophy({ title: 'Save Point', name: 'Partida guardada', type: 'chain' })
  }

  return (
    <footer className="footer" id="save" ref={root}>
      <div className="footer__top">
        <div className="footer__save">
          <p className="eyebrow">Memory Card (8MB) · Slot 1</p>
          <h2 className="footer__title">¿Guardar partida?</h2>
          <p className="footer__copy">Dejá tu mail y desbloqueá cada drop 24 horas antes que el resto.</p>

          {saved ? (
            <p className="footer__ok mono">✓ PARTIDA GUARDADA. NO APAGUES LA CONSOLA.</p>
          ) : (
            <form className="footer__form" onSubmit={onSubmit}>
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input id="email" type="email" required placeholder="tu@mail.com" />
              <button className="btn" type="submit">
                <span className="pad-btn">✕</span> Save
              </button>
            </form>
          )}
        </div>

        <ul className="footer__slots">
          {SLOTS.map((s) => (
            <li className={`footer__slot frame ${s.live ? 'is-live' : ''}`} key={s.n}>
              <span className="footer__slot-n">{s.n}</span>
              <span className="footer__slot-name">{s.name}</span>
              <span className="mono">{s.status}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer__cols">
        {COLS.map((c) => (
          <div key={c.title}>
            <p className="eyebrow">{c.title}</p>
            <ul>
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__giant" aria-hidden="true">
        {'DARKCLOTHES'.split('').map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </div>

      <div className="footer__bar mono">
        <span>
          © 2026 Dark Clothes · Marca ficticia · Concepto, diseño y desarrollo: <b className="footer__author">{AUTHOR.name}</b>
        </span>
        <button onClick={onTop}>
          Press <span className="pad-btn footer__circle">○</span> to go back
        </button>
      </div>
    </footer>
  )
}
