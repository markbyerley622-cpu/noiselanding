import { useEffect, useState } from 'react'
import { NoiseMark } from '../lib/NoiseMark'

const LINKS = [
  ['#top', 'Story'],
  ['#features', 'Capabilities'],
  ['#faq', 'FAQ'],
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
    <header className={'nav nav-lg' + (scrolled ? ' scrolled' : '')}>
      <div className="nav-inner">
        <a className="brand" href="#top" aria-label="Noise home">
          <NoiseMark width={104} height={21} />
          <span className="brand-word">Noise<span className="dot-g">.</span></span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
        <div className="nav-cta">
          <a className="btn btn-glass nav-signin" href="#">Sign in</a>
          <button className="btn btn-glass btn-glass-accent" onClick={onSignup}>Request access</button>
          <button className="nav-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </div>
      <div className={'nav-mobile' + (open ? ' open' : '')}>
        {LINKS.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a href="#" onClick={(e) => { e.preventDefault(); setOpen(false); onSignup() }}>Request access →</a>
      </div>
    </header>
  )
}
