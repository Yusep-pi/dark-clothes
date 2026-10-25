import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Garment from './Garment'
import Stats from './Stats'
import Clouds from './Clouds'
import Sparkle from './Sparkle'
import { FEATURED, formatPrice } from '../data/products'
import './Drop.css'

// Drop destacado: la sección se "fija" en pantalla y, mientras scrolleás,
// pasa como la entrada de un nuevo rival en un juego de pelea:
// franjas rojas → "NEW CHALLENGER" → se abre el cielo → la prenda
// aparece colgada de una barra cromada, con haces de luz detrás.

const pad = (n) => String(n).padStart(2, '0')

function useCountdown(target) {
  const [left, setLeft] = useState(() => new Date(target) - Date.now())
  useEffect(() => {
    const id = setInterval(() => setLeft(new Date(target) - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  const s = Math.max(0, Math.floor(left / 1000))
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60].map(pad)
}

// Gancho de percha con resorte
function Hook() {
  return (
    <svg className="drop__hook" viewBox="0 0 30 90" aria-hidden="true">
      <path d="M15 4 C27 4 27 20 15 20 L15 70" fill="none" stroke="url(#hookChrome)" strokeWidth="3" strokeLinecap="round" />
      <path d="M9 44 h12 M9 48 h12 M9 52 h12 M9 56 h12 M9 60 h12" stroke="url(#hookChrome)" strokeWidth="2.4" />
      <path d="M15 70 C15 84 4 86 4 76" fill="none" stroke="url(#hookChrome)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

const HANGING = [
  { type: 'boots', className: 'drop__hang--side' },
  { type: FEATURED.type, className: 'drop__hang--main' },
  { type: 'chain', className: 'drop__hang--side' },
]

export default function Drop({ onAdd }) {
  const root = useRef()
  const [d, h, m, s] = useCountdown(FEATURED.release)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=260%',
          pin: '.drop__pin',
          scrub: 0.6,
        },
      })

      tl.from('.drop__stripe--a', { xPercent: -110, ease: 'power3.out', duration: 1 })
        .from('.drop__stripe--b', { xPercent: 110, ease: 'power3.out', duration: 1 }, '<')
        .from('.drop__challenger span', { scale: 3, autoAlpha: 0, ease: 'expo.out', duration: 1, stagger: 0.15 }, '-=0.5')
        .to('.drop__flash', { autoAlpha: 0.9, duration: 0.08 })
        .to('.drop__flash', { autoAlpha: 0, duration: 0.4 })
        .to('.drop__challenger', { yPercent: -60, autoAlpha: 0, duration: 0.8, ease: 'power2.in' }, '+=0.3')
        // de la oscuridad al cielo: se abre un círculo desde el centro
        .fromTo(
          '.drop__sky',
          { clipPath: 'circle(0% at 50% 50%)' },
          { clipPath: 'circle(75% at 50% 50%)', duration: 1.2, ease: 'power2.inOut' },
          '<0.2',
        )
        .to('.drop__stripes', { autoAlpha: 0, duration: 0.4 }, '<0.6')
        .from('.drop__beams span', { scaleY: 0, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: 'expo.out' }, '-=0.4')
        .from('.drop__rack', { yPercent: -140, duration: 1, ease: 'back.out(1.4)' }, '<')
        .from('.drop__hang', { rotate: (i) => [-24, 14, 24][i], duration: 1.2, ease: 'elastic.out(1, 0.35)' }, '-=0.5')
        .from('.drop__info', { x: 80, autoAlpha: 0, duration: 0.8, ease: 'expo.out' }, '<')
        .from('.drop__info > *', { y: 24, autoAlpha: 0, stagger: 0.06, duration: 0.5 }, '<0.1')
        .to({}, { duration: 0.6 }) // pausa antes de soltar el pin

      // las nubes avanzan lento todo el tiempo
      gsap.to('.drop__clouds-track', { xPercent: -50, duration: 90, ease: 'none', repeat: -1 })
    },
    { scope: root },
  )

  const marquee = 'HERE COMES A NEW CHALLENGER · '.repeat(6)

  return (
    <section className="drop" id="drop" ref={root}>
      <div className="drop__pin">
        <div className="drop__sky" aria-hidden="true">
          <div className="drop__clouds-track">
            <Clouds seed={4} />
            <Clouds seed={4} />
          </div>
          <div className="drop__beams">
            <span />
            <span />
            <span />
          </div>
          <Sparkle size={34} style={{ top: '18%', left: '12%' }} />
          <Sparkle size={18} delay={0.8} style={{ top: '32%', left: '22%' }} />
          <Sparkle size={26} delay={1.4} style={{ top: '14%', right: '18%' }} />
          <Sparkle size={14} delay={0.4} style={{ bottom: '22%', right: '8%' }} />
        </div>

        <div className="drop__stripes" aria-hidden="true">
          <div className="drop__stripe drop__stripe--a">
            <span>{marquee}</span>
          </div>
          <div className="drop__stripe drop__stripe--b">
            <span>{marquee}</span>
          </div>
        </div>

        <h2 className="drop__challenger">
          <span>New</span>
          <span>Challenger</span>
        </h2>

        <div className="drop__card">
          <div className="drop__stage">
            <svg width="0" height="0" aria-hidden="true">
              <linearGradient id="hookChrome" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.5" stopColor="#7d8296" />
                <stop offset="1" stopColor="#e9ecf4" />
              </linearGradient>
            </svg>
            <div className="drop__rack">
              <div className="drop__bar" />
              <div className="drop__items">
                {HANGING.map((item, i) => (
                  <div className={`drop__hang ${item.className}`} key={i}>
                    <div className="drop__swing">
                      <Hook />
                      <Garment type={item.type} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="drop__info">
            <p className="eyebrow">{FEATURED.code} · Featured</p>
            <h3 className="drop__name">{FEATURED.name}</h3>
            <p className="drop__item mono">
              {FEATURED.item} — {formatPrice(FEATURED.price)}
            </p>
            <p className="drop__desc">{FEATURED.desc}</p>
            <Stats stats={FEATURED.stats} />

            <div className="drop__crt">
              <p className="mono">UNLOCKS IN</p>
              <div className="drop__digits" aria-label={`${d} días ${h} horas ${m} minutos`}>
                <span>{d}</span>:<span>{h}</span>:<span>{m}</span>:<span>{s}</span>
              </div>
              <p className="drop__units mono">
                <span>DÍA</span>
                <span>HRS</span>
                <span>MIN</span>
                <span>SEG</span>
              </p>
            </div>

            <button className="btn" onClick={() => onAdd({ id: 'shadow', name: FEATURED.item, type: FEATURED.type })}>
              <span className="pad-btn">✕</span> Pre-order
            </button>
          </div>
        </div>

        <div className="drop__flash" />
      </div>
    </section>
  )
}
