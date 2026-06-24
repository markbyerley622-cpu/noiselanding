import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '../lib/Reveal'
import { LOGOS } from '../data/site'

/* Telegram + Google Drive ship as JPEGs (baked white background), so they're
   drawn as transparent inline SVGs instead of <img>. */
const TelegramSvg = (
  <svg viewBox="0 0 240 240" role="img" aria-label="Telegram">
    <defs>
      <linearGradient id="tg-grad" x1="120" y1="0" x2="120" y2="240" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#2AABEE" /><stop offset="1" stopColor="#229ED9" />
      </linearGradient>
    </defs>
    <circle cx="120" cy="120" r="120" fill="url(#tg-grad)" />
    <path fill="#fff" d="M54 118.5c35-15.2 58.3-25.3 70-30.2 33.3-13.9 40.2-16.3 44.7-16.4 1 0 3.2.2 4.7 1.4 1.2 1 1.5 2.3 1.7 3.3.2 1 .4 3.1.2 4.8-1.8 19.2-9.7 65.7-13.7 87.2-1.7 9.1-5 12.1-8.2 12.4-7 .6-12.3-4.6-19-9-10.6-6.9-16.5-11.2-26.8-18-11.9-7.8-4.2-12.1 2.6-19.1 1.8-1.8 32.4-29.7 33-32.2.1-.3.1-1.5-.6-2.1-.8-.6-1.7-.4-2.5-.2-1.1.2-18.4 11.7-52.1 34.4-4.9 3.4-9.4 5-13.4 4.9-4.4-.1-12.9-2.5-19.2-4.6-7.7-2.5-13.9-3.8-13.3-8.1.3-2.2 3.4-4.5 9.2-6.9z" />
  </svg>
)

const SlackSvg = (
  <svg viewBox="0 0 122.8 122.8" role="img" aria-label="Slack">
    <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9z" fill="#36C5F0" />
    <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9z" fill="#2EB67D" />
    <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9z" fill="#ECB22E" />
    <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9z" fill="#E01E5A" />
  </svg>
)

const DriveSvg = (
  <svg viewBox="0 0 87.3 78" role="img" aria-label="Google Drive">
    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z" fill="#00ac47" />
    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
  </svg>
)

interface Card { x: number; y: number; name: string; msg: string; logo?: string; svg?: ReactNode; big?: boolean }
const CARDS: Card[] = [
  { x: 3, y: 9, name: 'Slack', svg: SlackSvg, msg: '"can you send the deck before EOD?"' },
  { x: 38, y: 2, name: 'Teams', logo: LOGOS.teams, big: true, msg: '"who owns the Acme renewal now?"' },
  { x: 70, y: 10, name: 'Gmail', logo: LOGOS.gmail, msg: '"re: contract — a few redlines attached"' },
  { x: 16, y: 40, name: 'Google Drive', svg: DriveSvg, big: true, msg: 'Acme_MSA_v4_FINAL.pdf' },
  { x: 72, y: 44, name: 'Salesforce', logo: LOGOS.salesforce, msg: 'Stage: Negotiation · $144,000' },
  { x: 2, y: 66, name: 'Telegram', svg: TelegramSvg, big: true, msg: '"approved! let\'s get it signed 🎉"' },
  { x: 30, y: 74, name: 'Google Calendar', logo: LOGOS.gcal, msg: 'Acme renewal call · Thu 2pm' },
  { x: 72, y: 70, name: 'Outlook', logo: LOGOS.outlook, msg: '"sending over the redlines now"' },
  { x: 52, y: 78, name: 'Dropbox', logo: LOGOS.dropbox, msg: 'Acme_pricing_v3.xlsx' },
  { x: 46, y: 14, name: 'WhatsApp', logo: LOGOS.whatsapp, big: true, msg: '"can we hop on a quick call?"' },
  { x: 8, y: 48, name: 'Messenger', logo: LOGOS.messenger, msg: '"did you see my last message?"' },
  { x: 60, y: 60, name: 'Facebook', logo: LOGOS.facebook, msg: '"left a comment on your post"' },
  { x: 86, y: 26, name: 'Google Meet', logo: LOGOS.meet, msg: '"joining the renewal call now"' },
  { x: 24, y: 20, name: 'Zoom', logo: LOGOS.zoom, msg: 'Recording: Acme QBR · 32 min' },
]

export default function Problem() {
  const [conv, setConv] = useState(false)
  const reduce = useReducedMotion()
  const tRef = useRef<number>()

  return (
    <section className="band tight">
      <div className="wrap">
        <div className="sec-head">
          <Reveal><span className="kicker">The problem</span></Reveal>
          <Reveal delay={0.08}><h2>Your relationships live in 12 apps.<br />Your memory of them lives nowhere.</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="lead">
              Every deal, promise and decision is scattered across inboxes, DMs and threads. Context evaporates the moment you close the tab. And when someone on your team leaves, everything they knew about your customers walks out the door with them. You don't need another inbox — you need something that remembers.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <motion.div
            className="prob-vis"
            viewport={{ amount: 0.4 }}
            onViewportEnter={() => {
              if (reduce) { setConv(true); return }
              clearTimeout(tRef.current)
              tRef.current = window.setTimeout(() => setConv(true), 500)
            }}
            onViewportLeave={() => { clearTimeout(tRef.current); setConv(false) }}
          >
            {CARDS.map((c, i) => {
              const dx = 50 - c.x - 6
              const dy = (44 - c.y) * 1.4
              return (
                <motion.div
                  key={i}
                  className="scatter"
                  style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  animate={conv ? { x: `${dx}%`, y: `${dy}%`, scale: 0.82, opacity: 0.3 } : { x: 0, y: 0, scale: 1, opacity: 1 }}
                  transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <div className="sc-top">
                    <span className={'sc-app' + (c.big ? ' big' : '')}>
                      {c.svg ? c.svg : <img src={c.logo} alt="" />}
                    </span>
                    <span className="sc-name">{c.name}</span>
                  </div>
                  <div className="sc-msg">{c.msg}</div>
                </motion.div>
              )
            })}
            <motion.div className="prob-center" animate={{ opacity: conv ? 1 : 0 }} transition={{ duration: 0.7 }}>
              <div className="pc-orb" /><div className="pc-t">One memory. One brain.</div>
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
