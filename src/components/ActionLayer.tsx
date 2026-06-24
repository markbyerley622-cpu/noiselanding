import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '../lib/Reveal'
import { Icon } from '../lib/icons'

const FULL = 'Hi John — sorry for the lag. The signed MSA is attached; free Thursday 2pm to walk through rollout?'

function DraftTyper() {
  const reduce = useReducedMotion()
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  function start() {
    if (done) return
    setDone(true)
    if (reduce) { setText(FULL); return }
    let i = 0
    const tick = () => { if (i <= FULL.length) { setText(FULL.slice(0, i)); i++; setTimeout(tick, 24) } }
    tick()
  }
  return (
    <motion.div className="draft-line" viewport={{ once: true, amount: 0.6 }} onViewportEnter={start}>
      <span className="typed">{text}</span><span className="caret" />
    </motion.div>
  )
}

export default function ActionLayer() {
  return (
    <section className="band tight">
      <div className="wrap">
        <div className="sec-head">
          <Reveal><span className="kicker">04 — The action layer</span></Reveal>
          <Reveal delay={0.08}><h2>From insight to done, in one click.</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="lead">Noise doesn't just tell you what's wrong — it hands you the next move. One ranked feed of what needs you. Replies drafted in your own voice, learned from how you actually write. And a 60-second brief every morning that tells you what changed, what's at risk and what to do today.</p>
          </Reveal>
        </div>

        <div className="action-grid">
          <Reveal delay={0.08}>
            <div className="acard">
              <span className="a-ic">{Icon.list}</span>
              <h3>One Focus feed</h3>
              <p>Every channel collapses into a single ranked list that answers one question: what do I do next?</p>
              <div className="a-demo">
                <div className="focus-li"><span className="fk">{Icon.check}</span> Reply to John — 2 days waiting</div>
                <div className="focus-li"><span className="fk" /> Approve Acme renewal draft</div>
                <div className="focus-li"><span className="fk" /> Log backup contact for Maria</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="acard">
              <span className="a-ic">{Icon.pen}</span>
              <h3>Drafted in your voice</h3>
              <p>Noise learns how you actually write, then drafts replies you can send as-is — or tweak in a second.</p>
              <div className="a-demo"><DraftTyper /></div>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="acard">
              <span className="a-ic">{Icon.brief}</span>
              <h3>Your founder brief</h3>
              <p>A 60-second morning read: what changed overnight, what's at risk, and exactly what to handle today.</p>
              <div className="a-demo">
                <div className="brief-li"><span className="bd" style={{ background: 'var(--err)' }} /> Acme quiet 9 days — $144k exposed</div>
                <div className="brief-li"><span className="bd" style={{ background: 'var(--ok)' }} /> Northwind heating up — close it</div>
                <div className="brief-li"><span className="bd" style={{ background: 'var(--p400)' }} /> 2 drafts waiting your approval</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
