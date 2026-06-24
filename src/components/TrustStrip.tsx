import { Icon } from '../lib/icons'

const SIGNALS: [keyof typeof Icon, string][] = [
  ['lock', 'OAuth 2.0 — no passwords'],
  ['checkCircle', 'Read-only to start'],
  ['tree', 'Encrypted in transit & at rest'],
  ['person', 'You own your data'],
]

export default function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="wrap">
        {SIGNALS.map(([ic, label]) => (
          <span className="ts-sig" key={label}>{Icon[ic]}{label}</span>
        ))}
        <a className="ts-link" href="/security">How we handle your data {Icon.arrow}</a>
      </div>
    </div>
  )
}
