import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

// Escena 3D de fondo: torres de cubos de vidrio flotando en niebla azul,
// igual que la pantalla de arranque de la PS2, más esferas de vidrio
// colgando (estética Frutiger Aero / "el futuro visto desde 2003").
// La cámara avanza por el pasillo a medida que scrolleás la página.

const TOP_COLOR = new THREE.Color('#0b0b2a')
const BOTTOM_COLOR = new THREE.Color('#04040c')
const ORB_COLORS = ['#ff2a4a', '#3dff8a', '#4a6bff', '#ff4ad8', '#ffffff']

// Número pseudoaleatorio estable: la escena queda igual en cada recarga
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function Towers() {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const cubes = useMemo(() => {
    const rand = seeded(7)
    const list = []
    for (let x = -11; x <= 11; x++) {
      for (let z = -40; z <= 4; z++) {
        if (Math.abs(x) < 2) continue // pasillo libre para la cámara
        if (rand() > 0.2) continue
        const height = 1 + Math.floor(rand() * 7)
        const base = -7 + rand() * 3
        const phase = rand() * Math.PI * 2
        const speed = 0.2 + rand() * 0.5
        for (let i = 0; i < height; i++) {
          list.push({ x: x * 1.04, y: base + i * 1.04, z: z * 1.04, phase, speed })
        }
      }
    }
    return list
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    cubes.forEach((c, i) => {
      // cada columna sube y baja despacio, como respirando
      dummy.position.set(c.x, c.y + Math.sin(t * c.speed + c.phase) * 0.6, c.z)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, cubes.length]}>
      <boxGeometry args={[0.96, 0.96, 0.96]} />
      {/* vidrio esmerilado, como una pared de bloques de vidrio */}
      <meshPhysicalMaterial
        color="#9a9aff"
        emissive="#1c1c6e"
        emissiveIntensity={0.55}
        roughness={0.3}
        clearcoat={1}
        clearcoatRoughness={0.12}
        transparent
        opacity={0.92}
      />
    </instancedMesh>
  )
}

function DarkCubes() {
  const group = useRef()
  const cubes = useMemo(() => {
    const rand = seeded(42)
    return Array.from({ length: 9 }, (_, i) => ({
      pos: [(rand() - 0.5) * 7, (rand() - 0.5) * 4, 2 - i * 4.2],
      rot: [rand() * 3, rand() * 3, 0],
      size: 0.6 + rand() * 0.7,
      spin: 0.1 + rand() * 0.3,
    }))
  }, [])

  useFrame((_, dt) => {
    group.current.children.forEach((m, i) => {
      m.rotation.x += dt * cubes[i].spin
      m.rotation.y += dt * cubes[i].spin * 0.7
    })
  })

  return (
    <group ref={group}>
      {cubes.map((c, i) => (
        <mesh key={i} position={c.pos} rotation={c.rot}>
          <boxGeometry args={[c.size, c.size, c.size]} />
          <meshStandardMaterial color="#07070f" roughness={0.25} metalness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// Textura de halo radial para que las luces "brillen" sin post-proceso
function useGlowTexture() {
  return useMemo(() => {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.25, 'rgba(255,255,255,0.45)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    return new THREE.CanvasTexture(canvas)
  }, [])
}

function Orbs() {
  const group = useRef()
  const glow = useGlowTexture()
  const orbs = useMemo(() => {
    const rand = seeded(99)
    return Array.from({ length: 14 }, (_, i) => ({
      pos: [(rand() - 0.5) * 9, (rand() - 0.5) * 5, 3 - rand() * 40],
      color: ORB_COLORS[i % ORB_COLORS.length],
      phase: rand() * 10,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    group.current.children.forEach((s, i) => {
      const o = orbs[i]
      s.position.y = o.pos[1] + Math.sin(t * 0.6 + o.phase) * 0.4
      s.material.opacity = 0.65 + Math.sin(t * 2 + o.phase) * 0.35
    })
  })

  return (
    <group ref={group}>
      {orbs.map((o, i) => (
        <sprite key={i} position={o.pos} scale={0.55}>
          <spriteMaterial
            map={glow}
            color={o.color}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      ))}
    </group>
  )
}

// Esferas de vidrio colgando de un cable, con reflejo tornasolado
const GLASS_ORBS = [
  { x: -2.6, z: 1.5, len: 4.2, r: 0.7 },
  { x: 3.1, z: -3, len: 5.6, r: 1.05 },
  { x: -2.2, z: -9, len: 6.4, r: 0.45 },
  { x: 2.4, z: -13, len: 4.4, r: 0.8 },
  { x: -3.2, z: -18, len: 5, r: 1.2 },
  { x: 2.2, z: -24, len: 6.8, r: 0.55 },
  { x: -2.4, z: -29, len: 5.2, r: 0.9 },
]
const CEILING = 6

function GlassOrbs() {
  const group = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    group.current.children.forEach((g, i) => {
      // se balancean como un péndulo desde el techo
      g.rotation.z = Math.sin(t * 0.5 + i * 1.7) * 0.06
      g.rotation.x = Math.cos(t * 0.4 + i) * 0.04
    })
  })

  return (
    <group ref={group}>
      {GLASS_ORBS.map((o, i) => (
        <group key={i} position={[o.x, CEILING, o.z]}>
          <mesh position={[0, -o.len / 2, 0]}>
            <cylinderGeometry args={[0.012, 0.012, o.len, 4]} />
            <meshStandardMaterial color="#c9ced6" metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[0, -o.len - 0.04, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 0.12, 12]} />
            <meshStandardMaterial color="#c9ced6" metalness={1} roughness={0.15} />
          </mesh>
          <mesh position={[0, -o.len - o.r - 0.08, 0]}>
            <sphereGeometry args={[o.r, 48, 48]} />
            <meshPhysicalMaterial
              color="#cfe0ff"
              emissive="#2a4cff"
              emissiveIntensity={0.25}
              roughness={0.03}
              metalness={0.1}
              iridescence={1}
              iridescenceIOR={1.6}
              clearcoat={1}
              envMapIntensity={3.5}
              transparent
              opacity={0.55}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Luces "de estudio" que solo ven los reflejos (esferas y cubos)
function Reflections() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#1a2a7a']} />
      <Lightformer intensity={8} color="#ffffff" position={[0, 6, -4]} rotation-x={Math.PI / 2} scale={[12, 3, 1]} />
      <Lightformer intensity={3} color="#8c8cff" position={[-6, 1, 0]} rotation-y={Math.PI / 2} scale={[24, 1, 1]} />
      <Lightformer intensity={3} color="#5ad1ff" position={[6, 1, 0]} rotation-y={-Math.PI / 2} scale={[24, 1, 1]} />
      <Lightformer form="ring" intensity={2} color="#e0142e" position={[0, 0, 8]} scale={3} />
    </Environment>
  )
}

function CameraRig() {
  const look = useMemo(() => new THREE.Vector3(), [])
  const bg = useMemo(() => new THREE.Color(), [])

  useFrame(({ camera, pointer, scene }) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? window.scrollY / max : 0

    // la cámara entra al pasillo de cubos con el scroll
    const targetZ = 8 - p * 30
    camera.position.z += (targetZ - camera.position.z) * 0.06
    camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.04
    camera.position.y += (0.4 + pointer.y * 0.5 - p * 1.5 - camera.position.y) * 0.04
    look.set(camera.position.x * 0.3, camera.position.y * 0.2, camera.position.z - 10)
    camera.lookAt(look)

    // más abajo en la página, fondo más oscuro para leer mejor
    bg.copy(TOP_COLOR).lerp(BOTTOM_COLOR, Math.min(p * 1.6, 1))
    scene.background.copy(bg)
    scene.fog.color.copy(bg)
  })

  return null
}

export default function Scene() {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        dpr={0.75}
        camera={{ position: [0, 0.4, 8], fov: 55, near: 0.1, far: 60 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#0b0b2a']} />
        <fog attach="fog" args={['#0b0b2a', 4, 22]} />
        <ambientLight intensity={0.6} color="#6b6bff" />
        <directionalLight position={[4, 8, 6]} intensity={1.6} color="#ffffff" />
        <pointLight position={[-4, 1, 0]} intensity={8} color="#ff2a4a" distance={10} />
        <pointLight position={[4, -1, -8]} intensity={8} color="#3dff8a" distance={10} />
        <Reflections />
        <Towers />
        <GlassOrbs />
        <DarkCubes />
        <Orbs />
        <CameraRig />
      </Canvas>
    </div>
  )
}
