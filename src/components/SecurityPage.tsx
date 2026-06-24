import { useEffect, useState } from 'react'
import { NoiseMark } from '../lib/NoiseMark'
import { Icon } from '../lib/icons'
import BackTransition from './BackTransition'

/* A real /security page — its own URL, linked from the trust strip + footer.
   Everything here is a product commitment Noise can stand behind. The few
   facts only the team has (compliance status, sub-processors, region, contact)
   are marked [LIKE THIS] — fill them in before launch. */

const PILLARS: [keyof typeof Icon, string, string][] = [
  ['lock', 'OAuth 2.0 only', 'You connect through Google or Microsoft’s own consent screen. Noise never sees or stores your password, and you can revoke access from your provider in one click.'],
  ['checkCircle', 'Read-only to start', 'Noise requests read access to understand your context. It never sends, deletes, archives or posts on your behalf without an explicit action from you.'],
  ['tree', 'Encrypted in transit & at rest', 'All data moves over TLS and is encrypted at rest. Access is scoped to your team — no other customer, and no Noise employee, browses your content.'],
  ['person', 'You own your data', 'Your communication history is yours. It is never sold, never shared, and never used to train public or third-party foundation models. Disconnect and it is purged.'],
]

const DOES = [
  'Reads recent messages, files and calendar events to build your private memory',
  'Resolves people, companies, promises and deadlines into a graph only your team can see',
  'Drafts replies and briefs that wait for your approval',
  'Lets you export or delete everything, anytime',
]
const DOESNT = [
  'Send, reply, delete or post anything without your explicit click',
  'Sell, rent or share your data with advertisers or third parties',
  'Train public or shared AI models on your content',
  'Keep your data after you disconnect',
]

const LIFECYCLE: [string, string][] = [
  ['You connect', 'Through Google/Microsoft OAuth. Read-only scopes, no password stored.'],
  ['Noise processes', 'Content is encrypted and indexed into memory scoped to your team alone.'],
  ['You stay in control', 'Every outbound action waits for your approval. Audit any insight to its source.'],
  ['You disconnect', 'Revoke in one click. Your data is deleted — no lock-in, no hostage knowledge.'],
]

export default function SecurityPage() {
  const [leaving, setLeaving] = useState(false)
  // Intercept any "back to site" link and play the 3D pixel-scan reveal first,
  // instead of jumping straight to the homepage and replaying its first-load intro.
  const back = (e: React.MouseEvent) => { e.preventDefault(); setLeaving(true) }

  // Warm the (lazy) 3D chunk while the page is idle so the reveal starts the
  // instant you click "back to site" — no black load gap.
  useEffect(() => {
    const warm = () => { import('./BackTransition'); import('./PixelScanLogo') }
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
    const id = ric ? ric(warm) : window.setTimeout(warm, 1200)
    return () => { const cic = (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback; if (cic) cic(id); else clearTimeout(id) }
  }, [])

  return (
    <div className="secpage">
      {leaving && <BackTransition to="/" />}
      <header className="secpage-nav">
        <div className="wrap secpage-nav-inner">
          <a className="brand" href="/" aria-label="Noise home">
            <NoiseMark width={94} height={19} />
            <span className="brand-word">Noise<span className="dot-g">.</span></span>
          </a>
          <a className="btn btn-glass" href="/" onClick={back} style={{ padding: '10px 18px', fontSize: 14 }}>← Back to site</a>
        </div>
      </header>

      <main className="wrap secpage-body">
        <span className="kicker">Security &amp; privacy</span>
        <h1 className="secpage-h1">You’re trusting Noise with your<br />communication history. Here’s how we earn it.</h1>
        <p className="lead">Noise is built on one principle: your data is yours, and you stay in control of it at every step. No dark patterns, no quiet data-sharing, no training on your content.</p>

        <div className="sec-pillars">
          {PILLARS.map(([ic, h, p]) => (
            <div className="sec-pillar" key={h}>
              <span className="sp-ic">{Icon[ic]}</span>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>

        <div className="sec-dd">
          <div className="sec-dd-col does">
            <h2 className="sec-h2">What Noise does</h2>
            <ul>{DOES.map((d) => <li key={d}><span className="dd-mark ok">{Icon.check}</span>{d}</li>)}</ul>
          </div>
          <div className="sec-dd-col dont">
            <h2 className="sec-h2">What Noise never does</h2>
            <ul>{DOESNT.map((d) => <li key={d}><span className="dd-mark no">✕</span>{d}</li>)}</ul>
          </div>
        </div>

        <h2 className="sec-h2 center">The life of your data</h2>
        <div className="sec-life">
          {LIFECYCLE.map(([h, p], i) => (
            <div className="sec-life-step" key={h}>
              <div className="sl-n">{i + 1}</div>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>

        <div className="sec-compliance">
          <h2 className="sec-h2">Compliance &amp; infrastructure</h2>
          <p className="lead" style={{ marginBottom: 20 }}>
            We design to GDPR principles — lawful basis, data minimisation, and the right to erasure are built in, not bolted on.
          </p>
          <div className="sec-facts">
            <div className="sec-fact"><span className="sf-k">Certifications</span><span className="sf-v">[Add current status — e.g. “SOC 2 Type II in progress”. Don’t claim a cert you don’t hold.]</span></div>
            <div className="sec-fact"><span className="sf-k">Data residency</span><span className="sf-v">[Add region — e.g. “Hosted in the EU / on AWS eu-west-1”]</span></div>
            <div className="sec-fact"><span className="sf-k">Sub-processors</span><span className="sf-v">[List your cloud host, model providers, and any vendors that touch data]</span></div>
            <div className="sec-fact"><span className="sf-k">Security contact</span><span className="sf-v">[security@yourdomain.com]</span></div>
          </div>
        </div>

        <div className="sec-cta">
          <h2 className="sec-h2">Questions before you connect?</h2>
          <p className="lead">Security reviews welcome. We’ll walk your team through scopes, storage and deletion in detail.</p>
          <a className="btn btn-glass btn-glass-accent btn-lg" href="/" onClick={back}>Back to Noise {Icon.arrow}</a>
        </div>
      </main>
    </div>
  )
}
