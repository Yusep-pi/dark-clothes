# Dark Clothes — Drop 03: Shadow Protocol

Web conceptual para una marca **ficticia** de streetwear oscuro que se juega como una PlayStation 2.

**Concepto:** el arranque de la PS2 (niebla azul, cubos, BIOS) × la selección de personaje de los juegos de pelea (cromo, rojo, stats), con momentos de luz Y2K / Frutiger Aero.

## Qué tiene
- Pantalla de arranque tipo BIOS con *Press Start*
- Escena 3D en tiempo real (Three.js) que avanza con el scroll
- Drop presentado como la entrada de un *New Challenger*, que se abre a un cielo con la prenda colgada
- Lookbook en formato caja de juego DVD que gira en 3D
- Grilla de productos como *character select*, con stats y trofeos
- Manifiesto que se enciende palabra por palabra
- Prendas en SVG y nubes generadas por código: cero imágenes

## Stack
React 19 · Vite · Three.js + React Three Fiber · GSAP (ScrollTrigger, SplitText, ScrambleText) · Lenis

## Correrlo localmente
```bash
cd web
npm install
npm run dev
```

Tus datos (nombre, mail, links) se editan en `web/src/config.js`.
