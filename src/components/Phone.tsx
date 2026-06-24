import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { IPHONE } from '../data/site'
import { Icon } from '../lib/icons'

const MiniOrb = () => <div className="miniorb" />

function ScreenFocus() {
  return (
    <div className="scr">
      <div className="s-top">
        <div><div className="s-title">Good morning, Alex</div><div className="s-sub">3 things need you today</div></div>
        <MiniOrb />
      </div>
      <div className="s-kpis">
        <div className="s-kpi hot"><div className="k">Revenue at risk</div><div className="v" style={{ color: '#FFB3BD' }}>$224k</div><div className="d">6 deals · 4d</div></div>
        <div className="s-kpi"><div className="k">Drafts ready</div><div className="v">8</div><div className="d">in your voice</div></div>
      </div>
      <div className="s-feed">
        <div className="s-row"><span className="fd" /><div><div className="ft">Draft ready — Acme renewal</div><div className="fw">Telegram · 12m ago</div></div><span className="s-chip" style={{ color: 'var(--p400)', background: 'var(--accent-weak)' }}>Reply</span></div>
        <div className="s-row"><span className="fd" style={{ background: 'var(--err)' }} /><div><div className="ft">John Smith waiting 2 days</div><div className="fw">Gmail · needs you</div></div><span className="s-chip" style={{ color: '#FFB3BD', background: 'rgba(251,113,133,.16)' }}>At risk</span></div>
        <div className="s-row"><span className="fd" style={{ background: 'var(--ok)' }} /><div><div className="ft">Invoice #2241 paid</div><div className="fw">Stripe · 1h ago</div></div></div>
      </div>
    </div>
  )
}

function ScreenMemory() {
  const rows: [keyof typeof Icon, string, string, string][] = [
    ['file', 'Acme_MSA_signed.pdf', 'Drive · 14 Mar', '98%'],
    ['mail', 'Re: contract terms', 'Gmail thread · 9 msgs', '94%'],
    ['cal', 'Acme kickoff notes', 'Calendar · 18 Mar', '89%'],
  ]
  return (
    <div className="scr">
      <div className="s-top"><div><div className="s-title">Memory</div><div className="s-sub">Ask anything</div></div><MiniOrb /></div>
      <div className="s-search">{Icon.search} the Acme MSA</div>
      {rows.map(([ic, t, s, cf]) => (
        <div className="s-res" key={t}>
          <span className="ic">{Icon[ic]}</span>
          <div><div className="rt">{t}</div><div className="rs">{s}</div></div>
          <span className="cf">{cf}</span>
        </div>
      ))}
    </div>
  )
}

function ScreenBrief() {
  const items: [string, JSX.Element][] = [
    ['var(--err)', <><b>Acme</b> went quiet 9 days — renewal in 21. <b>$144k</b> exposed.</>],
    ['var(--warn)', <>3 promises due today; <b>2 drafts</b> waiting your approval.</>],
    ['var(--ok)', <>Northwind deal heating up — replied in 4m, twice.</>],
    ['var(--p400)', <><b>Maria</b> is sole contact for <b>$310k</b> — log a backup.</>],
  ]
  return (
    <div className="scr">
      <div className="s-top"><div><div className="s-title">Founder brief</div><div className="s-sub">Tue · 60-second read</div></div><MiniOrb /></div>
      <div className="s-brief">
        {items.map(([c, node], i) => (
          <div className="bi" key={i}><span className="bd" style={{ background: c }} /><div>{node}</div></div>
        ))}
      </div>
    </div>
  )
}

const SCREENS = [<ScreenFocus />, <ScreenMemory />, <ScreenBrief />]

export default function Phone() {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((v) => (v + 1) % SCREENS.length), 3600)
    return () => clearInterval(t)
  }, [reduce])

  return (
    <div className="phone">
      <div className="screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {SCREENS[i]}
          </motion.div>
        </AnimatePresence>
      </div>
      <img src={IPHONE} alt="Noise running on iPhone" width={436} height={572} />
    </div>
  )
}
