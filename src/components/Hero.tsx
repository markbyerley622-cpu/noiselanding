import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import DesktopApp from './DesktopApp'
import { Icon } from '../lib/icons'

const EASE = [0.2, 0.8, 0.2, 1] as const
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
})

const SPARK = [60, 72, 64, 80, 70, 58, 52, 40]
const HEALTH = [
  { v: 92, w: '92%', c: 'var(--ok)', s: 'Healthy', sc: 'var(--ok)' },
  { v: 84, w: '84%', c: 'var(--ok)', s: 'Heating up', sc: 'var(--ok)' },
  { v: 71, w: '71%', c: 'var(--warn)', s: 'Waiting on you', sc: 'var(--warn)' },
  { v: 58, w: '58%', c: 'var(--err)', s: 'At risk', sc: 'var(--err)' },
]

function HealthCard() {
  const [k, setK] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setK((v) => (v + 1) % HEALTH.length), 2600)
    return () => clearInterval(t)
  }, [reduce])
  const st = HEALTH[k]
  return (
    <>
      <div className="fc-row">
        <div className="fc-av">AC</div>
        <div><div className="fc-name">Acme Corp</div><div className="fc-meta">Renewal · $144k</div></div>
        <div className="fc-score" style={{ color: st.sc }}>{st.v}</div>
      </div>
      <div className="fc-bar"><i style={{ width: st.w, background: st.c }} /></div>
      <div className="fc-foot">
        <span className="fc-state" style={{ color: st.sc }}>{st.s}</span>
        <span className="fc-spark">{SPARK.map((h, i) => <i key={i} style={{ height: (h / 100) * 18 }} />)}</span>
      </div>
    </>
  )
}

export default function Hero({ onSignup }: { onSignup: () => void }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })

  const rotateY = useTransform(sx, [-0.5, 0.5], [5, -5])
  const rotateX = useTransform(sy, [-0.5, 0.5], [-5, 5])
  const orbX = useTransform(sx, [-0.5, 0.5], [-12, 12])
  const orbY = useTransform(sy, [-0.5, 0.5], [-12, 12])
  const hX = useTransform(sx, [-0.5, 0.5], [-26, 26])
  const hY = useTransform(sy, [-0.5, 0.5], [-26, 26])
  const dX = useTransform(sx, [-0.5, 0.5], [-18, 18])
  const dY = useTransform(sy, [-0.5, 0.5], [-18, 18])

  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el || !window.matchMedia('(pointer:fine)').matches) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      mx.set((e.clientX - r.left) / r.width - 0.5)
      my.set((e.clientY - r.top) / r.height - 0.5)
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [reduce, mx, my])

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-bg">
        <div className="hero-grid" />
        <motion.div className="hero-glow" style={{ x: orbX, y: orbY }} />
        <motion.div className="hero-glow two" style={{ x: hX, y: hY }} />
      </div>
      <div className="wrap">
        <div className="hero-inner">
          <div className="hero-copy">
            <motion.span className="kicker" {...fadeUp(0)} style={{ display: 'inline-flex' }}>Turn the noise into <span className="grad-text">signal</span>.</motion.span>
            <motion.h1 {...fadeUp(0.08)} style={{ marginTop: 18 }}>
              Your communication<br />finally has a <span className="em">memory<span className="ul" /></span>.
            </motion.h1>
            <motion.p className="sub" {...fadeUp(0.16)}>
              Noise connects every channel you talk through — email, Slack, WhatsApp, Telegram, Teams and more — then builds a <b>memory and intelligence layer</b> on top. So you never lose context, you see relationship risk before it costs you, and the knowledge stays even when people leave.
            </motion.p>
            <motion.div className="hero-cta" {...fadeUp(0.24)}>
              <button className="btn btn-glass btn-glass-accent btn-lg" onClick={onSignup}>Connect your email {Icon.arrow}</button>
              <a className="btn btn-glass btn-lg" href="#how">See how it works</a>
            </motion.div>
            <motion.div className="hero-micro" {...fadeUp(0.32)}>
              <span>{Icon.checkCircle} 60 seconds to your first brief</span>
              <span>{Icon.lock} Encrypted at rest</span>
              <span>{Icon.checkCircle} No setup, no rules, no tagging</span>
            </motion.div>
          </div>

          <motion.div className="stage" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}>
            <motion.div className="stage-orb" style={{ x: orbX, y: orbY }} />

            <motion.div className="float-card fc-health" style={{ x: hX, y: hY }}>
              <HealthCard />
            </motion.div>

            <motion.div className="float-card fc-draft" style={{ x: dX, y: dY }}>
              <span className="fc-tag"><span className="dot" style={{ background: 'var(--p400)' }} />Draft ready · in your voice</span>
              <div className="fc-q">"Hi Sarah — thanks for the nudge. The signed MSA is attached; happy to jump on a call <b>Thursday</b> to walk through the rollout."</div>
            </motion.div>

            <motion.div className="desk-tilt desk-float" style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1300 }}>
              <DesktopApp />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
