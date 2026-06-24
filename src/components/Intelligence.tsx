import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '../lib/Reveal'
import { Icon } from '../lib/icons'
import { HEALTH_SCENES, type HealthScene } from '../data/site'

const SPLIT = 200, W = 320
const HIST = [90, 93, 91, 88, 84, 80]
const yOf = (v: number) => 105 - (v / 100) * 70

function pastPath(today: number) {
  const pts = [...HIST, today]
  return pts.map((v, i) => `${i ? 'L' : 'M'}${((i / (pts.length - 1)) * SPLIT).toFixed(1)} ${yOf(v).toFixed(1)}`).join(' ')
}
function forePath(today: number, future: number) {
  const y0 = yOf(today), y1 = yOf(future)
  return `M${SPLIT} ${y0.toFixed(1)} Q${(SPLIT + W) / 2} ${((y0 + y1) / 2 + 6).toFixed(1)} ${W} ${y1.toFixed(1)}`
}

const STATES: { st: HealthScene['state']; label: string; dot: string }[] = [
  { st: 'hot', label: 'Heating up', dot: 'var(--ok)' },
  { st: 'wait', label: 'Waiting on you', dot: 'var(--warn)' },
  { st: 'cool', label: 'Cooling down', dot: 'var(--warn)' },
  { st: 'risk', label: 'At risk', dot: 'var(--err)' },
]

export default function Intelligence() {
  const reduce = useReducedMotion()
  const [k, setK] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running || reduce) return
    const t = setInterval(() => setK((v) => (v + 1) % HEALTH_SCENES.length), 3000)
    return () => clearInterval(t)
  }, [running, reduce])

  const s = HEALTH_SCENES[k]
  const past = pastPath(s.today)

  return (
    <section className="band" id="intelligence">
      <div className="wrap">
        <div className="split rev">
          <div className="split-copy">
            <Reveal><span className="kicker">03 — The intelligence layer</span></Reveal>
            <Reveal delay={0.08}><h2>Know what's at risk<br />before it breaks.</h2></Reveal>
            <Reveal delay={0.16}>
              <p className="lead">Noise scores the health of every relationship from how you actually communicate — recency, reciprocity, tone — plus the business signals that matter: overdue invoices, stalled deals, slipping promises. Then it forecasts where each relationship is heading.</p>
            </Reveal>
            <div className="feature-list">
              {[
                [Icon.trend, 'Relationship health, scored', 'Every contact gets a 0–100 score and a state: heating up, waiting on you, cooling down, at risk.'],
                [Icon.pulse, 'Forecasts, not hindsight', 'Noise projects relationship health 14–30 days out and flags churn risk before you\'d ever notice.'],
                [Icon.person, 'Key-person risk', 'See when one employee is the single point of failure for a major account — and the revenue exposed if they leave.'],
              ].map(([ic, h, p], i) => (
                <Reveal delay={0.12 + i * 0.08} key={i}>
                  <div className="fitem"><span className="fi-ic">{ic as any}</span><div><h3>{h as string}</h3><p>{p as string}</p></div></div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <motion.div className="panel" viewport={{ once: true, amount: 0.45 }} onViewportEnter={() => setRunning(true)}>
              <div className="panel-bar"><div className="dots"><i /><i /><i /></div><span className="pt">noise · relationship health</span></div>
              <div className="health-card">
                <div className="hc-top">
                  <div className="hc-av">AC</div>
                  <div><div className="hc-name">Acme Corp</div><div className="hc-meta">Renewal · $144,000 · 41 messages</div></div>
                  <div className="hc-score"><div className="hs-v" style={{ color: s.color }}>{s.score}</div><div className="hs-l">/ 100</div></div>
                </div>
                <div className="hc-chart">
                  <span className="hc-now-label">Today</span><span className="hc-fore-label">+30d forecast</span>
                  <svg viewBox="0 0 320 140">
                    <line className="axis" x1="0" y1="35" x2="320" y2="35" />
                    <line className="axis" x1="0" y1="105" x2="320" y2="105" />
                    <line x1="200" y1="0" x2="200" y2="140" stroke="var(--bd2)" strokeDasharray="3 4" strokeWidth="1" />
                    <defs>
                      <linearGradient id="hcfill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="rgba(139,92,246,.28)" /><stop offset="1" stopColor="rgba(139,92,246,0)" />
                      </linearGradient>
                    </defs>
                    <motion.path fill="url(#hcfill)" animate={{ d: `${past} L${SPLIT} 105 L0 105 Z` }} transition={{ duration: 0.8 }} />
                    <motion.path fill="none" stroke={s.color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" animate={{ d: past }} transition={{ duration: 0.8 }} />
                    <motion.path fill="none" stroke="var(--err)" strokeWidth="2.4" strokeDasharray="2 5" strokeLinecap="round" animate={{ d: forePath(s.today, s.future) }} transition={{ duration: 0.8 }} />
                    <motion.circle r="4.5" fill={s.color} stroke="var(--bg2)" strokeWidth="2" animate={{ cx: SPLIT, cy: yOf(s.today) }} transition={{ duration: 0.8 }} />
                  </svg>
                </div>
                <div className="hc-states">
                  {STATES.map((st) => (
                    <span key={st.st} className={'hc-state' + (st.st === s.state ? ' active' : '')}>
                      <span className="dot" style={{ background: st.dot }} />{st.label}
                    </span>
                  ))}
                </div>
                <div className="hc-reason">
                  <div dangerouslySetInnerHTML={{ __html: s.reason }} />
                  <div className="why">
                    <span>recency <b>{s.rec}</b></span>
                    <span>reciprocity <b>{s.req}</b></span>
                    <span>business signals <b>{s.biz}</b></span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
