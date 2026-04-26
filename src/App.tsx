import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import JSZip from 'jszip'
import './index.css'

const DARK  = { bg:'#0E1625', surface:'#111d2e', card:'#162032', border:'#1e2d42', green:'#00c758', blue:'#3080ff', orange:'#fe6e00', text:'#ffffff', muted:'#6a7282', dimmed:'#3a4a5c' }
const LIGHT = { bg:'#f0f4f8', surface:'#ffffff', card:'#f8fafc', border:'#e2e8f0', green:'#00a847', blue:'#2563eb', orange:'#ea6300', text:'#0f172a', muted:'#64748b', dimmed:'#94a3b8' }

const TEMPLATES = [
  { id:'dark',     name:'Modern Dark',      desc:'Dark background, gradient headlines, glowing buttons',       emoji:'🌑' },
  { id:'minimal',  name:'Clean Minimal',    desc:'White, lots of space, content-first, elegant restraint',     emoji:'⬜' },
  { id:'bold',     name:'Bold Corporate',   desc:'Strong colors, big type, high contrast, authoritative',      emoji:'💼' },
  { id:'creative', name:'Creative Agency',  desc:'Asymmetric, expressive, modern agency energy',               emoji:'🎨' },
  { id:'warm',     name:'Warm & Friendly',  desc:'Rounded, approachable, welcoming personality',               emoji:'🌿' },
  { id:'luxury',   name:'Premium Luxury',   desc:'Dark + gold, serif fonts, exclusive and refined',            emoji:'✦' },
]

interface Audit {
  name:string; tagline:string; description:string; industry:string; tone:string
  aesthetic:string; targetAudience:string; brandPersonality:string
  primaryColor:string; secondaryColor:string; accentColor:string
  services:{ title:string; description:string; icon:string }[]
  whatsWorking:string[]; improvements:string[]
  contact:{ email:string; phone:string; address:string }
  social:Record<string,string>; allColors:string[]; fonts:string[]
  seoTitle:string; ctaText:string
}

type Phase = 'idle' | 'analyzing' | 'report' | 'building' | 'done' | 'error'

function Swatch({ color, B }: { color:string; B:typeof DARK }) {
  const [copied, setCopied] = useState(false)
  return (
    <div onClick={()=>{ navigator.clipboard.writeText(color); setCopied(true); setTimeout(()=>setCopied(false),1500) }}
      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, cursor:'pointer' }}>
      <div style={{ width:36, height:36, borderRadius:8, background:color, border:`1px solid ${B.border}`, boxShadow:`0 4px 12px ${color}50` }} />
      <span style={{ fontSize:8, fontFamily:'monospace', color: copied ? B.green : B.muted }}>{copied?'copied':color}</span>
    </div>
  )
}

export default function App() {
  const [dark, setDark] = useState(true)
  const B = dark ? DARK : LIGHT

  const [url, setUrl]             = useState('')
  const [phase, setPhase]         = useState<Phase>('idle')
  const [error, setError]         = useState('')
  const [audit, setAudit]         = useState<Audit|null>(null)
  const [template, setTemplate]   = useState('minimal')
  const [instructions, setInstr]  = useState('')
  const [html, setHtml]           = useState('')
  const [buildProgress, setBuildProgress] = useState(0)
  const [copied, setCopied]       = useState(false)

  // ── Step 1: Analyze ───────────────────────────────────────────
  const analyze = async () => {
    if (!url.trim()) return
    setPhase('analyzing'); setError(''); setAudit(null); setHtml('')
    try {
      const res = await fetch('/api/analyze', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ url: url.trim() }),
      })
      const text = await res.text()
      let data: Audit
      try { data = JSON.parse(text) } catch { throw new Error(text.slice(0,120)) }
      if (!res.ok) throw new Error((data as any).error || 'Analysis failed')
      setAudit(data)
      setPhase('report')
    } catch (err:unknown) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
      setPhase('error')
    }
  }

  // ── Step 2: Build ─────────────────────────────────────────────
  const build = async () => {
    if (!audit) return
    setPhase('building'); setBuildProgress(0); setHtml('')
    try {
      const res = await fetch('/api/generate', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ audit, template, instructions }),
      })
      if (!res.ok) {
        const text = await res.text()
        let msg = 'Build failed'
        try { msg = JSON.parse(text).error } catch { msg = text.slice(0,100) }
        throw new Error(msg)
      }
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream')
      const dec = new TextDecoder()
      let acc = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += dec.decode(value, { stream:true })
        setBuildProgress(Math.min(95, Math.round((acc.length / 18000) * 100)))
        if (acc.includes('<')) setHtml(acc)
      }
      if (!acc.includes('</html>')) acc += '\n</body></html>'
      setHtml(acc)
      setPhase('done')
    } catch (err:unknown) {
      setError(err instanceof Error ? err.message : 'Build failed')
      setPhase('error')
    }
  }

  // ── Actions ───────────────────────────────────────────────────
  const downloadZip = async () => {
    if (!html || !audit) return
    const zip = new JSZip()
    zip.file('index.html', html)
    zip.file('README.md', `# ${audit.name}\n\nBuilt with SiteForge.\n\nOpen index.html in a browser or drag to Netlify Drop to deploy.`)
    const blob = await zip.generateAsync({ type:'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${audit.name.toLowerCase().replace(/\s+/g,'-')}-website.zip`
    a.click()
  }

  const openTab = () => {
    if (!html) return
    window.open(URL.createObjectURL(new Blob([html], { type:'text/html' })), '_blank')
  }

  const copyHtml = () => {
    navigator.clipboard.writeText(html)
    setCopied(true); setTimeout(()=>setCopied(false),2000)
  }

  const startOver = () => {
    setPhase('idle'); setAudit(null); setHtml(''); setError(''); setUrl(''); setInstr('')
  }

  // ── Styles ────────────────────────────────────────────────────
  const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', background:B.card, border:`1px solid ${B.border}`, borderRadius:8, color:B.text, fontSize:12, outline:'none', boxSizing:'border-box', fontFamily:'inherit' }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:B.bg, color:B.text, fontFamily:"'Inter',system-ui,sans-serif", overflow:'hidden' }}>

      {/* ── TOPBAR ── */}
      <div style={{ display:'flex', alignItems:'center', padding:'0 20px', height:52, borderBottom:`1px solid ${B.border}`, flexShrink:0, gap:12 }}>
        <div style={{ width:28, height:28, borderRadius:8, background:B.green, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:B.bg, flexShrink:0 }}>S</div>
        <div style={{ flexShrink:0 }}>
          <div style={{ fontSize:13, fontWeight:800 }}>SiteForge</div>
          <div style={{ fontSize:9, color:B.muted }}>AI Website Builder</div>
        </div>

        {/* URL bar — always visible */}
        <div style={{ flex:1, display:'flex', alignItems:'center', background:B.surface, border:`1px solid ${phase==='error'?'#ef4444':audit?B.green:B.border}`, borderRadius:9, padding:'0 12px', gap:8 }}>
          <span style={{ fontSize:12 }}>🔗</span>
          <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&analyze()}
            placeholder="Paste client's website URL..."
            style={{ flex:1, background:'none', border:'none', outline:'none', color:B.text, fontSize:12, padding:'9px 0' }} />
          {audit && phase!=='analyzing' && <span style={{ fontSize:10, color:B.green, fontWeight:700, whiteSpace:'nowrap' }}>✓ {audit.name}</span>}
        </div>

        <motion.button whileTap={{ scale:0.95 }} onClick={analyze}
          disabled={phase==='analyzing'||phase==='building'}
          style={{ padding:'0 16px', height:36, borderRadius:8, background:phase==='analyzing'?B.card:B.green, color:phase==='analyzing'?B.muted:B.bg, fontSize:12, fontWeight:800, border:'none', cursor:'pointer', flexShrink:0 }}>
          {phase==='analyzing' ? '⏳ Analyzing...' : audit ? '↻ Re-analyze' : '✦ Analyze'}
        </motion.button>

        {phase==='done' && (
          <button onClick={startOver} style={{ padding:'0 12px', height:36, borderRadius:8, border:`1px solid ${B.border}`, background:'transparent', color:B.muted, fontSize:12, cursor:'pointer' }}>
            + New Site
          </button>
        )}

        <motion.button whileTap={{ scale:0.92 }} onClick={()=>setDark(d=>!d)}
          style={{ width:36, height:36, borderRadius:8, border:`1px solid ${B.border}`, background:'transparent', color:B.text, fontSize:16, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {dark?'☀️':'🌙'}
        </motion.button>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex:1, overflow:'hidden', display:'flex' }}>
        <AnimatePresence mode="wait">

          {/* IDLE */}
          {phase==='idle' && (
            <motion.div key="idle" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24, padding:40, textAlign:'center' }}>
              <div style={{ fontSize:64, opacity:0.15 }}>🌐</div>
              <div>
                <div style={{ fontSize:24, fontWeight:900, marginBottom:8 }}>Build stunning websites in minutes</div>
                <div style={{ fontSize:14, color:B.muted, maxWidth:460, lineHeight:1.7 }}>Paste any client website URL. The AI will audit their brand, then you choose a style and give instructions before building — so you only generate once.</div>
              </div>
              <div style={{ display:'flex', gap:12 }}>
                {['🔍 Brand audit','🎨 Template choice','✍️ Your instructions','⚡ Build once'].map((step,i)=>(
                  <div key={i} style={{ background:B.card, border:`1px solid ${B.border}`, borderRadius:12, padding:'14px 18px', fontSize:12, fontWeight:600, color:B.muted }}>{step}</div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ANALYZING */}
          {phase==='analyzing' && (
            <motion.div key="analyzing" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
              <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.5, ease:'linear' }}
                style={{ width:48, height:48, borderRadius:'50%', border:`3px solid ${B.border}`, borderTopColor:B.green }} />
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:16, fontWeight:800, marginBottom:6 }}>Analyzing website...</div>
                <div style={{ fontSize:12, color:B.muted }}>Reading brand colors, fonts, services, content and tone</div>
              </div>
            </motion.div>
          )}

          {/* ERROR */}
          {phase==='error' && (
            <motion.div key="error" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
              <div style={{ fontSize:32 }}>⚠️</div>
              <div style={{ fontSize:15, fontWeight:700 }}>Something went wrong</div>
              <div style={{ background:'#ef444420', border:'1px solid #ef4444', borderRadius:10, padding:'12px 20px', fontSize:12, color:'#ef4444', maxWidth:400, textAlign:'center' }}>{error}</div>
              <button onClick={startOver} style={{ padding:'10px 24px', borderRadius:8, background:B.green, color:B.bg, fontSize:13, fontWeight:700, border:'none', cursor:'pointer' }}>Try Again</button>
            </motion.div>
          )}

          {/* BRAND REPORT */}
          {phase==='report' && audit && (
            <motion.div key="report" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} style={{ flex:1, display:'flex', overflow:'hidden' }}>

              {/* Left: Brand Report */}
              <div style={{ width:340, borderRight:`1px solid ${B.border}`, overflowY:'auto', padding:'20px 16px', display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:B.green, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>Brand Analysis</div>
                  <div style={{ fontSize:18, fontWeight:900, marginBottom:2 }}>{audit.name}</div>
                  <div style={{ fontSize:11, color:B.muted, marginBottom:10 }}>{audit.industry}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {[audit.tone, audit.aesthetic, ...(audit.brandPersonality?.split(',')||[])].filter(Boolean).map((tag,i)=>(
                      <span key={i} style={{ fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:999, background:`${B.blue}20`, color:B.blue }}>{tag.trim()}</span>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div style={{ background:B.card, borderRadius:10, padding:'12px', border:`1px solid ${B.border}` }}>
                  <div style={{ fontSize:9, fontWeight:700, color:B.green, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Brand Colors</div>
                  <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                    {[['Primary',audit.primaryColor],['Secondary',audit.secondaryColor],['Accent',audit.accentColor]].map(([l,c])=>(
                      <div key={l} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, cursor:'pointer' }} onClick={()=>navigator.clipboard.writeText(c)}>
                        <div style={{ width:44, height:44, borderRadius:10, background:c, border:`1px solid ${B.border}`, boxShadow:`0 4px 14px ${c}50` }} />
                        <span style={{ fontSize:9, color:B.muted }}>{l}</span>
                        <span style={{ fontSize:8, fontFamily:'monospace', color:B.dimmed }}>{c}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                    {audit.allColors?.map((col,i)=><Swatch key={i} color={col} B={B} />)}
                  </div>
                </div>

                {/* AI insights */}
                <div style={{ background:B.card, borderRadius:10, padding:'12px', border:`1px solid ${B.border}` }}>
                  <div style={{ fontSize:9, fontWeight:700, color:B.green, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>AI Observations</div>
                  <div style={{ fontSize:11, color:B.muted, lineHeight:1.6, marginBottom:8 }}><strong style={{ color:B.text }}>Audience:</strong> {audit.targetAudience}</div>
                  {audit.whatsWorking?.length > 0 && <>
                    <div style={{ fontSize:10, fontWeight:700, color:B.green, marginBottom:6 }}>What's working ✓</div>
                    {audit.whatsWorking.map((w,i)=><div key={i} style={{ fontSize:10, color:B.muted, marginBottom:4, display:'flex', gap:6 }}><span style={{ color:B.green }}>✓</span>{w}</div>)}
                  </>}
                  {audit.improvements?.length > 0 && <>
                    <div style={{ fontSize:10, fontWeight:700, color:B.orange, marginBottom:6, marginTop:10 }}>Improvements needed →</div>
                    {audit.improvements.map((w,i)=><div key={i} style={{ fontSize:10, color:B.muted, marginBottom:4, display:'flex', gap:6 }}><span style={{ color:B.orange }}>→</span>{w}</div>)}
                  </>}
                </div>

                {/* Services found */}
                <div style={{ background:B.card, borderRadius:10, padding:'12px', border:`1px solid ${B.border}` }}>
                  <div style={{ fontSize:9, fontWeight:700, color:B.green, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Services Detected</div>
                  {audit.services?.map((s,i)=>(
                    <div key={i} style={{ display:'flex', gap:8, marginBottom:8, alignItems:'flex-start' }}>
                      <span style={{ fontSize:16 }}>{s.icon}</span>
                      <div><div style={{ fontSize:11, fontWeight:700 }}>{s.title}</div><div style={{ fontSize:10, color:B.muted, lineHeight:1.4 }}>{s.description}</div></div>
                    </div>
                  ))}
                </div>

                {/* Contact */}
                {(audit.contact?.email || audit.contact?.phone) && (
                  <div style={{ background:B.card, borderRadius:10, padding:'12px', border:`1px solid ${B.border}` }}>
                    <div style={{ fontSize:9, fontWeight:700, color:B.green, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Contact Detected</div>
                    {[['📧',audit.contact.email],['📞',audit.contact.phone],['📍',audit.contact.address]].filter(([,v])=>v).map(([icon,val])=>(
                      <div key={icon} style={{ fontSize:11, color:B.muted, marginBottom:4 }}>{icon} {val}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Template + Instructions + Build */}
              <div style={{ flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:20 }}>

                {/* Template picker */}
                <div>
                  <div style={{ fontSize:14, fontWeight:800, marginBottom:4 }}>Choose a template style</div>
                  <div style={{ fontSize:12, color:B.muted, marginBottom:14 }}>This tells the AI what design direction to take. You can also describe anything specific below.</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                    {TEMPLATES.map(t=>(
                      <motion.div key={t.id} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                        onClick={()=>setTemplate(t.id)}
                        style={{ background:template===t.id?`${B.green}15`:B.card, border:`2px solid ${template===t.id?B.green:B.border}`, borderRadius:12, padding:'16px 14px', cursor:'pointer', transition:'border-color 0.15s' }}>
                        <div style={{ fontSize:22, marginBottom:8 }}>{t.emoji}</div>
                        <div style={{ fontSize:12, fontWeight:800, marginBottom:4, color:template===t.id?B.green:B.text }}>{t.name}</div>
                        <div style={{ fontSize:10, color:B.muted, lineHeight:1.5 }}>{t.desc}</div>
                        {template===t.id && <div style={{ marginTop:8, fontSize:9, color:B.green, fontWeight:700 }}>✓ Selected</div>}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Custom instructions */}
                <div>
                  <div style={{ fontSize:14, fontWeight:800, marginBottom:4 }}>Any specific instructions? <span style={{ fontSize:11, fontWeight:400, color:B.muted }}>(optional)</span></div>
                  <div style={{ fontSize:12, color:B.muted, marginBottom:10 }}>Tell the AI anything extra — sections to add, things to include, tone adjustments, anything.</div>
                  <textarea
                    value={instructions}
                    onChange={e=>setInstr(e.target.value)}
                    rows={4}
                    placeholder={`Examples:\n• "Add a gallery section with 6 photos"\n• "Include a FAQ section about pricing"\n• "Make it more playful, use emoji in headings"\n• "Add WhatsApp chat button"`}
                    style={{ ...inp, resize:'none', lineHeight:1.6 }}
                  />
                </div>

                {/* Build button */}
                <div style={{ background:B.card, borderRadius:14, padding:20, border:`1px solid ${B.border}` }}>
                  <div style={{ fontSize:13, fontWeight:800, marginBottom:4 }}>Ready to build?</div>
                  <div style={{ fontSize:11, color:B.muted, marginBottom:16, lineHeight:1.6 }}>
                    The AI will generate a complete, custom-designed website for <strong style={{ color:B.text }}>{audit.name}</strong> using the <strong style={{ color:B.green }}>{TEMPLATES.find(t=>t.id===template)?.name}</strong> style.
                    {instructions && <> It will also follow your custom instructions.</>}
                    {' '}This takes about 30–45 seconds.
                  </div>
                  <motion.button whileTap={{ scale:0.97 }} onClick={build}
                    style={{ width:'100%', padding:'14px', borderRadius:10, background:B.green, color:B.bg, fontSize:14, fontWeight:900, border:'none', cursor:'pointer', letterSpacing:'-0.3px' }}>
                    ⚡ Build Website Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* BUILDING */}
          {phase==='building' && (
            <motion.div key="building" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
              {/* Progress bar */}
              <div style={{ padding:'12px 20px', borderBottom:`1px solid ${B.border}`, flexShrink:0, background:B.bg }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div style={{ fontSize:12, fontWeight:700 }}>🎨 Building {audit?.name} website...</div>
                  <div style={{ fontSize:11, color:B.muted }}>{buildProgress}%</div>
                </div>
                <div style={{ height:4, background:B.card, borderRadius:999, overflow:'hidden' }}>
                  <motion.div animate={{ width:`${buildProgress}%` }} transition={{ duration:0.3 }}
                    style={{ height:'100%', background:B.green, borderRadius:999 }} />
                </div>
                <div style={{ fontSize:10, color:B.muted, marginTop:6 }}>Writing HTML, adding animations, crafting copy...</div>
              </div>
              {/* Live iframe preview */}
              {html ? (
                <iframe srcDoc={html} style={{ flex:1, border:'none', width:'100%', opacity:0.7 }} title="Building..." sandbox="allow-scripts allow-same-origin" />
              ) : (
                <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
                  <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1.5, ease:'linear' }}
                    style={{ width:40, height:40, borderRadius:'50%', border:`3px solid ${B.border}`, borderTopColor:B.green }} />
                  <div style={{ fontSize:12, color:B.muted }}>Starting generation...</div>
                </div>
              )}
            </motion.div>
          )}

          {/* DONE */}
          {phase==='done' && html && (
            <motion.div key="done" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
              {/* Browser chrome */}
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 16px', background:B.card, borderBottom:`1px solid ${B.border}`, flexShrink:0 }}>
                <div style={{ display:'flex', gap:5 }}>
                  {['#ef4444','#f59e0b','#22c55e'].map(col=><div key={col} style={{ width:10, height:10, borderRadius:'50%', background:col }} />)}
                </div>
                <div style={{ flex:1, textAlign:'center', background:B.surface, borderRadius:6, padding:'5px 12px', fontSize:11, color:B.dimmed }}>
                  🔒 {audit?.name?.toLowerCase().replace(/\s+/g,'').replace(/[^a-z0-9]/g,'')||'website'}.co.za
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={()=>setPhase('report')} style={{ padding:'4px 10px', borderRadius:6, background:B.surface, border:`1px solid ${B.border}`, color:B.muted, fontSize:10, cursor:'pointer', fontWeight:600 }}>← Edit & Rebuild</button>
                  <button onClick={openTab} style={{ padding:'4px 10px', borderRadius:6, background:B.surface, border:`1px solid ${B.border}`, color:B.muted, fontSize:10, cursor:'pointer' }}>⛶ Full tab</button>
                </div>
              </div>
              <iframe srcDoc={html} style={{ flex:1, border:'none', width:'100%' }} title="Website Preview" sandbox="allow-scripts allow-same-origin" />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── ACTION BAR (only when done) ── */}
      {phase==='done' && (
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderTop:`1px solid ${B.border}`, background:B.bg, flexShrink:0 }}>
          <div style={{ fontSize:11, color:B.muted }}>
            <strong style={{ color:B.green }}>✓ {audit?.name}</strong> — {TEMPLATES.find(t=>t.id===template)?.name} style
          </div>
          <div style={{ flex:1 }} />
          <button onClick={()=>setPhase('report')} style={{ padding:'0 14px', height:34, borderRadius:8, border:`1px solid ${B.border}`, background:'transparent', color:B.muted, fontSize:11, cursor:'pointer', fontWeight:600 }}>
            ← Back to Edit
          </button>
          <button onClick={copyHtml} style={{ padding:'0 14px', height:34, borderRadius:8, border:`1px solid ${B.border}`, background:B.surface, color:copied?B.green:B.text, fontSize:11, fontWeight:700, cursor:'pointer' }}>
            {copied ? '✓ Copied' : '⎘ Copy HTML'}
          </button>
          <button onClick={downloadZip} style={{ padding:'0 16px', height:34, borderRadius:8, background:B.blue, color:'#fff', fontSize:12, fontWeight:700, border:'none', cursor:'pointer' }}>
            ↓ Download ZIP
          </button>
          <button onClick={openTab} style={{ padding:'0 16px', height:34, borderRadius:8, background:B.green, color:B.bg, fontSize:12, fontWeight:700, border:'none', cursor:'pointer' }}>
            ⛶ Full Preview
          </button>
        </div>
      )}
    </div>
  )
}
