import { useEffect, useState } from 'react'
import { NoiseMark } from '../lib/NoiseMark'

const LINKS = [
  ['#channels', 'Channels'],
  ['#memory', 'Memory'],
  ['#intelligence', 'Intelligence'],
  ['#how', 'How it works'],
  ['#trust', 'Trust'],
]

export default function Nav({ onSignup }: { onSignup: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={'nav' + (scrolled ? ' scrolled' : '')}>
      <div className="nav-inner">
        <a className="brand" href="#top" aria-label="Noise home">
          <NoiseMark width={94} height={19} />
          <span className="brand-word">Noise<span className="dot-g">.</span></span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <div className="nav-cta">
          <a className="btn btn-glass nav-signin" href="#" style={{ padding: '10px 18px', fontSize: 14 }}>Sign in</a>
          <button className="btn btn-glass btn-glass-accent" style={{ padding: '11px 20px', fontSize: 14 }} onClick={onSignup}>Sign up</button>
          <button className="nav-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </div>
      <div className={'nav-mobile' + (open ? ' open' : '')}>
        {LINKS.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a href="#" onClick={(e) => { e.preventDefault(); setOpen(false); onSignup() }}>Sign up →</a>
      </div>
    </header>
  )
}
