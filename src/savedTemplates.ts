// User's personal template library, persisted in localStorage.
// Two sources: explicitly "Save as template" by the user, and auto-saved when
// they analyze an existing website (the page structure is preserved as a
// reusable pattern).

import type { SiteData } from './types'

const KEY = 'siteforge-saved-templates-v1'

export interface SavedTemplate {
  id: string
  name: string
  description: string
  source: 'manual' | 'analyzed'
  /** Full site spec — drop straight into store.loadSite() */
  site: SiteData
  /** Hero image is used as the preview thumbnail. */
  preview?: string
  createdAt: number
}

function load(): SavedTemplate[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}

function save(arr: SavedTemplate[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(arr)) } catch {}
}

export function listSavedTemplates(): SavedTemplate[] {
  return load().sort((a, b) => b.createdAt - a.createdAt)
}

export function saveTemplate(input: Omit<SavedTemplate, 'id'|'createdAt'>): SavedTemplate {
  const arr = load()
  const item: SavedTemplate = { ...input, id: `tpl-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, createdAt: Date.now() }
  arr.push(item)
  save(arr)
  return item
}

export function deleteSavedTemplate(id: string): void {
  save(load().filter(t => t.id !== id))
}

/**
 * Pull the best preview image from a site spec — first hero image, otherwise
 * first about image, otherwise the logo.
 */
export function previewFor(site: SiteData): string {
  for (const p of site.pages) {
    for (const s of p.sections) {
      if (s.type === 'hero' && s.data?.image) return s.data.image
      if (s.type === 'about' && s.data?.image) return s.data.image
    }
  }
  return site.logo || ''
}
