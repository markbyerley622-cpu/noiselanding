import { useMemo, useRef } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

/* ────────────────────────────────────────────────────────────────────────
   PixelScanLogo — a 3D re-creation of the "Pixel Scan Logo" reveal, built
   from the ACTUAL Noise mark (the decaying waveform that resolves into a
   steady signal line — see lib/NoiseMark.tsx). A swarm of glowing pixel cubes
   streaks in and the bars snap into place while a scan ring sweeps around,
   then the clean Noise mark is left glowing. Brand colours, our logo.
   Everything is authored in the mark's own SVG units (0 0 300 60).
   ──────────────────────────────────────────────────────────────────────── */

// x, y, w, h — straight from lib/NoiseMark.tsx
const RECTS: [number, number, number, number][] = [
  [5, 4, 6, 52],
  [22, 14.5, 6, 31],
  [39, 8, 6, 44],
  [56, 20, 6, 20],
  [73, 16, 6, 28],
  [90, 24, 6, 12],
  [107, 22, 6, 16],
  [124, 27, 6, 6],
  [150, 27, 138, 6], // the steady signal line
]
const MIN_X = 5, MAX_X = 288, CX = (MIN_X + MAX_X) / 2, CY = 30
const DEPTH = 9

// NoiseMark palette: bars #5B8CFF on the left → #A78BFA, signal line is the
// bright gradient. Colour each piece by its position so it reads as our logo.
const C_LEFT = new THREE.Color('#5B8CFF')
const C_RIGHT = new THREE.Color('#A78BFA')
const C_SIGNAL = new THREE.Color('#7CA8FF')

type Piece = {
  pos: [number, number, number]
  size: [number, number, number]
  scatter: THREE.Vector3
  rot: THREE.Euler
  color: THREE.Color
  delay: number
  phase: number
  isLine: boolean
}

const WAVE_T = 1.7 // seconds — matches the real .noise-mark nmWave

const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeOutBack = (t: number) => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2) }
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

function buildPieces(): Piece[] {
  return RECTS.map(([x, y, w, h], i) => {
    const cx = x + w / 2 - CX
    const cy = -(y + h / 2 - CY)
    const isLine = w > 50
    const tx = clamp01((x + w / 2 - MIN_X) / (MAX_X - MIN_X))
    const color = isLine ? C_SIGNAL.clone() : C_LEFT.clone().lerp(C_RIGHT, tx)
    // scatter: a tight-ish cloud biased toward the camera so cubes streak in
    const ang = rnd(i, 1) * Math.PI * 2
    const rad = 90 + rnd(i, 2) * 120
    const scatter = new THREE.Vector3(
      cx + Math.cos(ang) * rad,
      cy + (rnd(i, 3) - 0.5) * 150,
      120 + rnd(i, 4) * 160,
    )
    const rot = new THREE.Euler(rnd(i, 5) * 3, rnd(i, 6) * 3, rnd(i, 7) * 3)
    return { pos: [cx, cy, 0], size: [w, h, DEPTH], scatter, rot, color, delay: (isLine ? 0.7 : i * 0.08), phase: i * 0.13, isLine }
  })
}

function Bar({ piece, t0 }: { piece: Piece; t0: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null!)
  const finalPos = useMemo(() => new THREE.Vector3(...piece.pos), [piece])

  useFrame(({ clock }) => {
    const m = ref.current
    if (!m) return
    const t = clock.elapsedTime - t0.current
    const p = clamp01((t - piece.delay) / 1.0)
    const e = easeOutCubic(p)
    m.position.lerpVectors(piece.scatter, finalPos, e)
    m.rotation.set(piece.rot.x * (1 - e), piece.rot.y * (1 - e), piece.rot.z * (1 - e))
    const popped = easeOutBack(clamp01(p * 1.05))
    if (piece.isLine || p < 1) {
      // the steady signal line never waves; bars pop to full size first
      m.scale.set(Math.max(0.0001, popped), Math.max(0.0001, popped), Math.max(0.0001, popped))
    } else {
      // once assembled, each bar breathes its height around the midline,
      // staggered per bar — exactly like the live .noise-mark logo
      const waveAmt = clamp01((t - (piece.delay + 1.0)) / 0.8)
      const wv = 0.5 + 0.25 * (1 - Math.cos((2 * Math.PI / WAVE_T) * (t - piece.phase)))
      m.scale.set(1, 1 + (wv - 1) * waveAmt, 1)
    }
    m.visible = p > 0.001
  })

  return (
    <RoundedBox ref={ref} args={piece.size} radius={2} smoothness={3} visible={false}>
      <meshStandardMaterial
        color={piece.color}
        emissive={piece.color}
        emissiveIntensity={0.65}
        metalness={0.35}
        roughness={0.25}
      />
    </RoundedBox>
  )
}

// A light swarm of glowing pixel cubes that streak in, land across the mark,
// then fade — the "pixel scan" texture. Cheap additive material → bloom.
function Swarm({ count, t0 }: { count: number; t0: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const data = useMemo(() => Array.from({ length: count }, (_, i) => {
    // land somewhere inside one of the real bars so the swarm builds the mark
    const r = RECTS[Math.floor(rnd(i, 30) * RECTS.length)]
    const end = new THREE.Vector3(
      r[0] + rnd(i, 31) * r[2] - CX,
      -(r[1] + rnd(i, 32) * r[3] - CY),
      (rnd(i, 33) - 0.5) * DEPTH,
    )
    const ang = rnd(i, 11) * Math.PI * 2
    const rad = 140 + rnd(i, 12) * 220
    const start = new THREE.Vector3(end.x + Math.cos(ang) * rad, end.y + (rnd(i, 13) - 0.5) * 180, 160 + rnd(i, 14) * 240)
    const size = 3 + rnd(i, 18) * 5
    const delay = rnd(i, 19) * 0.7
    return { start, end, size, delay }
  }), [count])

  useFrame(({ clock }) => {
    const mesh = ref.current
    if (!mesh) return
    const t = clock.elapsedTime - t0.current
    for (let i = 0; i < count; i++) {
      const d = data[i]
      const p = clamp01((t - d.delay) / 1.1)
      const e = easeOutCubic(p)
      dummy.position.lerpVectors(d.start, d.end, e)
      const life = clamp01((t - d.delay - 0.8) / 0.7) // fade as the bars solidify
      const s = d.size * (0.25 + 0.75 * e) * (1 - life)
      dummy.scale.setScalar(Math.max(0.0001, s))
      dummy.rotation.set(0, p * 4, p * 4)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#b9d6ff" toneMapped={false} transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
  )
}

function Scene({ reduce }: { reduce: boolean }) {
  const t0 = useRef(0)
  const started = useRef(false)
  const group = useRef<THREE.Group>(null!)
  const pieces = useMemo(buildPieces, [])

  useFrame(({ clock, camera }) => {
    if (!started.current) { t0.current = clock.elapsedTime; started.current = true }
    const t = clock.elapsedTime - t0.current
    // gentle, slow dolly-in, then hold — mark stays front-facing & readable.
    // Larger distance ⇒ the logo sits smaller in frame.
    camera.position.set(Math.sin(t * 0.25) * 8, 3, 500 - clamp01(t / 3.4) * 45)
    camera.lookAt(0, 0, 0)
    if (group.current) {
      const settle = easeOutCubic(clamp01((t - 0.9) / 1.6))
      group.current.rotation.y = (1 - settle) * -0.3 + Math.sin(t * 0.45) * 0.025
    }
  })

  return (
    <>
      <color attach="background" args={['#06070d']} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[120, 200, 300]} intensity={2.2} color="#dfe9ff" />
      <directionalLight position={[-180, -60, 120]} intensity={1.1} color="#8b5cf6" />
      <pointLight position={[0, 0, 160]} intensity={1.6} color="#5B8CFF" distance={900} />

      <group ref={group}>
        {pieces.map((p, i) => <Bar key={i} piece={p} t0={t0} />)}
        {!reduce && <Swarm count={44} t0={t0} />}
      </group>

      <EffectComposer enableNormalPass={false}>
        <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.35} luminanceSmoothing={0.25} radius={0.7} />
      </EffectComposer>
    </>
  )
}

export default function PixelScanLogo({ reduce = false, onReady }: { reduce?: boolean; onReady?: () => void }) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 3, 500], fov: 32, near: 1, far: 3000 }}
      dpr={[1, 1.6]}
      onCreated={() => onReady?.()}
    >
      <Scene reduce={reduce} />
    </Canvas>
  )
}

// keep the JSX intrinsic types referenced
export type _R3F = ThreeElements
