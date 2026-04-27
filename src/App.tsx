import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import JSZip from 'jszip'
import { useStore, getActivePage, getActiveSection, undo, redo } from './store'
import { SECTION_DEFS, SECTION_GROUPS } from './sections'
import { BLOCKS, BLOCK_CATEGORIES, type Block } from './blocks'
import { exportSite, renderPage, renderPreviewBundle } from './renderer'
import { IMAGES, IMAGE_CATEGORIES, searchImages, type LibraryImage } from './imageLibrary'
import { COUNTRY_LIST, COUNTRIES, DEFAULT_COUNTRY, type CountryCode } from './locale/profiles'
import { PERSONAS, PERSONA_LIST, pickPersona, type PersonaId } from './personas'
import { TEMPLATES, type SiteTemplate } from './templates'
import { listSavedTemplates, saveTemplate, deleteSavedTemplate, previewFor, type SavedTemplate } from './savedTemplates'
import { v4 as uuid } from 'uuid'
import type { SectionType, Theme } from './types'
import './index.css'

// ── Theme tokens ──────────────────────────────────────────────
const DARK  = { bg:'#0E1625', surface:'#111d2e', card:'#162032', border:'#1e2d42', green:'#00c758', blue:'#3080ff', orange:'#fe6e00', text:'#ffffff', muted:'#6a7282', dimmed:'#3a4a5c' }
const LIGHT = { bg:'#f0f4f8', surface:'#ffffff', card:'#f8fafc', border:'#e2e8f0', green:'#00a847', blue:'#2563eb', orange:'#ea6300', text:'#0f172a', muted:'#64748b', dimmed:'#94a3b8' }

const FONTS = ['Inter','Poppins','Raleway','Montserrat','Nunito','DM Sans','Playfair Display','Merriweather','Roboto','Open Sans']
const THEMES_PRESETS: { name:string; theme: Partial<Theme> }[] = [
  { name:'Ocean Blue',    theme:{ primaryColor:'#2563eb', secondaryColor:'#7c3aed', accentColor:'#06b6d4', style:'light' } },
  { name:'Forest Green',  theme:{ primaryColor:'#16a34a', secondaryColor:'#059669', accentColor:'#84cc16', style:'light' } },
  { name:'Sunset',        theme:{ primaryColor:'#ea580c', secondaryColor:'#dc2626', accentColor:'#f59e0b', style:'light' } },
  { name:'Royal Purple',  theme:{ primaryColor:'#9333ea', secondaryColor:'#6366f1', accentColor:'#ec4899', style:'light' } },
  { name:'Midnight',      theme:{ primaryColor:'#3080ff', secondaryColor:'#00c758', accentColor:'#fe6e00', style:'dark' } },
  { name:'Rose Gold',     theme:{ primaryColor:'#be185d', secondaryColor:'#9d174d', accentColor:'#f59e0b', style:'light' } },
]

// ── Small UI helpers ───────────────────────────────────────────
function Btn({ children, onClick, color='primary', size='sm', disabled=false, full=false, style:sx={} }: any) {
  const colors: Record<string,string> = { primary:'#2563eb', green:'#00c758', red:'#ef4444', ghost:'transparent', dark:'#111827' }
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding:size==='sm'?'7px 14px':'11px 22px', borderRadius:8, background:colors[color]||color, color: color==='ghost'?'inherit':'#fff', fontSize:size==='sm'?11:13, fontWeight:700, border:color==='ghost'?'1px solid currentColor':'none', cursor:disabled?'not-allowed':'pointer', opacity:disabled?.5:1, width:full?'100%':'auto', ...sx }}>
      {children}
    </button>
  )
}

function Label({ children }: any) {
  return <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'0.07em', marginBottom:5 }}>{children}</div>
}

// ── Section Preview (rendered in iframe) ─────────────────────
function SiteCanvas({ B, onMagicEdit, openImagePicker }: { B: typeof DARK; onMagicEdit: () => void; openImagePicker: (cb:(url:string)=>void) => void }) {
  const store = useStore()
  const page = getActivePage(store)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [device, setDevice] = useState<'desktop'|'tablet'|'mobile'>('desktop')
  const widths: Record<typeof device, string> = { desktop: '100%', tablet: '768px', mobile: '390px' }

  // Listen for clicks/edits from inside the iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const data = e.data
      if (!data || typeof data !== 'object') return
      if (data.type === 'section-click' && data.id) {
        store.setActiveSection(data.id)
      } else if (data.type === 'field-update' && data.sectionId && data.fieldKey) {
        const page = getActivePage(useStore.getState())
        const sec = page?.sections.find(s => s.id === data.sectionId)
        const current = sec?.data[data.fieldKey]
        if (current !== data.value) {
          store.updateSectionData(data.sectionId, data.fieldKey, data.value)
        }
      } else if (data.type === 'image-click' && data.sectionId && data.fieldKey) {
        store.setActiveSection(data.sectionId)
        openImagePicker((url) => {
          useStore.getState().updateSectionData(data.sectionId, data.fieldKey, url)
        })
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [store, openImagePicker])

  // Send the active section to the iframe so it highlights it
  useEffect(() => {
    if (!iframeRef.current?.contentWindow || !store.activeSectionId) return
    iframeRef.current.contentWindow.postMessage({ type:'set-active', id:store.activeSectionId }, '*')
  }, [store.activeSectionId])

  if (!page) return null
  const html = renderPage(store.site, page, true)
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:B.surface, overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, padding:'8px 16px', borderBottom:`1px solid ${B.border}`, background:B.bg, flexShrink:0 }}>
        <div style={{ fontSize:11, color:B.muted }}>
          <strong style={{ color:B.text }}>{page.name}</strong>
        </div>
        <div style={{ display:'flex', gap:4, alignItems:'center' }}>
          {(['desktop','tablet','mobile'] as const).map(d => (
            <button key={d} onClick={()=>setDevice(d)} title={d}
              style={{ width:30, height:26, borderRadius:6, border:`1px solid ${device===d?B.green:B.border}`, background:device===d?`${B.green}20`:'transparent', color:device===d?B.green:B.muted, fontSize:13, cursor:'pointer' }}>
              {d==='desktop'?'🖥':d==='tablet'?'📱':'📱'}
            </button>
          ))}
          <div style={{ width:8 }} />
          <button onClick={onMagicEdit}
            style={{ fontSize:11, padding:'5px 12px', borderRadius:7, background:B.green, border:'none', color:B.bg, fontWeight:800, cursor:'pointer' }}>
            ✨ Magic Edit Page
          </button>
          <button onClick={()=>{
              const html = renderPreviewBundle(store.site, store.activePageId)
              const w = window.open('','_blank')
              if (!w) { alert('Pop-up blocked. Allow pop-ups for this site to use Full Tab.'); return }
              w.document.write(html); w.document.close()
            }}
            style={{ fontSize:11, padding:'5px 12px', borderRadius:7, background:B.card, border:`1px solid ${B.border}`, color:B.muted, cursor:'pointer' }}>
            ⛶ Full Tab
          </button>
        </div>
      </div>
      <div style={{ flex:1, display:'flex', justifyContent:'center', overflow:'auto', background:device==='desktop'?'transparent':'#222', padding:device==='desktop'?0:'20px 12px' }}>
        <iframe
          ref={iframeRef}
          key={page.id + JSON.stringify(store.site.theme) + page.sections.length}
          srcDoc={html}
          style={{ flex:device==='desktop'?1:'none', border:device==='desktop'?'none':`1px solid ${B.border}`, borderRadius:device==='desktop'?0:14, width:widths[device], maxWidth:'100%', height:'100%', background:'#fff', boxShadow:device==='desktop'?'none':'0 12px 40px rgba(0,0,0,.3)' }}
          title="Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  )
}

// ── Left sidebar: Pages + Sections ────────────────────────────
function LeftPanel({ B }: { B: typeof DARK }) {
  const store = useStore()
  const activePage = getActivePage(store)
  const [newPageName, setNewPageName] = useState('')
  const [addingPage, setAddingPage] = useState(false)
  const inp = { background:B.card, border:`1px solid ${B.border}`, borderRadius:7, padding:'7px 10px', color:B.text, fontSize:12, outline:'none', width:'100%', boxSizing:'border-box' as const }

  return (
    <div style={{ width:220, background:B.bg, borderRight:`1px solid ${B.border}`, display:'flex', flexDirection:'column', flexShrink:0, overflow:'hidden' }}>
      {/* Pages */}
      <div style={{ padding:'12px 10px', borderBottom:`1px solid ${B.border}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em' }}>Pages</div>
          <button onClick={()=>setAddingPage(true)} style={{ fontSize:18, background:'none', border:'none', color:B.green, cursor:'pointer', lineHeight:1 }}>+</button>
        </div>
        {store.site.pages.map(p => (
          <div key={p.id} onClick={()=>store.setActivePage(p.id)}
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 10px', borderRadius:8, marginBottom:3, cursor:'pointer', background:store.activePageId===p.id?`${B.green}18`:B.card, border:`1px solid ${store.activePageId===p.id?B.green:B.border}` }}>
            <span style={{ fontSize:12, fontWeight:600, color:store.activePageId===p.id?B.green:B.text }}>📄 {p.name}</span>
            {store.site.pages.length>1 && <button onClick={e=>{e.stopPropagation();store.deletePage(p.id)}} style={{ background:'none', border:'none', color:B.muted, cursor:'pointer', fontSize:12 }}>✕</button>}
          </div>
        ))}
        {addingPage && (
          <div style={{ marginTop:8 }}>
            <input autoFocus value={newPageName} onChange={e=>setNewPageName(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'&&newPageName.trim()){ store.addPage(newPageName.trim()); setNewPageName(''); setAddingPage(false) } if(e.key==='Escape') setAddingPage(false) }}
              placeholder="Page name..." style={inp} />
            <div style={{ display:'flex', gap:6, marginTop:6 }}>
              <Btn color={B.green} onClick={()=>{ if(newPageName.trim()){ store.addPage(newPageName.trim()); setNewPageName(''); setAddingPage(false) } }}>Add</Btn>
              <Btn color='ghost' onClick={()=>setAddingPage(false)}>Cancel</Btn>
            </div>
          </div>
        )}
      </div>

      {/* Sections */}
      <div style={{ flex:1, overflowY:'auto', padding:'10px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em' }}>Sections</div>
          <button onClick={()=>store.setShowAddSection(true)} style={{ fontSize:18, background:'none', border:'none', color:B.green, cursor:'pointer', lineHeight:1 }}>+</button>
        </div>
        {activePage?.sections.map((sec) => {
          const def = SECTION_DEFS[sec.type]
          const active = store.activeSectionId === sec.id
          return (
            <div key={sec.id} onClick={()=>store.setActiveSection(sec.id)}
              style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 10px', borderRadius:8, marginBottom:3, cursor:'pointer', background:active?`${B.green}18`:B.card, border:`1px solid ${active?B.green:B.border}` }}>
              <span style={{ fontSize:12, fontWeight:600, color:active?B.green:B.text }}>
                {def?.icon||'◆'} {def?.name||sec.type}
              </span>
              <div style={{ display:'flex', gap:1 }}>
                <button onClick={e=>{e.stopPropagation();store.moveSectionToTop(sec.id)}} style={{ background:'none', border:'none', color:B.muted, cursor:'pointer', fontSize:10, padding:'2px 3px' }} title="Move to top">⤒</button>
                <button onClick={e=>{e.stopPropagation();store.moveSectionUp(sec.id)}} style={{ background:'none', border:'none', color:B.muted, cursor:'pointer', fontSize:11, padding:'2px 3px' }} title="Move up">↑</button>
                <button onClick={e=>{e.stopPropagation();store.moveSectionDown(sec.id)}} style={{ background:'none', border:'none', color:B.muted, cursor:'pointer', fontSize:11, padding:'2px 3px' }} title="Move down">↓</button>
                <button onClick={e=>{e.stopPropagation();store.moveSectionToBottom(sec.id)}} style={{ background:'none', border:'none', color:B.muted, cursor:'pointer', fontSize:10, padding:'2px 3px' }} title="Move to bottom">⤓</button>
                <button onClick={e=>{e.stopPropagation();store.deleteSection(sec.id)}} style={{ background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize:11, padding:'2px 3px' }} title="Delete">✕</button>
              </div>
            </div>
          )
        })}
        <button onClick={()=>store.setShowAddSection(true)}
          style={{ width:'100%', marginTop:8, padding:'8px', borderRadius:8, border:`2px dashed ${B.border}`, background:'transparent', color:B.muted, fontSize:12, cursor:'pointer', fontWeight:600 }}>
          + Add Section
        </button>
      </div>
    </div>
  )
}

// ── Right panel: Edit section or theme ────────────────────────
function RightPanel({ B, openImagePicker }: { B: typeof DARK; openImagePicker: (cb:(url:string)=>void) => void }) {
  const store = useStore()
  const section = getActiveSection(store)
  const tab = store.rightTab
  const setTab = store.setRightTab
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [blockCategory, setBlockCategory] = useState('All')
  const [blockQuery, setBlockQuery] = useState('')

  const inp: React.CSSProperties = { background:B.card, border:`1px solid ${B.border}`, borderRadius:8, padding:'9px 12px', color:B.text, fontSize:12, outline:'none', width:'100%', boxSizing:'border-box', fontFamily:'inherit' }

  const [aiError, setAiError] = useState('')
  const askAi = async (overridePrompt?: string) => {
    const text = (overridePrompt ?? aiPrompt).trim()
    if (!text || !section) return
    setAiLoading(true)
    setAiError('')
    try {
      const def = SECTION_DEFS[section.type]
      const res = await fetch('/api/ai-section', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          sectionType: section.type,
          currentData: section.data,
          siteName: store.site.name,
          prompt: text,
          fields: def?.fields || [],
          brandVoice: store.site.brandVoice || '',
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'AI request failed')
      if (data.updatedData && Object.keys(data.updatedData).length > 0) {
        store.setSectionData(section.id, { ...section.data, ...data.updatedData })
        setAiPrompt('')
      } else {
        setAiError('AI returned no changes. Try rephrasing.')
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI request failed')
    }
    setAiLoading(false)
  }

  const filteredBlocks = BLOCKS.filter(b => {
    if (blockCategory !== 'All' && b.category !== blockCategory) return false
    if (blockQuery && !`${b.name} ${b.description} ${b.category}`.toLowerCase().includes(blockQuery.toLowerCase())) return false
    return true
  })

  const addBlock = (block: Block) => {
    const newSec = { id: uuid(), type: block.type, data: { ...block.data } }
    const page = getActivePage(store)
    if (!page) return
    const updatedSections = [...page.sections, newSec]
    const updatedPages = store.site.pages.map(p => p.id === page.id ? { ...p, sections: updatedSections } : p)
    useStore.setState({ site: { ...store.site, pages: updatedPages }, activeSectionId: newSec.id, rightTab: 'edit' })
  }

  const TABS = [['edit','✏️ Edit'],['theme','🎨 Theme'],['ai','✦ AI'],['suggest','💡 Ideas'],['components','◈ Blocks']] as const

  return (
    <div style={{ width:300, background:B.bg, borderLeft:`1px solid ${B.border}`, display:'flex', flexDirection:'column', flexShrink:0, overflow:'hidden' }}>
      {/* Tab bar */}
      <div style={{ display:'flex', borderBottom:`1px solid ${B.border}` }}>
        {TABS.map(([t,l]) => (
          <button key={t} onClick={()=>setTab(t as any)} style={{ flex:1, padding:'10px 4px', fontSize:10, fontWeight:700, border:'none', cursor:'pointer', background:'transparent', color:tab===t?B.green:B.muted, borderBottom:tab===t?`2px solid ${B.green}`:'2px solid transparent' }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 12px' }}>

        {/* EDIT TAB */}
        {tab==='edit' && (
          !section ? (
            <div style={{ textAlign:'center', padding:'32px 0', color:B.muted }}>
              <div style={{ fontSize:24, marginBottom:8 }}>✏️</div>
              <div style={{ fontSize:12 }}>Click a section on the left or in the preview to start editing</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ fontSize:13, fontWeight:800, marginBottom:4 }}>
                {SECTION_DEFS[section.type]?.icon} {SECTION_DEFS[section.type]?.name}
              </div>
              {SECTION_DEFS[section.type]?.fields.map(field => {
                const val = section.data[field.key]
                if (field.type === 'boolean') return (
                  <div key={field.key}>
                    <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                      <input type="checkbox" checked={!!val} onChange={e=>store.updateSectionData(section.id, field.key, e.target.checked)} />
                      <span style={{ fontSize:12, fontWeight:600 }}>{field.label}</span>
                    </label>
                  </div>
                )
                if (field.type === 'image') return (
                  <div key={field.key}>
                    <Label>{field.label}</Label>
                    {val && <img src={val} alt="" style={{ width:'100%', height:80, objectFit:'cover', borderRadius:8, marginBottom:8 }} />}
                    <Btn color={B.blue} full onClick={()=>openImagePicker(url=>store.updateSectionData(section.id, field.key, url))}>🖼️ Browse Image Library</Btn>
                    <div style={{ fontSize:10, color:B.muted, marginTop:6, marginBottom:4 }}>or paste a URL:</div>
                    <input value={val||''} onChange={e=>store.updateSectionData(section.id, field.key, e.target.value)} placeholder="https://images.unsplash.com/..." style={inp} />
                  </div>
                )
                if (field.type === 'list') return (
                  <div key={field.key}>
                    <Label>{field.label}</Label>
                    <div style={{ fontSize:10, color:B.muted, marginBottom:6, lineHeight:1.5 }}>
                      Click the AI tab to regenerate content, or edit the JSON below directly.
                    </div>
                    <textarea value={JSON.stringify(val, null, 2)} rows={8}
                      onChange={e=>{ try { store.updateSectionData(section.id, field.key, JSON.parse(e.target.value)) } catch {} }}
                      style={{ ...inp, resize:'vertical', fontFamily:'monospace', fontSize:10 }} />
                  </div>
                )
                if (field.type === 'textarea') return (
                  <div key={field.key}>
                    <Label>{field.label}</Label>
                    <textarea value={val||''} rows={3} placeholder={field.placeholder}
                      onChange={e=>store.updateSectionData(section.id, field.key, e.target.value)}
                      style={{ ...inp, resize:'vertical' }} />
                  </div>
                )
                return (
                  <div key={field.key}>
                    <Label>{field.label}</Label>
                    <input value={val||''} placeholder={field.placeholder}
                      onChange={e=>store.updateSectionData(section.id, field.key, e.target.value)}
                      style={inp} />
                  </div>
                )
              })}
              <button onClick={()=>store.deleteSection(section.id)}
                style={{ marginTop:8, padding:'8px', borderRadius:8, background:'#ef444420', border:'1px solid #ef444460', color:'#ef4444', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                🗑 Delete Section
              </button>
            </div>
          )
        )}

        {/* THEME TAB */}
        {tab==='theme' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <Label>Site Name</Label>
              <input value={store.site.name} onChange={e=>store.setSiteName(e.target.value)} style={inp} />
            </div>
            <div>
              <Label>Tagline</Label>
              <input value={store.site.tagline} onChange={e=>store.setSiteTagline(e.target.value)} style={inp} />
            </div>
            <div>
              <Label>Logo</Label>
              {store.site.logo && <img src={store.site.logo} alt="logo" style={{ width:64, height:64, objectFit:'contain', borderRadius:8, background:B.surface, padding:6, marginBottom:8, display:'block' }} />}
              <input type="file" accept="image/*" onChange={e=>{
                const file = e.target.files?.[0]; if (!file) return
                if (file.size > 1024 * 1024) { alert('Logo too large (max 1MB).'); return }
                const reader = new FileReader()
                reader.onload = () => store.setSiteLogo(String(reader.result))
                reader.readAsDataURL(file)
                e.currentTarget.value = ''
              }}
              style={{ ...inp, padding:6, fontSize:11 }} />
              {store.site.logo && (
                <Btn color='ghost' onClick={()=>store.setSiteLogo('')} style={{ marginTop:6 }}>Remove logo</Btn>
              )}
            </div>

            <div>
              <Label>Favicon (browser tab icon)</Label>
              {store.site.favicon && <img src={store.site.favicon} alt="favicon" style={{ width:32, height:32, objectFit:'contain', borderRadius:6, background:B.surface, padding:4, marginBottom:8, display:'block' }} />}
              <input type="file" accept="image/png,image/svg+xml,image/x-icon,image/jpeg,image/webp" onChange={e=>{
                const file = e.target.files?.[0]; if (!file) return
                if (file.size > 256 * 1024) { alert('Favicon too large (max 256KB).'); return }
                const reader = new FileReader()
                reader.onload = () => store.setFavicon(String(reader.result))
                reader.readAsDataURL(file)
                e.currentTarget.value = ''
              }}
              style={{ ...inp, padding:6, fontSize:11 }} />
              <div style={{ fontSize:10, color:B.muted, marginTop:4, lineHeight:1.5 }}>If empty, your logo is used. PNG/SVG recommended, under 256 KB.</div>
            </div>

            <div>
              <Label>Country</Label>
              <select value={store.site.country || DEFAULT_COUNTRY} onChange={e=>store.setCountry(e.target.value as CountryCode)} style={inp}>
                {COUNTRY_LIST.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name} — {c.currencySymbol} {c.currencyCode}</option>)}
              </select>
              <div style={{ fontSize:10, color:B.muted, marginTop:4, lineHeight:1.5 }}>Drives currency labels, phone format, privacy law, and AI prompt locale.</div>
            </div>

            <div style={{ background:B.card, border:`1px solid ${B.border}`, borderRadius:10, padding:12 }}>
              <Label>✦ Brand voice (paste 2–3 things you have written)</Label>
              <textarea rows={6} value={store.site.brandVoice || ''} onChange={e=>store.setBrandVoice(e.target.value)}
                placeholder={`Paste a few paragraphs of your real writing — old emails, social posts, brochures, an "about" you have written before. AI will match the tone, vocabulary, and rhythm in everything it writes for you.\n\nExample:\nWe are a family-run plumbing crew based in Krugersdorp...\n(your paragraph 2)\n(your paragraph 3)`}
                style={{ ...inp, resize:'vertical', fontSize:12, lineHeight:1.6, fontFamily:'inherit' }} />
              <div style={{ fontSize:10, color:B.muted, marginTop:6, lineHeight:1.5 }}>
                Used by Magic Build, Magic Edit, and section-AI to match your tone. Leave empty to use defaults.
                {store.site.brandVoice && store.site.brandVoice.length > 50 && <span style={{ color:B.green, fontWeight:700, display:'block', marginTop:4 }}>✓ {store.site.brandVoice.length} characters · AI will match this style</span>}
              </div>
            </div>

            <div style={{ background:B.card, border:`1px solid ${B.border}`, borderRadius:10, padding:12 }}>
              <Label>Floating contact widget</Label>
              <label style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <input type="checkbox" checked={!!store.site.widget?.enabled} onChange={e=>store.setWidget({ enabled: e.target.checked })} />
                <span style={{ fontSize:12, fontWeight:600 }}>Show on every page</span>
              </label>
              {store.site.widget?.enabled && <>
                <select value={store.site.widget.channel} onChange={e=>store.setWidget({ channel: e.target.value as any })} style={{ ...inp, marginBottom:6 }}>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                  <option value="tel">Phone call</option>
                </select>
                <input value={store.site.widget.number} onChange={e=>store.setWidget({ number: e.target.value })} placeholder="Phone number (e.g. 0710000000)" style={{ ...inp, marginBottom:6 }} />
                <textarea rows={2} value={store.site.widget.message} onChange={e=>store.setWidget({ message: e.target.value })} placeholder="Pre-filled message..." style={{ ...inp, resize:'vertical' }} />
              </>}
            </div>

            <div>
              <Label>Color Presets</Label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                {THEMES_PRESETS.map(p => (
                  <button key={p.name} onClick={()=>store.setTheme(p.theme)}
                    style={{ padding:'8px', borderRadius:8, border:`1px solid ${B.border}`, background:B.card, cursor:'pointer', textAlign:'center' as const }}>
                    <div style={{ display:'flex', gap:4, justifyContent:'center', marginBottom:5 }}>
                      <div style={{ width:16, height:16, borderRadius:'50%', background:(p.theme as any).primaryColor }} />
                      <div style={{ width:16, height:16, borderRadius:'50%', background:(p.theme as any).secondaryColor }} />
                    </div>
                    <div style={{ fontSize:9, color:B.muted, fontWeight:600 }}>{p.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Primary Color</Label>
              <div style={{ display:'flex', gap:8 }}>
                <input type="color" value={store.site.theme.primaryColor} onChange={e=>store.setTheme({ primaryColor:e.target.value })}
                  style={{ width:42, height:38, border:'none', background:'none', cursor:'pointer', borderRadius:8, padding:2 }} />
                <input value={store.site.theme.primaryColor} onChange={e=>store.setTheme({ primaryColor:e.target.value })} style={{ ...inp, fontFamily:'monospace', flex:1 }} />
              </div>
            </div>
            <div>
              <Label>Secondary Color</Label>
              <div style={{ display:'flex', gap:8 }}>
                <input type="color" value={store.site.theme.secondaryColor} onChange={e=>store.setTheme({ secondaryColor:e.target.value })}
                  style={{ width:42, height:38, border:'none', background:'none', cursor:'pointer', borderRadius:8, padding:2 }} />
                <input value={store.site.theme.secondaryColor} onChange={e=>store.setTheme({ secondaryColor:e.target.value })} style={{ ...inp, fontFamily:'monospace', flex:1 }} />
              </div>
            </div>
            <div>
              <Label>Heading Font</Label>
              <select value={store.site.theme.fontHeading} onChange={e=>store.setTheme({ fontHeading:e.target.value })}
                style={{ ...inp }}>
                {FONTS.map(f=><option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <Label>Body Font</Label>
              <select value={store.site.theme.fontBody} onChange={e=>store.setTheme({ fontBody:e.target.value })}
                style={{ ...inp }}>
                {FONTS.map(f=><option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <Label>Border Radius</Label>
              <select value={store.site.theme.borderRadius} onChange={e=>store.setTheme({ borderRadius:e.target.value as any })}
                style={{ ...inp }}>
                {['none','small','medium','large','pill'].map(r=><option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <Label>Style</Label>
              <div style={{ display:'flex', gap:8 }}>
                {(['light','dark'] as const).map(s => (
                  <button key={s} onClick={()=>store.setTheme({ style:s })}
                    style={{ flex:1, padding:'8px', borderRadius:8, border:`1px solid ${store.site.theme.style===s?B.green:B.border}`, background:store.site.theme.style===s?`${B.green}15`:B.card, color:store.site.theme.style===s?B.green:B.muted, fontSize:12, fontWeight:700, cursor:'pointer', textTransform:'capitalize' as const }}>
                    {s==='light'?'☀️ Light':'🌑 Dark'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI TAB */}
        {tab==='ai' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ fontSize:13, fontWeight:800, marginBottom:4 }}>✦ AI Assistant</div>
            {!section && <div style={{ fontSize:11, color:B.muted, lineHeight:1.6 }}>Select a section first, then tell the AI what to do.</div>}
            {section && (
              <>
                <div style={{ fontSize:11, color:B.muted }}>Selected: <strong style={{ color:B.text }}>{SECTION_DEFS[section.type]?.name}</strong></div>
                <div>
                  <Label>Tell AI what to do</Label>
                  <textarea value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)} rows={4}
                    placeholder={`Examples:\n• "Rewrite the headline to be more powerful"\n• "Add 2 more services about cleaning and maintenance"\n• "Make the copy more professional and formal"\n• "Update contact details: phone 071 000 0000"`}
                    style={{ ...inp, resize:'none', lineHeight:1.6 }} />
                  <Btn color={B.green} full onClick={()=>askAi()} disabled={aiLoading} style={{ marginTop:8 }}>
                    {aiLoading ? '⏳ Working...' : '✦ Apply Changes'}
                  </Btn>
                </div>
                {aiError && <div style={{ background:'#ef444420', border:'1px solid #ef4444', borderRadius:8, padding:10, fontSize:11, color:'#ef4444' }}>{aiError}</div>}
                <div style={{ background:B.card, borderRadius:10, padding:12, border:`1px solid ${B.border}` }}>
                  <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Quick actions (one-click)</div>
                  {['Rewrite all copy to be more compelling','Make tone more professional','Make tone more friendly and casual','Add 2 more items','Shorten all text by 40%'].map(q=>(
                    <button key={q} disabled={aiLoading} onClick={()=>askAi(q)}
                      style={{ display:'block', width:'100%', textAlign:'left' as const, padding:'7px 10px', marginBottom:5, borderRadius:7, background:B.surface, border:`1px solid ${B.border}`, color:B.muted, fontSize:11, cursor:aiLoading?'wait':'pointer', opacity:aiLoading?.5:1 }}>
                      → {q}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* AI SUGGESTIONS TAB */}
        {tab==='suggest' && <SuggestPanel B={B} />}

        {/* BLOCK LIBRARY TAB */}
        {tab==='components' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ fontSize:13, fontWeight:800 }}>◈ Block Library</div>
            <div style={{ fontSize:11, color:B.muted, lineHeight:1.6 }}>Premium pre-built sections you can drop into any page. Each block has unique copy and styling — fully editable after.</div>
            <input value={blockQuery} onChange={e=>setBlockQuery(e.target.value)}
              placeholder="Search blocks..." style={inp} />
            <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
              {BLOCK_CATEGORIES.map(cat => (
                <button key={cat} onClick={()=>setBlockCategory(cat)}
                  style={{ padding:'4px 10px', borderRadius:999, background:blockCategory===cat?B.green:B.card, color:blockCategory===cat?B.bg:B.muted, border:`1px solid ${blockCategory===cat?B.green:B.border}`, fontSize:10, fontWeight:700, cursor:'pointer' }}>
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ fontSize:10, color:B.muted, marginTop:4 }}>{filteredBlocks.length} block{filteredBlocks.length!==1?'s':''}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {filteredBlocks.map(block => (
                <motion.div key={block.id} whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
                  onClick={()=>addBlock(block)}
                  style={{ background:B.card, borderRadius:10, padding:12, cursor:'pointer', border:`1px solid ${B.border}`, display:'flex', gap:10, alignItems:'flex-start', transition:'border-color 0.15s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor = B.green }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor = B.border }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:B.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{block.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:6, marginBottom:3 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:B.text }}>{block.name}</div>
                      <span style={{ fontSize:9, padding:'2px 6px', borderRadius:999, background:`${B.blue}20`, color:B.blue, fontWeight:700, flexShrink:0 }}>{block.category}</span>
                    </div>
                    <div style={{ fontSize:10, color:B.muted, lineHeight:1.5 }}>{block.description}</div>
                    <div style={{ fontSize:9, color:B.green, fontWeight:700, marginTop:6 }}>+ Click to add</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── AI Suggestions Panel ──────────────────────────────────────
type Suggestion = {
  title: string
  reason: string
  action: 'add-section' | 'apply-block' | 'replace-section-data' | 'set-theme' | 'edit-page' | 'note'
  payload?: any
}
function SuggestPanel({ B }: { B: typeof DARK }) {
  const store = useStore()
  const [loading, setLoading] = useState(false)
  const [auditing, setAuditing] = useState(false)
  const [error, setError] = useState('')
  const [items, setItems] = useState<Suggestion[]>([])
  const [audit, setAudit] = useState<any>(null)

  const refresh = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/suggest', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ site: store.site, activePageId: store.activePageId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch suggestions')
      setItems(data.suggestions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    }
    setLoading(false)
  }

  const runAudit = async () => {
    setAuditing(true); setError('')
    try {
      const res = await fetch('/api/audit', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ site: store.site })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to audit')
      setAudit(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    }
    setAuditing(false)
  }

  const apply = (s: Suggestion) => {
    const page = getActivePage(store)
    if (!page) return
    if (s.action === 'add-section' && s.payload?.type) {
      store.addSection(s.payload.type as SectionType)
    } else if (s.action === 'replace-section-data' && s.payload?.sectionId && s.payload?.data) {
      const sec = page.sections.find(x => x.id === s.payload.sectionId)
      if (sec) store.setSectionData(sec.id, { ...sec.data, ...s.payload.data })
    } else if (s.action === 'set-theme' && s.payload) {
      store.setTheme(s.payload)
    } else if (s.action === 'apply-block' && s.payload?.blockId) {
      const b = BLOCKS.find(x => x.id === s.payload.blockId)
      if (b) {
        const newSec = { id: uuid(), type: b.type, data: { ...b.data } }
        const updatedPages = store.site.pages.map(p => p.id === page.id ? { ...p, sections: [...p.sections, newSec] } : p)
        useStore.setState({ site: { ...store.site, pages: updatedPages }, activeSectionId: newSec.id, rightTab: 'edit' })
      }
    }
  }

  const scoreColor = (n: number) => n >= 80 ? B.green : n >= 60 ? '#f59e0b' : '#ef4444'
  const priColor: Record<string,string> = { high:'#ef4444', medium:'#f59e0b', low:B.muted }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:13, fontWeight:800 }}>💡 AI Ideas & Audit</div>
      <div style={{ fontSize:11, color:B.muted, lineHeight:1.6 }}>
        AI looks at your current site and tells you what to improve. <strong>Get ideas</strong> for one-click fixes; <strong>Run audit</strong> for a graded report.
      </div>
      <div style={{ display:'flex', gap:6 }}>
        <button onClick={refresh} disabled={loading||auditing}
          style={{ flex:1, padding:'10px', borderRadius:8, background:B.green, color:B.bg, fontSize:12, fontWeight:800, border:'none', cursor:(loading||auditing)?'wait':'pointer' }}>
          {loading ? '⏳ Ideas...' : '✦ Get ideas'}
        </button>
        <button onClick={runAudit} disabled={loading||auditing}
          style={{ flex:1, padding:'10px', borderRadius:8, background:B.blue, color:'#fff', fontSize:12, fontWeight:800, border:'none', cursor:(loading||auditing)?'wait':'pointer' }}>
          {auditing ? '⏳ Auditing...' : '⚖ Run audit'}
        </button>
      </div>
      {error && <div style={{ background:'#ef444420', border:'1px solid #ef4444', borderRadius:8, padding:10, fontSize:11, color:'#ef4444' }}>{error}</div>}

      {audit && (
        <div style={{ background:B.card, border:`1px solid ${B.border}`, borderRadius:12, padding:14 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <div style={{ fontSize:11, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em' }}>Score</div>
            <button onClick={()=>setAudit(null)} style={{ background:'none', border:'none', color:B.muted, fontSize:14, cursor:'pointer' }}>✕</button>
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:10 }}>
            <div style={{ fontSize:42, fontWeight:900, color:scoreColor(audit.score), lineHeight:1 }}>{audit.score}</div>
            <div style={{ fontSize:14, fontWeight:700, color:B.muted }}>/ 100 · {audit.grade}</div>
          </div>
          <div style={{ fontSize:11, color:B.muted, lineHeight:1.6, marginBottom:12 }}>{audit.summary}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:5, marginBottom:14 }}>
            {(audit.categories||[]).map((c: any, i: number) => (
              <div key={i}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                  <span style={{ fontSize:11, fontWeight:700 }}>{c.name}</span>
                  <span style={{ fontSize:11, fontWeight:800, color:scoreColor(c.score) }}>{c.score}</span>
                </div>
                <div style={{ height:5, background:B.surface, borderRadius:999 }}>
                  <div style={{ width:`${c.score}%`, height:'100%', background:scoreColor(c.score), borderRadius:999 }} />
                </div>
                <div style={{ fontSize:10, color:B.muted, marginTop:3, lineHeight:1.5 }}>{c.note}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:11, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Top fixes</div>
          {(audit.fixes||[]).map((f: any, i: number) => (
            <div key={i} style={{ paddingTop:8, borderTop:i>0?`1px solid ${B.border}`:'none', marginTop:i>0?8:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                <span style={{ fontSize:9, padding:'2px 6px', borderRadius:999, background:`${priColor[f.priority]}30`, color:priColor[f.priority], fontWeight:800, textTransform:'uppercase' }}>{f.priority}</span>
                <span style={{ fontSize:12, fontWeight:700 }}>{f.title}</span>
              </div>
              <div style={{ fontSize:11, color:B.muted, lineHeight:1.6 }}>{f.reason}</div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && !loading && !error && !audit && (
        <div style={{ background:B.card, border:`1px solid ${B.border}`, borderRadius:10, padding:14, fontSize:11, color:B.muted, lineHeight:1.6 }}>
          No suggestions yet. Use the buttons above to have AI review your site.
        </div>
      )}
      {items.map((s, i) => (
        <div key={i} style={{ background:B.card, border:`1px solid ${B.border}`, borderRadius:10, padding:12 }}>
          <div style={{ fontSize:12, fontWeight:800, marginBottom:5 }}>{s.title}</div>
          <div style={{ fontSize:11, color:B.muted, lineHeight:1.6, marginBottom:10 }}>{s.reason}</div>
          {s.action !== 'note' && s.action !== 'edit-page' && (
            <button onClick={()=>apply(s)} style={{ fontSize:11, padding:'6px 12px', borderRadius:7, background:B.green, color:B.bg, border:'none', fontWeight:700, cursor:'pointer' }}>
              Apply
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Image Picker Modal ────────────────────────────────────────
function ImagePickerModal({ B, onClose, onSelect }: { B: typeof DARK; onClose: () => void; onSelect: (url: string) => void }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('All')
  const [pasteUrl, setPasteUrl] = useState('')

  const results: LibraryImage[] = searchImages(query, category)

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onClose}>
      <motion.div initial={{ scale:.96 }} animate={{ scale:1 }}
        onClick={e=>e.stopPropagation()}
        style={{ background:B.surface, borderRadius:16, padding:20, width:780, maxWidth:'100%', maxHeight:'88vh', overflowY:'auto', border:`1px solid ${B.border}`, display:'flex', flexDirection:'column', gap:12 }}>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:18, fontWeight:900 }}>🖼️ Image Library</div>
            <div style={{ fontSize:11, color:B.muted, marginTop:2 }}>{IMAGES.length} curated stock photos. Click any to use.</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:B.muted, cursor:'pointer', fontSize:22 }}>✕</button>
        </div>

        <input value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="Search by keyword (e.g. plumbing, restaurant, office, gym)..."
          style={{ background:B.card, border:`1px solid ${B.border}`, borderRadius:8, padding:'10px 14px', color:B.text, fontSize:13, outline:'none' }} />

        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
          {IMAGE_CATEGORIES.map(c => (
            <button key={c} onClick={()=>setCategory(c)}
              style={{ padding:'4px 10px', borderRadius:999, background:category===c?B.green:B.card, color:category===c?B.bg:B.muted, border:`1px solid ${category===c?B.green:B.border}`, fontSize:10, fontWeight:700, cursor:'pointer' }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:8 }}>
          {results.map(img => (
            <div key={img.id}
              onClick={()=>{ onSelect(img.url); onClose() }}
              style={{ position:'relative', cursor:'pointer', borderRadius:8, overflow:'hidden', aspectRatio:'4/3', background:B.card, border:`2px solid transparent` }}
              onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor = B.green}}
              onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'}}>
              <img src={img.thumb} alt={img.alt} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent,rgba(0,0,0,.8))', color:'#fff', fontSize:10, padding:'14px 8px 6px', fontWeight:600 }}>
                {img.alt}
              </div>
            </div>
          ))}
          {results.length === 0 && (
            <div style={{ gridColumn:'1/-1', padding:'32px', textAlign:'center', color:B.muted, fontSize:12 }}>
              No images match your search. Try different keywords or paste a URL below.
            </div>
          )}
        </div>

        <div style={{ borderTop:`1px solid ${B.border}`, paddingTop:14, marginTop:4 }}>
          <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>Or paste any image URL</div>
          <div style={{ display:'flex', gap:6 }}>
            <input value={pasteUrl} onChange={e=>setPasteUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{ flex:1, background:B.card, border:`1px solid ${B.border}`, borderRadius:8, padding:'9px 12px', color:B.text, fontSize:12, outline:'none' }} />
            <button onClick={()=>{ if (pasteUrl.trim()) { onSelect(pasteUrl.trim()); onClose() } }}
              disabled={!pasteUrl.trim()}
              style={{ padding:'0 14px', borderRadius:8, background:B.green, color:B.bg, fontSize:12, fontWeight:800, border:'none', cursor:'pointer', opacity:pasteUrl.trim()?1:.4 }}>
              Use URL
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Welcome Modal (first-time experience) ─────────────────────
// ── Mobile / small-screen notice ──────────────────────────────
function MobileNotice({ B, onDismiss }: { B: typeof DARK; onDismiss: () => void }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.95)', zIndex:600, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <motion.div initial={{ scale:.94, y:10 }} animate={{ scale:1, y:0 }}
        style={{ background:B.surface, borderRadius:16, padding:30, width:'100%', maxWidth:420, textAlign:'center' as const, border:`1px solid ${B.border}` }}>
        <div style={{ fontSize:48, marginBottom:14 }}>🖥️</div>
        <div style={{ fontSize:20, fontWeight:900, marginBottom:10 }}>Best viewed on a desktop</div>
        <div style={{ fontSize:13, color:B.muted, lineHeight:1.7, marginBottom:22 }}>
          SiteForge is a full website builder with side panels, drag-to-reorder sections, and a live preview. It's tight on a phone screen.
          <br/><br/>
          Open <strong style={{ color:B.text }}>dashboard-neon-eight-82.vercel.app</strong> on a laptop or desktop for the full experience.
        </div>
        <div style={{ fontSize:11, color:B.muted, marginBottom:18, textAlign:'left' as const, padding:'12px 14px', background:B.card, borderRadius:8 }}>
          <strong style={{ color:B.text, display:'block', marginBottom:6 }}>What works on mobile:</strong>
          • Preview your generated sites<br/>
          • View AI Ideas / Audit results<br/>
          • Quick text edits<br/><br/>
          <strong style={{ color:B.text, display:'block', marginBottom:6 }}>What needs desktop:</strong>
          • Magic Build & Templates picker<br/>
          • Drag-to-reorder sections<br/>
          • Image library &amp; theme tab
        </div>
        <button onClick={onDismiss}
          style={{ padding:'12px 24px', borderRadius:10, background:B.green, color:B.bg, fontSize:13, fontWeight:800, border:'none', cursor:'pointer', width:'100%' }}>
          Continue on mobile anyway
        </button>
      </motion.div>
    </motion.div>
  )
}

function WelcomeModal({ B, onMagicBuild, onClose, onTemplates }: { B: typeof DARK; onMagicBuild: () => void; onClose: () => void; onTemplates: () => void }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.92)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <motion.div initial={{ scale:.94 }} animate={{ scale:1 }}
        style={{ background:B.surface, borderRadius:18, padding:36, width:540, maxWidth:'100%', textAlign:'center' as const, border:`1px solid ${B.border}` }}>
        <div style={{ width:56, height:56, borderRadius:14, background:`linear-gradient(135deg,${B.green},${B.blue})`, margin:'0 auto 18px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:900, color:B.bg }}>S</div>
        <div style={{ fontSize:24, fontWeight:900, marginBottom:10, letterSpacing:'-0.5px' }}>Welcome to SiteForge</div>
        <div style={{ fontSize:14, color:B.muted, lineHeight:1.7, marginBottom:26 }}>
          Build a real, professional website in minutes. Click anything in the preview to edit. Use ✨ Magic Build to have AI generate a complete site for you.
        </div>
        <div style={{ display:'flex', gap:10, flexDirection:'column' }}>
          <button onClick={onMagicBuild}
            style={{ padding:'14px', borderRadius:10, background:B.green, color:B.bg, fontSize:14, fontWeight:900, border:'none', cursor:'pointer' }}>
            ✨ Generate my website with AI
          </button>
          <button onClick={onTemplates}
            style={{ padding:'12px', borderRadius:10, background:'transparent', color:B.text, fontSize:13, fontWeight:700, border:`1px solid ${B.border}`, cursor:'pointer' }}>
            📚 Pick a template (plumber, salon, attorney, lodge…)
          </button>
          <button onClick={onClose}
            style={{ padding:'10px', borderRadius:10, background:'transparent', color:B.muted, fontSize:11, fontWeight:600, border:'none', cursor:'pointer' }}>
            Start with the default template
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Deploy Modal (post-ZIP download) ──────────────────────────
function DeployModal({ B, onClose, siteName }: { B: typeof DARK; onClose: () => void; siteName: string }) {
  const safeName = siteName.toLowerCase().replace(/\s+/g,'-')
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onClose}>
      <motion.div initial={{ scale:.95 }} animate={{ scale:1 }} onClick={e=>e.stopPropagation()}
        style={{ background:B.surface, borderRadius:16, padding:28, width:560, maxWidth:'100%', maxHeight:'90vh', overflowY:'auto', border:`1px solid ${B.border}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:900 }}>↓ Your site is downloaded</div>
            <div style={{ fontSize:12, color:B.muted, marginTop:4 }}>Now publish it for free in 60 seconds.</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:B.muted, cursor:'pointer', fontSize:22 }}>✕</button>
        </div>

        <div style={{ background:B.card, border:`1px solid ${B.border}`, borderRadius:12, padding:18, marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:B.green, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Recommended · No signup</div>
          <div style={{ fontSize:15, fontWeight:800, marginBottom:8 }}>1. Open Netlify Drop</div>
          <div style={{ fontSize:12, color:B.muted, lineHeight:1.6, marginBottom:12 }}>
            Drag the unzipped <strong style={{ color:B.text }}>{safeName}-website</strong> folder onto the Netlify Drop page. You'll get a live URL like <code style={{ background:B.surface, padding:'1px 6px', borderRadius:4 }}>{safeName}.netlify.app</code> instantly.
          </div>
          <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer"
            style={{ display:'inline-block', padding:'10px 18px', borderRadius:8, background:B.green, color:B.bg, fontSize:13, fontWeight:800, textDecoration:'none' }}>
            Open Netlify Drop →
          </a>
        </div>

        <div style={{ background:B.card, border:`1px solid ${B.border}`, borderRadius:12, padding:18, marginBottom:14 }}>
          <div style={{ fontSize:15, fontWeight:800, marginBottom:8 }}>2. Connect a custom domain (optional)</div>
          <div style={{ fontSize:12, color:B.muted, lineHeight:1.6 }}>
            In Netlify, go to <strong style={{ color:B.text }}>Site settings → Domain management</strong> and add your domain (e.g. yourbusiness.co.za). Netlify gives you the DNS records to add at your registrar.
          </div>
        </div>

        <div style={{ background:B.card, border:`1px solid ${B.border}`, borderRadius:12, padding:18 }}>
          <div style={{ fontSize:15, fontWeight:800, marginBottom:8 }}>3. Updating your site later</div>
          <div style={{ fontSize:12, color:B.muted, lineHeight:1.6 }}>
            Come back to SiteForge anytime — your project is auto-saved in this browser. Make changes, click <strong style={{ color:B.text }}>↓ Download ZIP</strong> again, then drag the new folder onto your Netlify site under <strong style={{ color:B.text }}>Deploys</strong>. The site updates in seconds.
          </div>
          <div style={{ fontSize:11, color:B.muted, marginTop:10, lineHeight:1.6 }}>
            Tip: Use <strong style={{ color:B.text }}>↓ Save Project</strong> in the top bar to export a backup file you can re-import on any computer.
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Templates Browser Modal ───────────────────────────────────
function TemplatesModal({ B, onClose, onPick, onPickSaved }: { B: typeof DARK; onClose: () => void; onPick: (t: SiteTemplate) => void; onPickSaved: (t: SavedTemplate) => void }) {
  const [saved, setSaved] = useState<SavedTemplate[]>(listSavedTemplates())
  const refresh = () => setSaved(listSavedTemplates())

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onClose}>
      <motion.div initial={{ scale:.95 }} animate={{ scale:1 }} onClick={e=>e.stopPropagation()}
        style={{ background:B.surface, borderRadius:16, padding:28, width:880, maxWidth:'100%', maxHeight:'90vh', overflowY:'auto', border:`1px solid ${B.border}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:900 }}>📚 Templates</div>
            <div style={{ fontSize:12, color:B.muted, marginTop:4 }}>Pre-built sites + your saved patterns. Pick one, then customise everything.</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:B.muted, cursor:'pointer', fontSize:22 }}>✕</button>
        </div>

        {saved.length > 0 && (
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, fontWeight:800, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Your saved templates ({saved.length})</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))', gap:14 }}>
              {saved.map(t => (
                <div key={t.id} style={{ position:'relative', cursor:'pointer', borderRadius:12, overflow:'hidden', border:`1px solid ${B.border}`, background:B.card }}
                  onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor = B.green}
                  onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor = B.border}>
                  <button onClick={(e)=>{ e.stopPropagation(); if (confirm(`Delete saved template "${t.name}"?`)) { deleteSavedTemplate(t.id); refresh() } }}
                    title="Delete"
                    style={{ position:'absolute', top:8, right:8, zIndex:2, background:'rgba(0,0,0,.7)', color:'#fff', border:'none', borderRadius:'50%', width:24, height:24, fontSize:12, cursor:'pointer' }}>✕</button>
                  <div onClick={()=>onPickSaved(t)}>
                    {t.preview && <div style={{ aspectRatio:'4/3', overflow:'hidden' }}>
                      <img src={t.preview} alt={t.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                    </div>}
                    <div style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                        <div style={{ fontSize:13, fontWeight:800 }}>{t.name}</div>
                        <span style={{ fontSize:9, padding:'2px 6px', borderRadius:999, background:`${B.green}22`, color:B.green, fontWeight:800 }}>{t.source === 'analyzed' ? 'Analyzed' : 'Saved'}</span>
                      </div>
                      <div style={{ fontSize:11, color:B.muted, lineHeight:1.5, minHeight:30 }}>{t.description || 'Saved by you'}</div>
                      <div style={{ fontSize:11, color:B.green, fontWeight:800, marginTop:8 }}>Use this template →</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ fontSize:11, fontWeight:800, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Built-in templates</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))', gap:14 }}>
          {TEMPLATES.map(t => (
            <motion.div key={t.id} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              onClick={()=>onPick(t)}
              style={{ cursor:'pointer', borderRadius:12, overflow:'hidden', border:`1px solid ${B.border}`, background:B.card, transition:'border-color .15s' }}
              onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.borderColor = B.green}
              onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.borderColor = B.border}>
              {t.preview && <div style={{ aspectRatio:'4/3', overflow:'hidden' }}>
                <img src={t.preview} alt={t.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              </div>}
              <div style={{ padding:'12px 14px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                  <div style={{ fontSize:13, fontWeight:800 }}>{t.emoji} {t.name}</div>
                  <span style={{ fontSize:9, padding:'2px 6px', borderRadius:999, background:`${B.blue}22`, color:B.blue, fontWeight:800 }}>{t.category}</span>
                </div>
                <div style={{ fontSize:11, color:B.muted, lineHeight:1.5, minHeight:30 }}>{t.description}</div>
                <div style={{ fontSize:11, color:B.green, fontWeight:800, marginTop:8 }}>Use this template →</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Add Section Modal ─────────────────────────────────────────
function AddSectionModal({ B }: { B: typeof DARK }) {
  const store = useStore()
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}
      onClick={()=>store.setShowAddSection(false)}>
      <motion.div initial={{ scale:.95, y:10 }} animate={{ scale:1, y:0 }}
        onClick={e=>e.stopPropagation()}
        style={{ background:B.surface, borderRadius:16, padding:24, width:600, maxHeight:'80vh', overflowY:'auto', border:`1px solid ${B.border}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div style={{ fontSize:16, fontWeight:800 }}>Add Section</div>
          <button onClick={()=>store.setShowAddSection(false)} style={{ background:'none', border:'none', color:B.muted, cursor:'pointer', fontSize:20 }}>✕</button>
        </div>
        {SECTION_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom:20 }}>
            <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>{group.label}</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {group.types.map(type => {
                const def = SECTION_DEFS[type]
                return (
                  <motion.button key={type} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    onClick={()=>store.addSection(type as SectionType)}
                    style={{ padding:'14px 12px', borderRadius:10, background:B.card, border:`1px solid ${B.border}`, cursor:'pointer', textAlign:'left' as const }}>
                    <div style={{ fontSize:20, marginBottom:8 }}>{def.icon}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:B.text, marginBottom:4 }}>{def.name}</div>
                    <div style={{ fontSize:10, color:B.muted, lineHeight:1.4 }}>{def.description}</div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

// ── Magic Edit Page Modal ─────────────────────────────────────
function MagicEditPageModal({ B, onClose }: { B: typeof DARK; onClose: () => void }) {
  const store = useStore()
  const page = getActivePage(store)
  const [instruction, setInstruction] = useState('')
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')

  const QUICK = [
    'Rewrite all copy on this page to be more compelling and benefit-focused',
    'Make all the copy shorter and punchier',
    'Make the tone more professional and authoritative',
    'Make the tone more friendly and approachable',
    'Add more specific details about what we offer',
    'Replace generic content with specific industry examples',
  ]

  const apply = async (text: string) => {
    if (!page || !text.trim()) return
    setWorking(true); setError('')
    try {
      const res = await fetch('/api/edit-page', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          sections: page.sections,
          instruction: text,
          businessName: store.site.name,
          industry: '',
          brandVoice: store.site.brandVoice || '',
        })
      })
      if (!res.ok) {
        const t = await res.text()
        let msg = 'Edit failed'
        try { msg = JSON.parse(t).error } catch { msg = t.slice(0,150) }
        throw new Error(msg)
      }
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream')
      const dec = new TextDecoder()
      let raw = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        raw += dec.decode(value, { stream: true })
      }
      raw = raw.trim()
      let parsed: any
      try { parsed = JSON.parse(raw) } catch { throw new Error('AI response was incomplete. Try again.') }

      // Apply updates
      parsed.updates?.forEach((u: any) => {
        const sec = page.sections[u.sectionIndex]
        if (sec) store.setSectionData(sec.id, { ...sec.data, ...u.data })
      })
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Edit failed')
    } finally {
      setWorking(false)
    }
  }

  const inp: React.CSSProperties = { width:'100%', padding:'10px 14px', background:B.card, border:`1px solid ${B.border}`, borderRadius:8, color:B.text, fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:'inherit' }

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onClose}>
      <motion.div initial={{ scale:.95 }} animate={{ scale:1 }}
        onClick={e=>e.stopPropagation()}
        style={{ background:B.surface, borderRadius:16, padding:28, width:580, maxWidth:'100%', maxHeight:'90vh', overflowY:'auto', border:`1px solid ${B.border}` }}>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:900, marginBottom:4 }}>✨ Magic Edit Page</div>
            <div style={{ fontSize:12, color:B.muted }}>Tell AI what to change on the <strong style={{ color:B.text }}>{page?.name}</strong> page</div>
          </div>
          <button onClick={onClose} disabled={working} style={{ background:'none', border:'none', color:B.muted, cursor:'pointer', fontSize:24 }}>✕</button>
        </div>

        {!working && <>
          <div style={{ marginTop:18 }}>
            <textarea value={instruction} onChange={e=>setInstruction(e.target.value)} rows={4}
              placeholder={`What should AI change?\n\nExamples:\n• "Make the headline more powerful and bold"\n• "Add a section about our 24/7 emergency service"\n• "Change all references to 'we' to 'I'"\n• "Make all content focus more on small businesses"`}
              style={{ ...inp, resize:'none', lineHeight:1.6 }} />
            <button onClick={()=>apply(instruction)}
              disabled={!instruction.trim()}
              style={{ width:'100%', marginTop:10, padding:'12px', borderRadius:9, background:B.green, color:B.bg, fontSize:13, fontWeight:800, border:'none', cursor:'pointer', opacity:!instruction.trim()?.4:1 }}>
              ✦ Apply Changes
            </button>
          </div>

          <div style={{ marginTop:20 }}>
            <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Quick Actions</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {QUICK.map(q => (
                <button key={q} onClick={()=>apply(q)}
                  style={{ textAlign:'left' as const, padding:'10px 14px', background:B.card, border:`1px solid ${B.border}`, borderRadius:8, color:B.text, fontSize:12, cursor:'pointer', lineHeight:1.5 }}>
                  → {q}
                </button>
              ))}
            </div>
          </div>

          {error && <div style={{ background:'#ef444420', border:'1px solid #ef4444', borderRadius:8, padding:12, fontSize:12, color:'#ef4444', marginTop:14 }}>{error}</div>}
        </>}

        {working && (
          <div style={{ padding:'40px 0', textAlign:'center' }}>
            <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.5, ease:'linear' }}
              style={{ width:48, height:48, borderRadius:'50%', border:`3px solid ${B.border}`, borderTopColor:B.green, margin:'0 auto 20px' }} />
            <div style={{ fontSize:14, fontWeight:800, marginBottom:8 }}>AI is updating the page...</div>
            <div style={{ fontSize:11, color:B.muted }}>Editing copy, replacing content, generating new sections</div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ── Magic Build Modal ─────────────────────────────────────────
function MagicBuildModal({ B, onClose }: { B: typeof DARK; onClose: () => void }) {
  const store = useStore()
  const [mode, setMode] = useState<'url'|'manual'>('manual')
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [description, setDescription] = useState('')
  const [services, setServices] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#2563eb')
  const [tone, setTone] = useState('professional')
  const [country, setCountry] = useState<CountryCode>(store.site.country as CountryCode || DEFAULT_COUNTRY)
  const [persona, setPersona] = useState<PersonaId | 'auto'>('auto')
  const [building, setBuilding] = useState(false)
  const [step, setStep] = useState('')
  const [error, setError] = useState('')

  const inp: React.CSSProperties = { width:'100%', padding:'10px 14px', background:B.card, border:`1px solid ${B.border}`, borderRadius:8, color:B.text, fontSize:13, outline:'none', boxSizing:'border-box' }

  const build = async () => {
    setBuilding(true); setError('')
    try {
      const resolvedPersonaId: PersonaId = persona === 'auto' ? pickPersona(industry || '') : persona
      const resolvedPersona = PERSONAS[resolvedPersonaId]
      const brandVoice = store.site.brandVoice || ''
      let payload: any = { name, industry, description, services, phone, email, address, primaryColor, tone, country, persona: resolvedPersonaId, brandVoice }
      let auditData: any = null
      if (mode === 'url' && url.trim()) {
        setStep('Analyzing existing website...')
        const r = await fetch('/api/analyze', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ url: url.trim(), country })
        })
        const audit = await r.json()
        if (!r.ok) throw new Error(audit.error || 'Analysis failed')
        auditData = audit
        payload = { audit, country, persona: resolvedPersonaId, brandVoice }
      }
      setStep('AI is designing your full website... (~30 seconds)')
      const res = await fetch('/api/build-site', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const txt = await res.text()
        let msg = 'Build failed'
        try { msg = JSON.parse(txt).error } catch { msg = txt.slice(0,150) }
        throw new Error(msg)
      }
      // Stream the JSON response
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream')
      const dec = new TextDecoder()
      let raw = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        raw += dec.decode(value, { stream: true })
      }
      raw = raw.trim().replace(/^```json\n?|```$/g, '').trim()
      let content
      try { content = JSON.parse(raw) }
      catch { throw new Error('AI response was incomplete. Please try again.') }

      // Build the full SiteData using audit data + AI-generated content
      const businessName = auditData?.name || name || 'Your Business'
      const businessIndustry = auditData?.industry || industry || 'Professional Services'
      const businessPhone = auditData?.contact?.phone || phone || ''
      const businessEmail = auditData?.contact?.email || email || ''
      const businessAddress = auditData?.contact?.address || address || ''
      const businessPrimary = auditData?.primaryColor || primaryColor || '#2563eb'

      const avatarColors = ['2563eb','16a34a','ea580c','dc2626','9333ea']
      const avatar = (n: string, i: number) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n||'User')}&size=200&background=${avatarColors[i%5]}&color=fff`

      // When the AI returned empty arrays for sections that the source did
      // not have, we substitute a single editable placeholder row so the user
      // sees "edit this to add your real X" instead of an empty section.
      const PLACEHOLDER_TESTIMONIAL = { name:'[Add a real client name]', role:'[Their company or role]', quote:'Edit this to add a real testimonial from a real customer. Click to edit. Fake testimonials damage trust and may breach consumer-protection law.' }
      const PLACEHOLDER_TEAM = { name:'[Add a team member name]', role:'[Their role]', bio:'Edit this to add a short bio of a real team member. Click to edit.' }
      const PLACEHOLDER_PRICING = { name:'Plan name', price:'Edit price', period:'/month', features:['Edit these features', 'Add what is included', 'Replace with real list'], cta:'Get a Quote', highlighted: false }
      const PLACEHOLDER_FAQ = { q:'Edit this question', a:'Edit this answer to address something your real customers actually ask. Click on it to start editing.' }
      const PLACEHOLDER_SERVICE = { icon:'zap', title:'Edit this service', desc:'Click to edit. Add a service your business actually offers.' }

      const testimonialsArr = (content.testimonials && content.testimonials.length > 0)
        ? content.testimonials.map((t:any,i:number)=>({ ...t, avatar: avatar(t.name, i) }))
        : [{ ...PLACEHOLDER_TESTIMONIAL, avatar: avatar('You', 0) }]
      const teamArr = (content.team && content.team.length > 0)
        ? content.team.map((m:any,i:number)=>({ ...m, image: avatar(m.name, i) }))
        : [{ ...PLACEHOLDER_TEAM, image: avatar('You', 0) }]
      const pricingArr = (content.pricing && content.pricing.length > 0) ? content.pricing : [PLACEHOLDER_PRICING]
      const faqArr = (content.faq && content.faq.length > 0) ? content.faq : [PLACEHOLDER_FAQ]
      const servicesArr = (content.services && content.services.length > 0) ? content.services : [PLACEHOLDER_SERVICE]

      const site = {
        id: 'gen', name: businessName, tagline: content.tagline || auditData?.tagline || '', logo: '',
        country,
        widget: { enabled: !!businessPhone, channel: 'whatsapp' as const, number: businessPhone, message: `Hi, I came from your ${businessName} website and wanted to ask...` },
        theme: {
          primaryColor: businessPrimary,
          secondaryColor: content.accentColor || auditData?.secondaryColor || resolvedPersona.paletteHint.secondary,
          accentColor: content.accentColor || resolvedPersona.paletteHint.accent,
          fontHeading: content.fontHeading || resolvedPersona.fontHeading,
          fontBody: content.fontBody || resolvedPersona.fontBody,
          borderRadius: content.borderRadius || resolvedPersona.borderRadius,
          style: content.style || resolvedPersona.paletteHint.style,
        },
        pages: [
          { name:'Home', slug:'/', sections: [
            { type:'hero', data: { headline: content.heroHeadline, subtext: content.heroSubtext, ctaText: content.ctaText, ctaUrl:'#contact', ctaText2:'Learn More', image: content.heroImage, showStats: true, variant: resolvedPersona.variants.hero || 'default' } },
            { type:'stats', data: { stat1val: content.stats?.[0]?.val||'200+', stat1label: content.stats?.[0]?.label||'Clients', stat2val: content.stats?.[1]?.val||'98%', stat2label: content.stats?.[1]?.label||'Satisfaction', stat3val: content.stats?.[2]?.val||'10yr', stat3label: content.stats?.[2]?.label||'Experience', stat4val: content.stats?.[3]?.val||'24/7', stat4label: content.stats?.[3]?.label||'Support' } },
            { type:'services', data: { heading:'What We Offer', subheading:'Professional services tailored to your needs.', items: servicesArr, variant: (resolvedPersona.variants as any).services || 'grid' } },
            { type:'features', data: { heading:'Why Choose Us', subheading:'What makes us different.', items: (content.features && content.features.length > 0) ? content.features.map((f:any)=>({ icon:f.icon||'check', title:f.title, desc:f.desc })) : [{ icon:'check', title:'Edit to add a feature', desc:'Click to edit. Add a real differentiator.' }] } },
            { type:'testimonials', data: { heading:'What Clients Say', items: testimonialsArr, variant: resolvedPersona.variants.testimonials || 'cards' } },
            { type:'cta', data: { heading:'Ready to Get Started?', subtext:'Take the next step today. We are here to help.', ctaText: content.ctaText, ctaUrl:'#contact', ctaText2:'' } },
          ]},
          { name:'About', slug:'/about', sections: [
            { type:'about', data: { heading: content.aboutHeading||'About Us', subheading: content.aboutSubheading||'Our Story', body: content.aboutBody||'', body2: content.aboutBody2||'', image: content.aboutImage, ctaText:'Get in Touch' } },
            { type:'team', data: { heading:'Meet the Team', members: teamArr } },
            { type:'stats', data: { stat1val: content.stats?.[0]?.val||'200+', stat1label: content.stats?.[0]?.label||'Clients', stat2val: content.stats?.[1]?.val||'98%', stat2label: content.stats?.[1]?.label||'Satisfaction', stat3val: content.stats?.[2]?.val||'10yr', stat3label: content.stats?.[2]?.label||'Experience', stat4val: content.stats?.[3]?.val||'24/7', stat4label: content.stats?.[3]?.label||'Support' } },
          ]},
          { name:'Services', slug:'/services', sections: [
            { type:'hero', data: { headline:`Our ${businessIndustry}`, subtext:'Discover the full range of services we offer.', ctaText:'Get a Quote', ctaUrl:'#contact', ctaText2:'', image:'', showStats: false } },
            { type:'services', data: { heading:'Services We Offer', subheading:'Comprehensive solutions for your business.', items: servicesArr, variant: (resolvedPersona.variants as any).services || 'grid' } },
            { type:'pricing', data: { heading:'Pricing Packages', subheading:'Transparent pricing. No hidden fees.', taxIncluded:true, items: pricingArr, variant: (resolvedPersona.variants as any).pricing || 'cards' } },
            { type:'faq', data: { heading:'Frequently Asked Questions', items: faqArr } },
            { type:'cta', data: { heading:'Ready to Get Started?', subtext:'Contact us today for a free consultation.', ctaText: content.ctaText, ctaUrl:'#contact', ctaText2:'' } },
          ]},
          { name:'Contact', slug:'/contact', sections: [
            { type:'contact', data: { heading:'Get in Touch', subtext:'We would love to hear from you. Send us a message.', phone: businessPhone, email: businessEmail, address: businessAddress, hours:'Monday – Friday, 8:00am – 5:00pm', formKey:'' } },
            { type:'maps', data: { heading:'Find Us', subtext:'', address: businessAddress, embedUrl:'' } },
            { type:'whatsapp', data: { heading:'Chat with us on WhatsApp', subtext:'Skip the form — message us directly. We typically reply within an hour during business hours.', number: businessPhone, message: `Hi, I came from your ${businessName} website and wanted to ask...`, buttonText:'Open WhatsApp' } },
          ]},
          { name:'Privacy', slug:'/privacy', sections: [
            { type:'policy', data: { heading:'Privacy Policy', autoGenerate:true, customBody:'' } },
          ]},
        ]
      }
      store.loadSite(site as any)
      // When the build was driven by analysing an existing URL, also save the
      // resulting design as a reusable template so the user can re-use the
      // pattern next time.
      if (mode === 'url' && url.trim()) {
        try {
          saveTemplate({
            name: `${businessName} (analyzed)`,
            description: `Auto-saved from analyzing ${url.trim()}`,
            source: 'analyzed',
            site: JSON.parse(JSON.stringify(site)),
            preview: previewFor(site as any),
          })
        } catch {}
      }
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Build failed')
    } finally {
      setBuilding(false); setStep('')
    }
  }

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onClose}>
      <motion.div initial={{ scale:.95 }} animate={{ scale:1 }}
        onClick={e=>e.stopPropagation()}
        style={{ background:B.surface, borderRadius:16, padding:28, width:560, maxWidth:'100%', maxHeight:'90vh', overflowY:'auto', border:`1px solid ${B.border}` }}>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:900, marginBottom:4 }}>✨ Magic Build</div>
            <div style={{ fontSize:12, color:B.muted }}>AI generates your complete multi-page website in one click</div>
          </div>
          <button onClick={onClose} disabled={building} style={{ background:'none', border:'none', color:B.muted, cursor:'pointer', fontSize:24 }}>✕</button>
        </div>

        {!building && <>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5 }}>Country</div>
              <select value={country} onChange={e=>setCountry(e.target.value as CountryCode)} style={inp}>
                {COUNTRY_LIST.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name} — {c.currencyCode}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5 }}>Design persona</div>
              <select value={persona} onChange={e=>setPersona(e.target.value as any)} style={inp}>
                <option value="auto">✨ Auto (pick from industry)</option>
                {PERSONA_LIST.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name} — {p.description.slice(0,40)}…</option>)}
              </select>
            </div>
          </div>
          <div style={{ fontSize:10, color:B.muted, marginTop:-8, marginBottom:12, lineHeight:1.5 }}>{COUNTRIES[country].flag} {COUNTRIES[country].name}: {COUNTRIES[country].currencySymbol} {COUNTRIES[country].currencyCode}, {COUNTRIES[country].privacyLaw}. Persona drives fonts, palette, layout & animation.</div>

          <div style={{ display:'flex', gap:6, marginBottom:18 }}>
            <button onClick={()=>setMode('manual')} style={{ flex:1, padding:'10px', borderRadius:9, border:`1px solid ${mode==='manual'?B.green:B.border}`, background:mode==='manual'?`${B.green}15`:B.card, color:mode==='manual'?B.green:B.text, fontSize:12, fontWeight:700, cursor:'pointer' }}>
              📝 Enter business info
            </button>
            <button onClick={()=>setMode('url')} style={{ flex:1, padding:'10px', borderRadius:9, border:`1px solid ${mode==='url'?B.green:B.border}`, background:mode==='url'?`${B.green}15`:B.card, color:mode==='url'?B.green:B.text, fontSize:12, fontWeight:700, cursor:'pointer' }}>
              🔗 Use existing website URL
            </button>
          </div>

          {mode === 'url' ? (
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>Existing Website URL</div>
              <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://yourbusiness.co.za" style={inp} />
              <div style={{ fontSize:11, color:B.muted, marginTop:8, lineHeight:1.6 }}>AI will analyze the site, extract brand colors, services, contact info — then generate a complete new multi-page website.</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', marginBottom:5 }}>Business Name *</div>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Apex Plumbing" style={inp} />
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', marginBottom:5 }}>Industry *</div>
                  <input value={industry} onChange={e=>setIndustry(e.target.value)} placeholder="e.g. Plumbing & Maintenance" style={inp} />
                </div>
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', marginBottom:5 }}>What do you do? *</div>
                <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3}
                  placeholder="Describe your business in 1-2 sentences. What do you offer and what makes you different?"
                  style={{ ...inp, resize:'none' }} />
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', marginBottom:5 }}>Main Services (comma-separated)</div>
                <input value={services} onChange={e=>setServices(e.target.value)}
                  placeholder="e.g. Pipe repair, drainage, geyser installation" style={inp} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', marginBottom:5 }}>Phone</div>
                  <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+27 11 000 0000" style={inp} />
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', marginBottom:5 }}>Email</div>
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="hello@business.co.za" style={inp} />
                </div>
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', marginBottom:5 }}>Address / Location</div>
                <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="e.g. Sandton, Johannesburg" style={inp} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', marginBottom:5 }}>Brand Color</div>
                  <div style={{ display:'flex', gap:6 }}>
                    <input type="color" value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)}
                      style={{ width:42, height:38, border:'none', background:'none', cursor:'pointer', borderRadius:8, padding:2 }} />
                    <input value={primaryColor} onChange={e=>setPrimaryColor(e.target.value)} style={{ ...inp, fontFamily:'monospace', flex:1 }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', marginBottom:5 }}>Brand Tone</div>
                  <select value={tone} onChange={e=>setTone(e.target.value)} style={inp}>
                    <option value="professional">Professional</option>
                    <option value="bold">Bold & Confident</option>
                    <option value="playful">Playful & Friendly</option>
                    <option value="minimal">Minimal & Clean</option>
                    <option value="luxury">Luxury & Premium</option>
                    <option value="corporate">Corporate & Trusted</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {error && <div style={{ background:'#ef444420', border:'1px solid #ef4444', borderRadius:8, padding:12, fontSize:12, color:'#ef4444', marginTop:14 }}>{error}</div>}

          <button onClick={build}
            disabled={mode === 'url' ? !url.trim() : (!name.trim() || !industry.trim() || !description.trim())}
            style={{ width:'100%', marginTop:20, padding:'14px', borderRadius:10, background:B.green, color:B.bg, fontSize:14, fontWeight:900, border:'none', cursor:'pointer', letterSpacing:'-0.3px' }}>
            ✨ Build My Website
          </button>
          <div style={{ fontSize:11, color:B.muted, marginTop:10, textAlign:'center', lineHeight:1.6 }}>
            AI will create 4 pages with all sections, copy, testimonials, FAQs and more — fully editable after.
          </div>
        </>}

        {building && (
          <div style={{ padding:'40px 0', textAlign:'center' }}>
            <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.5, ease:'linear' }}
              style={{ width:48, height:48, borderRadius:'50%', border:`3px solid ${B.border}`, borderTopColor:B.green, margin:'0 auto 20px' }} />
            <div style={{ fontSize:14, fontWeight:800, marginBottom:8 }}>{step}</div>
            <div style={{ fontSize:11, color:B.muted, lineHeight:1.7, maxWidth:400, margin:'0 auto' }}>
              Generating: pages, hero copy, services, features, testimonials, team, pricing, FAQs, contact — all unique to your business.
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(true)
  const B = darkMode ? DARK : LIGHT
  const store = useStore()
  const [exporting, setExporting] = useState(false)
  const [showMagic, setShowMagic] = useState(false)
  const [showEditPage, setShowEditPage] = useState(false)
  const [showDeploy, setShowDeploy] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  // Show "use a desktop" notice once per device on small screens (<900 px wide).
  const [showMobileNotice, setShowMobileNotice] = useState(() => {
    try {
      if (typeof window === 'undefined') return false
      if (window.innerWidth >= 900) return false
      return localStorage.getItem('siteforge-mobile-dismissed') !== '1'
    } catch { return false }
  })
  const [imagePicker, setImagePicker] = useState<null | { onSelect: (url: string) => void }>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Welcome shown once for first-time visitors (default site name still 'Your Business' & no localStorage edits).
  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      return !localStorage.getItem('siteforge-v2') || store.site.name === 'Your Business'
    } catch { return false }
  })

  const openImagePicker = (onSelect: (url: string) => void) => setImagePicker({ onSelect })

  // Cmd/Ctrl+Z = undo, Cmd/Ctrl+Shift+Z = redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey
      if (!meta) return
      const target = e.target as HTMLElement | null
      // Don't hijack browser undo inside form fields the user is actively typing in
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return
      if (target && target.isContentEditable) return
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const downloadSite = async () => {
    setExporting(true)
    try {
      const files = exportSite(store.site)
      const zip = new JSZip()
      Object.entries(files).forEach(([name, content]) => zip.file(name, content))
      zip.file('README.md', `# ${store.site.name}\n\nBuilt with SiteForge.\n\n## Quick deploy (free)\n1. Unzip this folder.\n2. Go to https://app.netlify.com/drop\n3. Drag the unzipped folder onto the page.\n4. Done — Netlify gives you an instant URL.\n\n## Updating later\nReturn to SiteForge, edit, click "↓ Download ZIP" again, then drag the new folder onto your Netlify site under "Deploys".\n\nFiles:\n${Object.keys(files).map(f=>`- ${f}`).join('\n')}`)
      const blob = await zip.generateAsync({ type:'blob' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${store.site.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'site'}-website.zip`
      a.click()
      setShowDeploy(true)
    } catch (err) {
      alert('Download failed: ' + (err instanceof Error ? err.message : 'unknown'))
    }
    setExporting(false)
  }

  const previewFull = () => {
    // Open a multi-page preview where cross-page links work in-tab. We bundle
    // every page into one HTML doc + an iframe wrapper that intercepts link
    // clicks (they used to 404 because relative .html paths were resolved
    // against the Vercel domain).
    const html = renderPreviewBundle(store.site, store.activePageId)
    const w = window.open('', '_blank')
    if (!w) { alert('Pop-up blocked. Allow pop-ups for this site to use Preview.'); return }
    w.document.write(html)
    w.document.close()
  }

  const saveProject = () => {
    const data = JSON.stringify(store.site, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    const safe = store.site.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'site'
    a.download = `${safe}.siteforge.json`
    a.click()
  }

  const saveAsTemplate = () => {
    const name = prompt('Name for this template:', store.site.name)
    if (!name) return
    const description = prompt('Short description (optional):', store.site.tagline || '') || ''
    saveTemplate({ name, description, source:'manual', site: JSON.parse(JSON.stringify(store.site)), preview: previewFor(store.site) })
    alert(`Saved "${name}" — find it in 📚 Templates → Your saved templates.`)
  }

  const loadProject = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const site = JSON.parse(String(reader.result))
        if (!site || !Array.isArray(site.pages)) throw new Error('Invalid project file')
        store.loadSite(site)
      } catch (err) {
        alert('Could not load project: ' + (err instanceof Error ? err.message : 'invalid file'))
      }
    }
    reader.readAsText(file)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:B.bg, color:B.text, fontFamily:"'Inter',system-ui,sans-serif", overflow:'hidden' }}>

      {/* TOP BAR */}
      <div style={{ display:'flex', alignItems:'center', padding:'8px 12px', minHeight:52, borderBottom:`1px solid ${B.border}`, flexShrink:0, gap:8, flexWrap:'wrap' }}>
        <div style={{ width:28, height:28, borderRadius:8, background:B.green, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:B.bg, flexShrink:0 }}>S</div>
        <div style={{ flexShrink:0 }}>
          <div style={{ fontSize:13, fontWeight:800 }}>SiteForge</div>
          <div style={{ fontSize:9, color:B.muted }}>Website Builder</div>
        </div>
        <div style={{ flex:1, minWidth:8 }} />
        <div style={{ fontSize:11, color:B.muted, marginRight:4, whiteSpace:'nowrap' as const }}>
          <strong style={{ color:B.text }}>{store.site.name}</strong>
        </div>
        <input ref={fileInputRef} type="file" accept=".json,application/json" style={{ display:'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) loadProject(f); e.currentTarget.value = '' }} />
        <button title="Load .siteforge.json" onClick={()=>fileInputRef.current?.click()}
          style={{ padding:'0 10px', height:32, borderRadius:7, border:`1px solid ${B.border}`, background:'transparent', color:B.muted, fontSize:11, fontWeight:600, cursor:'pointer' }}>
          ↑ Load
        </button>
        <button title="Save project as JSON" onClick={saveProject}
          style={{ padding:'0 10px', height:32, borderRadius:7, border:`1px solid ${B.border}`, background:'transparent', color:B.muted, fontSize:11, fontWeight:600, cursor:'pointer' }}>
          💾 Save
        </button>
        <button title="Save current site as a reusable template" onClick={saveAsTemplate}
          style={{ padding:'0 10px', height:32, borderRadius:7, border:`1px solid ${B.border}`, background:'transparent', color:B.muted, fontSize:11, fontWeight:600, cursor:'pointer' }}>
          ★ Save as template
        </button>
        <button onClick={()=>{
          if (confirm('Start over? This will reset your current site to the default template. Save your project first if you want to keep it.')) {
            localStorage.removeItem('siteforge-v2')
            window.location.reload()
          }
        }} style={{ padding:'0 10px', height:32, borderRadius:7, border:`1px solid ${B.border}`, background:'transparent', color:B.muted, fontSize:11, fontWeight:600, cursor:'pointer' }}>
          ↻ Reset
        </button>
        <button onClick={()=>setShowTemplates(true)}
          style={{ padding:'0 12px', height:32, borderRadius:7, background:'transparent', border:`1px solid ${B.border}`, color:B.text, fontSize:12, fontWeight:700, cursor:'pointer' }}>
          📚 Templates
        </button>
        <button onClick={()=>setShowMagic(true)}
          style={{ padding:'0 12px', height:32, borderRadius:7, background:`linear-gradient(135deg, ${B.green}, ${B.blue})`, color:'#fff', fontSize:12, fontWeight:800, border:'none', cursor:'pointer' }}>
          ✨ Magic Build
        </button>
        <button onClick={()=>setDarkMode(d=>!d)} title="Toggle editor theme"
          style={{ width:32, height:32, borderRadius:7, border:`1px solid ${B.border}`, background:'transparent', color:B.text, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {darkMode?'☀️':'🌙'}
        </button>
        <button onClick={previewFull}
          style={{ padding:'0 12px', height:32, borderRadius:7, border:`1px solid ${B.border}`, background:B.card, color:B.text, fontSize:12, fontWeight:700, cursor:'pointer' }}>
          ⛶ Preview
        </button>
        <button onClick={downloadSite} disabled={exporting}
          style={{ padding:'0 14px', height:32, borderRadius:7, background:B.green, color:B.bg, fontSize:12, fontWeight:800, border:'none', cursor:'pointer', opacity:exporting?.6:1 }}>
          {exporting ? '⏳...' : '↓ Download & Deploy'}
        </button>
      </div>

      {/* BODY */}
      <div className="sf-body" style={{ flex:1, display:'flex', overflow:'hidden' }}>
        <LeftPanel B={B} />
        <SiteCanvas B={B} onMagicEdit={()=>setShowEditPage(true)} openImagePicker={openImagePicker} />
        <RightPanel B={B} openImagePicker={openImagePicker} />
      </div>

      {/* ADD SECTION MODAL */}
      <AnimatePresence>
        {store.showAddSection && <AddSectionModal B={B} />}
      </AnimatePresence>

      {/* MAGIC BUILD MODAL */}
      <AnimatePresence>
        {showMagic && <MagicBuildModal B={B} onClose={()=>setShowMagic(false)} />}
      </AnimatePresence>

      {/* MAGIC EDIT PAGE MODAL */}
      <AnimatePresence>
        {showEditPage && <MagicEditPageModal B={B} onClose={()=>setShowEditPage(false)} />}
      </AnimatePresence>

      {/* IMAGE PICKER MODAL */}
      <AnimatePresence>
        {imagePicker && <ImagePickerModal B={B}
          onClose={()=>setImagePicker(null)}
          onSelect={url=>{ imagePicker.onSelect(url); setImagePicker(null) }} />}
      </AnimatePresence>

      {/* DEPLOY MODAL */}
      <AnimatePresence>
        {showDeploy && <DeployModal B={B} onClose={()=>setShowDeploy(false)} siteName={store.site.name} />}
      </AnimatePresence>

      {/* TEMPLATES MODAL */}
      <AnimatePresence>
        {showTemplates && <TemplatesModal B={B} onClose={()=>setShowTemplates(false)}
          onPick={(t)=>{
            store.loadSite(t.build())
            setShowTemplates(false)
            setShowWelcome(false)
          }}
          onPickSaved={(t)=>{
            store.loadSite(t.site)
            setShowTemplates(false)
            setShowWelcome(false)
          }} />}
      </AnimatePresence>

      {/* WELCOME */}
      <AnimatePresence>
        {showWelcome && <WelcomeModal B={B}
          onMagicBuild={()=>{ setShowWelcome(false); setShowMagic(true) }}
          onTemplates={()=>{ setShowWelcome(false); setShowTemplates(true) }}
          onClose={()=>setShowWelcome(false)} />}
      </AnimatePresence>

      {/* MOBILE NOTICE (shows only once per device on screens < 900px) */}
      <AnimatePresence>
        {showMobileNotice && <MobileNotice B={B} onDismiss={()=>{
          try { localStorage.setItem('siteforge-mobile-dismissed','1') } catch {}
          setShowMobileNotice(false)
        }} />}
      </AnimatePresence>
    </div>
  )
}
