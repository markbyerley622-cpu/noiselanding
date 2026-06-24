import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const PixelScanLogo = lazy(() => import('./PixelScanLogo'))

const EASE = [0.2, 0.8, 0.2, 1] as const

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch { return false }
}

/* BackTransition — the 3D "pixel scan" reveal of the Noise mark that plays when
   you leave /security. When it finishes it lands you on the homepage with the
   first-load intro suppressed (?nointro + the intro flag), so you don't get the
   same opening animation twice. Click anywhere to skip. */
export default function BackTransition({ to = '/' }: { to?: string }) {
  const reduce = !!useReducedMotion()
  const webgl = useRef(hasWebGL())
  const use3D = webgl.current && !reduce
  const [leaving, setLeaving] = useState(false)
  // gate the reveal timing on the canvas actually being ready, so a slow first
  // load of the 3D chunk can't cut the animation short
  const [ready, setReady] = useState(!use3D)
  const done = useRef(false)

  const go = () => {
    if (done.current) return
    done.current = true
    try { localStorage.setItem('noise_intro_v1', '1') } catch { /* ignore */ }
    setLeaving(true)
    // keep the dark overlay up through the hard navigation so there's no flash
    const sep = to.includes('?') ? '&' : '?'
    window.setTimeout(() => { window.location.assign(`${to}${sep}nointro`) }, 420)
  }

  // lock scroll on mount; hard safety net so we always navigate eventually
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const safety = window.setTimeout(go, 9000)
    return () => { window.clearTimeout(safety); document.body.style.overflow = prev }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // start the reveal clock once the scene is ready (or immediately if 2D path)
  useEffect(() => {
    if (!ready) return
    const total = use3D ? 4600 : 900
    const t = window.setTimeout(go, total)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <motion.div
      className="bxn"
      onClick={go}
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 1 : 1 }}
      style={{ opacity: 1 }}
    >
      <motion.div
        className="bxn-fade"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {use3D ? (
          <Suspense fallback={<div className="bxn-boot" />}>
            <div className="bxn-canvas">
              <PixelScanLogo reduce={reduce} onReady={() => setReady(true)} />
            </div>
          </Suspense>
        ) : (
          <div className="bxn-boot" />
        )}

        {/* wordmark + tagline reveal, timed (from scene-ready) to land as the glass settles */}
        {ready && (
          <div className="bxn-text">
            <motion.div
              className="bxn-word"
              initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: EASE, delay: use3D ? 2.2 : 0.1 }}
            >
              Noise<span className="bxn-dot">.</span>
            </motion.div>
            <motion.div
              className="bxn-tag"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: use3D ? 2.6 : 0.25 }}
            >
              Turn your noise into <span className="bxn-grad">signal</span>.
            </motion.div>
          </div>
        )}

        <div className="bxn-skip">Click to skip</div>
      </motion.div>
    </motion.div>
  )
}
