import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LOGOS } from '../data/site'
import { Icon } from '../lib/icons'

/* Section — Open Focus, the product. A priority queue: "what do I do next?"
   Each task takes its turn — it flashes red and shakes (urgency), resolves to a
   green check (satisfying), then flies off and the rest slide up. Calm, and a
   little dopamine, until the queue is clear. */

interface Row { logo: string; title: string; need: string; action: string; risk?: boolean }
const ROWS: Row[] = [
  { logo: LOGOS.gmail, title: 'Sarah Chen', need: 'Reply · 2 days waiting', action: 'Reply' },
  { logo: LOGOS.telegram, title: 'Approve Acme renewal draft', need: 'Approval', action: 'Approve' },
  { logo: LOGOS.salesforce, title: 'Acme cooling — reach out', need: 'Risk · $144k', action: 'Review', risk: true },
  { logo: LOGOS.slack, title: 'Follow through with John', need: 'Commitment · due today', action: 'Resolve' },
]
const EASE = [0.2, 0.8, 0.2, 1] as const

export default function OpenFocus({ reduce }: { reduce: boolean }) {
  const [remaining, setRemaining] = useState<string[]>(reduce ? [] : ROWS.map((r) => r.title))
  const [phase, setPhase] = useState<'idle' | 'alert' | 'done'>('idle')

  // each cycle: the top task alerts (red + shake) → resolves (green) → flies off
  useEffect(() => {
    if (reduce || remaining.length === 0) return
    setPhase('idle')
    const t1 = window.setTimeout(() => setPhase('alert'), 650)
    const t2 = window.setTimeout(() => setPhase('done'), 1250)
    const t3 = window.setTimeout(() => { setPhase('idle'); setRemaining((rs) => rs.slice(1)) }, 1950)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [remaining, reduce])

  const top = remaining[0]
  const left = remaining.length
  const rows = ROWS.filter((r) => remaining.includes(r.title))

  return (
    <div className="os-focus">
      <div className="os-focus-hero">
        <div>
          <span className="ofh-sub">Noise found {ROWS.length} things that need you · ~6 min</span>
          <span className="ofh-title">Open Focus</span>
        </div>
        <span className="ofh-arr">{Icon.arrow}</span>
      </div>

      <div className="os-focus-list">
        <AnimatePresence>
          {rows.map((r) => {
            const isTop = r.title === top
            const alert = isTop && phase === 'alert'
            const done = isTop && phase === 'done'
            return (
              <motion.div
                layout
                className={'of-row' + (r.risk ? ' risk' : '') + (alert ? ' alert' : '') + (done ? ' done' : '')}
                key={r.title}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={done ? { opacity: 1, y: 0, scale: [1, 1.05, 1] } : { opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 110, scale: 0.9, filter: 'blur(4px)', transition: { duration: 0.5, ease: EASE } }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div className="of-inner">
                  <span className="of-ic"><img src={r.logo} alt="" /></span>
                  <div className="of-main">
                    <div className="of-t">{r.title}</div>
                    <div className="of-n">{r.need}</div>
                  </div>
                  <span className="of-act">{done ? <>{Icon.check} Done</> : r.action}</span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="os-focus-foot">
        {left > 0
          ? <><span className="dot" style={{ background: 'var(--p400)' }} /> {left} left — one click each</>
          : <><span className="dot" style={{ background: 'var(--ok)' }} /> Queue clear. That’s the whole job.</>}
      </div>
    </div>
  )
}
