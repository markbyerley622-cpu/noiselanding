import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { LOGOS, IPHONE } from '../data/site'
import { NoiseMark } from '../lib/NoiseMark'

const APP_BG = '/app%20logo%20background.png'
const EASE = [0.2, 0.8, 0.2, 1] as const

const CHANS = [LOGOS.gmail, LOGOS.whatsapp, LOGOS.messenger, LOGOS.dropbox]

// app icon = black rounded background + the LIVE (animated) Noise waveform mark
const AppIcon = () => (
  <div className="app-icon">
    <img src={APP_BG} alt="Noise app" />
    <NoiseMark className="app-icon-mark" width={120} height={24} />
  </div>
)

export default function IntroOverlay({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion()
  const done = useRef(false)
  const finish = () => { if (done.current) return; done.current = true; onDone() }

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(finish, reduce ? 900 : 8200)
    return () => { clearTimeout(t); document.body.style.overflow = prev }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // (1) phone comes toward you & holds big. The iPhone FRAME blurs out first;
  // the Noise app imprints a touch longer before it too blurs away.
  const lead: Variants = {
    hidden: { opacity: 0, scale: 0.4, y: 0, filter: 'blur(16px)' },
    show: {
      opacity: [0, 1, 1, 1, 1, 1],
      scale: [0.4, 1.02, 1.16, 1.18, 1.12, 1.05],
      y: [0, 0, 0, 0, 0, -34],
      filter: ['blur(16px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'],
      transition: { duration: 4.6, times: [0, 0.18, 0.5, 0.66, 0.84, 1], ease: 'easeInOut' },
    },
  }
  const frameV: Variants = {
    hidden: { opacity: 1, filter: 'blur(0px)' },
    show: { opacity: [1, 1, 1, 0, 0], filter: ['blur(0px)', 'blur(0px)', 'blur(15px)', 'blur(18px)', 'blur(18px)'], transition: { duration: 4.6, times: [0, 0.64, 0.8, 0.9, 1], ease: 'easeInOut' } },
  }
  const screenV: Variants = {
    hidden: { opacity: 1, filter: 'blur(0px)' },
    show: { opacity: [1, 1, 1, 1, 0], filter: ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(2px)', 'blur(12px)'], transition: { duration: 4.6, times: [0, 0.72, 0.86, 0.94, 1], ease: 'easeInOut' } },
  }
  // (3) the 4 screens tilt up out of the dark, then each one BUILDS its content
  const grid: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6, delay: 4.1, staggerChildren: 0.16, delayChildren: 4.2 } } }
  const panel: Variants = {
    hidden: { opacity: 0, y: 46, rotateX: 24, scale: 0.92, filter: 'blur(7px)' },
    show: { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE, when: 'beforeChildren', delayChildren: 0.18, staggerChildren: 0.07 } },
  }
  // inner content cascades in after its panel has settled
  const item: Variants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }
  const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
  const barFill: Variants = { hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.95, ease: EASE } } }
  // (4) slow continued push on the whole centre — the cinematic "after"
  const drift: Variants = { hidden: { scale: 1 }, show: { scale: [1, 1, 1.06], transition: { duration: 8, times: [0, 0.5, 1], ease: 'easeInOut' } } }
  const wordL: Variants = { hidden: { opacity: 0, x: -46 }, show: { opacity: 1, x: 0, transition: { duration: 1, ease: EASE, delay: 4.2 } } }
  const wordR: Variants = { hidden: { opacity: 0, x: 46 }, show: { opacity: 1, x: 0, transition: { duration: 1, ease: EASE, delay: 4.6 } } }
  const tagV: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 4.4 } } }

  return (
    <motion.div
      className="intro"
      onClick={finish}
      initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.07, filter: 'blur(26px)', transition: { duration: 1.05, ease: [0.4, 0, 0.2, 1] } }}
    >
      <div className="intro-bg"><div className="intro-glow" /><div className="intro-grain" /></div>

      <div className="intro-stage">
        <motion.div className="intro-word left" variants={wordL} initial="hidden" animate="show">Turn your<br />noise</motion.div>

        <motion.div className="intro-center" variants={drift} initial="hidden" animate="show">
          {/* pan-in lead — Noise app on the iPhone (frame blurs first, app imprints) */}
          <motion.div className="intro-lead" variants={lead} initial="hidden" animate="show">
            <div className="intro-lead-phone">
              <motion.div className="intro-lead-screen" variants={screenV}>
                <AppIcon />
                <div className="scr-wm">Noise<span className="dot-g">.</span></div>
              </motion.div>
              <motion.img className="intro-lead-frame" variants={frameV} src={IPHONE} alt="" width={436} height={572} />
            </div>
          </motion.div>

          {/* assembling grid — panels tilt up, then build their content */}
          <motion.div className="intro-grid2" variants={grid} initial="hidden" animate="show">
            <motion.div className="intro-panel" variants={panel}>
              <AppIcon />
              <motion.div className="scr-wm" variants={item}>Noise<span className="dot-g">.</span></motion.div>
            </motion.div>
            <motion.div className="intro-panel" variants={panel}>
              <motion.div className="ip-orb" variants={item} />
              <motion.div className="scr-name" variants={item}>Acme Corp</motion.div>
              <motion.div className="ip-score" variants={item}>92</motion.div>
              <motion.div className="ip-bar" variants={item}><motion.i variants={barFill} style={{ width: '92%', transformOrigin: 'left' }} /></motion.div>
              <motion.div className="ip-state" variants={item}>Healthy</motion.div>
            </motion.div>
            <motion.div className="intro-panel" variants={panel}>
              <motion.div className="scr-chans" variants={stagger}>
                {CHANS.map((s, i) => <motion.span className="scr-chan" key={i} variants={item}><img src={s} alt="" /></motion.span>)}
              </motion.div>
              <motion.div className="scr-title" variants={item}>Every channel,<br />one brain</motion.div>
            </motion.div>
            <motion.div className="intro-panel" variants={panel}>
              <motion.div className="ip-cap" variants={item}>Founder brief</motion.div>
              <motion.div className="ip-brief" variants={stagger}>
                <motion.div className="ip-bl" variants={item}><span className="d" style={{ background: 'var(--err)' }} /><div><b>Acme</b> quiet 9d · $144k</div></motion.div>
                <motion.div className="ip-bl" variants={item}><span className="d" style={{ background: 'var(--warn)' }} /><div>3 promises due today</div></motion.div>
                <motion.div className="ip-bl" variants={item}><span className="d" style={{ background: 'var(--ok)' }} /><div>Northwind heating up</div></motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="intro-word right" variants={wordR} initial="hidden" animate="show">into <span className="grad-bright">signal</span>.</motion.div>

        <motion.div className="intro-mobile-tag" variants={tagV} initial="hidden" animate="show">
          Turn your noise<br />into <span className="grad-bright">signal</span>.
        </motion.div>
      </div>

      <div className="intro-skip">Click to skip</div>
    </motion.div>
  )
}
