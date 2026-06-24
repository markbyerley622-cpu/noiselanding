// Real brand assets in /public (Vite serves them at the web root).
// Filenames contain spaces / parens, so paths are URL-encoded.
export const LOGOS = {
  gmail: '/Gmail_icon_(2020).svg.webp',
  slack: '/slack%20logo.png',
  outlook: '/outlook%20logo',
  teams: '/Microsoft_Teams-Logo.wine.svg',
  telegram: '/telegram%20logo',
  salesforce: '/Salesforce.com_logo.svg.png',
  drive: '/google%20drive%20logo',
  dropbox: '/dropbox%20logo.png',
  gcal: '/google%20calendar.png',
  ocal: '/outlook%20calendar%20logo.png',
  whatsapp: '/WhatsApp-logo-webp-green-medium-size-removebg-preview.png',
  messenger: '/Facebook_Messenger_logo_2025.svg-removebg-preview.png',
  facebook: '/facebook-removebg-preview.png',
  meet: '/Google-Meet--removebg-preview.png',
  zoom: '/zoom-removebg-preview.png',
} as const

export const IPHONE = '/iphone.png'

// Nodes in the orbiting channel network — only logos we actually have.
// `scale` = fraction of the node filled by the logo (default 0.6). Logos with
// heavy built-in whitespace (Teams, Telegram, Drive) are bumped up so they
// read at the same visual weight as the others.
export const NETWORK_NODES: { name: string; src: string; scale?: number }[] = [
  { name: 'Gmail', src: LOGOS.gmail },
  { name: 'Slack', src: LOGOS.slack },
  { name: 'Outlook', src: LOGOS.outlook },
  { name: 'Microsoft Teams', src: LOGOS.teams, scale: 0.84 },
  { name: 'Telegram', src: LOGOS.telegram, scale: 0.86 },
  { name: 'Salesforce', src: LOGOS.salesforce },
  { name: 'Google Drive', src: LOGOS.drive, scale: 0.82 },
  { name: 'Dropbox', src: LOGOS.dropbox },
  { name: 'Google Calendar', src: LOGOS.gcal },
  { name: 'Outlook Calendar', src: LOGOS.ocal },
  { name: 'WhatsApp', src: LOGOS.whatsapp, scale: 0.7 },
  { name: 'Messenger', src: LOGOS.messenger, scale: 0.64 },
  { name: 'Facebook', src: LOGOS.facebook, scale: 0.64 },
  { name: 'Google Meet', src: LOGOS.meet, scale: 0.72 },
  { name: 'Zoom', src: LOGOS.zoom, scale: 0.78 },
]

// Full declared channel list (text chips) — the substrate, not a logo wall.
export const ALL_CHANNELS = [
  'Gmail', 'Outlook', 'IMAP / SMTP', 'Slack', 'Microsoft Teams', 'Discord',
  'Telegram', 'WhatsApp', 'SMS', 'Instagram', 'Messenger', 'Facebook',
  'Google Meet', 'Zoom',
  'Google Calendar', 'Outlook Calendar', 'Salesforce', 'ClickUp',
  'Google Drive', 'Dropbox',
]

export type ResultKind = 'file' | 'mail' | 'cal' | 'chat'
export interface MemoryQuery {
  q: string
  short: string
  results: { kind: ResultKind; title: string; sub: string; cf?: string }[]
  answer: string
}

export const MEMORY_QUERIES: MemoryQuery[] = [
  {
    q: 'Show me the Acme MSA',
    short: 'Show me the Acme MSA',
    results: [
      { kind: 'file', title: 'Acme_MSA_signed.pdf', sub: 'Google Drive · signed 14 Mar', cf: '98%' },
      { kind: 'mail', title: 'Re: contract terms — final', sub: 'Gmail thread · 9 messages', cf: '94%' },
      { kind: 'cal', title: 'Acme kickoff — notes', sub: 'Calendar · 18 Mar', cf: '87%' },
    ],
    answer:
      'The signed Acme MSA is <b>Acme_MSA_signed.pdf</b> in Drive (14 Mar). It supersedes v4; net-30 terms, 12-month, auto-renew. The redline history lives in the linked Gmail thread.',
  },
  {
    q: 'What did we agree on pricing?',
    short: 'What did we agree on pricing?',
    results: [
      { kind: 'mail', title: 'Pricing — agreed final', sub: 'Gmail · from Sarah, 11 Mar', cf: '96%' },
      { kind: 'chat', title: '"works for us at $12k/mo"', sub: 'Slack · #acme-deal', cf: '91%' },
      { kind: 'file', title: 'Acme_quote_v3.pdf', sub: 'Dropbox · 9 Mar', cf: '83%' },
    ],
    answer:
      'You agreed <b>$12,000 / month on an annual commit</b>, with a 10% ramp discount for the first quarter. Confirmed by Sarah in Gmail (11 Mar) and again in Slack #acme-deal.',
  },
  {
    q: 'Find contracts expiring in 30 days',
    short: 'Contracts expiring in 30 days',
    results: [
      { kind: 'file', title: 'Acme MSA — renews in 21 days', sub: '$144,000 · at risk' },
      { kind: 'file', title: 'Northwind SOW — renews in 28 days', sub: '$92,000 · healthy' },
      { kind: 'file', title: 'Globex retainer — renews in 30 days', sub: '$48,000 · waiting on you' },
    ],
    answer:
      '<b>3 contracts</b> renew in the next 30 days, worth <b>$284,000</b>. One — Acme ($144k) — is flagged at risk: 9 days quiet with a renewal in 21. Want a draft to re-open it?',
  },
]

export interface HealthScene {
  today: number
  future: number
  score: number
  state: 'hot' | 'wait' | 'cool' | 'risk'
  color: string
  reason: string
  rec: string
  req: string
  biz: string
}

export const HEALTH_SCENES: HealthScene[] = [
  {
    today: 92, future: 88, score: 92, state: 'hot', color: 'var(--ok)',
    reason: '<b>Healthy.</b> Fast replies both ways, sentiment positive, invoice current.',
    rec: 'strong', req: 'balanced', biz: 'invoice current',
  },
  {
    today: 76, future: 64, score: 76, state: 'wait', color: 'var(--warn)',
    reason: "<b>Waiting on you.</b> They've sent the last 3 messages — reply gap widening to 2 days.",
    rec: 'slowing', req: 'you owe 3', biz: 'invoice due soon',
  },
  {
    today: 58, future: 42, score: 58, state: 'risk', color: 'var(--err)',
    reason: '<b>At risk.</b> 9 days quiet, renewal in 21, invoice overdue. <b>$144k</b> exposed.',
    rec: '9 days quiet', req: 'one-sided', biz: 'invoice overdue',
  },
]
