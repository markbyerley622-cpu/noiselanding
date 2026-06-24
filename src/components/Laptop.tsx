import { useEffect, useRef, useState } from 'react'
import DesktopApp from './DesktopApp'

/* Final-beat product shot — the front-facing laptop with the real Noise
   "cockpit" dashboard (DesktopApp) composited onto its screen, auto-scaled to
   fill it. (The angled render is skipped — its screen is opaque white.) */

const DESIGN_W = 760 // natural width the deskwin is designed at

export default function Laptop() {
  const screenRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.42)

  useEffect(() => {
    const el = screenRef.current
    if (!el) return
    const update = () => setScale(el.clientWidth / DESIGN_W)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="lp">
      <img className="lp-img" src="/transparent%20laptop%202.png" alt="Noise dashboard on a laptop" />
      <div className="lp-screen" ref={screenRef}>
        <div className="lp-app" style={{ width: DESIGN_W, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <DesktopApp />
        </div>
      </div>
    </div>
  )
}
