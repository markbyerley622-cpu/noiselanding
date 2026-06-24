import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import IntroOverlay from './components/IntroOverlay'
import Nav from './components/Nav'
import OrbStory from './components/OrbStory'
import FeatureCards from './components/FeatureCards'
import TrustStrip from './components/TrustStrip'
import Faq from './components/Faq'
import GiantWordmark from './components/GiantWordmark'
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
        <OrbStory onSignup={openSignup} />
        <FeatureCards />
        <TrustStrip />
        <Faq />
        <GiantWordmark />
      </main>
      <Footer />
      <SignupFlow open={signup} onClose={() => setSignup(false)} />
      <AnimatePresence>
        {showIntro && <IntroOverlay key="intro" onDone={finishIntro} />}
      </AnimatePresence>
    </>
  )
}
