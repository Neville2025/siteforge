export interface Theme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontHeading: string
  fontBody: string
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'pill'
  style: 'light' | 'dark'
}

export interface FloatingWidget {
  /** Show a floating bottom-right widget on the public site */
  enabled: boolean
  /** Channel: whatsapp uses wa.me/<number>, sms uses sms:<number> */
  channel: 'whatsapp' | 'sms' | 'tel' | 'none'
  /** Phone number (digits only or with country code). Country profile fills the rest. */
  number: string
  /** Pre-filled message (URL-encoded by renderer) */
  message: string
}

export interface MediaItem {
  url: string
  alt: string
}

export interface Section {
  id: string
  type: SectionType
  data: Record<string, any>
}

export type SectionType =
  | 'hero' | 'services' | 'about' | 'stats' | 'testimonials'
  | 'gallery' | 'pricing' | 'team' | 'faq' | 'cta' | 'contact'
  | 'features' | 'custom21st'
  | 'whatsapp' | 'banking' | 'policy' | 'maps' | 'newsletter'

export interface Page {
  id: string
  name: string
  slug: string
  sections: Section[]
}

export interface SiteData {
  id: string
  name: string
  tagline: string
  logo: string
  /** Optional favicon as data URL or remote URL. If empty, logo is used. */
  favicon?: string
  /** Country code (ISO 3166-1 alpha-2). Drives currency, phone format, privacy law, AI prompt locale. */
  country?: string
  theme: Theme
  /** Optional floating contact widget shown on every page */
  widget?: FloatingWidget
  pages: Page[]
}

export interface SectionField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'image' | 'color' | 'url' | 'list' | 'boolean' | 'select'
  options?: string[]
  placeholder?: string
  hint?: string
}

export interface SectionDefinition {
  type: SectionType
  name: string
  icon: string
  description: string
  fields: SectionField[]
  defaultData: Record<string, any>
}

export interface Component21st {
  id?: string
  name?: string
  preview_url?: string
  demo_url?: string
  description?: string
  component_slug?: string
}
