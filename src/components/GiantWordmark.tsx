import { Reveal } from '../lib/Reveal'

/* Oversized, very faint brand wordmark — a quiet closing flourish, echoing the
   ghosted KOSH lockup. The stroke fades from invisible at the bottom to a soft
   white at the top, so it reads as a watermark, not a headline. */
export default function GiantWordmark() {
  return (
    <Reveal>
      <div className="giant-wm" aria-hidden="true">
        <span className="giant-wm-text">Noise<span className="giant-wm-dot">.</span></span>
      </div>
    </Reveal>
  )
}
