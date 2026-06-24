import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { LOGOS } from '../data/site'
import { GoogleMark, MicrosoftMark, Icon } from '../lib/icons'
import { NoiseMark } from '../lib/NoiseMark'

type Kind = 'single' | 'multi'
interface Opt { id: string; label: React.ReactNode }
interface QStep {
  key: string
  step: number
  title: string
  sub: string
  kind: Kind
  full?: boolean
  options: Opt[]
  initial: string[]
}

const chip = (src: string, label: string) => (
  <span className="su-chip-logo"><span className="lg"><img src={src} alt="" /></span>{label}</span>
)

const QUESTIONS: QStep[] = [
  {
    key: 'channels', step: 2, title: 'Which apps do you communicate through?',
    sub: "Pick all that apply — we'll prioritize connecting these first.", kind: 'multi', initial: ['gmail', 'slack', 'telegram'],
    options: [
      { id: 'gmail', label: chip(LOGOS.gmail, 'Gmail') },
      { id: 'slack', label: chip(LOGOS.slack, 'Slack') },
      { id: 'teams', label: chip(LOGOS.teams, 'Teams') },
      { id: 'telegram', label: chip(LOGOS.telegram, 'Telegram') },
      { id: 'salesforce', label: chip(LOGOS.salesforce, 'Salesforce') },
      { id: 'else', label: '+ Something else' },
    ],
  },
  {
    key: 'team', step: 3, title: 'How big is your team?',
    sub: 'This helps us tune what Noise surfaces — from solo founder to enterprise.', kind: 'single', initial: ['2-10'],
    options: [
      { id: 'me', label: 'Just me' }, { id: '2-10', label: '2–10' }, { id: '11-50', label: '11–50' },
      { id: '51-200', label: '51–200' }, { id: '201-1k', label: '201–1,000' }, { id: '1k', label: '1,000+' },
    ],
  },
  {
    key: 'location', step: 4, title: 'Where are you based?',
    sub: 'Helps with time zones, scheduling and regional defaults.', kind: 'single', full: true, initial: ['uk'],
    options: [
      { id: 'uk', label: '🇬🇧  United Kingdom' }, { id: 'us', label: '🇺🇸  United States' },
      { id: 'eu', label: '🇪🇺  Europe' }, { id: 'other', label: '🌍  Somewhere else' },
    ],
  },
  {
    key: 'role', step: 5, title: 'What best describes you?',
    sub: 'So Noise leads with what matters to your day.', kind: 'single', initial: ['founder'],
    options: [
      { id: 'founder', label: 'Founder / CEO' }, { id: 'sales', label: 'Sales / AM' },
      { id: 'cs', label: 'Customer success' }, { id: 'ops', label: 'Ops / Chief of staff' },
      { id: 'mgr', label: 'Manager / Lead' }, { id: 'else', label: 'Something else' },
    ],
  },
  {
    key: 'priorities', step: 6, title: 'What should Noise watch for you?',
    sub: 'Pick your priorities — you can change these anytime.', kind: 'multi', initial: ['replies', 'promises', 'keyperson'],
    options: [
      { id: 'replies', label: 'Replies I owe' }, { id: 'promises', label: 'Promises & deadlines' },
      { id: 'cold', label: 'Relationships going cold' }, { id: 'invoices', label: 'Overdue invoices' },
      { id: 'keyperson', label: 'Key-person risk' }, { id: 'decisions', label: 'Decisions & history' },
    ],
  },
]

const BUILD_LINES = [
  'Reading your recent messages…',
  'Mapping the people you talk to…',
  'Spotting promises and deadlines…',
  'Building your first briefing…',
]
const check = <svg viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" /></svg>
const TOTAL = 7 // welcome + 5 questions + connect

// Shown at the OAuth step — the moment a user weighs handing over their inbox.
// Answers "what happens when I connect?" before they have to wonder.
const TRUST_POINTS: [string, string][] = [
  ['Read-only to understand.', 'Noise reads to build your memory — it never sends, deletes or posts without your explicit approval.'],
  ['Yours alone.', 'Your data is encrypted, scoped to your team, never sold and never used to train public models.'],
  ['Leaves when you do.', 'Disconnect in one click and your data is purged. No lock-in, no hostage knowledge.'],
]

export default function SignupFlow({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()
  // phase: 0 welcome | 1..5 questions | 6 connect | 7 building | 8 done
  const [phase, setPhase] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>(
    Object.fromEntries(QUESTIONS.map((q) => [q.key, q.initial])),
  )
  const [buildDone, setBuildDone] = useState(-1)
  const [buildSpin, setBuildSpin] = useState(-1)

  // reset when reopened
  useEffect(() => {
    if (open) { setPhase(0); setBuildDone(-1); setBuildSpin(-1) }
  }, [open])

  // ESC to close + lock body scroll
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  // building animation, then auto-advance to done
  useEffect(() => {
    if (phase !== 7) return
    if (reduce) { setBuildDone(BUILD_LINES.length); const t = setTimeout(() => setPhase(8), 600); return () => clearTimeout(t) }
    const timers: number[] = []
    BUILD_LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setBuildSpin(i), i * 850))
      timers.push(window.setTimeout(() => { setBuildSpin(-1); setBuildDone(i) }, i * 850 + 650))
    })
    timers.push(window.setTimeout(() => setPhase(8), BUILD_LINES.length * 850 + 500))
    return () => timers.forEach(clearTimeout)
  }, [phase, reduce])

  function toggle(key: string, id: string, kind: Kind) {
    setAnswers((a) => {
      const cur = a[key] || []
      if (kind === 'single') return { ...a, [key]: [id] }
      return { ...a, [key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] }
    })
  }

  const progress =
    phase === 0 ? 8
    : phase <= 5 ? 8 + (phase / 6) * 92
    : 100

  function renderInner() {
    // WELCOME
    if (phase === 0) {
      return (
        <Slide k="welcome">
          <div className="su-step">Step 1 of {TOTAL}</div>
          <h3 style={{ marginTop: 14 }}>Welcome to Noise.</h3>
          <p className="su-sub">A few quick questions so we can shape Noise around how you actually work. Takes about a minute.</p>
          <div className="su-opts">
            <button className="su-opt full" onClick={() => setPhase(6)} style={{ color: 'var(--t3)' }}>Skip setup, just connect my email →</button>
          </div>
          <div className="su-foot">
            <button className="btn btn-glass btn-glass-accent" onClick={() => setPhase(1)}>Let's go {Icon.arrow}</button>
          </div>
        </Slide>
      )
    }
    // QUESTIONS (phase 1..5)
    if (phase >= 1 && phase <= 5) {
      const q = QUESTIONS[phase - 1]
      const sel = answers[q.key] || []
      return (
        <Slide k={q.key}>
          <div className="su-step">Step {q.step} of {TOTAL} · {q.title.split(' ')[0]}</div>
          <h3 style={{ marginTop: 14 }}>{q.title}</h3>
          <p className="su-sub">{q.sub}</p>
          <div className="su-opts">
            {q.options.map((o) => (
              <button
                key={o.id}
                className={'su-opt' + (q.full ? ' full' : '') + (sel.includes(o.id) ? ' sel' : '')}
                onClick={() => toggle(q.key, o.id, q.kind)}
                type="button"
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="su-foot">
            <button className="su-skip" onClick={() => setPhase(phase + 1)}>Skip</button>
            <button className="btn btn-glass btn-glass-accent" onClick={() => setPhase(phase + 1)}>Continue</button>
          </div>
        </Slide>
      )
    }
    // CONNECT
    if (phase === 6) {
      return (
        <Slide k="connect">
          <div className="su-step">Step {TOTAL} of {TOTAL} · Connect</div>
          <h3 style={{ marginTop: 14 }}>Now connect your email.</h3>
          <p className="su-sub">This is where it gets to work — reading what matters, mapping who you talk to, and spotting your open promises.</p>
          <ul className="su-trust">
            {TRUST_POINTS.map(([head, body]) => (
              <li key={head}><span className="st-ic">{Icon.checkCircle}</span><span><b>{head}</b> {body}</span></li>
            ))}
          </ul>
          <div className="su-oauth">
            <button className="su-oauth-btn" onClick={() => setPhase(7)}>{GoogleMark}Continue with Google</button>
            <button className="su-oauth-btn ms" onClick={() => setPhase(7)}>{MicrosoftMark}Continue with Microsoft</button>
          </div>
          <div className="su-secure">{Icon.lock} Encrypted in transit &amp; at rest · revoke access in one click, anytime</div>
        </Slide>
      )
    }
    // BUILDING
    if (phase === 7) {
      return (
        <Slide k="building">
          <div className="su-center su-build">
            <div className="bb-orb" />
            <div style={{ textAlign: 'center', marginBottom: 18 }}><h3 style={{ margin: 0 }}>Building your brain…</h3></div>
            {BUILD_LINES.map((l, i) => (
              <div className={'bb-line' + (i <= buildDone ? ' done' : '')} key={i}>
                {buildSpin === i ? <span className="bb-sp" /> : <span className="bb-ck">{check}</span>}
                {l}
              </div>
            ))}
          </div>
        </Slide>
      )
    }
    // DONE
    return (
      <Slide k="done">
        <div className="su-center su-done">
          <div className="su-done-orb" />
          <h3>Your brain is ready.</h3>
          <p>Your first founder brief is waiting — what changed, what's at risk, and exactly what to do next.</p>
          <button className="btn btn-glass btn-glass-accent btn-lg" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
            Open your Focus dashboard {Icon.arrow}
          </button>
        </div>
      </Slide>
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="signup-backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            className="signup-card"
            role="dialog" aria-modal="true" aria-label="Sign up for Noise"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <button className="signup-close" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <div className="su-head">
              <div className="su-brand">
                <NoiseMark width={86} height={17} />
                <span className="brand-word">Noise<span className="dot-g">.</span></span>
              </div>
              <div className="su-prog"><i style={{ width: `${progress}%` }} /></div>
            </div>
            <div className="su-body">
              <AnimatePresence mode="wait">{renderInner()}</AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Slide({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <motion.div
      key={k}
      style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
