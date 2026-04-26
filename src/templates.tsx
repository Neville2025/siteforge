import type { ClientConfig } from './types'

// ── Template 1: Modern Dark ────────────────────────────────────
export function TemplateDark({ c }: { c: ClientConfig }) {
  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: c.primaryColor }} />
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px' }}>{c.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#888' }}>
          <span>Services</span><span>About</span><span>Work</span><span>Contact</span>
        </div>
        <div style={{ padding: '9px 20px', borderRadius: 8, background: c.primaryColor, color: '#fff', fontSize: 13, fontWeight: 700 }}>{c.ctaText}</div>
      </nav>

      <div style={{ padding: '80px 40px 60px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: `${c.primaryColor}20`, border: `1px solid ${c.primaryColor}40`, marginBottom: 24 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.primaryColor }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: c.primaryColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c.industry}</span>
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 20, background: `linear-gradient(135deg, #fff 60%, ${c.primaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{c.tagline}</h1>
        <p style={{ fontSize: 16, color: '#888', lineHeight: 1.8, maxWidth: 520, marginBottom: 36 }}>{c.description}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ padding: '13px 28px', borderRadius: 10, background: c.primaryColor, color: '#fff', fontSize: 14, fontWeight: 700, boxShadow: `0 8px 32px ${c.primaryColor}50` }}>{c.ctaText} →</div>
          <div style={{ padding: '13px 24px', borderRadius: 10, border: '1px solid #333', fontSize: 14, fontWeight: 600, color: '#888' }}>View Work</div>
        </div>
        <div style={{ display: 'flex', gap: 40, marginTop: 60, paddingTop: 40, borderTop: '1px solid #222' }}>
          {[['200+','Clients'],['99%','Satisfaction'],['10yr','Experience']].map(([v,l])=>(
            <div key={l}><div style={{ fontSize: 28, fontWeight: 900, color: c.primaryColor }}>{v}</div><div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{l}</div></div>
          ))}
        </div>
      </div>

      <div style={{ padding: '60px 40px', background: '#111' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: c.primaryColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Services</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 36, letterSpacing: '-1px' }}>What We Deliver</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {c.services.slice(0,3).map((s,i)=>(
              <div key={i} style={{ background: '#1a1a1a', borderRadius: 14, padding: '24px', border: '1px solid #2a2a2a' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{s.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#666', lineHeight: 1.7 }}>{s.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '60px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', background: `linear-gradient(135deg, ${c.primaryColor}20, ${c.accentColor}10)`, borderRadius: 20, padding: '48px', border: `1px solid ${c.primaryColor}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Ready to get started?</div><div style={{ fontSize: 13, color: '#888' }}>{c.email} · {c.phone}</div></div>
          <div style={{ padding: '13px 28px', borderRadius: 10, background: c.primaryColor, color: '#fff', fontSize: 14, fontWeight: 700 }}>Contact Us →</div>
        </div>
      </div>
      <div style={{ padding: '20px 40px', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#555' }}>
        <span>{c.name}</span><span>{c.address} · © {new Date().getFullYear()}</span>
      </div>
    </div>
  )
}

// ── Template 2: Clean Minimal ──────────────────────────────────
export function TemplateMinimal({ c }: { c: ClientConfig }) {
  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#fff', color: '#111', minHeight: '100vh' }}>
      <nav style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: '-0.5px' }}>{c.name}</span>
        <div style={{ display: 'flex', gap: 28, fontSize: 13, color: '#999' }}>
          <span>Services</span><span>About</span><span>Work</span><span>Contact</span>
        </div>
        <div style={{ padding: '9px 20px', borderRadius: 999, border: `2px solid ${c.primaryColor}`, color: c.primaryColor, fontSize: 13, fontWeight: 700 }}>{c.ctaText}</div>
      </nav>

      <div style={{ padding: '100px 48px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, maxWidth: 1100, margin: '0 auto', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: c.primaryColor, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>{c.industry}</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 20 }}>{c.tagline}</h1>
          <p style={{ fontSize: 15, color: '#777', lineHeight: 1.8, marginBottom: 36 }}>{c.description}</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ padding: '12px 28px', borderRadius: 999, background: '#111', color: '#fff', fontSize: 13, fontWeight: 700 }}>{c.ctaText}</div>
            <div style={{ padding: '12px 24px', borderRadius: 999, fontSize: 13, fontWeight: 600, color: '#999' }}>Learn more →</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[['200+','Projects'],['98%','Satisfaction'],['10yr','Experience'],['24/7','Support']].map(([v,l],i)=>(
            <div key={i} style={{ background: i===0?c.primaryColor:'#f8f8f8', borderRadius: 16, padding: '28px', color: i===0?'#fff':'#111' }}>
              <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{v}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '60px 48px', background: '#f8f8f8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', marginBottom: 40, textAlign: 'center' }}>Our Services</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {c.services.slice(0,3).map((s,i)=>(
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '32px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#999', lineHeight: 1.7 }}>{s.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '60px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px', marginBottom: 12 }}>Let's work together</div>
        <p style={{ fontSize: 15, color: '#999', marginBottom: 28 }}>{c.email} · {c.phone}</p>
        <div style={{ display: 'inline-block', padding: '14px 36px', borderRadius: 999, background: '#111', color: '#fff', fontSize: 14, fontWeight: 700 }}>{c.ctaText} →</div>
      </div>
      <div style={{ padding: '20px 48px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#bbb' }}>
        <span style={{ fontWeight: 700, color: '#111' }}>{c.name}</span><span>© {new Date().getFullYear()}</span>
      </div>
    </div>
  )
}

// ── Template 3: Bold Corporate ─────────────────────────────────
export function TemplateBold({ c }: { c: ClientConfig }) {
  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#fff', color: '#111', minHeight: '100vh' }}>
      <div style={{ background: '#111', padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 900, fontSize: 16, color: '#fff', letterSpacing: '-0.5px' }}>{c.name}</span>
        <div style={{ display: 'flex', gap: 24, fontSize: 12, color: '#888' }}>
          <span>Services</span><span>About</span><span>Work</span><span>Contact</span>
        </div>
        <div style={{ padding: '8px 18px', borderRadius: 4, background: c.primaryColor, color: '#fff', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.ctaText}</div>
      </div>

      <div style={{ background: `linear-gradient(135deg, #111 50%, ${c.primaryColor})`, padding: '80px 48px', color: '#fff' }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: c.primaryColor, marginBottom: 20, background: `${c.primaryColor}20`, display: 'inline-block', padding: '4px 12px', borderRadius: 4 }}>{c.industry}</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: 20 }}>{c.tagline}</h1>
          <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.8, maxWidth: 480, marginBottom: 36 }}>{c.description}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ padding: '14px 32px', background: c.primaryColor, color: '#fff', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.ctaText}</div>
            <div style={{ padding: '14px 28px', border: '2px solid #444', color: '#aaa', fontSize: 13, fontWeight: 700 }}>Our Work</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '3px solid #111' }}>
        {[['200+','Clients Served'],['99%','Retention Rate'],['10yr','In Business']].map(([v,l],i)=>(
          <div key={i} style={{ flex: 1, padding: '32px 48px', borderRight: i<2?'1px solid #eee':'none' }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: c.primaryColor }}>{v}</div>
            <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '60px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px' }}>Our Services</div>
          <div style={{ fontSize: 13, color: c.primaryColor, fontWeight: 700 }}>View All →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, border: '1px solid #eee' }}>
          {c.services.slice(0,3).map((s,i)=>(
            <div key={i} style={{ padding: '32px', borderRight: i<2?'1px solid #eee':'none' }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>{s.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.title}</div>
              <div style={{ fontSize: 13, color: '#888', lineHeight: 1.7 }}>{s.description}</div>
              <div style={{ marginTop: 20, fontSize: 12, color: c.primaryColor, fontWeight: 700 }}>Learn more →</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#111', padding: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Ready to grow?</div><div style={{ fontSize: 13, color: '#666' }}>{c.email} · {c.phone}</div></div>
        <div style={{ padding: '14px 32px', background: c.primaryColor, color: '#fff', fontSize: 13, fontWeight: 800, textTransform: 'uppercase' }}>Get Started</div>
      </div>
    </div>
  )
}

// ── Template 4: Creative Agency ────────────────────────────────
export function TemplateCreative({ c }: { c: ClientConfig }) {
  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#fafaf8', color: '#111', minHeight: '100vh' }}>
      <nav style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 16 }}>{c.name[0]}</div>
        <div style={{ display: 'flex', gap: 28, fontSize: 13, color: '#999' }}>
          <span>Work</span><span>About</span><span>Services</span><span>Contact</span>
        </div>
        <div style={{ padding: '9px 20px', borderRadius: 999, background: '#111', color: '#fff', fontSize: 13, fontWeight: 700 }}>Let's talk</div>
      </nav>

      <div style={{ padding: '60px 48px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${c.primaryColor}25, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ fontSize: 11, fontWeight: 700, color: c.primaryColor, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>✦ {c.industry}</div>
        <h1 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.0, letterSpacing: '-3px', marginBottom: 32, maxWidth: 700 }}>{c.tagline}</h1>
        <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
          <p style={{ fontSize: 15, color: '#888', lineHeight: 1.8, maxWidth: 360 }}>{c.description}</p>
          <div>
            <div style={{ padding: '14px 32px', borderRadius: 999, background: c.primaryColor, color: '#fff', fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'inline-block' }}>{c.ctaText} →</div>
            <div style={{ fontSize: 12, color: '#bbb', paddingLeft: 16 }}>{c.email}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 48px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
          <div style={{ background: '#111', borderRadius: 20, padding: '40px', color: '#fff' }}>
            <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Featured Service</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>{c.services[0]?.title}</div>
            <div style={{ fontSize: 13, color: '#888', lineHeight: 1.7 }}>{c.services[0]?.description}</div>
          </div>
          {c.services.slice(1,3).map((s,i)=>(
            <div key={i} style={{ background: i===0?c.primaryColor:'#fff', borderRadius: 20, padding: '32px', border: '1px solid #eee', color: i===0?'#fff':'#111' }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.6 }}>{s.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: '0 48px 48px', background: '#111', borderRadius: 20, padding: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', maxWidth: 300, lineHeight: 1.2 }}>Let's build something great together</div>
        <div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>{c.phone} · {c.address}</div>
          <div style={{ padding: '13px 28px', borderRadius: 999, background: c.primaryColor, color: '#fff', fontSize: 13, fontWeight: 700 }}>{c.ctaText}</div>
        </div>
      </div>
    </div>
  )
}

export const TEMPLATES = [
  { id: 'dark',     label: 'Modern Dark',     component: TemplateDark,     thumb: '🌑' },
  { id: 'minimal',  label: 'Clean Minimal',   component: TemplateMinimal,  thumb: '⬜' },
  { id: 'bold',     label: 'Bold Corporate',  component: TemplateBold,     thumb: '🔳' },
  { id: 'creative', label: 'Creative Agency', component: TemplateCreative, thumb: '🎨' },
]
