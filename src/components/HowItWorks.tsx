import { useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal } from '../lib/Reveal'
import { Icon } from '../lib/icons'

// The transparency moment. Every beat answers a fear a cautious founder has
// the instant before they hand over an inbox — and the last beat is the
// control guarantee, not a feature.
const STEPS: [string, string][] = [
  ['Connect Gmail or Outlook', 'One click. Read-only access to mail & calendar — no passwords stored, revoke in a click.'],
  ['Noise reads recent history', 'It reads your recent messages to understand context. It never posts, deletes or replies on its own.'],
  ['Maps people & commitments', 'People, companies, promises and deadlines resolve into one private graph — scoped to your team alone.'],
  ['Builds your first brief', 'Your first 60-second brief is generated automatically. Value lands in under a minute.'],
  ['Nothing sent without approval', 'Every draft waits for your yes. You stay in control of every word that leaves your account.'],
]

export default function HowItWorks() {
  const [lit, setLit] = useState(-1)

  function go() {
    STEPS.forEach((_, i) => setTimeout(() => setLit(i), 300 + i * 320))
  }

  return (
    <section className="band tight" id="how">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal><span className="kicker center">Before you connect</span></Reveal>
          <Reveal delay={0.08}><h2>Exactly what happens<br />when you connect.</h2></Reveal>
          <Reveal delay={0.16}><p className="lead">No surprises, no fine print. Here's everything Noise does the moment you connect — and the one thing it will never do without you.</p></Reveal>
        </div>

        <Reveal delay={0.1}>
          <motion.div className="steps" viewport={{ once: true, amount: 0.4 }} onViewportEnter={go}>
            <div className="track" />
            <motion.div className="prog" initial={{ width: 0 }} animate={{ width: lit >= 0 ? '84%' : 0 }} transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }} />
            {STEPS.map(([h, p], i) => {
              const guard = i === STEPS.length - 1
              return (
                <div className={'step' + (i <= lit ? ' lit' : '') + (guard ? ' guard' : '')} key={i}>
                  <div className="sn">{guard ? Icon.lock : i + 1}</div>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              )
            })}
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
