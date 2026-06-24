/* Inline SVG store badges. The brief referenced /figma-assets/footer/*.svg, but
   those files don't exist in /public — so the badges are drawn inline here,
   keeping them crisp at any size with no missing-asset 404s. */

export const AppStoreBadge = () => (
  <a className="store-badge" href="#" aria-label="Download on the App Store">
    <svg width="135" height="44" viewBox="0 0 135 44" role="img">
      <rect x=".5" y=".5" width="134" height="43" rx="9" fill="#000" stroke="rgba(255,255,255,.28)" />
      <path
        fill="#fff"
        d="M30.9 22.6c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9-.7 0-1.9-.9-3.1-.8-1.6 0-3 .9-3.8 2.4-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8zM28.5 15c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2-.5 2.7-1.3z"
      />
      <text x="46" y="17" fill="#fff" fontFamily="Inter,sans-serif" fontSize="8" opacity=".82">Download on the</text>
      <text x="46" y="32" fill="#fff" fontFamily="'Space Grotesk',sans-serif" fontSize="16" fontWeight="600" letterSpacing="-.5">App Store</text>
    </svg>
  </a>
)

export const GooglePlayBadge = () => (
  <a className="store-badge" href="#" aria-label="Get it on Google Play">
    <svg width="135" height="44" viewBox="0 0 135 44" role="img">
      <rect x=".5" y=".5" width="134" height="43" rx="9" fill="#000" stroke="rgba(255,255,255,.28)" />
      <g transform="translate(18 12)">
        <path fill="#00D3FF" d="M.4.3C.2.5 0 .9 0 1.4v17.2c0 .5.2.9.4 1.1L10 10.4z" />
        <path fill="#00F076" d="M13.2 7.2 1.1.2C.8 0 .6 0 .4.3l9.6 10.1z" />
        <path fill="#FFCE00" d="m13.2 13.6 3.6-2.1c1-.6 1-1.5 0-2.1l-3.6-2.1-3.2 3.1z" />
        <path fill="#FF3A44" d="M.4 20.5c.2.3.5.3.8.1l12.1-7-3.3-3.2z" />
      </g>
      <text x="46" y="17" fill="#fff" fontFamily="Inter,sans-serif" fontSize="8" opacity=".82" letterSpacing=".4">GET IT ON</text>
      <text x="46" y="32" fill="#fff" fontFamily="'Space Grotesk',sans-serif" fontSize="16" fontWeight="600" letterSpacing="-.5">Google Play</text>
    </svg>
  </a>
)
