import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Reveal } from '../lib/Reveal'
import { Icon } from '../lib/icons'
import { LOGOS } from '../data/site'

interface DAction { label: string; icon: ReactNode; primary?: boolean }
interface DFile {
  id: string
  name: string
  meta: string
  mark?: ReactNode      // real brand logo (Drive / Dropbox)
  icon?: ReactNode      // fallback line icon
  steps: string[]
  summary: string
  tags: [string, string][]
  actions: DAction[]
}

const DriveMark = (
  <svg viewBox="0 0 87.3 78" role="img" aria-label="Google Drive">
    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z" fill="#00ac47" />
    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
  </svg>
)
const DropboxMark = <img src={LOGOS.dropbox} alt="Dropbox" />

const FILES: DFile[] = [
  {
    id: 'msa', name: 'Acme_MSA_signed.pdf', meta: 'Google Drive · PDF', mark: DriveMark,
    steps: ['Reading document', 'Extracting entities', 'Embedding into memory'],
    summary: 'Linked to Acme Corp · renewal flagged',
    tags: [['Company', 'Acme Corp'], ['Terms', 'net-30'], ['Expires', '14 Mar']],
    actions: [{ label: 'Summarise', icon: Icon.brief, primary: true }, { label: 'Draft renewal', icon: Icon.pen }, { label: 'Schedule reminder', icon: Icon.cal }],
  },
  {
    id: 'xls', name: 'Q3_pipeline.xlsx', meta: 'Dropbox · spreadsheet', mark: DropboxMark,
    steps: ['Parsing rows', 'Linking deals', 'Embedding into memory'],
    summary: 'Mapped 6 deals into the graph',
    tags: [['Deals', '6 open'], ['At risk', '$224k'], ['Links', '4 people']],
    actions: [{ label: 'Summarise', icon: Icon.brief, primary: true }, { label: 'Email report', icon: Icon.mail }, { label: 'Schedule review', icon: Icon.cal }],
  },
]

const tick = <svg viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" /></svg>
const fileIcon = (f: DFile, cls: string) =>
  f.mark ? <span className={cls + ' logo'}>{f.mark}</span> : <span className={cls}>{f.icon}</span>

function Chip({ file, zoneRef, onDrop, onDragState, onOver }: {
  file: DFile
  zoneRef: React.RefObject<HTMLDivElement>
  onDrop: (f: DFile) => void
  onDragState: (d: boolean) => void
  onOver: (o: boolean) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const hit = () => {
    const c = ref.current?.getBoundingClientRect()
    const z = zoneRef.current?.getBoundingClientRect()
    if (!c || !z) return false
    const cx = c.left + c.width / 2, cy = c.top + c.height / 2
    return cx >= z.left && cx <= z.right && cy >= z.top && cy <= z.bottom
  }
  return (
    <motion.div
      ref={ref}
      className="dd-file"
      drag
      dragSnapToOrigin
      dragElastic={0.18}
      whileDrag={{ scale: 1.06, zIndex: 8, boxShadow: 'var(--glow-md)' }}
      onDragStart={() => onDragState(true)}
      onDrag={() => onOver(hit())}
      onDragEnd={() => { const h = hit(); onDragState(false); onOver(false); if (h) onDrop(file) }}
    >
      {fileIcon(file, 'fi')}
      <div><div className="fn">{file.name}</div><div className="fm">{file.meta}</div></div>
    </motion.div>
  )
}

function DragDropDemo() {
  const reduce = useReducedMotion()
  const zoneRef = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [tray, setTray] = useState<DFile[]>(FILES)
  const [flying, setFlying] = useState<DFile | null>(null)
  const [proc, setProc] = useState<{ file: DFile; step: number } | null>(null)
  const [memory, setMemory] = useState<DFile[]>([])
  const [over, setOver] = useState(false)
  const [dragging, setDragging] = useState(false)

  const remove = (id: string) => setTray((t) => t.filter((f) => f.id !== id))

  // reset to original (used on scroll-up / leaving view)
  const reset = () => { setStarted(false); setTray(FILES); setMemory([]); setProc(null); setFlying(null); setOver(false) }

  // auto-demo driver — plays through the tray exactly once (no loop)
  useEffect(() => {
    if (!started) return
    if (reduce) { setMemory(FILES); setTray([]); return }
    if (proc || flying || dragging) return
    if (tray.length > 0) {
      const t = setTimeout(() => { remove(tray[0].id); setFlying(tray[0]) }, 1100)
      return () => clearTimeout(t)
    }
  }, [started, proc, flying, dragging, tray, reduce])

  // flying file lands → begin processing
  useEffect(() => {
    if (!flying) return
    const t = setTimeout(() => { setProc({ file: flying, step: 0 }); setFlying(null) }, 1450)
    return () => clearTimeout(t)
  }, [flying])

  // step through processing → commit to memory
  useEffect(() => {
    if (!proc) return
    const last = proc.file.steps.length - 1
    if (proc.step < last) {
      const t = setTimeout(() => setProc({ file: proc.file, step: proc.step + 1 }), 760)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => { setMemory((m) => [...m, proc.file]); setProc(null) }, 820)
    return () => clearTimeout(t)
  }, [proc])

  const onDrop = (f: DFile) => { if (proc || flying) return; remove(f.id); setProc({ file: f, step: 0 }) }

  return (
    <motion.div
      className="panel"
      viewport={{ amount: 0.4 }}
      onViewportEnter={() => setStarted(true)}
      onViewportLeave={reset}
    >
      <div className="panel-bar"><div className="dots"><i /><i /><i /></div><span className="pt">noise · memory</span></div>
      <div className="panel-body dd">
        <div className="dd-hint">Drag a file into Noise ↓</div>

        <div className="dd-tray">
          {tray.map((f) => (
            <Chip key={f.id} file={f} zoneRef={zoneRef} onDrop={onDrop} onDragState={setDragging} onOver={setOver} />
          ))}
        </div>

        <div className={'dd-zone' + (over ? ' over' : '') + (proc ? ' busy' : '')} ref={zoneRef}>
          <div className="dd-orb" />
          {proc ? (
            <div className="dd-steps">
              {proc.file.steps.map((s, i) => (
                <div key={i} className={'dd-step' + (i < proc.step ? ' ok' : i === proc.step ? ' on' : '')}>
                  {i < proc.step ? <span className="sx">{tick}</span> : i === proc.step ? <span className="sp" /> : <span className="sx" />}
                  {s}…
                </div>
              ))}
            </div>
          ) : (
            <div className="dd-zone-text">
              {tray.length ? 'Drop a file, email or attachment — Noise reads it straight into memory.' : 'Your brain is built. Drop more in anytime.'}
            </div>
          )}
        </div>

        {/* purple trail + flying file, relative to the whole demo body */}
        {flying && (
          <>
            <svg className="dd-trail" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* slow-drawn link from the file down into the brain */}
              <motion.line
                x1="50" y1="9" x2="50" y2="43" stroke="var(--p400)" strokeWidth="1" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.95, 0.95, 0.3] }}
                transition={{ duration: 1.35, ease: [0.4, 0, 0.2, 1], opacity: { times: [0, 0.25, 0.75, 1] } }}
              />
            </svg>
            <motion.div
              className="dd-file dd-flyer"
              initial={{ top: '5%', scale: 1, opacity: 1, rotate: -2 }}
              animate={{ top: '40%', scale: 0.62, opacity: 0, rotate: 3 }}
              transition={{ duration: 1.35, ease: [0.4, 0, 0.2, 1] }}
            >
              {fileIcon(flying, 'fi')}
              <div><div className="fn">{flying.name}</div><div className="fm">{flying.meta}</div></div>
            </motion.div>
          </>
        )}

        <div className="dd-mem">
          {memory.length > 0 && <div className="dd-mh"><span className="dot" style={{ background: 'var(--p400)' }} />In your memory</div>}
          <AnimatePresence>
            {memory.map((f) => (
              <motion.div key={f.id} className="dd-item" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}>
                <div className="di-top">
                  {fileIcon(f, 'di-ic')}
                  <div><div className="di-n">{f.name}</div><div className="di-s">{tick} {f.summary}</div></div>
                </div>
                <div className="dd-tags">
                  {f.tags.map(([k, v]) => <span className="dd-tag" key={k}>{k} <b>{v}</b></span>)}
                </div>
                <motion.div className="dd-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.4 }}>
                  {f.actions.map((a) => (
                    <button key={a.label} className={'dd-act' + (a.primary ? ' primary' : '')} type="button">
                      {a.icon} {a.label}
                    </button>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default function MemoryDemo({ onSignup }: { onSignup: () => void }) {
  return (
    <section className="band" id="memory">
      <div className="wrap">
        <div className="split">
          <div className="split-copy">
            <Reveal><span className="kicker">02 — The memory layer</span></Reveal>
            <Reveal delay={0.08}><h2>It remembers everything,<br />so you don't have to.</h2></Reveal>
            <Reveal delay={0.16}>
              <p className="lead">Noise indexes your files, analyzes your attachments and embeds every conversation into one searchable brain. Drop in anything — a document, a thread, an attachment — and it goes to work.</p>
            </Reveal>
            <div className="feature-list">
              {[
                [Icon.file, 'Drop in anything', 'Drag in a file, email or attachment and Noise reads it, extracts the entities, and files it into memory — no tagging, no folders.'],
                [Icon.search, 'Find the real file', 'Later, say "the Acme MSA" and Noise ranks the actual documents by confidence — no folder-digging, no guessing.'],
                [Icon.graph, 'Map what matters', 'A living knowledge graph tracks every company, person and topic — and who\'s connected to what.'],
              ].map(([ic, h, p], i) => (
                <Reveal delay={0.12 + i * 0.08} key={i}>
                  <div className="fitem"><span className="fi-ic">{ic as any}</span><div><h3>{h as string}</h3><p>{p as string}</p></div></div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}><DragDropDemo /></Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="inline-cta">
            <span>Watch it read your real files into memory.</span>
            <button className="btn btn-glass btn-glass-accent" onClick={onSignup}>Connect your email {Icon.arrow}</button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
