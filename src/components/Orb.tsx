import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LOGOS } from '../data/site'
import { Icon } from '../lib/icons'
import { PdfIcon, DocxIcon } from '../lib/DocIcons'
import CalendarStage from './CalendarStage'
import OpenFocus from './OpenFocus'
import DesktopApp from './DesktopApp'

/* THE ORB — a single persistent object that evolves as the story scrolls.
   It is purely a function of `stage` (0..8). Earlier layers fade to a quiet
   substrate; the current beat's signature element is the focal point. The core
   brightens and grows as more flows in, so accumulation is felt, not crowded. */

const EASE = [0.2, 0.8, 0.2, 1] as const

const RING = [
  { name: 'Gmail', src: LOGOS.gmail },
  { name: 'Outlook', src: LOGOS.outlook },
  { name: 'Slack', src: LOGOS.slack },
  { name: 'Teams', src: LOGOS.teams, scale: 0.82 },
  { name: 'Telegram', src: LOGOS.telegram, scale: 1 },
  { name: 'WhatsApp', src: LOGOS.whatsapp, scale: 0.7 },
  { name: 'Salesforce', src: LOGOS.salesforce },
  { name: 'Google Drive', src: LOGOS.drive, scale: 0.8 },
  { name: 'Dropbox', src: LOGOS.dropbox },
  { name: 'Google Calendar', src: LOGOS.gcal },
  { name: 'Outlook Calendar', src: LOGOS.ocal },
  { name: 'Google Meet', src: LOGOS.meet, scale: 0.72 },
  { name: 'Zoom', src: LOGOS.zoom, scale: 0.78 },
]

// entity chips that crystallise out of absorbed files
const ENTITIES = [
  { t: 'Acme Corp', a: -120, r: 220 },
  { t: 'Sarah Chen', a: -40, r: 244 },
  { t: 'MSA · signed', a: 36, r: 220 },
  { t: 'Renewal · $144k', a: 110, r: 240 },
  { t: 'Q3 pipeline', a: 168, r: 222 },
  { t: 'Promises · 2', a: -170, r: 236 },
]

// relationship nodes — last one is the at-risk account
const RELS = [
  { id: 'NW', a: -110, tone: 'ok' as const },
  { id: 'GX', a: -20, tone: 'ok' as const },
  { id: 'BL', a: 70, tone: 'warn' as const },
  { id: 'AC', a: 160, tone: 'risk' as const },
]

// everything that flows into memory — all Acme-related, so it pays off at the
// Intelligence stage ("oh — it actually remembered those things")
const FILES: { name: string; icon: ReactNode }[] = [
  { name: 'Acme_MSA.pdf', icon: PdfIcon },
  { name: 'Sarah_Notes.docx', icon: DocxIcon },
  { name: 'Renewal_Email.eml', icon: <img src={LOGOS.gmail} alt="" /> },
  { name: 'Invoice_144k.pdf', icon: PdfIcon },
  { name: 'Acme · #deal', icon: <img src={LOGOS.slack} alt="" /> },
  { name: 'Sarah · WhatsApp', icon: <img src={LOGOS.whatsapp} alt="" /> },
]

const polar = (a: number, r: number) => {
  const rad = (a * Math.PI) / 180
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r }
}

export default function Orb({ stage, reduce }: { stage: number; reduce: boolean }) {
  // beats: 0 hero · 1 connect · 2 memory · 3 focus · 4 intelligence ·
  //        5 moat · 6 trust · 7 calendar · 8 dashboard · 9 final
  const risk = stage === 4
  const transparent = stage === 6
  const dashboard = stage === 8 // show the cockpit — the "see everything" payoff
  const focusing = stage === 3 // Open Focus — orb glides to the top-left
  const operating = stage === 7 // calendar — orb moves to the upper-right corner
  const leftAside = dashboard || focusing
  const offset = leftAside || operating
  // core scales / brightens as the brain fills
  const fill = Math.min(stage, 9) / 9

  // viewport size, so the orb can glide to the upper-right quadrant on cue
  const [vp, setVp] = useState(() => ({
    w: typeof window === 'undefined' ? 1280 : window.innerWidth,
    h: typeof window === 'undefined' ? 800 : window.innerHeight,
  }))
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  const hero = stage === 0 // opening — orb + channels nestle to the lower-left, clear of the headline
  const connect = stage === 1 // Connect — bright ring + connecting lines
  const orbX = hero ? -vp.w * 0.22 : leftAside ? -vp.w * 0.28 : operating ? vp.w * 0.2 : 0
  const orbY = hero ? vp.h * 0.1 : offset ? -vp.h * 0.15 : 0
  // ring spins around the orb when it's centred; hidden when the orb steps aside (focus/calendar/dashboard)
  const showRing = hero || connect || stage === 2 || (stage >= 4 && stage <= 6)
  const ringShift = hero ? { transform: `translate(${orbX}px, ${orbY}px)` } : undefined

  const anim = <T,>(el: T): T | undefined => (reduce ? undefined : el)

  return (
    <div className="os-orb-field">
      {/* spinning integration ring — every channel orbits the brain.
          On Connect, lines link each channel into the core. */}
      {showRing && (
        <div className={'os-ring' + (stage <= 1 ? ' live' : ' dim') + (reduce ? ' still' : '')} style={ringShift}>
          <div className="os-ring-rot">
            {connect && (
              <svg className="os-ring-svg" width="600" height="600" viewBox="-300 -300 600 600" aria-hidden="true">
                <defs>
                  <linearGradient id="os-netgrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#3BA0FF" /><stop offset="1" stopColor="#D946EF" />
                  </linearGradient>
                </defs>
                {RING.map((n, i) => {
                  const { x, y } = polar((i / RING.length) * 360 - 90, 236)
                  return <line key={n.name} x1="0" y1="0" x2={x} y2={y} className="os-line" />
                })}
                {RING.map((n, i) => {
                  const { x, y } = polar((i / RING.length) * 360 - 90, 236)
                  return <line key={'p' + n.name} x1="0" y1="0" x2={x} y2={y} className="os-line pulse" style={{ animationDelay: `${i * 0.22}s` }} />
                })}
              </svg>
            )}
            {RING.map((n, i) => {
              const { x, y } = polar((i / RING.length) * 360 - 90, 236)
              return (
                <motion.div
                  className="os-node" key={n.name} title={n.name}
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  initial={anim({ opacity: 0, scale: 0.4 })}
                  animate={{ opacity: stage <= 1 ? 1 : 0.32, scale: 1 }}
                  transition={{ duration: 0.6, ease: EASE, delay: stage <= 1 ? i * 0.05 : 0 }}
                >
                  <span className="os-node-rot"><img src={n.src} alt="" style={{ width: `${(n.scale ?? 0.6) * 100}%` }} /></span>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* THE CORE */}
      <motion.div
        className={'os-orb' + (risk ? ' risk' : '') + (transparent ? ' glass' : '')}
        animate={{ scale: operating ? 0.6 : 0.86 + fill * 0.22, x: orbX, y: orbY }}
        transition={{ duration: 1, ease: EASE }}
      >
        <div className="os-orb-aura" />
        <div className="os-orb-core" />
        <div className="os-orb-sheen" />
        {transparent && (
          <div className="os-glass-inner">
            <span>Messages</span><span>Files</span><span>Signals</span><span>Scores</span>
          </div>
        )}
      </motion.div>

      {/* ── per-stage signature overlays ── */}
      <AnimatePresence mode="popLayout">
        {/* DASHBOARD — the "see everything" payoff, last */}
        {stage === 8 && (
          <motion.div className="os-layer" key="dash" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <div className="os-dash"><DesktopApp dropPane focusView /></div>
          </motion.div>
        )}

        {/* MEMORY — files absorb, entities crystallise */}
        {stage === 2 && (
          <motion.div className="os-layer" key="mem" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            {FILES.map((f, i) => {
              const { x, y } = polar((360 / FILES.length) * i, 260)
              return (
                <motion.span className="os-file" key={f.name}
                  initial={anim({ x, y, opacity: 0, scale: 1 })}
                  animate={anim({ x: 0, y: 0, opacity: [0, 1, 1, 0], scale: 0.4 })}
                  transition={{ duration: 1.6, ease: EASE, delay: i * 0.25, repeat: reduce ? 0 : Infinity, repeatDelay: 1.2 }}
                ><span className="os-file-ic">{f.icon}</span>{f.name}</motion.span>
              )
            })}
            {ENTITIES.map((e, i) => {
              const { x, y } = polar(e.a, e.r)
              return (
                <motion.span className="os-entity" key={e.t} style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  initial={anim({ opacity: 0, scale: 0.6 })} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.4 + i * 0.08 }}
                >{e.t}</motion.span>
              )
            })}
          </motion.div>
        )}

        {/* INTELLIGENCE — relationship graph, one node turns red */}
        {stage === 4 && (
          <motion.div className="os-layer" key="intel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <svg className="os-rel-svg" viewBox="-300 -300 600 600" aria-hidden="true">
              {RELS.map((n) => {
                const { x, y } = polar(n.a, 210)
                return <line key={n.id} x1="0" y1="0" x2={x} y2={y} className={'os-rel-line ' + n.tone} />
              })}
            </svg>
            {RELS.map((n, i) => {
              const { x, y } = polar(n.a, 210)
              return (
                <motion.span className={'os-rel ' + n.tone} key={n.id} style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  initial={anim({ opacity: 0, scale: 0.5 })} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                >{n.id}</motion.span>
              )
            })}
            <motion.span className="os-risk-tag" initial={anim({ opacity: 0, y: 8 })} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              Acme Corp · <b>76 / 100</b> · cooling
            </motion.span>
          </motion.div>
        )}

        {/* OPEN FOCUS — one feed of what needs you, cleared in place */}
        {stage === 3 && (
          <motion.div className="os-layer" key="focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <OpenFocus reduce={reduce} />
          </motion.div>
        )}

        {/* MOAT — a person fades, knowledge stays */}
        {stage === 5 && (
          <motion.div className="os-layer" key="moat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <motion.span className="os-person leaving"
              initial={anim({ opacity: 1, x: 0 })}
              animate={anim({ opacity: 0.15, x: -90, filter: 'grayscale(1)' })}
              transition={{ duration: 1.6, ease: EASE, delay: 0.4 }}
              style={{ left: 'calc(50% - 150px)', top: '50%' }}
            >MR</motion.span>
            <motion.span className="os-leave-tag" style={{ left: 'calc(50% - 150px)', top: 'calc(50% + 42px)' }}
              initial={anim({ opacity: 0 })} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>left the company</motion.span>
            {['Relationships', 'Documents', 'History', 'Context'].map((k, i) => {
              const { x, y } = polar(-50 + i * 34, 236)
              return (
                <motion.span className="os-retain" key={k} style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  initial={anim({ opacity: 0, scale: 0.6 })} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.1 }}
                ><span className="dot" />{k}</motion.span>
              )
            })}
          </motion.div>
        )}

        {/* TRUST — the flow that makes a score */}
        {stage === 6 && (
          <motion.div className="os-layer os-flow" key="trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            {['Message activity', 'Business signals', 'Recency · Reciprocity'].map((s, i) => (
              <motion.span className="os-flow-in" key={s}
                initial={anim({ opacity: 0, x: -16 })} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>{s}</motion.span>
            ))}
            <motion.span className="os-flow-score" initial={anim({ opacity: 0, scale: 0.8 })} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>Score 58</motion.span>
            <motion.span className="os-flow-out" initial={anim({ opacity: 0, x: 16 })} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>{Icon.check} Action</motion.span>
          </motion.div>
        )}

        {/* CALENDAR — the orb is now operational: it acts */}
        {stage === 7 && (
          <motion.div className="os-layer" key="cal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <CalendarStage reduce={reduce} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
