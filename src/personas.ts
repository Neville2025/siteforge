// Design personas — each one is a complete visual world: fonts, color logic,
// border-radius preset, animation intensity, layout choices. Magic Build picks
// a default based on the industry; the user can override.

import type { Theme } from './types'

export type PersonaId = 'minimal' | 'bold' | 'luxury' | 'playful' | 'corporate' | 'tech' | 'wellness' | 'editorial'

export interface Persona {
  id: PersonaId
  name: string
  description: string
  emoji: string
  fontHeading: string
  fontBody: string
  borderRadius: Theme['borderRadius']
  /** Animation intensity multiplier — used to set AOS duration / stagger delay. */
  animation: 'subtle' | 'medium' | 'lively'
  /** Default layout variants for sections. Renderer reads these as fallbacks
   *  when a section has no explicit `variant` field. */
  variants: Partial<Record<'hero'|'services'|'about'|'testimonials'|'pricing', string>>
  /** Suggested palette starting points. The user can still override. */
  paletteHint: { primary: string; secondary: string; accent: string; style: Theme['style'] }
  /** Industry tags this persona suits — used for default selection. */
  fits: string[]
}

export const PERSONAS: Record<PersonaId, Persona> = {
  minimal: {
    id:'minimal', name:'Minimal', description:'Lots of whitespace, restrained typography, subtle motion.', emoji:'⬜',
    fontHeading:'Inter', fontBody:'Inter', borderRadius:'small', animation:'subtle',
    variants:{ hero:'split', services:'grid', about:'stacked', testimonials:'cards', pricing:'cards' },
    paletteHint:{ primary:'#0f172a', secondary:'#475569', accent:'#0ea5e9', style:'light' },
    fits:['SaaS','Consultancy','Agency','Architect','Design','Tech startup'],
  },
  bold: {
    id:'bold', name:'Bold', description:'High contrast, oversized type, full-bleed sections.', emoji:'⚡',
    fontHeading:'Poppins', fontBody:'Inter', borderRadius:'medium', animation:'lively',
    variants:{ hero:'fullbleed', services:'bento', about:'split', testimonials:'marquee', pricing:'cards' },
    paletteHint:{ primary:'#ef4444', secondary:'#0a0a0a', accent:'#fbbf24', style:'dark' },
    fits:['Fitness','Gym','Tradesperson','Construction','Auto','Bold brand','Sports','Fashion'],
  },
  luxury: {
    id:'luxury', name:'Luxury', description:'Serif headings, deep colors, elegant spacing, gold accents.', emoji:'✦',
    fontHeading:'Playfair Display', fontBody:'Inter', borderRadius:'small', animation:'subtle',
    variants:{ hero:'fullbleed', services:'editorial', about:'editorial', testimonials:'cards', pricing:'cards' },
    paletteHint:{ primary:'#1e293b', secondary:'#0f172a', accent:'#a16207', style:'light' },
    fits:['Lodge','Hotel','Boutique','Luxury','Spa','Jeweller','Wine','Real estate (high-end)','Attorney'],
  },
  playful: {
    id:'playful', name:'Playful', description:'Friendly type, soft pastels, rounded corners, animated everything.', emoji:'🎈',
    fontHeading:'Poppins', fontBody:'Nunito', borderRadius:'large', animation:'lively',
    variants:{ hero:'centered', services:'cards', about:'split', testimonials:'cards', pricing:'cards' },
    paletteHint:{ primary:'#ec4899', secondary:'#a855f7', accent:'#f59e0b', style:'light' },
    fits:['Beauty','Salon','Kids','Café','Bakery','Pet','Daycare','Tutoring','Restaurant (casual)'],
  },
  corporate: {
    id:'corporate', name:'Corporate', description:'Authoritative blues, structured grids, photography-led.', emoji:'🏢',
    fontHeading:'Montserrat', fontBody:'Inter', borderRadius:'small', animation:'subtle',
    variants:{ hero:'split', services:'grid', about:'split', testimonials:'cards', pricing:'cards' },
    paletteHint:{ primary:'#1e3a8a', secondary:'#0f172a', accent:'#0891b2', style:'light' },
    fits:['Finance','Insurance','Accounting','Banking','B2B','Logistics','Engineering','Manufacturing'],
  },
  tech: {
    id:'tech', name:'Tech', description:'Dark mode by default, gradient hero, monospace accents, motion-rich.', emoji:'⌨',
    fontHeading:'DM Sans', fontBody:'Inter', borderRadius:'medium', animation:'lively',
    variants:{ hero:'split', services:'bento', about:'split', testimonials:'marquee', pricing:'cards' },
    paletteHint:{ primary:'#3b82f6', secondary:'#8b5cf6', accent:'#06b6d4', style:'dark' },
    fits:['SaaS','Tech startup','Software','Developer','AI','API','Platform','Web3','Cybersecurity'],
  },
  wellness: {
    id:'wellness', name:'Wellness', description:'Warm earth tones, generous spacing, calm animation, nature imagery.', emoji:'🌿',
    fontHeading:'Merriweather', fontBody:'Inter', borderRadius:'large', animation:'subtle',
    variants:{ hero:'centered', services:'grid', about:'split', testimonials:'cards', pricing:'cards' },
    paletteHint:{ primary:'#16a34a', secondary:'#365314', accent:'#84cc16', style:'light' },
    fits:['Yoga','Wellness','Therapist','Doctor','Clinic','Dentist','Healing','Massage','Coach','Mental health'],
  },
  editorial: {
    id:'editorial', name:'Editorial', description:'Magazine-style, mixed typography, asymmetric layouts.', emoji:'📰',
    fontHeading:'Playfair Display', fontBody:'DM Sans', borderRadius:'none', animation:'medium',
    variants:{ hero:'editorial', services:'editorial', about:'editorial', testimonials:'cards', pricing:'cards' },
    paletteHint:{ primary:'#0a0a0a', secondary:'#404040', accent:'#dc2626', style:'light' },
    fits:['Photographer','Studio','Creative agency','Magazine','Author','Portfolio','Architect'],
  },
}

export const PERSONA_LIST: Persona[] = Object.values(PERSONAS)

/**
 * Pick the most appropriate persona for an industry string. Falls back to
 * 'minimal' when no clear match.
 */
export function pickPersona(industry: string): PersonaId {
  if (!industry) return 'minimal'
  const lower = industry.toLowerCase()
  for (const p of PERSONA_LIST) {
    for (const f of p.fits) {
      if (lower.includes(f.toLowerCase())) return p.id
    }
  }
  return 'minimal'
}
