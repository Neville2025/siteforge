import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import JSZip from 'jszip'
import { useStore, getActivePage, getActiveSection } from './store'
import { SECTION_DEFS, SECTION_GROUPS } from './sections'
import { BLOCKS, BLOCK_CATEGORIES, type Block } from './blocks'
import { exportSite, renderPage } from './renderer'
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
function SiteCanvas({ B }: { B: typeof DARK }) {
  const store = useStore()
  const page = getActivePage(store)
  if (!page) return null
  const html = renderPage(store.site, page)
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:B.surface, overflow:'hidden' }}>
      {/* Viewport toggle */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'8px 16px', borderBottom:`1px solid ${B.border}`, background:B.bg, flexShrink:0 }}>
        <div style={{ fontSize:11, color:B.muted, marginRight:8 }}>Live Preview — {page.name}</div>
        <button onClick={()=>{ const w=window.open('','_blank'); w?.document.write(html); w?.document.close() }}
          style={{ fontSize:10, padding:'4px 10px', borderRadius:6, background:B.card, border:`1px solid ${B.border}`, color:B.muted, cursor:'pointer' }}>
          ⛶ Full Tab
        </button>
      </div>
      <iframe
        key={page.id + JSON.stringify(store.site.theme)}
        srcDoc={html}
        style={{ flex:1, border:'none', width:'100%' }}
        title="Preview"
        sandbox="allow-scripts allow-same-origin"
      />
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
              <div style={{ display:'flex', gap:2 }}>
                <button onClick={e=>{e.stopPropagation();store.moveSectionUp(sec.id)}} style={{ background:'none', border:'none', color:B.muted, cursor:'pointer', fontSize:11 }} title="Move up">↑</button>
                <button onClick={e=>{e.stopPropagation();store.moveSectionDown(sec.id)}} style={{ background:'none', border:'none', color:B.muted, cursor:'pointer', fontSize:11 }} title="Move down">↓</button>
                <button onClick={e=>{e.stopPropagation();store.deleteSection(sec.id)}} style={{ background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize:11 }} title="Delete">✕</button>
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
function RightPanel({ B }: { B: typeof DARK }) {
  const store = useStore()
  const section = getActiveSection(store)
  const [tab, setTab] = useState<'edit'|'theme'|'ai'|'components'>('edit')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [blockCategory, setBlockCategory] = useState('All')
  const [blockQuery, setBlockQuery] = useState('')
  const [imageSearch, setImageSearch] = useState('')
  const [, setImageLoading] = useState(false)
  const [images, setImages] = useState<{url:string;alt:string}[]>([])
  const [activeImageField, setActiveImageField] = useState<string|null>(null)

  const inp: React.CSSProperties = { background:B.card, border:`1px solid ${B.border}`, borderRadius:8, padding:'9px 12px', color:B.text, fontSize:12, outline:'none', width:'100%', boxSizing:'border-box', fontFamily:'inherit' }

  const searchImages = async () => {
    if (!imageSearch.trim()) return
    setImageLoading(true)
    try {
      const kw = encodeURIComponent(imageSearch)
      const urls = Array.from({ length:8 }, (_,i) => ({
        url:`https://source.unsplash.com/800x600/?${kw}&sig=${i+Date.now()}`,
        alt: imageSearch
      }))
      setImages(urls)
    } catch {}
    setImageLoading(false)
  }

  const askAi = async () => {
    if (!aiPrompt.trim() || !section) return
    setAiLoading(true)
    try {
      const def = SECTION_DEFS[section.type]
      const res = await fetch('/api/ai-section', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          sectionType: section.type,
          currentData: section.data,
          siteName: store.site.name,
          prompt: aiPrompt,
          fields: def?.fields || [],
        })
      })
      const data = await res.json()
      if (data.updatedData) { store.setSectionData(section.id, { ...section.data, ...data.updatedData }); setAiPrompt('') }
    } catch {}
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
    useStore.setState({ site: { ...store.site, pages: updatedPages }, activeSectionId: newSec.id })
  }

  const TABS = [['edit','✏️ Edit'],['theme','🎨 Theme'],['ai','✦ AI'],['components','◈ Blocks']] as const

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
                    <input value={val||''} onChange={e=>store.updateSectionData(section.id, field.key, e.target.value)} placeholder="Paste image URL..." style={inp} />
                    <div style={{ marginTop:6, display:'flex', gap:6 }}>
                      <input value={imageSearch} onChange={e=>setImageSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&searchImages()}
                        placeholder="Search Unsplash..." style={{ ...inp, flex:1 }} />
                      <Btn color={B.blue} onClick={()=>{ setActiveImageField(field.key); searchImages() }}>Search</Btn>
                    </div>
                    {activeImageField===field.key && images.length>0 && (
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:6, marginTop:8 }}>
                        {images.map((img,i)=>(
                          <img key={i} src={img.url} alt={img.alt} onClick={()=>{ store.updateSectionData(section.id, field.key, img.url); setImages([]); setActiveImageField(null) }}
                            style={{ width:'100%', height:56, objectFit:'cover', borderRadius:6, cursor:'pointer', border:`2px solid transparent` }}
                            onMouseEnter={e=>(e.currentTarget.style.border=`2px solid ${B.green}`)}
                            onMouseLeave={e=>(e.currentTarget.style.border='2px solid transparent')} />
                        ))}
                      </div>
                    )}
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
                  <Btn color={B.green} full onClick={askAi} disabled={aiLoading} style={{ marginTop:8 }}>
                    {aiLoading ? '⏳ Working...' : '✦ Apply Changes'}
                  </Btn>
                </div>
                <div style={{ background:B.card, borderRadius:10, padding:12, border:`1px solid ${B.border}` }}>
                  <div style={{ fontSize:10, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Quick actions</div>
                  {['Rewrite all copy to be more compelling','Make tone more professional','Make tone more friendly and casual','Add 2 more items','Shorten all text by 40%'].map(q=>(
                    <button key={q} onClick={()=>{ setAiPrompt(q); }}
                      style={{ display:'block', width:'100%', textAlign:'left' as const, padding:'7px 10px', marginBottom:5, borderRadius:7, background:B.surface, border:`1px solid ${B.border}`, color:B.muted, fontSize:11, cursor:'pointer' }}>
                      → {q}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

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

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [darkMode, setDarkMode] = useState(true)
  const B = darkMode ? DARK : LIGHT
  const store = useStore()
  const [exporting, setExporting] = useState(false)

  const downloadSite = async () => {
    setExporting(true)
    const files = exportSite(store.site)
    const zip = new JSZip()
    Object.entries(files).forEach(([name, content]) => zip.file(name, content))
    zip.file('README.md', `# ${store.site.name}\n\nBuilt with SiteForge.\n\nFiles:\n${Object.keys(files).map(f=>`- ${f}`).join('\n')}\n\nDeploy: Drag folder to Netlify Drop at netlify.com/drop`)
    const blob = await zip.generateAsync({ type:'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${store.site.name.toLowerCase().replace(/\s+/g,'-')}-website.zip`
    a.click()
    setExporting(false)
  }

  const previewFull = () => {
    const page = getActivePage(store)
    if (!page) return
    const html = renderPage(store.site, page)
    const w = window.open('', '_blank')
    w?.document.write(html)
    w?.document.close()
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:B.bg, color:B.text, fontFamily:"'Inter',system-ui,sans-serif", overflow:'hidden' }}>

      {/* TOP BAR */}
      <div style={{ display:'flex', alignItems:'center', padding:'0 16px', height:52, borderBottom:`1px solid ${B.border}`, flexShrink:0, gap:12 }}>
        <div style={{ width:28, height:28, borderRadius:8, background:B.green, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:B.bg }}>S</div>
        <div style={{ flexShrink:0 }}>
          <div style={{ fontSize:13, fontWeight:800 }}>SiteForge</div>
          <div style={{ fontSize:9, color:B.muted }}>Website Builder</div>
        </div>
        <div style={{ flex:1 }} />
        <div style={{ fontSize:12, color:B.muted }}>
          Editing: <strong style={{ color:B.text }}>{store.site.name}</strong>
        </div>
        <button onClick={()=>setDarkMode(d=>!d)}
          style={{ width:34, height:34, borderRadius:8, border:`1px solid ${B.border}`, background:'transparent', color:B.text, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {darkMode?'☀️':'🌙'}
        </button>
        <button onClick={previewFull}
          style={{ padding:'0 14px', height:34, borderRadius:8, border:`1px solid ${B.border}`, background:B.card, color:B.text, fontSize:12, fontWeight:700, cursor:'pointer' }}>
          ⛶ Preview
        </button>
        <button onClick={downloadSite} disabled={exporting}
          style={{ padding:'0 16px', height:34, borderRadius:8, background:B.green, color:B.bg, fontSize:12, fontWeight:800, border:'none', cursor:'pointer', opacity:exporting?.6:1 }}>
          {exporting ? '⏳...' : '↓ Download ZIP'}
        </button>
      </div>

      {/* BODY */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        <LeftPanel B={B} />
        <SiteCanvas B={B} />
        <RightPanel B={B} />
      </div>

      {/* ADD SECTION MODAL */}
      <AnimatePresence>
        {store.showAddSection && <AddSectionModal B={B} />}
      </AnimatePresence>
    </div>
  )
}
