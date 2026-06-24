import { useEffect, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { motion, useInView } from 'framer-motion'
import { Reveal } from '../lib/Reveal'
import { Icon } from '../lib/icons'

/* Kosh-style horizontal feature gallery. Real horizontal scrolling (wheel /
   trackpad / touch / scrollbar) plus mouse click-drag, and each card's mock
   animates the moment it enters view — typing, counting, filling, checking off. */

const EASE = [0.2, 0.8, 0.2, 1] as const

/* ---- tiny animated primitives, triggered on view ---- */
function Typer({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [t, setT] = useState('')
  useEffect(() => {
    if (!inView) return
    let i = 0
    const tick = () => { if (i <= text.length) { setT(text.slice(0, i)); i++; window.setTimeout(tick, 22) } }
    tick()
  }, [inView, text])
  return <span ref={ref}>{t}<span className="kc-caret" /></span>
}

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let cur = 0
    const step = Math.max(1, Math.round(to / 26))
    const id = window.setInterval(() => { cur += step; if (cur >= to) { cur = to; clearInterval(id) } setN(cur) }, 30)
    return () => clearInterval(id)
  }, [inView, to])
  return <span ref={ref}>{n}</span>
}

const view = { once: true, amount: 0.5 } as const

function FocusMock() {
  const items: [string, boolean][] = [
    ['Reply to Sarah · 2 days waiting', true],
    ['Approve Acme renewal draft', true],
    ['Log backup contact for Maria', false],
    ['Send Q3 numbers to John', false],
  ]
  return (
    <div className="kc-mock kc-focus">
      {items.map(([t, willDo], i) => (
        <motion.div className="kc-row" key={t} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ duration: 0.4, ease: EASE, delay: i * 0.12 }}>
          <motion.span className="kc-ck" initial={{ backgroundColor: 'rgba(0,0,0,0)', borderColor: '#363643' }}
            whileInView={willDo ? { backgroundColor: '#34D399', borderColor: '#34D399' } : {}} viewport={view} transition={{ delay: 0.5 + i * 0.45, duration: 0.3 }}>
            <motion.span initial={{ opacity: 0, scale: 0.4 }} whileInView={willDo ? { opacity: 1, scale: 1 } : {}} viewport={view} transition={{ delay: 0.55 + i * 0.45 }}>{Icon.check}</motion.span>
          </motion.span>
          {t}
        </motion.div>
      ))}
    </div>
  )
}

function MemoryMock() {
  return (
    <div className="kc-mock kc-memory">
      <motion.div className="kc-orb" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 4, repeat: Infinity, ease: EASE }} />
      <div className="kc-files">
        {['Acme_MSA.pdf', 'Q3_pipeline.xlsx', 'Kickoff notes'].map((f, i) => (
          <motion.span className="kc-chip" key={f} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ delay: 0.3 + i * 0.18, duration: 0.4 }}>{f}</motion.span>
        ))}
      </div>
    </div>
  )
}

function HealthMock() {
  return (
    <div className="kc-mock kc-health">
      <div className="kc-h-top"><span className="kc-h-name">Acme Corp</span><span className="kc-h-score"><CountUp to={58} /></span></div>
      <div className="kc-h-bar"><motion.i initial={{ width: 0 }} whileInView={{ width: '58%' }} viewport={view} transition={{ duration: 1.1, ease: EASE, delay: 0.2 }} /></div>
      <div className="kc-h-foot"><span className="dot" style={{ background: 'var(--err)' }} /> At risk · 9 days quiet</div>
    </div>
  )
}

function DraftMock() {
  return (
    <div className="kc-mock kc-draft">
      <span className="kc-tag">Draft · in your voice</span>
      <div className="kc-bubble"><Typer text={'Hi Sarah — the signed MSA is attached. Free Thursday 2pm to walk through rollout?'} /></div>
    </div>
  )
}

function BriefMock() {
  const lines: [string, string][] = [
    ['var(--err)', 'Acme quiet 9d · $144k exposed'],
    ['var(--ok)', 'Northwind heating up — close it'],
    ['var(--p400)', '2 drafts waiting approval'],
  ]
  return (
    <div className="kc-mock kc-brief">
      <span className="kc-tag">Founder brief · 7:00am</span>
      {lines.map(([c, t], i) => (
        <motion.div className="kc-bl" key={t} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ delay: 0.25 + i * 0.2, duration: 0.4, ease: EASE }}>
          <span className="d" style={{ background: c }} /> {t}
        </motion.div>
      ))}
    </div>
  )
}

function CalMock() {
  return (
    <div className="kc-mock kc-cal">
      <div className="kc-cal-now"><span className="pdot" /> 11:30 · Acme renewal call</div>
      <motion.div className="kc-cal-ctx" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ delay: 0.3, duration: 0.5, ease: EASE }}>
        <div className="kc-cal-h">Noise prepared this</div>
        <div className="kc-cal-tags">
          {['Last reply 9d', 'Renewal 21d', '2 promises due'].map((t, i) => (
            <motion.span key={t} initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={view} transition={{ delay: 0.5 + i * 0.12 }}>{t}</motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

interface Card { key: string; tint: string; title: string; body: string; Visual: ComponentType }
const CARDS: Card[] = [
  { key: 'focus', tint: 'violet', title: 'Open Focus', body: 'Every channel collapses into one ranked feed that answers a single question: what do I do next?', Visual: FocusMock },
  { key: 'memory', tint: 'blue', title: 'One memory', body: 'Files, threads and attachments embedded into a single searchable brain. Drop anything in — it remembers.', Visual: MemoryMock },
  { key: 'health', tint: 'teal', title: 'Relationship health', body: 'Every contact scored 0–100 from how you actually communicate, plus the business signals that matter.', Visual: HealthMock },
  { key: 'draft', tint: 'magenta', title: 'Drafted in your voice', body: 'Replies written the way you write — ready to send as-is, or tweak in a second.', Visual: DraftMock },
  { key: 'brief', tint: 'amber', title: 'Your founder brief', body: 'A 60-second morning read: what changed overnight, what’s at risk, and exactly what to handle today.', Visual: BriefMock },
  { key: 'cal', tint: 'indigo', title: 'Calendar context', body: 'Walk into every meeting prepared — who you’re seeing, where it stands, and what you owe them.', Visual: CalMock },
]

export default function FeatureCards() {
  const gal = useRef<HTMLDivElement>(null)
  const drag = useRef({ down: false, startX: 0, startScroll: 0 })

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const el = gal.current
    if (!el) return
    drag.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft }
    el.classList.add('dragging')
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return
    const el = gal.current
    if (!el) return
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX)
  }
  const onUp = () => {
    drag.current.down = false
    gal.current?.classList.remove('dragging')
  }

  return (
    <section className="band" id="features">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal><span className="kicker center">Everything it becomes</span></Reveal>
          <Reveal delay={0.08}><h2>One brain. Every capability.</h2></Reveal>
          <Reveal delay={0.16}><p className="lead">Drag or scroll to explore.</p></Reveal>
        </div>
      </div>

      <div
        className="kc-gallery" ref={gal}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
      >
        <div className="kc-track">
          {CARDS.map((c, i) => (
            <motion.div
              className={'kc-card tint-' + c.tint} key={c.key}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.08 }}
            >
              <div className="kc-square"><c.Visual /></div>
              <h3 className="kc-title">{c.title}</h3>
              <p className="kc-body">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
