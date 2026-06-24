import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import Orb from './Orb'
import Laptop from './Laptop'
import { Icon } from '../lib/icons'
import { NoiseMark } from '../lib/NoiseMark'

/* The whole landing narrative is one scroll-driven story of a single Orb
   becoming the company brain. A sticky stage holds the Orb; a tall track drives
   the scroll. `stage` (0..8) selects the beat and the Orb's state. The final
   beat dissolves the Orb so it hands off into the Kosh-style feature cards. */

interface Beat {
  kicker?: string
  left?: string
  right?: string
  note?: string
  eyebrow?: string
  head?: string
  sub?: string
  audience?: string
  cta?: boolean
}

const BEATS: Beat[] = [
  {
    eyebrow: 'The memory layer for your business',
    head: 'Your company should know everything.',
    sub: 'Noise gives your company a memory. It remembers what was said, promised, decided and forgotten across email, chat, meetings and files.',
    audience: 'Connect Gmail, Outlook, Slack, Teams, WhatsApp, Telegram, Drive and Calendar.',
    cta: true,
  },
  { kicker: '01 — Connect', left: 'Connect every channel once', right: 'Every conversation becomes searchable', note: 'Gmail, Slack, Teams, WhatsApp, Drive and more — connected once, never again.' },
  { kicker: '02 — Memory', left: 'Drop anything in. Noise remembers it.', note: 'Emails, files, contracts, notes and attachments become company memory automatically.' },
  { kicker: '03 — Focus', left: 'One feed of what needs attention', note: 'Drafts, follow-ups, decisions and next actions — all in one place.' },
  { kicker: '04 — Intelligence', left: 'See risk before it becomes a problem', note: 'Noise tracks every relationship and surfaces changes before they cost you.' },
  { kicker: '05 — The moat', left: 'People leave', right: 'Knowledge stays', note: 'When someone leaves, their context stays with the company.' },
  { kicker: '06 — Trust', left: 'Every answer shows its evidence', note: 'Trace every score, recommendation and insight back to the source.' },
  { kicker: '07 — Calendar', left: 'Meetings arrive prepared', note: 'Meeting links, context, follow-ups and next steps — handled automatically.' },
  { kicker: '08 — Dashboard', left: 'Your whole company, one screen', note: 'Every conversation, document, meeting and relationship in a single live view.' },
  { head: 'More than a unified inbox.', sub: 'A memory layer for your company.', audience: 'Noise turns conversations, documents and relationships into institutional memory.', cta: true },
]
const N = BEATS.length

export default function OrbStory({ onSignup }: { onSignup: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = !!useReducedMotion()
  // On phones the sticky/absolute orb choreography can't lay out cleanly, so we
  // serve the calm vertical version (same one used for reduced motion).
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const on = () => setIsMobile(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const [stage, setStage] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const exact = p * N
    const target = Math.min(N - 1, Math.max(0, Math.floor(exact)))
    setStage((prev) => {
      if (target === prev) return prev
      // fast scroll across several beats — just snap there
      if (Math.abs(target - prev) > 1) return target
      // adjacent beat: require being clearly past the boundary, so tiny scroll
      // jitter at the edge can't flip the heavy overlays back and forth
      const frac = exact - Math.floor(exact)
      if (target > prev && frac < 0.12) return prev
      if (target < prev && frac > 0.88) return prev
      return target
    })
  })

  // Mobile / reduced-motion: a calm vertical read with a static orb.
  if (reduce || isMobile) {
    return (
      <section className="os-fallback" id="top">
        <div className="wrap">
          <div className="os-fb-orb"><span className="os-fb-core" /></div>
          {BEATS.map((b, i) => (
            <div className="os-fb-beat" key={i}>
              {b.eyebrow && <span className="kicker">{b.eyebrow}</span>}
              {b.kicker && <span className="kicker">{b.kicker}</span>}
              {b.head && <h2>{b.head}</h2>}
              {b.sub && <p className="lead">{b.sub}</p>}
              {b.audience && <p className="lead">{b.audience}</p>}
              {(b.left || b.right) && (
                <p className="lead"><b>{b.left}.</b> {b.right ? `${b.right}.` : ''}</p>
              )}
              {b.note && <p className="lead">{b.note}</p>}
              {b.cta && <button className="btn btn-glass btn-glass-accent btn-lg" onClick={onSignup}>Connect your email {Icon.arrow}</button>}
            </div>
          ))}
        </div>
      </section>
    )
  }

  const b = BEATS[stage]
  const dissolve = stage === N - 1

  return (
    <section className="os-story" id="top" ref={ref} style={{ height: `${N * 135}vh` }}>
      <div className="os-sticky">
        <div className="os-bg"><div className="os-grid" /><div className="os-glow" /></div>

        {/* THE ORB — dissolves on the final beat to hand off into the cards */}
        <motion.div
          className="os-stage"
          animate={{ opacity: dissolve ? 0 : 1, scale: dissolve ? 0.7 : 1, filter: dissolve ? 'blur(14px)' : 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <Orb stage={stage} reduce={false} />
        </motion.div>

        {/* COPY — crossfades per beat */}
        <div className="os-copy">
          {b.head ? (
            <motion.div className={'os-center' + (stage === N - 1 ? ' os-center-final' : '')} key={'c' + stage} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}>
              {stage === N - 1 && <Laptop />}
              <div className="os-final-text">
                {stage === N - 1 && <div className="os-bigmark"><NoiseMark width={300} height={60} /></div>}
                <div className="os-center-body">
                  {b.eyebrow && <span className="os-eyebrow">{b.eyebrow}</span>}
                  <h1>{stage === N - 1 ? <>More than a unified <span className="grad-text">inbox.</span></> : b.head}</h1>
                  {b.sub && <p>{b.sub}</p>}
                  {b.audience && <p className="os-audience">{b.audience}</p>}
                  {b.cta && (
                    <div className="os-center-cta">
                      <button className="btn btn-glass btn-glass-accent btn-lg" onClick={onSignup}>Connect your email {Icon.arrow}</button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {b.kicker && (
                <motion.span className="os-kicker" key={'k' + stage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{b.kicker}</motion.span>
              )}
              <motion.div className="os-side left" key={'l' + stage} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}>{b.left}</motion.div>
              {b.right && <motion.div className="os-side right" key={'r' + stage} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}>{b.right}</motion.div>}
              {b.note && <motion.p className="os-note" key={'n' + stage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1], delay: 0.15 }}>{b.note}</motion.p>}
            </>
          )}
        </div>

        {/* progress rail */}
        <div className="os-rail" aria-hidden="true">
          {BEATS.map((_, i) => <span key={i} className={'os-rail-dot' + (i === stage ? ' on' : '') + (i < stage ? ' done' : '')} />)}
        </div>

        {stage === 0 && <div className="os-scroll-hint">Scroll to watch it learn</div>}
      </div>
    </section>
  )
}
