import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import JSZip from 'jszip'
import './index.css'

const DARK = { bg:'#0E1625', surface:'#111d2e', card:'#162032', border:'#1e2d42', green:'#00c758', blue:'#3080ff', orange:'#fe6e00', text:'#ffffff', muted:'#6a7282', dimmed:'#3a4a5c' }
const LIGHT = { bg:'#f0f4f8', surface:'#ffffff', card:'#f8fafc', border:'#e2e8f0', green:'#00a847', blue:'#2563eb', orange:'#ea6300', text:'#0f172a', muted:'#64748b', dimmed:'#94a3b8' }

interface Analysis {
  name: string; tagline: string; description: string; industry: string
  tone: string; aesthetic: string; targetAudience: string; brandPersonality: string
  primaryColor: string; secondaryColor: string; accentColor: string
  backgroundColor: string; textColor: string; services: any[]
  whatsWorking: string[]; improvements: string[]
  componentRecommendations: string[]
  contact: { email: string; phone: string; address: string }
  social: Record<string, string>; allColors: string[]; fonts: string[]
  seoTitle: string; ctaText: string
}

type Step = 'idle' | 'analyzing' | 'generating' | 'done' | 'error'

export default function App() {
  const [dark, setDark] = useState(true)
  const B = dark ? DARK : LIGHT
  const [url, setUrl] = useState('')
  const [step, setStep] = useState<Step>('idle')
  const [stepMsg, setStepMsg] = useState('')
  const [audit, setAudit] = useState<Analysis | null>(null)
  const [html, setHtml] = useState('')
  const [error, setError] = useState('')
  const [showAudit, setShowAudit] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const run = async () => {
    if (!url.trim()) return
    setStep('analyzing')
    setStepMsg('Scanning website...')
    setError('')
    setHtml('')
    setAudit(null)

    try {
      // Step 1: Audit
      const auditRes = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      if (!auditRes.ok) {
        const e = await auditRes.json()
        throw new Error(e.error || 'Analysis failed')
      }
      const auditData: Analysis = await auditRes.json()
      setAudit(auditData)

      // Step 2: Generate (streaming)
      setStep('generating')
      setStepMsg('Designing your website...')
      const genRes = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audit: auditData }),
      })
      if (!genRes.ok) {
        let errMsg = 'Generation failed'
        try { const e = await genRes.json(); errMsg = e.error || errMsg } catch {}
        throw new Error(errMsg)
      }

      // Stream the HTML as it arrives
      const reader = genRes.body?.getReader()
      if (!reader) throw new Error('No response stream')
      const decoder = new TextDecoder()
      let accumulated = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        if (accumulated.includes('<')) setHtml(accumulated)
      }
      if (!accumulated.startsWith('<!DOCTYPE') && !accumulated.startsWith('<html')) {
        throw new Error('Website generation failed. Please try again.')
      }
      setHtml(accumulated)
      setStep('done')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('error')
    }
  }

  const regenerate = async () => {
    if (!audit) return
    setRegenerating(true)
    try {
      const genRes = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audit }),
      })
      const reader = genRes.body?.getReader()
      if (!reader) return
      const decoder = new TextDecoder()
      let accumulated = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        if (accumulated.includes('<')) setHtml(accumulated)
      }
      setHtml(accumulated)
    } catch { /* silent */ }
    setRegenerating(false)
  }

  const downloadZip = async () => {
    if (!html || !audit) return
    const zip = new JSZip()
    zip.file('index.html', html)
    zip.file('README.md', `# ${audit.name}\n\nGenerated website by SiteForge.\n\nTo deploy: drag the index.html to Netlify Drop or push to GitHub Pages.`)
    const blob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${audit.name.toLowerCase().replace(/\s+/g,'-')}-website.zip`
    a.click()
  }

  const copyHtml = () => {
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openInNewTab = () => {
    const blob = new Blob([html], { type: 'text/html' })
    window.open(URL.createObjectURL(blob), '_blank')
  }

  const s: Record<string, React.CSSProperties> = {
    wrap: { height:'100vh', display:'flex', flexDirection:'column', background:B.bg, color:B.text, fontFamily:"'Inter',system-ui,sans-serif", overflow:'hidden' },
    topbar: { display:'flex', alignItems:'center', gap:12, padding:'0 20px', height:56, borderBottom:`1px solid ${B.border}`, flexShrink:0 },
    logo: { width:30, height:30, borderRadius:8, background:B.green, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:B.bg, flexShrink:0 },
    urlbox: { flex:1, display:'flex', alignItems:'center', background:B.surface, border:`1px solid ${step==='error'?'#ef4444':audit?B.green:B.border}`, borderRadius:10, padding:'0 14px', gap:8, transition:'border-color 0.2s' },
    urlinput: { flex:1, background:'none', border:'none', outline:'none', color:B.text, fontSize:13, padding:'10px 0', fontFamily:'inherit' },
    btn: { padding:'0 18px', height:38, borderRadius:9, fontSize:12, fontWeight:800, border:'none', cursor:'pointer', flexShrink:0, letterSpacing:'-0.2px', whiteSpace:'nowrap' as const },
    body: { flex:1, display:'flex', overflow:'hidden' },
    sidebar: { width:280, background:B.bg, borderRight:`1px solid ${B.border}`, display:'flex', flexDirection:'column', flexShrink:0, overflow:'hidden' },
    main: { flex:1, display:'flex', flexDirection:'column', background:B.surface, overflow:'hidden' },
    actionbar: { padding:'8px 16px', borderTop:`1px solid ${B.border}`, display:'flex', gap:8, alignItems:'center', flexShrink:0, background:B.bg },
  }

  const toneColor: Record<string,string> = { professional:B.blue, bold:B.orange, playful:'#f59e0b', minimal:B.muted, luxury:'#a855f7', corporate:B.blue }

  return (
    <div style={s.wrap}>

      {/* TOPBAR */}
      <div style={s.topbar}>
        <div style={s.logo}>S</div>
        <div style={{ marginRight:4 }}>
          <div style={{ fontSize:13, fontWeight:800 }}>SiteForge</div>
          <div style={{ fontSize:9, color:B.muted }}>AI Website Builder</div>
        </div>

        <div style={s.urlbox}>
          <span>🔗</span>
          <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==='Enter'&&run()}
            placeholder="Paste your client's website URL to analyze and rebuild it..."
            style={s.urlinput} />
          {step==='done' && <span style={{ fontSize:10, color:B.green, fontWeight:700, whiteSpace:'nowrap' }}>✓ Website ready</span>}
          {step==='error' && <span style={{ fontSize:10, color:'#ef4444', whiteSpace:'nowrap' }}>⚠ {error.slice(0,40)}</span>}
        </div>

        <motion.button whileTap={{ scale:0.95 }} onClick={run}
          disabled={step==='analyzing'||step==='generating'}
          style={{ ...s.btn, background:step==='analyzing'||step==='generating'?B.card:B.green, color:step==='analyzing'||step==='generating'?B.muted:B.bg }}>
          {step==='analyzing'?'⏳ Analyzing...' : step==='generating'?'🎨 Designing...' : '✦ Analyze & Build'}
        </motion.button>

        <motion.button whileTap={{ scale:0.92 }} onClick={()=>setDark(d=>!d)}
          style={{ ...s.btn, background:B.card, color:B.text, width:38, padding:0 }}>
          {dark?'☀️':'🌙'}
        </motion.button>
      </div>

      <div style={s.body}>

        {/* SIDEBAR */}
        <div style={s.sidebar}>
          {!audit ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center', gap:16 }}>
              <div style={{ fontSize:40 }}>🌐</div>
              <div style={{ fontSize:14, fontWeight:700, color:B.text }}>How it works</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12, width:'100%' }}>
                {[['1','Paste URL','Drop any client website URL above'],['2','AI Analyzes','Full brand audit — colors, fonts, tone, content'],['3','AI Designs','Generates a complete custom website'],['4','Download','Get the files, deploy anywhere']].map(([n,t,d])=>(
                  <div key={n} style={{ display:'flex', gap:10, alignItems:'flex-start', background:B.card, borderRadius:10, padding:'12px', border:`1px solid ${B.border}`, textAlign:'left' }}>
                    <div style={{ width:22, height:22, borderRadius:'50%', background:B.green, color:B.bg, fontSize:11, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{n}</div>
                    <div><div style={{ fontSize:12, fontWeight:700, marginBottom:3 }}>{t}</div><div style={{ fontSize:10, color:B.muted, lineHeight:1.5 }}>{d}</div></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ flex:1, overflowY:'auto', padding:'14px 12px', display:'flex', flexDirection:'column', gap:10 }}>
              {/* Toggle */}
              <div style={{ display:'flex', gap:6, marginBottom:4 }}>
                <button onClick={()=>setShowAudit(false)} style={{ flex:1, padding:'7px', borderRadius:7, border:'none', cursor:'pointer', background:!showAudit?B.green:B.card, color:!showAudit?B.bg:B.muted, fontSize:11, fontWeight:700 }}>Website</button>
                <button onClick={()=>setShowAudit(true)} style={{ flex:1, padding:'7px', borderRadius:7, border:'none', cursor:'pointer', background:showAudit?B.green:B.card, color:showAudit?B.bg:B.muted, fontSize:11, fontWeight:700 }}>Brand Audit</button>
              </div>

              {!showAudit ? (
                /* Website Info */
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ background:B.card, borderRadius:10, padding:'12px', border:`1px solid ${B.border}` }}>
                    <div style={{ fontSize:16, fontWeight:800, marginBottom:2 }}>{audit.name}</div>
                    <div style={{ fontSize:10, color:B.muted }}>{audit.industry}</div>
                  </div>
                  {[['Tagline',audit.tagline],['Description',audit.description],['CTA Text',audit.ctaText]].map(([l,v])=>(
                    <div key={l} style={{ display:'flex', flexDirection:'column', gap:4 }}>
                      <div style={{ fontSize:9, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em' }}>{l}</div>
                      <div style={{ fontSize:11, color:B.text, lineHeight:1.5, background:B.card, padding:'8px', borderRadius:7, border:`1px solid ${B.border}` }}>{v}</div>
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize:9, fontWeight:700, color:B.muted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>Services</div>
                    {audit.services?.map((s,i)=>(
                      <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', padding:'8px', background:B.card, borderRadius:8, marginBottom:6, border:`1px solid ${B.border}` }}>
                        <span style={{ fontSize:16 }}>{s.icon}</span>
                        <div><div style={{ fontSize:11, fontWeight:700 }}>{s.title}</div><div style={{ fontSize:10, color:B.muted, lineHeight:1.4 }}>{s.description}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Brand Audit */
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ background:B.card, borderRadius:10, padding:'12px', border:`1px solid ${B.border}` }}>
                    <div style={{ fontSize:9, fontWeight:700, color:B.green, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Brand Identity</div>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      {[audit.tone, audit.aesthetic, ...(audit.brandPersonality?.split(',')||[])].filter(Boolean).map((tag,i)=>(
                        <span key={i} style={{ fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:999, background:`${toneColor[audit.tone]||B.blue}20`, color:toneColor[audit.tone]||B.blue }}>{tag.trim()}</span>
                      ))}
                    </div>
                    <div style={{ fontSize:10, color:B.muted, marginTop:8, lineHeight:1.5 }}><strong style={{ color:B.text }}>Audience:</strong> {audit.targetAudience}</div>
                  </div>

                  <div style={{ background:B.card, borderRadius:10, padding:'12px', border:`1px solid ${B.border}` }}>
                    <div style={{ fontSize:9, fontWeight:700, color:B.green, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>Colors</div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {[['Primary',audit.primaryColor],['Secondary',audit.secondaryColor],['Accent',audit.accentColor]].map(([l,c])=>(
                        <div key={l} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, cursor:'pointer' }} onClick={()=>navigator.clipboard.writeText(c)}>
                          <div style={{ width:36, height:36, borderRadius:8, background:c, border:`1px solid ${B.border}`, boxShadow:`0 4px 12px ${c}40` }} />
                          <span style={{ fontSize:8, color:B.muted }}>{l}</span>
                          <span style={{ fontSize:8, fontFamily:'monospace', color:B.dimmed }}>{c}</span>
                        </div>
                      ))}
                    </div>
                    {audit.allColors?.length > 0 && (
                      <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:10 }}>
                        {audit.allColors.map((col,i)=>(
                          <div key={i} title={col} onClick={()=>navigator.clipboard.writeText(col)}
                            style={{ width:24, height:24, borderRadius:6, background:col, border:`1px solid ${B.border}`, cursor:'pointer', boxShadow:`0 2px 6px ${col}30` }} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ background:B.card, borderRadius:10, padding:'12px', border:`1px solid ${B.border}` }}>
                    <div style={{ fontSize:9, fontWeight:700, color:B.green, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>What to Improve</div>
                    {audit.improvements?.map((item,i)=>(
                      <div key={i} style={{ display:'flex', gap:6, marginBottom:8, fontSize:10, color:B.muted, lineHeight:1.5 }}>
                        <span style={{ color:B.orange, flexShrink:0 }}>→</span><span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {audit.contact && (
                    <div style={{ background:B.card, borderRadius:10, padding:'12px', border:`1px solid ${B.border}` }}>
                      <div style={{ fontSize:9, fontWeight:700, color:B.green, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:8 }}>Contact</div>
                      {[['📧',audit.contact.email],['📞',audit.contact.phone],['📍',audit.contact.address]].filter(([,v])=>v).map(([icon,val])=>(
                        <div key={icon} style={{ fontSize:10, color:B.muted, marginBottom:4 }}>{icon} {val}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* MAIN PREVIEW */}
        <div style={s.main}>
          <AnimatePresence mode="wait">

            {/* IDLE */}
            {(step==='idle'||step==='error') && (
              <motion.div key="idle" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:40, textAlign:'center' }}>
                <div style={{ fontSize:56, opacity:0.2 }}>🌐</div>
                <div style={{ fontSize:20, fontWeight:800, color:B.text }}>Paste a client's website URL to get started</div>
                <div style={{ fontSize:13, color:B.muted, maxWidth:400, lineHeight:1.7 }}>The AI will scan their existing site, extract their brand identity, and generate a beautiful, custom-designed website — ready to deliver.</div>
                {step==='error' && <div style={{ background:'#ef444420', border:'1px solid #ef4444', borderRadius:10, padding:'12px 20px', fontSize:12, color:'#ef4444', maxWidth:400 }}>{error}</div>}
              </motion.div>
            )}

            {/* LOADING */}
            {(step==='analyzing'||step==='generating') && (
              <motion.div key="loading" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24 }}>
                <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:2, ease:'linear' }}
                  style={{ width:56, height:56, borderRadius:'50%', border:`3px solid ${B.border}`, borderTopColor:B.green }} />
                <div>
                  <div style={{ fontSize:16, fontWeight:800, marginBottom:6, textAlign:'center' }}>{stepMsg}</div>
                  <div style={{ fontSize:12, color:B.muted, textAlign:'center' }}>
                    {step==='analyzing' ? 'Reading brand colors, fonts, content, services...' : 'AI is writing your custom website — this takes ~30 seconds...'}
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  {['Analyzing brand','Extracting colors','Reading content','Writing HTML','Adding animations','Finalizing design'].map((label,i)=>(
                    <motion.div key={i} initial={{ opacity:0.2 }} animate={{ opacity:[0.2,1,0.2] }} transition={{ repeat:Infinity, duration:2, delay:i*0.3 }}
                      style={{ fontSize:9, padding:'4px 10px', borderRadius:999, background:B.card, color:B.muted, border:`1px solid ${B.border}` }}>
                      {label}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* DONE — iframe preview (also shows during streaming) */}
            {(step==='done' || (step==='generating' && html)) && html && (
              <motion.div key="preview" initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                {/* Browser chrome */}
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 16px', background:B.card, borderBottom:`1px solid ${B.border}`, flexShrink:0 }}>
                  <div style={{ display:'flex', gap:5 }}>
                    {['#ef4444','#f59e0b','#22c55e'].map(col=><div key={col} style={{ width:10, height:10, borderRadius:'50%', background:col }} />)}
                  </div>
                  <div style={{ flex:1, textAlign:'center', fontSize:11, color:B.dimmed, background:B.surface, borderRadius:6, padding:'5px 12px' }}>
                    🔒 {audit?.name?.toLowerCase().replace(/\s+/g,'').replace(/[^a-z0-9]/g,'')||'yourbusiness'}.co.za
                  </div>
                  <button onClick={openInNewTab} style={{ fontSize:10, padding:'4px 10px', borderRadius:6, background:B.surface, border:`1px solid ${B.border}`, color:B.muted, cursor:'pointer' }}>
                    ⛶ Open full tab
                  </button>
                </div>
                <iframe ref={iframeRef} srcDoc={html} style={{ flex:1, border:'none', width:'100%' }} title="Generated Website" sandbox="allow-scripts allow-same-origin" />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ACTION BAR */}
      {step==='done' && (
        <div style={s.actionbar}>
          <div style={{ fontSize:11, color:B.muted }}>
            <strong style={{ color:B.green }}>✓ {audit?.name}</strong> website generated
          </div>
          <div style={{ flex:1 }} />
          <motion.button whileTap={{ scale:0.95 }} onClick={regenerate} disabled={regenerating}
            style={{ ...s.btn, background:B.card, color:regenerating?B.muted:B.text }}>
            {regenerating ? '⏳ Regenerating...' : '↻ Regenerate'}
          </motion.button>
          <motion.button whileTap={{ scale:0.95 }} onClick={copyHtml}
            style={{ ...s.btn, background:B.surface, color:copied?B.green:B.text }}>
            {copied ? '✓ Copied!' : '⎘ Copy HTML'}
          </motion.button>
          <motion.button whileTap={{ scale:0.95 }} onClick={downloadZip}
            style={{ ...s.btn, background:B.blue, color:'#fff' }}>
            ↓ Download ZIP
          </motion.button>
          <motion.button whileTap={{ scale:0.95 }} onClick={openInNewTab}
            style={{ ...s.btn, background:B.green, color:B.bg }}>
            ⛶ Full Preview
          </motion.button>
        </div>
      )}
    </div>
  )
}
