export interface Theme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontHeading: string
  fontBody: string
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'pill'
  style: 'light' | 'dark'
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
  theme: Theme
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
