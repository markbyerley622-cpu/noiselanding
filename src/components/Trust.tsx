import { useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal } from '../lib/Reveal'
import { Icon } from '../lib/icons'

const FEATS: [keyof typeof Icon, string, string][] = [
  ['checkCircle', 'Evidence-based scoring', 'Every number traces back to the messages and signals behind it.'],
  ['lines3', 'Repeatable, not a hunch', 'Scoring is rules-based math — same inputs, same score, every time. Never a model guessing.'],
  ['lock', 'Yours, and encrypted', 'Encrypted in transit and at rest, scoped to your team — never sold, never used to train public models.'],
  ['tree', 'Auditable end to end', 'Open any insight and trace exactly how Noise arrived at it.'],
]

const FACTORS: [string, string, number, string][] = [
  ['Recency — last reply 9 days ago', '−22', 62, 'var(--err)'],
  ['Reciprocity — you sent last 3', '−14', 40, 'var(--warn)'],
  ['Business signal — invoice overdue', '−10', 28, 'var(--warn)'],
  ['Sentiment — tone cooling', '−18', 50, 'var(--err)'],
]

export default function Trust() {
  const [show, setShow] = useState(false)
  return (
    <section className="band" id="trust">
      <div className="wrap">
        <div className="trust-grid">
          <div>
            <Reveal><span className="kicker">06 — Trust</span></Reveal>
            <Reveal delay={0.08}><h2>Explainable,<br />never a black box.</h2></Reveal>
            <Reveal delay={0.16}>
              <p className="lead">Every score shows its evidence; every forecast shows its math. The intelligence is rules-based and reproducible — AI only ever writes the words, it never decides the numbers. So you can always trace exactly why Noise is telling you something.</p>
            </Reveal>
            <div className="trust-feats">
              {FEATS.map(([ic, h, p], i) => (
                <Reveal delay={0.12 + i * 0.07} key={h}>
                  <div className="tfeat"><span className="tf-ic">{Icon[ic]}</span><h3>{h}</h3><p>{p}</p></div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <motion.div className="panel" viewport={{ once: true, amount: 0.4 }} onViewportEnter={() => setShow(true)}>
              <div className="panel-bar"><div className="dots"><i /><i /><i /></div><span className="pt">noise · why this score?</span></div>
              <div className="explain">
                <div className="ex-top"><span className="ex-v" style={{ color: 'var(--err)' }}>58</span><span className="ex-l">Acme Corp · At risk</span></div>
                <div className="ex-sub">This score is the sum of weighted, observable signals — here's the breakdown.</div>
                {FACTORS.map(([name, w, fill, color], i) => (
                  <div className="ex-factor" key={name}>
                    <div className="ef-top"><span className="ef-n">{name}</span><span className="ef-w">{w}</span></div>
                    <div className="ex-bar">
                      <motion.i style={{ background: color }} initial={{ width: 0 }} animate={{ width: show ? `${fill}%` : 0 }} transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 + i * 0.14 }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
