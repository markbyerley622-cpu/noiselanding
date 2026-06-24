import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '../lib/Reveal'
import { Icon } from '../lib/icons'

const KNOWLEDGE: [keyof typeof Icon, string][] = [
  ['people', '38 customer relationships'],
  ['mail', '4,200 conversations'],
  ['contract', '19 contracts & commitments'],
  ['clock', 'Full context & history'],
]

export default function Moat({ onSignup }: { onSignup: () => void }) {
  const reduce = useReducedMotion()
  const [left, setLeft] = useState(false)

  return (
    <section className="band">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal><span className="kicker center">05 — The moat</span></Reveal>
          <Reveal delay={0.08}><h2>Knowledge that outlives the person.</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="lead">When someone leaves your team, the relationship doesn't reset to zero. Every conversation, promise and piece of context stays — owned by the company, ready to hand off. This is the one thing no inbox, CRM or chat app can give you.</p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <motion.div className="moat-vis" viewport={{ once: true, amount: 0.4 }} onViewportEnter={() => { if (!reduce) setTimeout(() => setLeft(true), 700) }}>
            <div className="moat-stage">
              <div className="moat-person">
                <motion.div className="moat-av" animate={left ? { x: -160, y: -20, opacity: 0, filter: 'grayscale(1)' } : {}} transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}>MR</motion.div>
                <motion.div className="mp-name" animate={{ opacity: left ? 0.3 : 1 }} transition={{ duration: 1.2 }}>Maria Rivera · AE</motion.div>
                <motion.div className="moat-leave" animate={{ opacity: left ? 1 : 0 }} transition={{ duration: 0.6, delay: 0.4 }}>— left the company —</motion.div>
              </div>
              <div className="moat-knowledge">
                <div className="mk-h">What stays with Noise</div>
                {KNOWLEDGE.map(([ic, label]) => (
                  <div className="mk-item" key={label}>
                    <span className="mk-ic">{Icon[ic]}</span> {label}
                    <span className="mk-stay"><span className="dot" style={{ background: 'var(--ok)' }} />retained</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="inline-cta">
            <span>Start building knowledge your company keeps.</span>
            <button className="btn btn-glass btn-glass-accent" onClick={onSignup}>Connect your email {Icon.arrow}</button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
