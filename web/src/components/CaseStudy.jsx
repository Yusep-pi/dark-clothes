import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { AUTHOR, CONTACT_URL } from '../config'
import './CaseStudy.css'

// Panel "Case study": explica el proyecto a quien visita el portfolio.
// Se abre con el botón SELECT de abajo a la izquierda (como en la PS2).

const PALETTE = [
  { name: 'Void', hex: '#05050F' },
  { name: 'Boot blue', hex: '#0B0B2A' },
  { name: 'Lavender', hex: '#8C8CFF' },
  { name: 'Ice', hex: '#E8EAFF' },
  { name: 'Chrome', hex: '#C9CED6' },
  { name: 'Signal red', hex: '#E0142E' },
  { name: 'Aero sky', hex: '#1F6BFF' },
]

const FONTS = [
  { name: 'Orbitron', use: 'Títulos y logo', family: 'var(--f-display)' },
  { name: 'Rajdhani', use: 'Interfaz y textos', family: 'var(--f-ui)' },
  { name: 'Share Tech Mono', use: 'Datos, BIOS y HUD', family: 'var(--f-mono)' },
]

const STACK = ['React 19', 'Vite', 'Three.js', 'React Three Fiber', 'GSAP', 'ScrollTrigger', 'SplitText', 'Lenis']

const HIGHLIGHTS = [
  ['Escena 3D en tiempo real', 'Torres de cubos de vidrio y esferas tornasoladas, renderizadas a baja resolución a propósito para imitar la PS2. La cámara avanza con el scroll.'],
  ['Secuencias fijadas al scroll', 'El drop y el lookbook se "pausan" en pantalla y cuentan una historia mientras scrolleás: entrada de rival, apertura del cielo, la caja del juego que gira.'],
  ['Cero imágenes', 'Las prendas están dibujadas en SVG y las nubes se generan con un filtro de ruido. Todo es código: pesa poco y se ve nítido en cualquier pantalla.'],
  ['UI de videojuego como sistema', 'Boot de BIOS, stats de personaje, trofeos, memory card y "Press ○ to go back": cada interacción de compra está traducida a un gesto de juego.'],
]

export default function CaseStudy({ open, onClose, lenis }) {
  const root = useRef()

  useGSAP(
    () => {
      if (open) {
        gsap.set(root.current, { autoAlpha: 1 })
        gsap.fromTo('.cs__panel', { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: 'expo.out' })
        gsap.fromTo('.cs__block', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.6, delay: 0.2, ease: 'expo.out' })
      } else {
        gsap.to('.cs__panel', { xPercent: 100, duration: 0.45, ease: 'power3.in' })
        gsap.to(root.current, { autoAlpha: 0, duration: 0.2, delay: 0.3 })
      }
    },
    { dependencies: [open], scope: root },
  )

  // mientras está abierto, la página de atrás no scrollea; Esc lo cierra
  useEffect(() => {
    if (!open) return
    lenis.current?.stop()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis.current?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, lenis])

  return (
    <div className="cs" ref={root} aria-hidden={!open}>
      <div className="cs__backdrop" onClick={onClose} />
      <aside className="cs__panel" role="dialog" aria-modal="true" aria-label="Case study" data-lenis-prevent>
        <header className="cs__head">
          <p className="eyebrow">Case study · Proyecto conceptual</p>
          <button className="cs__close mono" onClick={onClose}>
            <span className="pad-btn">○</span> Cerrar
          </button>
        </header>

        <h2 className="cs__title cs__block">Dark Clothes</h2>
        <p className="cs__lead cs__block">
          Web para una marca <strong>ficticia</strong> de streetwear oscuro. La idea: que comprar ropa se sienta como prender una
          PlayStation 2 en 2003.
        </p>

        <dl className="cs__meta cs__block">
          <div>
            <dt className="mono">Rol</dt>
            <dd>Concepto, dirección de arte, diseño UI y desarrollo front-end</dd>
          </div>
          <div>
            <dt className="mono">Autor</dt>
            <dd>{AUTHOR.name}</dd>
          </div>
          <div>
            <dt className="mono">Año</dt>
            <dd>2026</dd>
          </div>
        </dl>

        <section className="cs__block">
          <h3>Concepto</h3>
          <p>
            Dos mundos de la era PS2 combinados: el <em>arranque de la consola</em> (niebla azul, cubos, BIOS) y la{' '}
            <em>selección de personaje</em> de los juegos de pelea (cromo, rojo, stats). Encima, momentos de luz Y2K / Frutiger
            Aero: vidrio, cielo, brillo tipo gel. La base siempre oscura, porque la marca se llama Dark.
          </p>
        </section>

        <section className="cs__block">
          <h3>Paleta</h3>
          <ul className="cs__swatches">
            {PALETTE.map((c) => (
              <li key={c.hex}>
                <span style={{ background: c.hex }} />
                <b>{c.name}</b>
                <small className="mono">{c.hex}</small>
              </li>
            ))}
          </ul>
        </section>

        <section className="cs__block">
          <h3>Tipografía</h3>
          <ul className="cs__fonts">
            {FONTS.map((f) => (
              <li key={f.name}>
                <span style={{ fontFamily: f.family }}>{f.name}</span>
                <small className="mono">{f.use}</small>
              </li>
            ))}
          </ul>
        </section>

        <section className="cs__block">
          <h3>Lo más interesante</h3>
          <ol className="cs__highlights">
            {HIGHLIGHTS.map(([t, d], i) => (
              <li key={t}>
                <span className="mono">0{i + 1}</span>
                <div>
                  <b>{t}</b>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="cs__block">
          <h3>Stack</h3>
          <ul className="cs__stack mono">
            {STACK.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <footer className="cs__cta cs__block">
          <p>¿Querés una web así para tu marca?</p>
          <a className="btn" href={CONTACT_URL}>
            <span className="pad-btn">✕</span> Hablemos
          </a>
        </footer>
      </aside>
    </div>
  )
}
