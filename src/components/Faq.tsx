import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal } from '../lib/Reveal'

const QS: [string, string][] = [
  [
    'What exactly does Noise connect to?',
    'Email (Gmail, Outlook, IMAP/SMTP), chat (Slack, Teams, Telegram, WhatsApp and more), calendars (Google, Outlook) and files (Drive, Dropbox). Connect one or all of them — every new channel instantly inherits your full memory.',
  ],
  [
    'Can Noise send messages on my behalf?',
    'Never without your approval. Noise reads to build your memory and drafts replies in your voice, but nothing is sent, posted or deleted until you say yes.',
  ],
  [
    'Is my data secure?',
    'Yes. Connections use OAuth — no passwords stored. Everything is encrypted in transit and at rest, scoped to your team, never sold and never used to train public models. Revoke access in one click and your data is purged.',
  ],
  [
    'How is the health score calculated?',
    'It’s rules-based math, not a model guessing. Recency, reciprocity, sentiment and business signals (overdue invoices, stalled deals, slipping promises) each contribute a weighted, observable value — so every score traces back to the evidence behind it.',
  ],
  [
    'How long until I see value?',
    'About 60 seconds. Connect your email and Noise reads, maps your relationships and generates your first founder brief automatically — before your coffee’s cold.',
  ],
  [
    'What happens when someone leaves my team?',
    'The knowledge stays. Every conversation, promise and piece of context is owned by the company and ready to hand off — so a relationship never resets to zero.',
  ],
]

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section className="band tight" id="faq">
      <div className="wrap">
        <div className="sec-head center">
          <Reveal><span className="kicker center">FAQ</span></Reveal>
          <Reveal delay={0.08}><h2>Questions, answered.</h2></Reveal>
        </div>

        <div className="faq">
          {QS.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <Reveal delay={0.04 * i} key={q}>
                <div className={'faq-item' + (isOpen ? ' open' : '')}>
                  <button className="faq-q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                    <span>{q}</span>
                    <span className="faq-plus" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="faq-a-wrap"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
                      >
                        <p className="faq-a">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
