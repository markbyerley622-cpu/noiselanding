import { LOGOS } from '../data/site'

/** Desktop "cockpit" mockup.
 *  - `dropPane` adds a far-right empty drop zone with the orb.
 *  - `focusView` swaps the KPI grid for a Morning Brief + Open Focus list.
 *  Hero/final use the plain cockpit; the dashboard beat uses both flags. */
const I = {
  grid: <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>,
  doc: <svg viewBox="0 0 24 24" fill="none"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></svg>,
  people: <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /></svg>,
  gear: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.2-1.8l1.8-1.4-2-3.4-2.1.9A7 7 0 0 0 14 4.2L13.6 2h-3.2L10 4.2a7 7 0 0 0-1.8 1L6.1 4.4l-2 3.4 1.8 1.4A7 7 0 0 0 5 12" /></svg>,
  search: <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>,
}

// white tile so logos with baked (non-transparent) backgrounds still read cleanly
const Logo = ({ src }: { src: string }) => <span className="dk-logo"><img src={src} alt="" /></span>

const CHANNELS: [string, string][] = [
  [LOGOS.gmail, 'Gmail'], [LOGOS.slack, 'Slack'], [LOGOS.telegram, 'Telegram'], [LOGOS.whatsapp, 'WhatsApp'],
]

const FOCUS: { src: string; t: string; w: string; chip: string; tone?: 'risk' }[] = [
  { src: LOGOS.gmail, t: 'Sarah Chen', w: 'Reply · 2 days waiting', chip: 'Reply' },
  { src: LOGOS.telegram, t: 'Approve Acme renewal draft', w: 'Approval', chip: 'Approve' },
  { src: LOGOS.salesforce, t: 'Acme cooling — reach out', w: 'Risk · $144k', chip: 'At risk', tone: 'risk' },
  { src: LOGOS.slack, t: 'Follow through with John', w: 'Commitment · due today', chip: 'Resolve' },
]

export default function DesktopApp({ dropPane = false, focusView = false }: { dropPane?: boolean; focusView?: boolean }) {
  return (
    <div className="deskwin">
      <div className="dk-bar">
        <div className="dk-dots"><i /><i /><i /></div>
        <div className="dk-omni">{I.search} Ask or tell Noise…</div>
        <span className="dk-orb" />
      </div>
      <div className={'dk-body' + (dropPane ? ' has-drop' : '')}>
        <aside className="dk-side">
          <div className="dk-brand">Noise<span className="dot-g">.</span></div>
          <div className="dk-lbl">Workspace</div>
          <div className="dk-nav active">{I.grid} Focus</div>
          <div className="dk-nav">{I.doc} Documents <span className="dk-badge">12</span></div>
          <div className="dk-nav">{I.people} People</div>
          <div className="dk-nav">{I.gear} Settings</div>
          <div className="dk-lbl">Channels</div>
          {CHANNELS.map(([src, name]) => (
            <div className="dk-nav" key={name}><Logo src={src} /> {name}</div>
          ))}
        </aside>
        <main className="dk-main">
          <div className="dk-head">
            <div>
              <div className="dk-greet">Good morning, Alex</div>
              <div className="dk-greet-sub">3 things need you today.</div>
            </div>
            <span className="dk-cta">Review all</span>
          </div>

          {focusView ? (
            <>
              <div className="dk-brief">
                <span className="dk-brief-l">Morning brief</span>
                <span className="dk-brief-i"><b style={{ color: '#FFB3BD' }}>1</b> account cooling</span>
                <span className="dk-brief-i"><b style={{ color: 'var(--warn)' }}>2</b> commitments due</span>
                <span className="dk-brief-i"><b>3</b> replies waiting</span>
              </div>
              <div className="dk-of-hero">
                <span className="dk-of-t">Open Focus</span>
                <span className="dk-of-cnt">4 need you · ~6 min</span>
              </div>
              <div className="dk-feed dk-of-feed">
                {FOCUS.map((f) => (
                  <div className={'dk-row' + (f.tone === 'risk' ? ' risk' : '')} key={f.t}>
                    <Logo src={f.src} />
                    <div><div className="ft">{f.t}</div><div className="fw">{f.w}</div></div>
                    <span className="chip" style={f.tone === 'risk'
                      ? { color: '#FFB3BD', background: 'rgba(251,113,133,.16)' }
                      : { color: 'var(--p400)', background: 'var(--accent-weak)' }}>{f.chip}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="dk-kpis">
                <div className="dk-kpi hot"><div className="k">Revenue at risk</div><div className="v" style={{ color: '#FFB3BD' }}>$224k</div><div className="dl">6 deals · 4d</div></div>
                <div className="dk-kpi"><div className="k">Drafts ready</div><div className="v">8</div><div className="dl">in your voice</div></div>
                <div className="dk-kpi"><div className="k">Handled today</div><div className="v">42</div><div className="dl">+12 vs avg</div></div>
              </div>
              <div className="dk-feed">
                <div className="dk-row"><span className="fd" /><div><div className="ft">Draft ready — Acme renewal</div><div className="fw">Telegram · 12m ago</div></div><span className="chip" style={{ color: 'var(--p400)', background: 'var(--accent-weak)' }}>Reply</span></div>
                <div className="dk-row"><span className="fd" style={{ background: 'var(--err)' }} /><div><div className="ft">John Smith waiting 2 days</div><div className="fw">Gmail · needs a reply</div></div><span className="chip" style={{ color: '#FFB3BD', background: 'rgba(251,113,133,.16)' }}>At risk</span></div>
                <div className="dk-row"><span className="fd" style={{ background: 'var(--ok)' }} /><div><div className="ft">Invoice #2241 paid</div><div className="fw">Stripe · 1h ago</div></div><span className="chip" style={{ color: '#9DEBC9', background: 'rgba(52,211,153,.16)' }}>Done</span></div>
              </div>
            </>
          )}
        </main>
        {dropPane && (
          <aside className="dk-drop">
            <div className="dk-drop-orb" />
            <div className="dk-drop-t">Drop anything</div>
            <div className="dk-drop-s">files · emails · messages</div>
          </aside>
        )}
      </div>
    </div>
  )
}
