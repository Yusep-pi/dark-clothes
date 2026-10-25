import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Sparkle from './Sparkle'
import './Hero.css'

// Hero: composición inspirada en la pantalla de PS2 (marco con el
// control, logo con subrayado y cajitas "EE / GS" abajo).
// La animación de entrada arranca cuando se cierra la pantalla de boot.

const WORD_A = 'Dark'
const WORD_B = 'Clothes'

const split = (word) =>
  word.split('').map((ch, i) => (
    <span className="hero__char" key={i}>
      {ch}
    </span>
  ))

function PadIcons() {
  return (
    <svg className="hero__pad hero__reveal" viewBox="0 0 132 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M14 4 h8 v10 h10 v8 h-10 v10 h-8 v-10 h-10 v-8 h10 z" />
        <rect x="60" y="13" width="12" height="12" />
        <path d="M92 7 l7 12 h-14 z" />
        <circle cx="92" cy="30" r="6" />
        <path d="M110 14 l12 12 M122 14 l-12 12" />
      </g>
    </svg>
  )
}

export default function Hero({ play }) {
  const root = useRef()

  useGSAP(
    () => {
      const chars = gsap.utils.toArray('.hero__char')

      if (!play) {
        gsap.set([chars, '.hero__reveal'], { autoAlpha: 0 })
        gsap.set('.hero__line', { scaleX: 0 })
        return
      }

      const tl = gsap.timeline({ delay: 0.15 })
      tl.to('.hero__line', { scaleX: 1, duration: 1.1, ease: 'expo.inOut', stagger: 0.1 })
        .fromTo(
          chars,
          { autoAlpha: 0, yPercent: 110, rotateX: -95, z: -200, filter: 'blur(12px)' },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            z: 0,
            filter: 'blur(0px)',
            clearProps: 'filter',
            duration: 1.1,
            ease: 'expo.out',
            stagger: { each: 0.045, from: 'center' },
          },
          0.2,
        )
        // golpe de "glitch" cromático cuando termina de formarse
        .add(() => root.current.classList.add('is-glitch'), 1.05)
        .to('.hero__title', { x: 6, duration: 0.04, repeat: 5, yoyo: true, ease: 'none' }, 1.05)
        .add(() => root.current.classList.remove('is-glitch'), 1.35)
        .fromTo(
          '.hero__reveal',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08 },
          1.1,
        )
        .to(
          '.hero__code',
          { duration: 1.2, scrambleText: { text: 'DCPH-00003 · SHADOW PROTOCOL', chars: '01X#/█▓░', speed: 0.6 } },
          1.2,
        )

      // al scrollear, el hero se aleja hacia el fondo
      gsap.to('.hero__inner', {
        yPercent: -18,
        scale: 0.92,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { dependencies: [play], scope: root, revertOnUpdate: true },
  )

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__inner">
        <div className="hero__panel">
          <span className="hero__mark hero__reveal">DC</span>
          <PadIcons />
          <span className="hero__line hero__line--top" />
        </div>

        <div className="hero__logo">
          <h1 className="hero__title" aria-label="Dark Clothes">
            <span className="hero__word hero__word--a">{split(WORD_A)}</span>
            <span className="hero__word hero__word--b">{split(WORD_B)}</span>
          </h1>
          <p className="hero__code mono">DCPH-XXXXX</p>
          <div className="hero__sparkles hero__reveal">
            <Sparkle size={30} style={{ top: '-8%', left: '-6%' }} />
            <Sparkle size={16} delay={0.9} style={{ top: '30%', left: '-12%' }} />
            <Sparkle size={22} delay={1.7} style={{ bottom: '18%', right: '-3%' }} />
          </div>
          <span className="hero__line hero__line--logo">
            <i />
          </span>
        </div>

        <div className="hero__bottom">
          <div className="hero__chips hero__reveal">
            <div className="hero__chip">
              <b>DC</b>
              <small>DarkClothes</small>
            </div>
            <div className="hero__chip">
              <b>03</b>
              <small>ShadowProtocol</small>
            </div>
          </div>
          <span className="hero__line hero__line--bottom">
            <i />
          </span>
          <p className="hero__start hero__reveal">
            Scroll para empezar <span className="pad-btn">↓</span>
          </p>
        </div>
      </div>
    </section>
  )
}
