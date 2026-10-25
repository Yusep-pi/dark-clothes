import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import './Manifesto.css'

// Manifiesto: el texto se "enciende" palabra por palabra mientras
// scrolleás, como un diálogo que se va cargando en pantalla.

const TEXT =
  'No hacemos ropa para que te vean. Hacemos ropa para que no te encuentren. Cada prenda es una armadura para la ciudad de noche: pesada, negra, sin logos que griten. Elegí tu personaje. Guardá la partida. La calle es el último nivel.'

// palabras que se marcan en rojo cuando se encienden
const HOT = ['encuentren.', 'armadura', 'personaje.', 'último', 'nivel.']

export default function Manifesto() {
  const root = useRef()

  useGSAP(
    () => {
      const split = SplitText.create('.manifesto__text', { type: 'words', wordsClass: 'word' })
      split.words.forEach((w) => {
        if (HOT.includes(w.textContent.trim())) w.classList.add('is-hot')
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=180%',
          pin: '.manifesto__pin',
          scrub: 0.5,
        },
      })

      tl.from('.manifesto__hud', { autoAlpha: 0, y: -20, duration: 0.5 })
        .to(split.words, { opacity: 1, stagger: 0.12, duration: 0.3, ease: 'none' }, 0)
        .to('.manifesto__progress span', { scaleX: 1, duration: tl.duration(), ease: 'none' }, 0)
        .from('.manifesto__sig', { autoAlpha: 0, y: 20, duration: 0.6 })
    },
    { scope: root },
  )

  return (
    <section className="manifesto" id="manifesto" ref={root}>
      <div className="manifesto__pin">
        <div className="manifesto__hud mono">
          <span>MEMORY CARD (8MB) · SLOT 1</span>
          <span className="manifesto__rec">● REC 03:14</span>
        </div>

        <p className="manifesto__text">{TEXT}</p>

        <div className="manifesto__foot">
          <p className="manifesto__sig">
            <span className="manifesto__imagine">Imaginalo.</span>
            <span className="mono">— DARK CLOTHES · MANIFIESTO 03/03</span>
          </p>
          <div className="manifesto__progress">
            <span />
          </div>
        </div>
      </div>
    </section>
  )
}
