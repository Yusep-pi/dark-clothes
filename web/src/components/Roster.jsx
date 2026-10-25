import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Garment from './Garment'
import Stats from './Stats'
import { PRODUCTS, formatPrice } from '../data/products'
import './Roster.css'

// Grilla de productos como pantalla de selección de personaje:
// pasás el mouse por una prenda y se "elige" en el panel grande.

function Card({ product, active, onHover, onAdd }) {
  const ref = useRef()

  // inclinación 3D siguiendo al mouse
  const { contextSafe } = useGSAP({ scope: ref })
  const onMove = contextSafe((e) => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(ref.current, { rotateY: x * 14, rotateX: -y * 14, duration: 0.4, ease: 'power2.out' })
  })
  const onLeave = contextSafe(() => {
    gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
  })

  return (
    <article
      ref={ref}
      className={`card ${active ? 'is-active' : ''}`}
      onMouseEnter={onHover}
      onFocus={onHover}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <button className="card__hit" onClick={() => onAdd(product)} aria-label={`Agregar ${product.name}`} />
      <span className="card__p1">P1</span>
      <span className="card__code mono">{product.code}</span>
      <div className="card__art">
        <Garment type={product.type} />
      </div>
      <div className="card__meta">
        <h3>{product.name}</h3>
        <p className="mono">{formatPrice(product.price)}</p>
      </div>
      <div className="card__stats">
        <Stats stats={product.stats} compact />
      </div>
      <span className="card__scan" />
    </article>
  )
}

export default function Roster({ onAdd }) {
  const root = useRef()
  const [activeId, setActiveId] = useState(PRODUCTS[0].id)
  const active = PRODUCTS.find((p) => p.id === activeId)

  useGSAP(
    () => {
      gsap.from('.roster__head > *', {
        y: 60,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.roster__head', start: 'top 80%' },
      })
      gsap.fromTo(
        '.card',
        { y: 80, autoAlpha: 0, clipPath: 'inset(100% 0% 0% 0%)' },
        {
          y: 0,
          autoAlpha: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          clearProps: 'clipPath',
          stagger: { each: 0.07, grid: 'auto', from: 'start' },
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.roster__grid', start: 'top 80%' },
        },
      )
      gsap.from('.roster__preview', {
        x: -60,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.roster__grid', start: 'top 80%' },
      })
    },
    { scope: root },
  )

  // cada vez que cambia el personaje: corte rápido con destello
  useGSAP(
    () => {
      gsap
        .timeline()
        .fromTo('.roster__cut', { autoAlpha: 0.7 }, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' })
        .fromTo('.roster__big .garment', { x: -60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' }, 0)
        .fromTo(
          '.roster__name',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6, scrambleText: { text: active.name, chars: 'upperCase', speed: 1 } },
          0,
        )
    },
    { dependencies: [activeId], scope: root },
  )

  return (
    <section className="roster" id="roster" ref={root}>
      <header className="roster__head">
        <p className="eyebrow">Drop 03 · 08 personajes</p>
        <h2 className="roster__title">
          Select your <em>fit</em>
        </h2>
        <p className="roster__timer mono">
          TIME <b>99</b>
        </p>
      </header>

      <div className="roster__layout">
        <aside className="roster__preview frame">
          <span className="roster__cut" />
          <div className="roster__top mono">
            <span className="roster__p1">P1</span>
            <span>{active.code}</span>
            <span>CLASS · {active.cls.toUpperCase()}</span>
          </div>
          <div className="roster__big">
            <Garment type={active.type} />
          </div>
          <h3 className="roster__name">{active.name}</h3>
          <p className="roster__desc">{active.desc}</p>
          <Stats stats={active.stats} />
          <div className="roster__buy">
            <span className="roster__price">{formatPrice(active.price)}</span>
            <button className="btn" onClick={() => onAdd(active)}>
              <span className="pad-btn">✕</span> Equipar
            </button>
          </div>
        </aside>

        <div className="roster__grid">
          {PRODUCTS.map((p) => (
            <Card
              key={p.id}
              product={p}
              active={p.id === activeId}
              onHover={() => setActiveId(p.id)}
              onAdd={onAdd}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
