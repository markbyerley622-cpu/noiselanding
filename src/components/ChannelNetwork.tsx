import { Reveal } from '../lib/Reveal'
import { NETWORK_NODES, ALL_CHANNELS } from '../data/site'

const VB = 560
const C = VB / 2
const R = 214

export default function ChannelNetwork() {
  const nodes = NETWORK_NODES.map((n, i) => {
    const ang = (i / NETWORK_NODES.length) * Math.PI * 2 - Math.PI / 2
    return {
      ...n,
      ang,
      // percent position for the DOM node
      left: 50 + Math.cos(ang) * (R / (VB / 100)),
      top: 50 + Math.sin(ang) * (R / (VB / 100)),
      // absolute coords for the SVG line
      x: C + Math.cos(ang) * R,
      y: C + Math.sin(ang) * R,
    }
  })

  return (
    <section className="band" id="channels">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal><span className="kicker center">01 — The integration layer</span></Reveal>
          <Reveal delay={0.08}><h2>Every channel. One foundation.</h2></Reveal>
          <Reveal delay={0.16}>
            <p className="lead">
              Noise plugs into everywhere you communicate and pulls it all into a single model. This isn't about reading your messages in one list — it's the substrate that makes everything above it possible. Add a new channel and it instantly inherits your full memory, health scoring and actions.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="net">
          <div className="net-rings">
            <div className="net-ring" style={{ width: 300, height: 300 }} />
            <div className="net-ring" style={{ width: 480, height: 480 }} />
          </div>
          <svg className="net-svg" viewBox={`0 0 ${VB} ${VB}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <linearGradient id="netgrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#3BA0FF" /><stop offset="1" stopColor="#D946EF" />
              </linearGradient>
            </defs>
            {nodes.map((n, i) => (
              <line key={'l' + i} x1={C} y1={C} x2={n.x} y2={n.y} />
            ))}
            {nodes.map((n, i) => (
              <line key={'p' + i} className="pulse" x1={C} y1={C} x2={n.x} y2={n.y} style={{ animationDelay: `${i * 0.28}s` }} />
            ))}
          </svg>
          <div className="net-core"><span>Noise</span></div>
          <div className="net-orbit-mask">
            <div className="net-orbit">
              {nodes.map((n, i) => (
                <div className="node-wrap" key={n.name} style={{ left: `${n.left}%`, top: `${n.top}%` }}>
                  <div className="node" title={n.name} style={{ animationDelay: `${(i * 0.26).toFixed(2)}s` }}>
                    <img src={n.src} alt={`${n.name} logo`} loading="lazy" style={{ width: `${(n.scale ?? 0.6) * 100}%`, height: `${(n.scale ?? 0.6) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <p className="net-cap eyebrow" style={{ textAlign: 'center', marginTop: 44, color: 'var(--p400)' }}>
            More than a unified inbox.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="chan-list">
            {ALL_CHANNELS.map((c) => <span className="chan-chip" key={c}>{c}</span>)}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
