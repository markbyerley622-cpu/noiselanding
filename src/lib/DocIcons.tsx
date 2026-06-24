/* Inline document-type logos (PDF / Excel / Word) — drawn here so the file
   demos use real-looking marks with no missing-asset 404s. Swap to <img> if
   real PNGs are added to /public. */
import type { ReactNode } from 'react'

const Doc = ({ label, color }: { label: string; color: string }) => (
  <svg viewBox="0 0 24 24" role="img" aria-label={label}>
    <path d="M6 2.2h7.5L18 6.7V21a.8.8 0 0 1-.8.8H6a.8.8 0 0 1-.8-.8V3a.8.8 0 0 1 .8-.8Z" fill="#fff" stroke="#cfcfda" strokeWidth=".7" />
    <path d="M13.5 2.2 18 6.7h-3.7a.8.8 0 0 1-.8-.8V2.2Z" fill="#e9e9f0" />
    <rect x="3.4" y="12.6" width="14" height="6.6" rx="1.2" fill={color} />
    <text x="10.4" y="17.6" fontFamily="Inter,Arial,sans-serif" fontSize="4.3" fontWeight="700" fill="#fff" textAnchor="middle">{label}</text>
  </svg>
)

export const PdfIcon: ReactNode = <Doc label="PDF" color="#E2453C" />
export const XlsIcon: ReactNode = <Doc label="XLS" color="#1D6F42" />
export const DocxIcon: ReactNode = <Doc label="DOC" color="#2B579A" />
