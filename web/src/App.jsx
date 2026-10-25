import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'

import Boot from './components/Boot'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Drop from './components/Drop'
import GameCase from './components/GameCase'
import Roster from './components/Roster'
import Manifesto from './components/Manifesto'
import Footer from './components/Footer'
import Trophy from './components/Trophy'
import Continue from './components/Continue'
import CaseStudy from './components/CaseStudy'

// el 3D (Three.js) se descarga aparte, mientras se ve la pantalla de boot
const Scene = lazy(() => import('./components/Scene'))

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP)

// arrancar siempre desde arriba (si no, el navegador recuerda el scroll)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

export default function App() {
  const [booted, setBooted] = useState(false)
  const [cart, setCart] = useState([])
  const [trophy, setTrophy] = useState(null)
  const [caseOpen, setCaseOpen] = useState(false)
  const closeCase = useCallback(() => setCaseOpen(false), [])
  const lenis = useRef(null)

  // Lenis = scroll suave. Lo conectamos al reloj de GSAP para que
  // ScrollTrigger y Lenis vayan sincronizados.
  useEffect(() => {
    window.scrollTo(0, 0)
    const l = new Lenis({ lerp: 0.085 })
    lenis.current = l
    l.on('scroll', ScrollTrigger.update)
    const tick = (time) => l.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      l.destroy()
    }
  }, [])

  // mientras está la pantalla de boot, el scroll queda bloqueado
  useEffect(() => {
    const l = lenis.current
    if (booted) l?.start()
    else l?.stop()
    document.documentElement.classList.toggle('is-locked', !booted)
    if (booted) ScrollTrigger.refresh()
  }, [booted])

  const scrollTo = (target) => lenis.current?.scrollTo(target, { duration: 1.6 })

  const addToCart = (product) => {
    setCart((c) => [...c, product.id])
    setTrophy({ ...product, key: Date.now() })
  }

  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <div className="vignette" />
      <div className="crt" />

      {!booted && <Boot onDone={() => setBooted(true)} />}
      <Nav visible={booted} cartCount={cart.length} onNavigate={scrollTo} />
      <Trophy trophy={trophy} />
      <CaseStudy open={caseOpen} onClose={closeCase} lenis={lenis} />
      {booted && (
        <button className="cs-trigger" onClick={() => setCaseOpen(true)}>
          <span className="cs-trigger__select">SELECT</span> Case study
        </button>
      )}

      <main>
        <Hero play={booted} />
        <Drop onAdd={addToCart} />
        <GameCase />
        <Roster onAdd={addToCart} />
        <Manifesto />
        <Footer onTrophy={(t) => setTrophy({ ...t, key: Date.now() })} onTop={() => scrollTo(0)} />
        <Continue onCaseStudy={() => setCaseOpen(true)} />
      </main>
    </>
  )
}
