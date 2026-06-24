import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import IntroOverlay from './components/IntroOverlay'
import Nav from './components/Nav'
import Hero from './components/Hero'
import TrustStrip from './components/TrustStrip'
import ChannelNetwork from './components/ChannelNetwork'
import Problem from './components/Problem'
import MemoryDemo from './components/MemoryDemo'
import Intelligence from './components/Intelligence'
import ActionLayer from './components/ActionLayer'
import Moat from './components/Moat'
import HowItWorks from './components/HowItWorks'
import Trust from './components/Trust'
import Calendar from './components/Calendar'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import SignupFlow from './components/SignupFlow'

export default function App() {
  const [signup, setSignup] = useState(false)
  const openSignup = () => setSignup(true)

  // First-visit cinematic intro — plays once in production. In dev it always
  // plays so it's easy to iterate on. Add ?intro to force it anywhere; add
  // ?nointro to skip it in dev.
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.has('nointro')) return false
      if (params.has('intro')) return true
      if (import.meta.env.DEV) return true
      return !localStorage.getItem('noise_intro_v1')
    } catch { return true }
  })
  const finishIntro = () => {
    try { localStorage.setItem('noise_intro_v1', '1') } catch { /* ignore */ }
    setShowIntro(false)
  }
  // Offset in-page anchor scrolling for the fixed nav.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href')!
      if (id.length < 2) return
      const t = document.querySelector(id)
      if (!t) return
      e.preventDefault()
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: reduce ? 'auto' : 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      <Nav onSignup={openSignup} />
      <main>
        <Hero onSignup={openSignup} />
        <TrustStrip />
        <Problem />
        <ChannelNetwork />
        <MemoryDemo onSignup={openSignup} />
        <Intelligence />
        <ActionLayer />
        <Moat onSignup={openSignup} />
        <Trust />
        <Calendar />
        <HowItWorks />
        <FinalCTA onSignup={openSignup} />
      </main>
      <Footer />
      <SignupFlow open={signup} onClose={() => setSignup(false)} />
      <AnimatePresence>
        {showIntro && <IntroOverlay key="intro" onDone={finishIntro} />}
      </AnimatePresence>
    </>
  )
}
