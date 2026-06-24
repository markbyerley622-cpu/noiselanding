import { NoiseMark } from '../lib/NoiseMark'
import { AppStoreBadge, GooglePlayBadge } from '../lib/StoreBadges'

const COLS: [string, [string, string][]][] = [
  ['Product', [['#channels', 'Channels'], ['#memory', 'Memory'], ['#intelligence', 'Intelligence'], ['#how', 'How it works']]],
  ['Company', [['#', 'About'], ['#', 'Careers'], ['/security', 'Security'], ['#', 'Contact']]],
  ['Legal', [['#', 'Privacy'], ['#', 'Terms'], ['#', 'DPA']]],
]

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-inner">
          <div>
            <a className="brand" href="#top"><NoiseMark width={94} height={19} /> <span className="brand-word">Noise<span className="dot-g">.</span></span></a>
            <p className="ft-tag">Turn the noise into signal. The memory and intelligence layer on top of every channel you communicate through.</p>
            <div className="foot-stores">
              <AppStoreBadge />
              <GooglePlayBadge />
            </div>
          </div>
          <div className="foot-cols">
            {COLS.map(([title, links]) => (
              <div className="foot-col" key={title}>
                <h4>{title}</h4>
                {links.map(([href, label], i) => <a href={href} key={i}>{label}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="foot-bottom"><span>© 2026 Noise. All rights reserved.</span><span>Encrypted in transit &amp; at rest · read-only to start · revoke anytime.</span></div>
      </div>
    </footer>
  )
}
