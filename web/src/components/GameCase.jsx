import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Garment from './Garment'
import Sparkle from './Sparkle'
import { PRODUCTS } from '../data/products'
import './GameCase.css'

// Lookbook presentado como la caja de un juego en DVD.
// Al scrollear: la caja entra → sale el disco → vuelve → la caja gira
// y muestra la contratapa. Abajo, un subtítulo de cinemática.

// Un "personaje" armado con las prendas: hoodie + cargo + borcegos
function Figure({ className = '', style }) {
  return (
    <div className={`fig ${className}`} style={style} aria-hidden="true">
      <Garment type="cargo" className="fig__legs" />
      <Garment type="boots" className="fig__boot fig__boot--l" />
      <Garment type="boots" className="fig__boot fig__boot--r" />
      <Garment type="hoodie" className="fig__top" />
    </div>
  )
}

// Código de barras con anchos fijos (siempre el mismo dibujo)
const BARS = [3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 1, 2, 2, 1, 3, 1, 2, 1, 1, 3, 1, 2, 1, 2, 3, 1, 1]
function Barcode() {
  let x = 0
  return (
    <svg className="case__barcode" viewBox="0 0 80 40" aria-hidden="true">
      <rect width="80" height="40" fill="#fff" />
      {BARS.map((w, i) => {
        const bar = i % 2 === 0 && <rect key={i} x={4 + x} y="3" width={w} height="28" fill="#000" />
        x += w + 0.4
        return bar
      })}
      <text x="40" y="38" textAnchor="middle" fontSize="6" fontFamily="monospace">
        7 290003 140312
      </text>
    </svg>
  )
}

function Rating() {
  return (
    <div className="case__rating">
      <b>D</b>
      <span>DARK</span>
      <small>Content rated by DC</small>
    </div>
  )
}

const FEATURES = [
  '8 personajes jugables, cada uno con sus stats',
  'Modo historia: la ciudad de noche',
  'Multijugador local: tu crew',
  'Compatible con Memory Card (8MB)',
]

export default function GameCase() {
  const root = useRef()

  useGSAP(
    () => {
      gsap.set('.case__box', { rotateY: -22, rotateX: 6 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=240%',
          pin: '.case__pin',
          scrub: 0.8,
        },
      })

      tl.from('.case__box', { y: 200, rotateX: 50, rotateY: -60, scale: 0.6, autoAlpha: 0, duration: 1, ease: 'power3.out' })
        .from('.case__copy > *', { y: 40, autoAlpha: 0, stagger: 0.08, duration: 0.6 }, '<0.2')
        // sale el disco por el costado, girando
        .to('.case__disc', { xPercent: 62, duration: 0.9, ease: 'power2.inOut' })
        .to('.case__disc-face', { rotate: 540, duration: 1.6, ease: 'none' }, '<')
        .to('.case__disc', { xPercent: 0, duration: 0.7, ease: 'power2.inOut' }, '>-0.3')
        // gira y muestra la contratapa
        .to('.case__box', { rotateY: 180, rotateX: 4, duration: 1.4, ease: 'power2.inOut' })
        .fromTo(
          '.case__subtitle',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6, scrambleText: { text: 'Who are you today?', chars: 'lowerCase', speed: 0.5 } },
          '-=0.4',
        )
        .to({}, { duration: 0.5 })

      // flotación suave de la caja
      gsap.to('.case__float', { y: -14, rotateZ: 1.2, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    },
    { scope: root },
  )

  return (
    <section className="case" id="lookbook" ref={root}>
      <div className="case__pin">
        <div className="case__copy">
          <p className="eyebrow">Lookbook · Edición coleccionista</p>
          <h2 className="case__title">
            Insert <em>disc</em>
          </h2>
          <p className="case__lead">
            Cada drop sale como un juego. Tapa, contratapa, disco y manual. Este es el número 03.
          </p>
          <ul className="case__list mono">
            {FEATURES.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="case__scene">
          <div className="case__float">
            <div className="case__box">
              {/* disco tornasolado, guardado entre tapa y contratapa */}
              <div className="case__disc">
                <div className="case__disc-face">
                  <span>DC · SHADOW PROTOCOL · DISC 1 ·</span>
                </div>
              </div>

              {/* ---- tapa ---- */}
              <div className="case__face case__front">
                <div className="case__art">
                  <Figure className="fig--main" />
                  <Figure className="fig--mini" style={{ top: '13%', left: '6%', rotate: '-16deg' }} />
                  <Figure className="fig--mini" style={{ top: '30%', right: '5%', rotate: '14deg' }} />
                  <Sparkle size={22} style={{ top: '22%', right: '24%' }} />
                  <Sparkle size={14} delay={1} style={{ top: '48%', left: '18%' }} />
                </div>
                <div className="case__top">
                  <span className="case__brand">DARKCLOTHES</span>
                  <span className="case__dvd">
                    DVD<small>ROM</small>
                  </span>
                </div>
                <h3 className="case__game">
                  Shadow
                  <br />
                  Protocol
                </h3>
                <div className="case__bottom">
                  <Barcode />
                  <div className="case__badges">
                    <div className="case__platform">
                      <b>DC</b>
                      <span>DROP-ROM</span>
                      <small>Wearable</small>
                    </div>
                    <Rating />
                  </div>
                </div>
              </div>

              {/* ---- contratapa ---- */}
              <div className="case__face case__back">
                <p className="case__back-title">Elegí tu personaje. Guardá la partida.</p>
                <div className="case__shots">
                  {PRODUCTS.slice(0, 6).map((p) => (
                    <div className="case__shot" key={p.id}>
                      <Garment type={p.type} />
                    </div>
                  ))}
                </div>
                <ul className="case__back-list">
                  {FEATURES.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="case__bottom">
                  <Rating />
                  <p className="case__legal">
                    © 2026 Dark Clothes. Marca ficticia. Prohibido el alquiler, la copia y la luz del día.
                  </p>
                  <Barcode />
                </div>
              </div>

              <div className="case__spine">
                <span>DARK CLOTHES · SHADOW PROTOCOL</span>
                <b>03</b>
              </div>
            </div>
          </div>
        </div>

        <p className="case__subtitle" aria-live="off">
          Who are you today?
        </p>
      </div>
    </section>
  )
}
