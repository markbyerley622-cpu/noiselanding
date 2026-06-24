import { motion, type Variants } from 'framer-motion'
import { Reveal } from '../lib/Reveal'
import { Icon } from '../lib/icons'

const EASE = [0.2, 0.8, 0.2, 1] as const

interface Ev { time: string; title: string; sub: string; dot: string; next?: boolean }
const EVENTS: Ev[] = [
  { time: '9:00', title: 'Team standup', sub: 'Slack huddle', dot: 'var(--t3)' },
  { time: '11:30', title: 'Acme renewal call', sub: 'Google Meet · Sarah @ Acme', dot: 'var(--p400)', next: true },
  { time: '14:00', title: '1:1 with Maria', sub: 'In person', dot: 'var(--ok)' },
  { time: '16:00', title: 'Northwind demo', sub: 'Zoom', dot: 'var(--blue)' },
]

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }
const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }
const ctx: Variants = { hidden: { opacity: 0, y: 10, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } } }

function CalEvent({ e }: { e: Ev }) {
  return (
    <motion.div className={'cal-ev' + (e.next ? ' next' : '')} variants={item}>
      <span className="cal-time">{e.time}</span>
      <span className="cal-dot" style={{ background: e.dot }} />
      <div><div className="cal-tt">{e.title}</div><div className="cal-sub">{e.sub}</div></div>
      {e.next && <span className="cal-chip">in 14 min</span>}
    </motion.div>
  )
}

export default function Calendar() {
  return (
    <section className="band" id="calendar">
      <div className="wrap">
        <div className="split">
          <div className="split-copy">
            <Reveal><span className="kicker">07 — The calendar layer</span></Reveal>
            <Reveal delay={0.08}><h2>Walk into every<br />meeting prepared.</h2></Reveal>
            <Reveal delay={0.16}>
              <p className="lead">Noise reads your Google and Outlook calendars and ties every event back to your memory — so the moment a meeting starts, you already know who you're seeing, where things stand, and what you owe them.</p>
            </Reveal>
            <div className="feature-list">
              {[
                [Icon.brief, 'Context before every call', 'The relationship brief surfaces automatically: last touch, open promises, deal status — no prep, no digging.'],
                [Icon.clock, 'Follow-ups that schedule themselves', 'Promises and next steps become calendar holds and reminders, so nothing agreed in the room slips.'],
                [Icon.cal, 'One calendar across accounts', 'Google and Outlook seen as a single timeline — Noise never double-books a relationship.'],
              ].map(([ic, h, p], i) => (
                <Reveal delay={0.12 + i * 0.08} key={i}>
                  <div className="fitem"><span className="fi-ic">{ic as any}</span><div><h3>{h as string}</h3><p>{p as string}</p></div></div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <motion.div className="panel" variants={list} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
              <div className="panel-bar"><div className="dots"><i /><i /><i /></div><span className="pt">noise · calendar</span></div>
              <div className="cal-body">
                <div className="cal-top">
                  <div className="cal-day">Tuesday<span>· 18 March</span></div>
                  <span className="cal-now"><span className="pdot" />Now · 11:16</span>
                </div>
                <div className="cal-list">
                  <CalEvent e={EVENTS[0]} />
                  <CalEvent e={EVENTS[1]} />

                  {/* context Noise prepared for the next meeting */}
                  <motion.div className="cal-ctx" variants={ctx}>
                    <div className="cal-ctx-h"><span className="dot" style={{ background: 'var(--p400)' }} />Noise prepared this</div>
                    <div className="cal-ctx-row">
                      <div className="cal-av">AC</div>
                      <div><div className="cal-name">Acme Corp</div><div className="cal-meta">$144k renewal · Sarah Chen</div></div>
                    </div>
                    <div className="cal-tags">
                      <span className="cal-tag"><span className="d" style={{ background: 'var(--err)' }} />Last reply 9d ago</span>
                      <span className="cal-tag"><span className="d" style={{ background: 'var(--warn)' }} />Renewal in 21d</span>
                      <span className="cal-tag"><span className="d" style={{ background: 'var(--p400)' }} />2 promises due</span>
                    </div>
                    <div className="cal-prep">{Icon.brief} Brief &amp; draft agenda ready</div>
                  </motion.div>

                  <CalEvent e={EVENTS[2]} />
                  <CalEvent e={EVENTS[3]} />
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>

        <Reveal>
          <p className="eyebrow" style={{ textAlign: 'center', marginTop: 44, color: 'var(--p400)' }}>
            More than a unified inbox. The foundation for something smarter.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
