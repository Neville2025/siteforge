// Curated SVG icon library for SiteForge generated sites.
// All icons are 24x24 viewBox, currentColor stroke, line-style — feels closer
// to Lucide / Heroicons. Inline SVG so exports stay self-contained.

export interface IconDef {
  name: string
  label: string
  category: string
  /** Inner SVG markup (no outer <svg>), uses stroke="currentColor" */
  body: string
}

const stroke = (path: string) => path

export const ICONS: Record<string, IconDef> = {
  // Default / generic
  zap:        { name:'zap', label:'Lightning', category:'Generic',  body: stroke(`<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  star:       { name:'star', label:'Star', category:'Generic',      body: stroke(`<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  check:      { name:'check', label:'Check', category:'Generic',    body: stroke(`<polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`) },
  'check-circle': { name:'check-circle', label:'Check circle', category:'Generic', body: stroke(`<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><polyline points="9 12 11 14 15 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`) },
  award:      { name:'award', label:'Award', category:'Generic',    body: stroke(`<circle cx="12" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><polyline points="8 13 6 21 12 18 18 21 16 13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  rocket:     { name:'rocket', label:'Rocket', category:'Generic',  body: stroke(`<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M15 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  target:     { name:'target', label:'Target', category:'Generic',  body: stroke(`<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2" fill="currentColor"/>`) },

  // Trust & service quality
  shield:     { name:'shield', label:'Shield', category:'Trust',    body: stroke(`<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  lock:       { name:'lock', label:'Lock', category:'Trust',        body: stroke(`<rect x="3" y="11" width="18" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`) },
  thumbsUp:   { name:'thumbs-up', label:'Thumbs up', category:'Trust', body: stroke(`<path d="M14 9V5a3 3 0 0 0-6 0v4H4v12h13a4 4 0 0 0 4-4l-1-7a3 3 0 0 0-3-3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`) },

  // Time & speed
  clock:      { name:'clock', label:'Clock', category:'Time',       body: stroke(`<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><polyline points="12 6 12 12 16 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  calendar:   { name:'calendar', label:'Calendar', category:'Time', body: stroke(`<rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="1.8"/>`) },
  bolt:       { name:'bolt', label:'Bolt (fast)', category:'Time',  body: stroke(`<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },

  // Communication
  phone:      { name:'phone', label:'Phone', category:'Contact',    body: stroke(`<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  mail:       { name:'mail', label:'Mail', category:'Contact',      body: stroke(`<rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><polyline points="22 6 12 13 2 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  message:    { name:'message', label:'Message', category:'Contact', body: stroke(`<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  mapPin:     { name:'map-pin', label:'Map pin', category:'Contact', body: stroke(`<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/>`) },

  // People & business
  users:      { name:'users', label:'Users', category:'People',     body: stroke(`<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`) },
  briefcase:  { name:'briefcase', label:'Briefcase', category:'People', body: stroke(`<rect x="2" y="7" width="20" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" fill="none" stroke="currentColor" stroke-width="1.8"/>`) },
  heart:      { name:'heart', label:'Heart', category:'People',     body: stroke(`<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`) },

  // Money & growth
  trending:   { name:'trending-up', label:'Trending up', category:'Money', body: stroke(`<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><polyline points="17 6 23 6 23 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  dollar:     { name:'dollar', label:'Dollar', category:'Money',    body: stroke(`<line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`) },
  chart:      { name:'chart', label:'Chart bar', category:'Money',  body: stroke(`<line x1="12" y1="20" x2="12" y2="10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="18" y1="20" x2="18" y2="4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`) },

  // Tools & trades
  wrench:     { name:'wrench', label:'Wrench', category:'Trades',   body: stroke(`<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  paint:      { name:'paint', label:'Paint brush', category:'Trades', body: stroke(`<path d="M18.37 2.63 14 7l3 3 4.37-4.37a2.12 2.12 0 1 0-3-3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 8a3 3 0 0 0-3 3v8a2 2 0 0 1-2 2H2v-2a2 2 0 0 1 2-2h0a2 2 0 0 0 2-2v-2a4 4 0 0 1 4-4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  scissors:   { name:'scissors', label:'Scissors', category:'Trades', body: stroke(`<circle cx="6" cy="6" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="20" y1="4" x2="8.12" y2="15.88" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="14.47" y1="14.48" x2="20" y2="20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="8.12" y1="8.12" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`) },
  truck:      { name:'truck', label:'Truck', category:'Trades',     body: stroke(`<rect x="1" y="3" width="15" height="13" fill="none" stroke="currentColor" stroke-width="1.8"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18.5" cy="18.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>`) },

  // Tech / building
  code:       { name:'code', label:'Code', category:'Tech',         body: stroke(`<polyline points="16 18 22 12 16 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><polyline points="8 6 2 12 8 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  cpu:        { name:'cpu', label:'Chip', category:'Tech',          body: stroke(`<rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="9" y="9" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="9" y1="1" x2="9" y2="4" stroke="currentColor" stroke-width="1.8"/><line x1="15" y1="1" x2="15" y2="4" stroke="currentColor" stroke-width="1.8"/><line x1="9" y1="20" x2="9" y2="23" stroke="currentColor" stroke-width="1.8"/><line x1="15" y1="20" x2="15" y2="23" stroke="currentColor" stroke-width="1.8"/><line x1="20" y1="9" x2="23" y2="9" stroke="currentColor" stroke-width="1.8"/><line x1="20" y1="14" x2="23" y2="14" stroke="currentColor" stroke-width="1.8"/><line x1="1" y1="9" x2="4" y2="9" stroke="currentColor" stroke-width="1.8"/><line x1="1" y1="14" x2="4" y2="14" stroke="currentColor" stroke-width="1.8"/>`) },
  cloud:      { name:'cloud', label:'Cloud', category:'Tech',       body: stroke(`<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  smartphone: { name:'smartphone', label:'Phone (mobile)', category:'Tech', body: stroke(`<rect x="5" y="2" width="14" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="12" y1="18" x2="12" y2="18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>`) },

  // Wellness / nature
  leaf:       { name:'leaf', label:'Leaf', category:'Wellness',     body: stroke(`<path d="M11 20A7 7 0 0 1 4 13c0-3.86 3.14-7 7-7h7v7a7 7 0 0 1-7 7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M11 20c0-3.5 0-7 7-13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`) },
  smile:      { name:'smile', label:'Smile', category:'Wellness',   body: stroke(`<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 14s1.5 2 4 2 4-2 4-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>`) },

  // Misc
  home:       { name:'home', label:'Home', category:'Misc',         body: stroke(`<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  scale:      { name:'scale', label:'Scales (justice)', category:'Misc', body: stroke(`<path d="M12 3v18M5 8l-3 5h6zM19 8l-3 5h6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 13a3 3 0 0 0 6 0M15 13a3 3 0 0 0 6 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`) },
  globe:      { name:'globe', label:'Globe', category:'Misc',       body: stroke(`<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.8"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="currentColor" stroke-width="1.8"/>`) },
  search:     { name:'search', label:'Search', category:'Misc',     body: stroke(`<circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`) },
  settings:   { name:'settings', label:'Settings', category:'Misc', body: stroke(`<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  gift:       { name:'gift', label:'Gift', category:'Misc',         body: stroke(`<polyline points="20 12 20 22 4 22 4 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="2" y="7" width="20" height="5" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="12" y1="22" x2="12" y2="7" stroke="currentColor" stroke-width="1.8"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`) },
  lightbulb:  { name:'lightbulb', label:'Lightbulb', category:'Misc', body: stroke(`<path d="M9 18h6m-3-14a7 7 0 0 0-4 12.7V18h8v-1.3A7 7 0 0 0 12 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="10" y1="22" x2="14" y2="22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`) },
  sparkles:   { name:'sparkles', label:'Sparkles', category:'Misc', body: stroke(`<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`) },
  car:        { name:'car', label:'Car', category:'Misc',           body: stroke(`<path d="M5 17h14l-2-7H7l-2 7zM5 17v3h2v-3M17 17v3h2v-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="17" r="1.5" fill="currentColor"/><circle cx="16" cy="17" r="1.5" fill="currentColor"/>`) },
}

export const ICON_NAMES = Object.keys(ICONS)

/** Render an inline SVG for an icon name. Falls back to the literal value
 *  (lets users keep emojis if they prefer). Size is in pixels. */
export function renderIcon(nameOrEmoji: string, size = 24): string {
  if (!nameOrEmoji) return ''
  const def = ICONS[nameOrEmoji]
  if (def) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${def.body}</svg>`
  }
  // Fall back: render the literal string (emoji or text).
  return nameOrEmoji
}
