import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LOGOS } from '../data/site'
import { Icon } from '../lib/icons'

/* Section — Open Focus, the product. A priority queue: "what do I do next?"
   The first task (Sarah Chen) plays out in full to SHOW what Open Focus does:
   it opens into a box, a cursor clicks "Draft response", Noise drafts the reply,
   then the task resolves and flies off. The remaining tasks keep the calm
   priority-queue rhythm — flash red, resolve to a green check, fly off. */

interface Row { logo: string; title: string; need: string; action: string; risk?: boolean; demo?: boolean }
const ROWS: Row[] = [
  { logo: LOGOS.gmail, title: 'Sarah Chen', need: 'Reply · 2 days waiting', action: 'Reply', demo: true },
  { logo: LOGOS.telegram, title: 'Approve Acme renewal draft', need: 'Approval', action: 'Approve' },
  { logo: LOGOS.salesforce, title: 'Acme cooling — reach out', need: 'Risk · $144k', action: 'Review', risk: true },
  { logo: LOGOS.slack, title: 'Follow through with John', need: 'Commitment · due today', action: 'Resolve' },
]
const EASE = [0.2, 0.8, 0.2, 1] as const

// Sarah's waiting message + the reply Noise drafts from company memory
const INCOMING = '“Any update on the renewal timeline? I need to take it back to my team this week.”'
const DRAFT = 'Hi Sarah — yes, the updated renewal terms are ready. Sending them over now with the MSA summary so you can share with your team.'

type Phase = 'idle' | 'alert' | 'open' | 'click' | 'done'

export default function OpenFocus({ reduce }: { reduce: boolean }) {
  const [remaining, setRemaining] = useState<string[]>(reduce ? [] : ROWS.map((r) => r.title))
  const [phase, setPhase] = useState<Phase>('idle')

  // The top task takes its turn. The demo task (Sarah) plays a longer beat:
  // open → cursor clicks → drafts → done → fly off. Every other task just
  // alerts (red + shake) → resolves (green) → flies off.
  useEffect(() => {
    if (reduce || remaining.length === 0) return
    setPhase('idle')
    const top = ROWS.find((r) => r.title === remaining[0])
    const ts: number[] = []
    if (top?.demo) {
      ts.push(window.setTimeout(() => setPhase('open'), 600))
      ts.push(window.setTimeout(() => setPhase('click'), 1800))
      ts.push(window.setTimeout(() => setPhase('done'), 3000))
      ts.push(window.setTimeout(() => { setPhase('idle'); setRemaining((rs) => rs.slice(1)) }, 3900))
    } else {
      ts.push(window.setTimeout(() => setPhase('alert'), 650))
      ts.push(window.setTimeout(() => setPhase('done'), 1250))
      ts.push(window.setTimeout(() => { setPhase('idle'); setRemaining((rs) => rs.slice(1)) }, 1950))
    }
    return () => ts.forEach(clearTimeout)
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
            const open = isTop && r.demo && (phase === 'open' || phase === 'click' || phase === 'done')
            const clicking = isTop && phase === 'click'
            const drafted = isTop && (phase === 'click' || phase === 'done')
            return (
              <motion.div
                layout
                className={'of-row' + (r.risk ? ' risk' : '') + (alert ? ' alert' : '') + (done ? ' done' : '') + (open ? ' open' : '')}
                key={r.title}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={done && !r.demo ? { opacity: 1, y: 0, scale: [1, 1.05, 1] } : { opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 110, scale: 0.9, filter: 'blur(4px)', transition: { duration: 0.5, ease: EASE } }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div className="of-inner">
                  <span className="of-ic"><img src={r.logo} alt="" /></span>
                  <div className="of-main">
                    <div className="of-t">{r.title}</div>
                    <div className="of-n">{r.need}</div>
                  </div>
                  <span className="of-act">{done ? <>{Icon.check} {r.demo ? 'Sent' : 'Done'}</> : r.action}</span>
                </div>

                {/* DEMO — the task opens into a live draft, a cursor clicks, Noise replies */}
                {r.demo && (
                  <AnimatePresence>
                    {open && (
                      <motion.div className="of-expand" key="exp"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}>
                        <div className="of-msg">{INCOMING}</div>
                        <AnimatePresence>
                          {drafted && (
                            <motion.div className="of-draft" key="draft"
                              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                              {DRAFT}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="of-expand-foot">
                          <span className={'of-draft-btn' + (drafted ? ' on' : '')}>
                            {done ? <>{Icon.check} Sent</> : drafted ? 'Drafting…' : <>{Icon.mail} Draft response</>}
                          </span>
                          <motion.span className={'of-cursor' + (clicking ? ' click' : '')}
                            initial={{ opacity: 0, x: 22, y: 16 }}
                            animate={{ opacity: phase === 'done' ? 0 : 1, x: 0, y: 0 }}
                            transition={{ duration: 0.6, ease: EASE }}>
                            <svg viewBox="0 0 24 24"><path d="M5 3l15 9-6 1.5L11 20 5 3z" /></svg>
                          </motion.span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* CLEARED — a calm "caught up" state with the time-saved payoff */}
        <AnimatePresence>
          {left === 0 && (
            <motion.div className="of-clear" key="clear"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              <span className="of-clear-check">
                <svg viewBox="0 0 52 52" aria-hidden="true">
                  <motion.circle cx="26" cy="26" r="23" className="ofc-ring"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.3 }} />
                  <motion.path d="M16 27l7 7 14-15" className="ofc-tick"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: EASE, delay: 0.75 }} />
                </svg>
              </span>
              <div className="of-clear-t">You’re all caught up</div>
              <div className="of-clear-s">~6 min of triage, handled</div>
              <div className="of-clear-watch"><span className="ofc-pulse" /> Noise is watching for what’s next.</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {left > 0 && (
        <div className="os-focus-foot">
          <span className="dot" style={{ background: 'var(--p400)' }} /> {left} left — one click each
        </div>
      )}
    </div>
  )
}
