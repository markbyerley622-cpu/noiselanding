# Noise — Landing Page

The marketing site for **Noise**, the memory and intelligence layer that sits on
top of every channel you communicate through. **Not a unified inbox** — the
channels are the foundation; the memory + intelligence is the product.

Built as a faithful extension of `noise_brand_system.html` (Design System v2):
neutral charcoal carries ~85% of every surface, and Noise Purple (`#8B5CF6`) is
rationed to action, focus, data and rare hero moments.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Framer Motion** for scroll reveals, the hero phone tilt/parallax, the live
  relationship-health animation, the channel network, and the interactive demos.
- No CSS framework — design tokens and components are ported verbatim from the
  brand system into `src/index.css`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to /dist
npm run preview  # serve the production build
```

## Structure

```
index.html               Vite entry (loads /src/main.tsx)
design-reference.html    Original single-file build — kept as the visual spec
noise_brand_system.html  Source of truth for tokens, type, color, motion
public/                  Real channel logos + iphone.png (served at web root)
src/
  index.css              Brand tokens + every section style (ported)
  App.tsx                Page composition + nav-offset smooth scroll
  lib/
    Reveal.tsx           Scroll-triggered fade-up wrapper (Framer)
    icons.tsx            Inline line-icons + brand wordmark
  data/site.ts           Asset paths, channel list, memory + health demo data
  components/
    Nav, Hero, Phone, TrustStrip, ChannelNetwork, Problem, MemoryDemo,
    Intelligence, ActionLayer, Moat, HowItWorks, Onboarding, Trust,
    FinalCTA, Footer
```

## Sections (the three-layer narrative)

1. **Hero** — full-viewport, animated background, the iPhone with rotating
   screens + mouse tilt, a live relationship-health card, and a draft preview.
2. **Integration layer** — channels orbiting the Noise core as a living network.
3. **Problem** — scattered messages converging into one brain.
4. **Memory layer** — interactive "Show me the Acme MSA" search demo.
5. **Intelligence layer** — relationship health animating 92 → 76 → 58 with a
   30-day forecast.
6. **Action layer** — Focus feed, drafts in your voice, founder brief.
7. **Moat** — an employee leaves; the knowledge stays.
8. **How it works** — connect-once timeline.
9. **Onboarding** — the 7-screen questionnaire + building screen, interactive.
10. **Trust** — explainable, evidence-based score breakdown.
11. **Final CTA**.

## Brand guardrails

Use: memory layer · intelligence layer · relationship health · knowledge graph ·
"knowledge outlives the person" · forecasting · explainable.
Avoid: "unified inbox" · "all your messages in one place" · "inbox zero".

## Channel logos

Only logos present in `public/` are rendered as image nodes (Gmail, Slack,
Outlook, Teams, Telegram, Salesforce, Google Drive, Dropbox, Google/Outlook
Calendar). The full declared channel set (WhatsApp, Discord, Instagram,
Messenger, SMS, IMAP, ClickUp, …) appears as text chips — drop their logos into
`public/` and add them to `NETWORK_NODES` in `src/data/site.ts` to promote them.
