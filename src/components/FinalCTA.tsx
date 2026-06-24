import { Reveal } from '../lib/Reveal'
import { Icon } from '../lib/icons'

export default function FinalCTA({ onSignup }: { onSignup: () => void }) {
  return (
    <section className="final" id="connect">
      <div className="final-glow" />
      <div className="wrap final-inner">
        <Reveal><div className="final-orb" /></Reveal>
        <Reveal delay={0.08}><h2>Meet your brain in 60 seconds.</h2></Reveal>
        <Reveal delay={0.16}>
          <p className="lead">Connect your email and Noise reads, maps and builds your first brief automatically — before your coffee's cold.</p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="final-cta">
            <button className="btn btn-glass btn-glass-accent btn-lg" onClick={onSignup}>Connect your email {Icon.arrow}</button>
            <a className="btn btn-glass btn-lg" href="#how">See how it works</a>
          </div>
        </Reveal>
        <Reveal delay={0.32}>
          <div className="hero-micro" style={{ justifyContent: 'center', marginTop: 26 }}>
            <span>{Icon.lock} Read-only to start</span>
            <span>{Icon.checkCircle} You approve every send</span>
            <span>{Icon.checkCircle} Revoke access anytime</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
