import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'
import type { SiteData, Page, Section, SectionType, Theme } from './types'
import { SECTION_DEFS } from './sections'

const DEFAULT_THEME: Theme = {
  primaryColor: '#2563eb', secondaryColor: '#7c3aed', accentColor: '#06b6d4',
  fontHeading: 'Inter', fontBody: 'Inter',
  borderRadius: 'medium', style: 'light',
}

const makePage = (name: string, slug: string, sectionTypes: SectionType[]): Page => ({
  id: uuid(), name, slug,
  sections: sectionTypes.map(type => ({
    id: uuid(), type, data: { ...SECTION_DEFS[type].defaultData }
  }))
})

const DEFAULT_SITE: SiteData = {
  id: uuid(),
  name: 'Your Business',
  tagline: 'Professional services you can trust',
  logo: '',
  theme: DEFAULT_THEME,
  pages: [
    makePage('Home', '/', ['hero', 'stats', 'services', 'about', 'testimonials', 'cta']),
    makePage('About', '/about', ['about', 'team', 'stats', 'cta']),
    makePage('Services', '/services', ['hero', 'services', 'features', 'pricing', 'cta']),
    makePage('Contact', '/contact', ['contact']),
  ]
}

export type RightTab = 'edit' | 'theme' | 'ai' | 'suggest' | 'components'

interface BuilderState {
  site: SiteData
  activePageId: string
  activeSectionId: string | null
  rightTab: RightTab
  showAddSection: boolean
  aiLoading: boolean

  // Site actions
  setSiteName: (name: string) => void
  setSiteTagline: (tagline: string) => void
  setSiteLogo: (logo: string) => void
  setTheme: (theme: Partial<Theme>) => void

  // Page actions
  setActivePage: (id: string) => void
  addPage: (name: string) => void
  deletePage: (id: string) => void
  renamePage: (id: string, name: string) => void

  // Section actions
  setActiveSection: (id: string | null) => void
  addSection: (type: SectionType) => void
  deleteSection: (id: string) => void
  moveSectionUp: (id: string) => void
  moveSectionDown: (id: string) => void
  moveSectionToTop: (id: string) => void
  moveSectionToBottom: (id: string) => void
  updateSectionData: (id: string, key: string, value: any) => void
  setSectionData: (id: string, data: Record<string, any>) => void
  addCustomSection: (html: string, name: string) => void

  // UI
  setRightTab: (tab: RightTab) => void
  setShowAddSection: (v: boolean) => void
  setAiLoading: (v: boolean) => void

  // Reset
  loadSite: (site: SiteData) => void
}

export const useStore = create<BuilderState>()(
  persist(
    (set) => ({
      site: DEFAULT_SITE,
      activePageId: DEFAULT_SITE.pages[0].id,
      activeSectionId: null,
      rightTab: 'edit',
      showAddSection: false,
      aiLoading: false,

      setSiteName: (name) => set(s => ({ site: { ...s.site, name } })),
      setSiteTagline: (tagline) => set(s => ({ site: { ...s.site, tagline } })),
      setSiteLogo: (logo: string) => set(s => ({ site: { ...s.site, logo } })),
      setTheme: (theme) => set(s => ({ site: { ...s.site, theme: { ...s.site.theme, ...theme } } })),

      setActivePage: (id) => set({ activePageId: id, activeSectionId: null }),

      addPage: (name) => {
        const page = makePage(name, `/${name.toLowerCase().replace(/\s+/g,'-')}`, ['hero', 'cta'])
        set(s => ({ site: { ...s.site, pages: [...s.site.pages, page] }, activePageId: page.id }))
      },

      deletePage: (id) => set(s => {
        const pages = s.site.pages.filter(p => p.id !== id)
        return { site: { ...s.site, pages }, activePageId: pages[0]?.id || '' }
      }),

      renamePage: (id, name) => set(s => ({
        site: { ...s.site, pages: s.site.pages.map(p => p.id === id ? { ...p, name } : p) }
      })),

      setActiveSection: (id) => set({ activeSectionId: id, rightTab: 'edit' }),
      setRightTab: (tab) => set({ rightTab: tab }),

      addSection: (type) => {
        const section: Section = { id: uuid(), type, data: { ...SECTION_DEFS[type].defaultData } }
        set(s => {
          const pages = s.site.pages.map(p =>
            p.id === s.activePageId ? { ...p, sections: [...p.sections, section] } : p
          )
          return { site: { ...s.site, pages }, activeSectionId: section.id, showAddSection: false }
        })
      },

      addCustomSection: (html, name) => {
        const section: Section = { id: uuid(), type: 'custom21st', data: { html, name } }
        set(s => {
          const pages = s.site.pages.map(p =>
            p.id === s.activePageId ? { ...p, sections: [...p.sections, section] } : p
          )
          return { site: { ...s.site, pages }, activeSectionId: section.id, showAddSection: false }
        })
      },

      deleteSection: (id) => set(s => {
        const pages = s.site.pages.map(p =>
          p.id === s.activePageId ? { ...p, sections: p.sections.filter(sec => sec.id !== id) } : p
        )
        return { site: { ...s.site, pages }, activeSectionId: null }
      }),

      moveSectionUp: (id) => set(s => {
        const pages = s.site.pages.map(p => {
          if (p.id !== s.activePageId) return p
          const idx = p.sections.findIndex(sec => sec.id === id)
          if (idx <= 0) return p
          const sections = [...p.sections]
          ;[sections[idx-1], sections[idx]] = [sections[idx], sections[idx-1]]
          return { ...p, sections }
        })
        return { site: { ...s.site, pages } }
      }),

      moveSectionDown: (id) => set(s => {
        const pages = s.site.pages.map(p => {
          if (p.id !== s.activePageId) return p
          const idx = p.sections.findIndex(sec => sec.id === id)
          if (idx >= p.sections.length-1) return p
          const sections = [...p.sections]
          ;[sections[idx], sections[idx+1]] = [sections[idx+1], sections[idx]]
          return { ...p, sections }
        })
        return { site: { ...s.site, pages } }
      }),

      moveSectionToTop: (id) => set(s => {
        const pages = s.site.pages.map(p => {
          if (p.id !== s.activePageId) return p
          const idx = p.sections.findIndex(sec => sec.id === id)
          if (idx <= 0) return p
          const sections = [...p.sections]
          const [moved] = sections.splice(idx, 1)
          sections.unshift(moved)
          return { ...p, sections }
        })
        return { site: { ...s.site, pages } }
      }),

      moveSectionToBottom: (id) => set(s => {
        const pages = s.site.pages.map(p => {
          if (p.id !== s.activePageId) return p
          const idx = p.sections.findIndex(sec => sec.id === id)
          if (idx === -1 || idx >= p.sections.length-1) return p
          const sections = [...p.sections]
          const [moved] = sections.splice(idx, 1)
          sections.push(moved)
          return { ...p, sections }
        })
        return { site: { ...s.site, pages } }
      }),

      updateSectionData: (id, key, value) => set(s => {
        const pages = s.site.pages.map(p =>
          p.id === s.activePageId ? {
            ...p,
            sections: p.sections.map(sec =>
              sec.id === id ? { ...sec, data: { ...sec.data, [key]: value } } : sec
            )
          } : p
        )
        return { site: { ...s.site, pages } }
      }),

      setSectionData: (id, data) => set(s => {
        const pages = s.site.pages.map(p =>
          p.id === s.activePageId ? {
            ...p,
            sections: p.sections.map(sec =>
              sec.id === id ? { ...sec, data } : sec
            )
          } : p
        )
        return { site: { ...s.site, pages } }
      }),

      setShowAddSection: (v) => set({ showAddSection: v, activeSectionId: null }),
      setAiLoading: (v) => set({ aiLoading: v }),

      loadSite: (site) => {
        // Ensure all pages and sections have IDs (AI-generated data won't)
        const fixed: SiteData = {
          ...site,
          id: site.id || uuid(),
          pages: site.pages.map(p => ({
            ...p,
            id: p.id || uuid(),
            sections: p.sections.map(sec => ({
              ...sec,
              id: sec.id || uuid(),
            }))
          }))
        }
        set({ site: fixed, activePageId: fixed.pages[0]?.id || '', activeSectionId: null })
      },
    }),
    { name: 'siteforge-v2' }
  )
)

export const getActivePage = (s: BuilderState) =>
  s.site.pages.find(p => p.id === s.activePageId)

export const getActiveSection = (s: BuilderState) => {
  const page = s.site.pages.find(p => p.id === s.activePageId)
  return page?.sections.find(sec => sec.id === s.activeSectionId)
}
