import { useId } from 'react'

/** The Noise mark: a decaying waveform on the left (the noise) that resolves
 *  into a single steady gradient line on the right (the signal).
 *  The left bars gently wave; the right line stays perfectly steady. */
const BARS = [
  { x: 5, y: 4, h: 52 },
  { x: 22, y: 14.5, h: 31 },
  { x: 39, y: 8, h: 44 },
  { x: 56, y: 20, h: 20 },
  { x: 73, y: 16, h: 28 },
  { x: 90, y: 24, h: 12 },
  { x: 107, y: 22, h: 16 },
  { x: 124, y: 27, h: 6 },
]

export function NoiseMark({
  width = 90,
  height = 18,
  className,
  animated = true,
}: {
  width?: number
  height?: number
  className?: string
  animated?: boolean
}) {
  const gid = 'noiseSig-' + useId().replace(/:/g, '')
  return (
    <svg
      className={'noise-mark' + (animated ? ' anim' : '') + (className ? ' ' + className : '')}
      width={width}
      height={height}
      viewBox="0 0 300 60"
      fill="none"
      role="img"
      aria-label="Noise"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5B8CFF" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <g fill="#5B8CFF">
        {BARS.map((b, i) => (
          <rect key={i} className="nm-bar" x={b.x} y={b.y} width="6" height={b.h} rx="3" style={{ animationDelay: `${(i * 0.11).toFixed(2)}s` }} />
        ))}
      </g>
      <rect x="150" y="27" width="138" height="6" rx="3" fill={`url(#${gid})`} />
    </svg>
  )
}
