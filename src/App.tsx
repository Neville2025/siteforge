import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

// ── Theme definitions ──────────────────────────────────────────
const DARK = {
  bg:      '#0E1625', surface: '#111d2e', card: '#162032',
  border:  '#1e2d42', green:   '#00c758', blue: '#3080ff',
  orange:  '#fe6e00', text:    '#ffffff', muted: '#6a7282', dimmed: '#3a4a5c',
}
const LIGHT = {
  bg:      '#f0f4f8', surface: '#ffffff', card: '#f8fafc',
  border:  '#e2e8f0', green:   '#00a847', blue: '#2563eb',
  orange:  '#ea6300', text:    '#0f172a', muted: '#64748b', dimmed: '#94a3b8',
}

const BACKEND = 'http://localhost:3333'

interface Service { title: string; description: string; icon: string }
interface Analysis {
  name: string; tagline: string; description: string; industry: string
  tone: string; aesthetic: string; targetAudience: string; brandPersonality: string
  primaryColor: string; secondaryColor: string; accentColor: string
  backgroundColor: string; textColor: string
  services: Service[]
  whatsWorking: string[]; improvements: string[]
  componentRecommendations: string[]
  contact: { email: string; phone: string; address: string }
  social: Record<string, string>
  allColors: string[]; fonts: string[]
  seoTitle: string; ctaText: string
}
interface Component { id?: string; name?: string; preview_url?: string; demo_url?: string; description?: string; component_slug?: string }
interface ClientConfig {
  name: string; tagline: string; description: string; phone: string
  email: string; address: string; primaryColor: string; accentColor: string
  industry: string; ctaText: string; services: Service[]
}

const defaults: ClientConfig = {
  name: 'Your Business', tagline: 'The Headline That Wins Clients',
  description: 'We deliver professional solutions that help businesses grow faster and operate smarter.',
  phone: '+27 11 000 0000', email: 'hello@yourbusiness.co.za',
  address: 'Johannesburg, South Africa', primaryColor: '#00c758',
  accentColor: '#3080ff', industry: 'Professional Services', ctaText: 'Get Started',
  services: [
    { title: 'Service One', description: 'What this service does and why clients love it.', icon: '⚡' },
    { title: 'Service Two', description: 'What this service does and why clients love it.', icon: '🎯' },
    { title: 'Service Three', description: 'What this service does and why clients love it.', icon: '🔒' },
  ],
}

// ── UI helpers ─────────────────────────────────────────────────
function Tag({ text, color }: { text: string; color: string }) {
  return <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: `${color}20`, color, textTransform: 'capitalize', letterSpacing: '0.04em' }}>{text}</span>
}

function Swatch({ color, border = '#1e2d42', green = '#00c758', muted = '#6a7282' }: { color: string; border?: string; green?: string; muted?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div title={color} onClick={() => { navigator.clipboard.writeText(color); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: color, border: `1px solid ${border}`, boxShadow: `0 4px 14px ${color}50` }} />
      <span style={{ fontSize: 8, fontFamily: 'monospace', color: copied ? green : muted }}>{copied ? 'copied' : color}</span>
    </div>
  )
}

function Field({ label, children, muted }: { label: string; children: React.ReactNode; muted: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
      {children}
    </div>
  )
}

// ── Website Preview ────────────────────────────────────────────
function SitePreview({ c }: { c: ClientConfig }) {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fff', color: '#0f172a', fontSize: 13 }}>
      {/* Nav */}
      <nav style={{ padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: c.primaryColor }} />
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-0.3px' }}>{c.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 18, fontSize: 11, color: '#64748b' }}>
          <span>Services</span><span>About</span><span>Work</span><span>Contact</span>
        </div>
        <div style={{ padding: '7px 16px', borderRadius: 7, background: c.primaryColor, color: '#fff', fontSize: 11, fontWeight: 700 }}>{c.ctaText}</div>
      </nav>

      {/* Hero */}
      <div style={{ padding: '56px 28px 44px', position: 'relative', overflow: 'hidden', background: `linear-gradient(160deg, ${c.primaryColor}10 0%, #fff 50%)` }}>
        <div style={{ position: 'absolute', top: -60, right: -80, width: 360, height: 360, borderRadius: '50%', background: `radial-gradient(circle, ${c.accentColor}18, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 520 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: `${c.primaryColor}15`, marginBottom: 16 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.primaryColor }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: c.primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.industry}</span>
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.2px', marginBottom: 14, color: '#0f172a' }}>{c.tagline}</h1>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.75, marginBottom: 28 }}>{c.description}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ padding: '11px 24px', borderRadius: 8, background: c.primaryColor, color: '#fff', fontSize: 12, fontWeight: 700, boxShadow: `0 8px 24px ${c.primaryColor}45` }}>{c.ctaText} →</div>
            <div style={{ padding: '11px 20px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600, color: '#475569' }}>See Our Work</div>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 36, paddingTop: 28, borderTop: '1px solid #f1f5f9' }}>
            {[['200+','Clients Served'],['99%','Satisfaction'],['10yr','In Business']].map(([v,l])=>(
              <div key={l}>
                <div style={{ fontSize: 22, fontWeight: 900, color: c.primaryColor }}>{v}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div style={{ padding: '32px 28px', background: '#f8fafc' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: c.primaryColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>What We Do</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, letterSpacing: '-0.5px' }}>Services Built to Deliver Results</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {c.services.slice(0,3).map((s,i)=>(
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: '#0f172a' }}>{s.title}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.6 }}>{s.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ margin: '0 28px 28px', padding: '24px 28px', borderRadius: 16, background: c.primaryColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Ready to work with us?</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{c.email} · {c.phone}</div>
        </div>
        <div style={{ padding: '10px 22px', borderRadius: 8, background: '#fff', color: c.primaryColor, fontSize: 12, fontWeight: 800 }}>Contact Us →</div>
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 28px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700 }}>{c.name}</span>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>{c.address} · © {new Date().getFullYear()}</span>
      </div>
    </div>
  )
}

// ── Main App ───────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true)
  const BRAND = dark ? DARK : LIGHT
  const [c, setC] = useState<ClientConfig>(defaults)
  const [url, setUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')
  const [rightTab, setRightTab] = useState<'preview'|'audit'|'components'>('preview')
  const [leftTab, setLeftTab] = useState<'details'|'services'|'style'>('details')
  const [components, setComponents] = useState<Component[]>([])
  const [loadingComps, setLoadingComps] = useState(false)
  const [selectedComp, setSelectedComp] = useState<Component|null>(null)
  const [copied, setCopied] = useState(false)

  const set = (k: keyof ClientConfig, v: string) => setC(p=>({...p,[k]:v}))
  const setSvc = (i:number, k:keyof Service, v:string) => { const s=[...c.services]; s[i]={...s[i],[k]:v}; setC(p=>({...p,services:s})) }
  const addSvc = () => c.services.length < 6 && setC(p=>({...p,services:[...p.services,{title:'New Service',description:'Short description.',icon:'✦'}]}))
  const rmSvc = (i:number) => c.services.length>1 && setC(p=>({...p,services:p.services.filter((_,j)=>j!==i)}))

  const analyze = async () => {
    if (!url) return
    setAnalyzing(true); setError(''); setAnalysis(null)
    try {
      const res = await fetch(`${BACKEND}/api/analyze`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ url }),
      })
      const data: Analysis = await res.json()
      if (!res.ok) throw new Error((data as any).error)
      setAnalysis(data)
      setC({
        name: data.name, tagline: data.tagline, description: data.description,
        email: data.contact?.email || '', phone: data.contact?.phone || '',
        address: data.contact?.address || '',
        primaryColor: data.primaryColor, accentColor: data.secondaryColor,
        industry: data.industry, ctaText: data.ctaText || 'Get Started',
        services: data.services?.slice(0,3) || defaults.services,
      })
      setRightTab('audit')
      fetchComponents(data.componentRecommendations?.join(' ') || data.industry)
    } catch(err:unknown) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  const fetchComponents = useCallback(async (query: string) => {
    setLoadingComps(true)
    try {
      const res = await fetch(`${BACKEND}/api/components?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      const list: Component[] = Array.isArray(data) ? data : data.results || data.components || []
      setComponents(list.slice(0,12))
    } catch { setComponents([]) }
    finally { setLoadingComps(false) }
  }, [])

  const copyCode = () => {
    const code = `const CLIENT = ${JSON.stringify(c, null, 2)}`
    navigator.clipboard.writeText(code)
    setCopied(true); setTimeout(()=>setCopied(false),2000)
  }

  const TONE_COLOR: Record<string,string> = { professional: BRAND.blue, bold: BRAND.orange, playful: '#f59e0b', minimal: BRAND.muted, luxury: '#a855f7', corporate: BRAND.blue }
  const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', background:BRAND.card, border:`1px solid ${BRAND.border}`, borderRadius:8, color:BRAND.text, fontSize:12, outline:'none', boxSizing:'border-box', fontFamily:'inherit' }
  const F = ({ label, children }: { label: string; children: React.ReactNode }) => <Field label={label} muted={BRAND.muted}>{children}</Field>

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:BRAND.bg, color:BRAND.text, fontFamily:"'Inter',system-ui,sans-serif", overflow:'hidden' }}>

      {/* ── TOPBAR ── */}
      <div style={{ display:'flex', alignItems:'center', padding:'0 16px', height:56, borderBottom:`1px solid ${BRAND.border}`, flexShrink:0, gap:12 }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0, marginRight:8 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:BRAND.green, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900, color:BRAND.bg }}>S</div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, letterSpacing:'-0.3px', color:BRAND.text }}>SiteForge</div>
            <div style={{ fontSize:9, color:BRAND.muted }}>Professional Website Builder</div>
          </div>
        </div>

        {/* URL input */}
        <div style={{ flex:1, display:'flex', gap:8 }}>
          <div style={{ flex:1, display:'flex', alignItems:'center', background:BRAND.surface, border:`1px solid ${error ? '#ef4444' : analysis ? BRAND.green : BRAND.border}`, borderRadius:10, padding:'0 14px', gap:8, transition:'border-color 0.2s' }}>
            <span style={{ fontSize:14, flexShrink:0 }}>🔗</span>
            <input value={url} onChange={e=>{ setUrl(e.target.value); setError('') }}
              onKeyDown={e=>e.key==='Enter'&&analyze()}
              placeholder="Paste any website URL — run a full brand analysis..."
              style={{ flex:1, background:'none', border:'none', outline:'none', color:BRAND.text, fontSize:13, padding:'10px 0' }} />
            {analysis && <span style={{ fontSize:10, color:BRAND.green, fontWeight:700, whiteSpace:'nowrap' }}>✓ Analysis complete</span>}
            {error && <span style={{ fontSize:10, color:'#ef4444', whiteSpace:'nowrap', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis' }} title={error}>⚠ {error}</span>}
          </div>
          <motion.button whileTap={{ scale:0.95 }} onClick={analyze} disabled={analyzing||!url}
            style={{ padding:'0 20px', height:42, borderRadius:10, background:analyzing?BRAND.surface:BRAND.green, color:analyzing?BRAND.muted:BRAND.bg, fontSize:13, fontWeight:800, border:'none', cursor:analyzing?'not-allowed':'pointer', flexShrink:0, letterSpacing:'-0.2px' }}>
            {analyzing ? '⏳ Analyzing...' : '✦ Analyze Website'}
          </motion.button>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:8, flexShrink:0 }}>
          <motion.button whileTap={{ scale:0.92 }} onClick={()=>setDark(d=>!d)}
            style={{ width:36, height:36, borderRadius:8, border:`1px solid ${BRAND.border}`, background:BRAND.surface, color:BRAND.text, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {dark ? '☀️' : '🌙'}
          </motion.button>
          <button onClick={()=>setC(defaults)} style={{ padding:'0 12px', height:36, borderRadius:8, border:`1px solid ${BRAND.border}`, background:'transparent', color:BRAND.muted, fontSize:12, cursor:'pointer' }}>Reset</button>
          <motion.button whileTap={{ scale:0.96 }} onClick={copyCode}
            style={{ padding:'0 16px', height:36, borderRadius:8, background:copied?'#16a34a':BRAND.blue, color:'#fff', fontSize:12, fontWeight:700, border:'none', cursor:'pointer' }}>
            {copied?'✓ Copied!':'Copy Code'}
          </motion.button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* LEFT SIDEBAR */}
        <div style={{ width:290, background:BRAND.bg, borderRight:`1px solid ${BRAND.border}`, display:'flex', flexDirection:'column', flexShrink:0 }}>
          {/* Tabs */}
          <div style={{ display:'flex', padding:'8px 10px', gap:4, borderBottom:`1px solid ${BRAND.border}` }}>
            {(['details','style','services'] as const).map(t=>(
              <button key={t} onClick={()=>setLeftTab(t)} style={{ flex:1, padding:'8px 4px', fontSize:11, fontWeight:700, border:'none', cursor:'pointer', borderRadius:7, background:leftTab===t?BRAND.surface:'transparent', color:leftTab===t?BRAND.green:BRAND.muted, textTransform:'capitalize', letterSpacing:'0.02em' }}>{t}</button>
            ))}
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'14px 12px', display:'flex', flexDirection:'column', gap:12 }}>
            <AnimatePresence mode="wait">
              <motion.div key={leftTab} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.12 }} style={{ display:'flex', flexDirection:'column', gap:12 }}>

                {leftTab==='details' && <>
                  {([['Business Name','name'],['Industry','industry'],['Tagline','tagline'],['Phone','phone'],['Email','email'],['Address','address'],['CTA Button Text','ctaText']] as [string,keyof ClientConfig][]).map(([label,key])=>(
                    <F key={key} label={label}><input style={inp} value={c[key] as string} onChange={e=>set(key,e.target.value)} /></F>
                  ))}
                  <F label="Description"><textarea style={{ ...inp, resize:'none' }} rows={3} value={c.description} onChange={e=>set('description',e.target.value)} /></F>
                </>}

                {leftTab==='style' && <>
                  <F label="Primary Color">
                    <div style={{ display:'flex', gap:8 }}>
                      <input type="color" value={c.primaryColor} onChange={e=>set('primaryColor',e.target.value)} style={{ width:42, height:42, border:'none', background:'none', cursor:'pointer', borderRadius:8, padding:2 }} />
                      <input style={{ ...inp, fontFamily:'monospace', flex:1 }} value={c.primaryColor} onChange={e=>set('primaryColor',e.target.value)} />
                    </div>
                  </F>
                  <F label="Accent Color">
                    <div style={{ display:'flex', gap:8 }}>
                      <input type="color" value={c.accentColor} onChange={e=>set('accentColor',e.target.value)} style={{ width:42, height:42, border:'none', background:'none', cursor:'pointer', borderRadius:8, padding:2 }} />
                      <input style={{ ...inp, fontFamily:'monospace', flex:1 }} value={c.accentColor} onChange={e=>set('accentColor',e.target.value)} />
                    </div>
                  </F>
                  <div style={{ height:48, borderRadius:10, background:`linear-gradient(135deg,${c.primaryColor},${c.accentColor})`, boxShadow:`0 6px 20px ${c.primaryColor}40` }} />
                  {analysis?.allColors && <>
                    <div style={{ fontSize:10, fontWeight:700, color:BRAND.muted, textTransform:'uppercase', letterSpacing:'0.07em' }}>Extracted from site</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {analysis.allColors.map((col,i)=><Swatch key={i} color={col} border={BRAND.border} green={BRAND.green} muted={BRAND.muted} />)}
                    </div>
                  </>}
                </>}

                {leftTab==='services' && <>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:10, color:BRAND.muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em' }}>Services ({c.services.length}/6)</span>
                    <span onClick={addSvc} style={{ fontSize:11, color:BRAND.green, fontWeight:700, cursor:'pointer' }}>+ Add</span>
                  </div>
                  {c.services.map((s,i)=>(
                    <div key={i} style={{ background:BRAND.card, border:`1px solid ${BRAND.border}`, borderRadius:10, padding:12, display:'flex', flexDirection:'column', gap:8 }}>
                      <div style={{ display:'flex', justifyContent:'space-between' }}>
                        <span style={{ fontSize:10, fontWeight:700, color:BRAND.green }}>Service {i+1}</span>
                        <span onClick={()=>rmSvc(i)} style={{ fontSize:10, color:BRAND.muted, cursor:'pointer' }}>✕ Remove</span>
                      </div>
                      <div style={{ display:'flex', gap:6 }}>
                        <div style={{ width:52 }}><F label="Icon"><input style={{ ...inp, textAlign:'center', fontSize:16, padding:'6px' }} value={s.icon} onChange={e=>setSvc(i,'icon',e.target.value)} /></F></div>
                        <div style={{ flex:1 }}><F label="Title"><input style={inp} value={s.title} onChange={e=>setSvc(i,'title',e.target.value)} /></F></div>
                      </div>
                      <F label="Description"><textarea style={{ ...inp, resize:'none' }} rows={2} value={s.description} onChange={e=>setSvc(i,'description',e.target.value)} /></F>
                    </div>
                  ))}
                </>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', background:BRAND.surface, overflow:'hidden' }}>
          {/* Right tabs */}
          <div style={{ display:'flex', borderBottom:`1px solid ${BRAND.border}`, padding:'0 16px', flexShrink:0 }}>
            {([['preview','◉ Preview'],['audit',`✦ Brand Audit${analysis?' ✓':''}`],['components','◈ Components']] as const).map(([t,label])=>(
              <button key={t} onClick={()=>setRightTab(t as any)} style={{ padding:'14px 16px', fontSize:12, fontWeight:700, border:'none', background:'transparent', cursor:'pointer', color:rightTab===t?BRAND.green:BRAND.muted, borderBottom:rightTab===t?`2px solid ${BRAND.green}`:'2px solid transparent', letterSpacing:'-0.1px' }}>{label}</button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* PREVIEW */}
            {rightTab==='preview' && (
              <motion.div key="preview" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:14 }}>
                {/* Browser chrome */}
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 14px', background:BRAND.card, borderRadius:10, border:`1px solid ${BRAND.border}` }}>
                  <div style={{ display:'flex', gap:5 }}>
                    {['#ef4444','#f59e0b','#22c55e'].map(col=><div key={col} style={{ width:10, height:10, borderRadius:'50%', background:col }} />)}
                  </div>
                  <div style={{ flex:1, textAlign:'center', fontSize:11, color:BRAND.dimmed }}>
                    🔒 {c.name.toLowerCase().replace(/\s+/g,'').replace(/[^a-z0-9]/g,'')||'yourbusiness'}.co.za
                  </div>
                </div>
                <div style={{ background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 24px 80px rgba(0,0,0,0.5)', border:`1px solid ${BRAND.border}` }}>
                  <SitePreview c={c} />
                </div>
              </motion.div>
            )}

            {/* AI AUDIT */}
            {rightTab==='audit' && (
              <motion.div key="audit" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:14 }}>
                {!analysis && !analyzing && (
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:12, color:BRAND.muted, textAlign:'center', padding:40 }}>
                    <div style={{ fontSize:48, opacity:0.3 }}>✦</div>
                    <div style={{ fontSize:15, fontWeight:700, color:BRAND.text }}>Claude Brand Audit</div>
                    <div style={{ fontSize:12, maxWidth:300, lineHeight:1.6 }}>Paste a client's website URL above and click "Analyze Website" — Claude will analyze the entire brand and give you a full strategic report.</div>
                  </div>
                )}
                {analyzing && (
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, gap:16 }}>
                    <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:2, ease:'linear' }} style={{ width:48, height:48, borderRadius:'50%', border:`3px solid ${BRAND.border}`, borderTopColor:BRAND.green }} />
                    <div style={{ fontSize:13, color:BRAND.muted }}>Analyzing website...</div>
                    <div style={{ fontSize:11, color:BRAND.dimmed }}>Analyzing brand, colors, content & strategy</div>
                  </div>
                )}
                {analysis && (<>
                  {/* Brand Overview */}
                  <div style={{ background:BRAND.card, borderRadius:12, padding:18, border:`1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize:10, fontWeight:700, color:BRAND.green, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Brand Overview</div>
                    <div style={{ fontSize:18, fontWeight:800, marginBottom:4 }}>{analysis.name}</div>
                    <div style={{ fontSize:12, color:BRAND.muted, marginBottom:14 }}>{analysis.industry}</div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
                      <Tag text={analysis.tone} color={TONE_COLOR[analysis.tone]||BRAND.blue} />
                      <Tag text={analysis.aesthetic} color={BRAND.green} />
                      {analysis.brandPersonality?.split(',').map((p,i)=><Tag key={i} text={p.trim()} color={BRAND.muted} />)}
                    </div>
                    <div style={{ fontSize:11, color:BRAND.muted, lineHeight:1.7 }}><strong style={{ color:BRAND.text }}>Target audience:</strong> {analysis.targetAudience}</div>
                    <div style={{ fontSize:11, color:BRAND.muted, lineHeight:1.7, marginTop:4 }}><strong style={{ color:BRAND.text }}>SEO title:</strong> {analysis.seoTitle}</div>
                  </div>

                  {/* Color Palette */}
                  <div style={{ background:BRAND.card, borderRadius:12, padding:18, border:`1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize:10, fontWeight:700, color:BRAND.green, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Color Palette</div>
                    <div style={{ display:'flex', gap:12, marginBottom:16 }}>
                      {[['Primary',analysis.primaryColor],['Secondary',analysis.secondaryColor],['Accent',analysis.accentColor],['Background',analysis.backgroundColor],['Text',analysis.textColor]].map(([label,color])=>(
                        <div key={label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                          <div style={{ width:44, height:44, borderRadius:10, background:color, border:`1px solid ${BRAND.border}`, boxShadow:`0 4px 12px ${color}40`, cursor:'pointer' }}
                            onClick={()=>navigator.clipboard.writeText(color)} title={`Click to copy ${color}`} />
                          <span style={{ fontSize:9, color:BRAND.muted }}>{label}</span>
                          <span style={{ fontSize:8, fontFamily:'monospace', color:BRAND.dimmed }}>{color}</span>
                        </div>
                      ))}
                    </div>
                    {analysis.allColors?.length > 0 && <>
                      <div style={{ fontSize:9, color:BRAND.dimmed, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.05em' }}>All extracted colors</div>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        {analysis.allColors.map((col,i)=><Swatch key={i} color={col} border={BRAND.border} green={BRAND.green} muted={BRAND.muted} />)}
                      </div>
                    </>}
                  </div>

                  {/* Typography */}
                  {analysis.fonts?.length > 0 && (
                    <div style={{ background:BRAND.card, borderRadius:12, padding:18, border:`1px solid ${BRAND.border}` }}>
                      <div style={{ fontSize:10, fontWeight:700, color:BRAND.green, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Typography</div>
                      {analysis.fonts.map((font,i)=>(
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px', background:BRAND.bg, borderRadius:8, marginBottom:6 }}>
                          <div style={{ fontSize:22, fontFamily:font, color:BRAND.text, minWidth:40 }}>Aa</div>
                          <div>
                            <div style={{ fontSize:12, fontWeight:600 }}>{font}</div>
                            <div style={{ fontSize:9, color:BRAND.muted }}>{i===0?'Primary Typeface':'Secondary Typeface'}</div>
                          </div>
                          {i===0 && <Tag text="Primary" color={BRAND.green} />}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* What's Working vs Improvements */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div style={{ background:BRAND.card, borderRadius:12, padding:16, border:`1px solid ${BRAND.border}` }}>
                      <div style={{ fontSize:10, fontWeight:700, color:BRAND.green, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>✓ What's Working</div>
                      {analysis.whatsWorking?.map((item,i)=>(
                        <div key={i} style={{ display:'flex', gap:8, marginBottom:10, fontSize:11, color:BRAND.muted, lineHeight:1.5 }}>
                          <span style={{ color:BRAND.green, flexShrink:0 }}>✓</span><span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ background:BRAND.card, borderRadius:12, padding:16, border:`1px solid ${BRAND.border}` }}>
                      <div style={{ fontSize:10, fontWeight:700, color:BRAND.orange, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>⚡ Improvements</div>
                      {analysis.improvements?.map((item,i)=>(
                        <div key={i} style={{ display:'flex', gap:8, marginBottom:10, fontSize:11, color:BRAND.muted, lineHeight:1.5 }}>
                          <span style={{ color:BRAND.orange, flexShrink:0 }}>→</span><span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact & Social */}
                  <div style={{ background:BRAND.card, borderRadius:12, padding:16, border:`1px solid ${BRAND.border}` }}>
                    <div style={{ fontSize:10, fontWeight:700, color:BRAND.green, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Contact & Social</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                      {[['📧',analysis.contact?.email],['📞',analysis.contact?.phone],['📍',analysis.contact?.address]].map(([icon,val])=>val?(
                        <div key={icon} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 12px', background:BRAND.bg, borderRadius:8 }}>
                          <span>{icon}</span><span style={{ fontSize:12 }}>{val}</span>
                        </div>
                      ):null)}
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:4 }}>
                        {Object.entries(analysis.social||{}).map(([k,v])=>v?(
                          <a key={k} href={v} target="_blank" rel="noreferrer" style={{ padding:'4px 12px', borderRadius:999, background:BRAND.bg, border:`1px solid ${BRAND.border}`, fontSize:10, color:BRAND.blue, textDecoration:'none', fontWeight:700, textTransform:'capitalize' }}>{k}</a>
                        ):null)}
                      </div>
                    </div>
                  </div>

                  <motion.button whileTap={{ scale:0.97 }} onClick={()=>setRightTab('preview')}
                    style={{ padding:'13px', borderRadius:10, background:BRAND.green, color:BRAND.bg, fontSize:13, fontWeight:800, border:'none', cursor:'pointer', letterSpacing:'-0.2px' }}>
                    View Upgraded Preview →
                  </motion.button>
                </>)}
              </motion.div>
            )}

            {/* COMPONENTS */}
            {rightTab==='components' && (
              <motion.div key="components" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800 }}>Component Library</div>
                    <div style={{ fontSize:11, color:BRAND.muted }}>Recommended for {c.industry}</div>
                  </div>
                  <button onClick={()=>fetchComponents(analysis?.componentRecommendations?.join(' ')||c.industry)}
                    style={{ padding:'7px 14px', borderRadius:8, background:BRAND.card, border:`1px solid ${BRAND.border}`, color:BRAND.muted, fontSize:11, cursor:'pointer' }}>↻ Refresh</button>
                </div>

                {analysis?.componentRecommendations && (
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {analysis.componentRecommendations.map((rec,i)=>(
                      <button key={i} onClick={()=>fetchComponents(rec)}
                        style={{ padding:'5px 12px', borderRadius:999, background:BRAND.card, border:`1px solid ${BRAND.border}`, color:BRAND.blue, fontSize:10, fontWeight:700, cursor:'pointer' }}>
                        {rec}
                      </button>
                    ))}
                  </div>
                )}

                {loadingComps && (
                  <div style={{ display:'flex', alignItems:'center', gap:10, padding:32, justifyContent:'center', color:BRAND.muted }}>
                    <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.5, ease:'linear' }} style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${BRAND.border}`, borderTopColor:BRAND.green }} />
                    <span style={{ fontSize:12 }}>Fetching components...</span>
                  </div>
                )}

                {!loadingComps && components.length===0 && (
                  <div style={{ textAlign:'center', padding:40, color:BRAND.muted }}>
                    <div style={{ fontSize:32, marginBottom:8, opacity:0.3 }}>◈</div>
                    <div style={{ fontSize:12 }}>Run an audit first — get targeted component recommendations</div>
                  </div>
                )}

                {selectedComp && (
                  <div style={{ background:BRAND.card, borderRadius:12, padding:16, border:`2px solid ${BRAND.green}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:800 }}>{selectedComp.name}</div>
                        <Tag text="Selected" color={BRAND.green} />
                      </div>
                      <button onClick={()=>setSelectedComp(null)} style={{ background:'none', border:'none', color:BRAND.muted, cursor:'pointer', fontSize:16 }}>✕</button>
                    </div>
                    {selectedComp.preview_url
                      ? <img src={selectedComp.preview_url} alt={selectedComp.name} style={{ width:'100%', borderRadius:8, border:`1px solid ${BRAND.border}` }} />
                      : selectedComp.demo_url
                      ? <iframe src={selectedComp.demo_url} style={{ width:'100%', height:280, borderRadius:8, border:`1px solid ${BRAND.border}` }} title={selectedComp.name} />
                      : <div style={{ height:120, background:BRAND.bg, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:BRAND.muted, fontSize:12 }}>No preview available</div>
                    }
                    {selectedComp.description && <div style={{ fontSize:11, color:BRAND.muted, marginTop:10, lineHeight:1.5 }}>{selectedComp.description}</div>}
                  </div>
                )}

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {components.map((comp,i)=>(
                    <motion.div key={comp.id||i} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                      onClick={()=>setSelectedComp(comp)}
                      style={{ background:selectedComp?.id===comp.id?`${BRAND.green}10`:BRAND.card, borderRadius:10, padding:12, cursor:'pointer', border:`1px solid ${selectedComp?.id===comp.id?BRAND.green:BRAND.border}` }}>
                      {comp.preview_url
                        ? <img src={comp.preview_url} alt={comp.name} style={{ width:'100%', height:100, objectFit:'cover', borderRadius:7, marginBottom:8, border:`1px solid ${BRAND.border}` }} />
                        : <div style={{ width:'100%', height:100, borderRadius:7, marginBottom:8, background:`linear-gradient(135deg,${c.primaryColor}20,${c.accentColor}20)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, border:`1px solid ${BRAND.border}` }}>◈</div>
                      }
                      <div style={{ fontSize:11, fontWeight:700, marginBottom:3 }}>{comp.name||`Component ${i+1}`}</div>
                      {comp.description && <div style={{ fontSize:9, color:BRAND.muted, lineHeight:1.4 }}>{comp.description.slice(0,70)}...</div>}
                      <div style={{ marginTop:8 }}>
                        <Tag text="Component" color={BRAND.blue} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
