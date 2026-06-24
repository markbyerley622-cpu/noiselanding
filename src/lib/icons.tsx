/** Line icons — rounded, 1.6–1.9px stroke, stroked in purple-400 by context CSS.
 *  Kept inline + minimal to match the Noise design system iconography. */
import type { ReactNode } from 'react'

const I = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none">{children}</svg>
)

export const Icon = {
  arrow: (
    <svg className="arr" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  search: <I><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></I>,
  file: <I><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></I>,
  mail: <I><path d="M4 5h16v12H4z" /><path d="M4 7l8 5 8-5" /></I>,
  cal: <I><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></I>,
  chat: <I><path d="M5 5h14v10H9l-4 4z" /></I>,
  check: <I><path d="M4 12l5 5L20 6" /></I>,
  checkCircle: <I><path d="M12 2a10 10 0 1 0 .01 0M8 12l3 3 5-6" /></I>,
  lock: <I><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></I>,
  graph: (
    <I>
      <circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="7" r="2.5" /><circle cx="12" cy="18" r="2.5" />
      <path d="M8 7l8 0M7.5 8.3l3.5 7.5M16.5 9l-3.5 6.5" />
    </I>
  ),
  trend: <I><path d="M3 17l5-6 4 4 5-8 4 6" /></I>,
  pulse: <I><path d="M3 12h4l3 8 4-16 3 8h4" /></I>,
  person: <I><circle cx="12" cy="8" r="3.2" /><path d="M5 20a7 7 0 0 1 14 0" /><path d="M19 5l1.5 1.5L23 4" /></I>,
  people: <I><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M17 8h4M19 6v4" /></I>,
  list: <I><path d="M4 6h16M4 12h10M4 18h7" /></I>,
  pen: <I><path d="M12 19l7-7-3-3-7 7v3z" /><path d="M16 5l3 3" /></I>,
  brief: <I><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 9h8M8 13h6M8 17h4" /></I>,
  clock: <I><path d="M12 2a10 10 0 1 0 .01 0M12 7v5l3 2" /></I>,
  contract: <I><path d="M7 3h7l5 5v13H7z" /></I>,
  tree: <I><path d="M12 3v18M5 8l7-5 7 5" /></I>,
  lines3: <I><path d="M4 7h16M4 12h16M4 17h10" /></I>,
}

export const GoogleMark = (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M21.6 12.2c0-.6 0-1.2-.2-1.8H12v3.4h5.4c-.2 1.2-.9 2.3-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.1z" />
    <path fill="#34A853" d="M12 22c2.7 0 5-1 6.6-2.7l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6C4.7 19.8 8.1 22 12 22z" />
    <path fill="#FBBC05" d="M6.4 13.6c-.2-.6-.3-1.2-.3-1.6s.1-1 .3-1.6V7.8H3.1C2.4 9.1 2 10.5 2 12s.4 2.9 1.1 4.2l3.3-2.6z" />
    <path fill="#EA4335" d="M12 6.4c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 3.5 14.7 2.6 12 2.6 8.1 2.6 4.7 4.8 3.1 8l3.3 2.6C7.2 8.2 9.4 6.4 12 6.4z" />
  </svg>
)

export const MicrosoftMark = (
  <svg width="15" height="15" viewBox="0 0 24 24">
    <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" />
    <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" />
    <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
    <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" />
  </svg>
)

/** The waveform wordmark glyph used in nav + footer. */
export const Waveform = () => (
  <span className="wave" aria-hidden="true">
    <i style={{ height: 8 }} /><i style={{ height: 15 }} /><i style={{ height: 22 }} />
    <i style={{ height: 12 }} /><i style={{ height: 6 }} />
  </span>
)
