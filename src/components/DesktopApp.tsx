/** Desktop "cockpit" mockup for the hero — the app shown on a laptop/desktop
 *  rather than a phone (phones are used in the intro). */
const I = {
  grid: <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>,
  doc: <svg viewBox="0 0 24 24" fill="none"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></svg>,
  people: <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /></svg>,
  gear: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.2-1.8l1.8-1.4-2-3.4-2.1.9A7 7 0 0 0 14 4.2L13.6 2h-3.2L10 4.2a7 7 0 0 0-1.8 1L6.1 4.4l-2 3.4 1.8 1.4A7 7 0 0 0 5 12" /></svg>,
  mail: <svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16v12H4z" /><path d="M4 7l8 5 8-5" /></svg>,
  send: <svg viewBox="0 0 24 24" fill="none"><path d="M21 5L2 12l6 2 2 6 3-4 5 4z" /></svg>,
  search: <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>,
}

export default function DesktopApp() {
  return (
    <div className="deskwin">
      <div className="dk-bar">
        <div className="dk-dots"><i /><i /><i /></div>
        <div className="dk-omni">{I.search} Ask or tell Noise…</div>
        <span className="dk-orb" />
      </div>
      <div className="dk-body">
        <aside className="dk-side">
          <div className="dk-brand">Noise<span className="dot-g">.</span></div>
          <div className="dk-lbl">Workspace</div>
          <div className="dk-nav active">{I.grid} Cockpit</div>
          <div className="dk-nav">{I.doc} Documents <span className="dk-badge">12</span></div>
          <div className="dk-nav">{I.people} People</div>
          <div className="dk-nav">{I.gear} Settings</div>
          <div className="dk-lbl">Channels</div>
          <div className="dk-nav">{I.mail} Gmail</div>
          <div className="dk-nav">{I.send} Telegram</div>
        </aside>
        <main className="dk-main">
          <div className="dk-head">
            <div>
              <div className="dk-greet">Good morning, Alex</div>
              <div className="dk-greet-sub">3 things need you today.</div>
            </div>
            <span className="dk-cta">Review all</span>
          </div>
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
        </main>
      </div>
    </div>
  )
}
