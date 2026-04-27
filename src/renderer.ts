import type { SiteData, Page, Section, Theme } from './types'
import { COUNTRIES, DEFAULT_COUNTRY, phoneToTelLink, phoneToWhatsApp, type CountryCode } from './locale/profiles'
import { generatePrivacyPolicy } from './locale/privacyPolicy'
import { renderIcon } from './icons'

// 5-pointed SVG star, used for testimonial ratings (replaces ★).
const STAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
function ratingStars(count = 5): string {
  return `<div style="display:inline-flex;gap:2px;color:var(--primary);margin-bottom:12px" aria-label="${count} out of 5 stars">${STAR_SVG.repeat(count)}</div>`
}

function getProfile(site: SiteData) {
  const code = (site.country as CountryCode) || DEFAULT_COUNTRY
  return COUNTRIES[code] || COUNTRIES[DEFAULT_COUNTRY]
}

function escapeHtml(s: string): string {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

/**
 * Build an Unsplash URL with width/format hints. Falls through unchanged
 * if the input is not a images.unsplash.com URL (so user-pasted URLs and
 * data: URIs are preserved exactly).
 */
function imgUrl(raw: string, w: number, opts: { webp?: boolean } = {}): string {
  if (!raw) return ''
  if (!raw.includes('images.unsplash.com')) return raw
  const url = raw.split('?')[0]
  const parts = [`w=${w}`, 'q=80', 'auto=format', 'fit=crop']
  if (opts.webp) parts.push('fm=webp')
  return `${url}?${parts.join('&')}`
}

function srcSet(raw: string, base: number): string {
  if (!raw || !raw.includes('images.unsplash.com')) return ''
  return `srcset="${imgUrl(raw, base)} 1x, ${imgUrl(raw, base*2)} 2x"`
}

// Tiny, safe Markdown→HTML for auto-generated privacy text. Headings, bold,
// paragraphs, lists. Not a general-purpose renderer.
function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  let html = ''
  let inList = false
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false }
      html += `<h3 style="margin-top:24px;font-size:18px;font-weight:800">${escapeHtml(line.slice(3))}</h3>`
    } else if (line.startsWith('# ')) {
      if (inList) { html += '</ul>'; inList = false }
      html += `<h2 style="margin-top:8px;font-size:24px;font-weight:900">${escapeHtml(line.slice(2))}</h2>`
    } else if (line.startsWith('- ')) {
      if (!inList) { html += '<ul style="padding-left:20px;margin:8px 0">'; inList = true }
      html += `<li style="margin:4px 0">${escapeHtml(line.slice(2)).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')}</li>`
    } else if (line === '') {
      if (inList) { html += '</ul>'; inList = false }
      html += '<div style="height:8px"></div>'
    } else {
      if (inList) { html += '</ul>'; inList = false }
      html += `<p style="margin:8px 0;line-height:1.7">${escapeHtml(line).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')}</p>`
    }
  }
  if (inList) html += '</ul>'
  return html
}

function css(theme: Theme) {
  const rMap = { none:'0px', small:'4px', medium:'10px', large:'20px', pill:'999px' }
  const r = rMap[theme.borderRadius] || '10px'
  return `
    @import url('https://fonts.googleapis.com/css2?family=${theme.fontHeading.replace(/ /g,'+')}:wght@400;700;900&family=${theme.fontBody.replace(/ /g,'+')}:wght@400;500;600&display=swap');
    :root { --primary:${theme.primaryColor}; --secondary:${theme.secondaryColor}; --accent:${theme.accentColor}; --radius:${r}; }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;font-size:16px}
    body{font-family:'${theme.fontBody}',system-ui,sans-serif;background:${theme.style==='dark'?'#0a0a0a':'#fff'};color:${theme.style==='dark'?'#f0f0f0':'#111'};line-height:1.6}
    h1,h2,h3,h4{font-family:'${theme.fontHeading}',system-ui,sans-serif;line-height:1.1;font-weight:900}
    img{max-width:100%;height:auto;display:block}
    a{color:var(--primary);text-decoration:none}
    .container{max-width:1100px;margin:0 auto;padding:0 24px}
    .btn{display:inline-block;padding:13px 28px;border-radius:var(--radius);font-weight:700;font-size:15px;cursor:pointer;transition:all .2s;border:none}
    .btn-primary{background:var(--primary);color:#fff;box-shadow:0 6px 20px color-mix(in srgb,var(--primary) 40%,transparent)}
    .btn-primary:hover{opacity:.9;transform:translateY(-1px)}
    .btn-outline{background:transparent;color:${theme.style==='dark'?'#fff':'#111'};border:2px solid ${theme.style==='dark'?'rgba(255,255,255,.3)':'rgba(0,0,0,.2)'};}
    .btn-outline:hover{border-color:var(--primary);color:var(--primary)}
    .section-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--primary);margin-bottom:12px}
    .section-heading{font-size:clamp(28px,4vw,42px);letter-spacing:-1px;margin-bottom:16px}
    .section-sub{font-size:16px;color:${theme.style==='dark'?'#aaa':'#666'};max-width:560px;line-height:1.7}
    /* NAV */
    nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between;background:${theme.style==='dark'?'rgba(10,10,10,.92)':'rgba(255,255,255,.92)'};backdrop-filter:blur(12px);border-bottom:1px solid ${theme.style==='dark'?'rgba(255,255,255,.08)':'rgba(0,0,0,.08)'}}
    .nav-logo{display:flex;align-items:center;gap:10px;font-weight:900;font-size:18px;letter-spacing:-.5px;color:inherit}
    .nav-logo-icon{width:32px;height:32px;border-radius:8px;background:var(--primary);flex-shrink:0}
    .nav-links{display:flex;gap:28px;font-size:14px;color:${theme.style==='dark'?'#888':'#666'}}
    .nav-links a:hover{color:var(--primary)}
    .nav-cta .btn{padding:9px 20px;font-size:13px}
    .hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px}
    .hamburger span{width:22px;height:2px;background:currentColor;transition:.3s}
    .mobile-menu{display:none;position:fixed;top:64px;left:0;right:0;background:${theme.style==='dark'?'#0a0a0a':'#fff'};border-bottom:1px solid ${theme.style==='dark'?'#222':'#eee'};padding:20px 24px;flex-direction:column;gap:16px;z-index:99}
    .mobile-menu.open{display:flex}
    .mobile-menu a{font-size:16px;font-weight:600;color:inherit;padding:8px 0;border-bottom:1px solid ${theme.style==='dark'?'#222':'#f0f0f0'}}
    @media(max-width:768px){.nav-links{display:none}.hamburger{display:flex}}
    /* Animations */
    @keyframes sf-gradient { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    @keyframes sf-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes sf-count-blur { 0%{filter:blur(8px);opacity:0} 100%{filter:blur(0);opacity:1} }
    .sf-gradient-text { background:linear-gradient(120deg, var(--primary), var(--secondary), var(--accent), var(--primary)); background-size:300% 100%; -webkit-background-clip:text; background-clip:text; color:transparent; animation: sf-gradient 8s ease infinite }
    .sf-marquee-track { display:flex; gap:24px; animation: sf-marquee 40s linear infinite; will-change:transform }
    .sf-marquee:hover .sf-marquee-track { animation-play-state:paused }
    .sf-card { transition: transform .25s cubic-bezier(.2,.8,.2,1), box-shadow .25s, border-color .15s }
    .sf-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(0,0,0,.12) }
    .sf-btn-primary { position:relative; overflow:hidden }
    .sf-btn-primary::after { content:''; position:absolute; inset:0; background:radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.25) 0%, transparent 60%); opacity:0; transition:opacity .2s }
    .sf-btn-primary:hover::after { opacity:1 }
    /* Mobile responsiveness for section grids */
    @media(max-width:900px){
      .sf-grid-2{grid-template-columns:1fr !important;gap:32px !important}
      .sf-grid-3{grid-template-columns:repeat(2,1fr) !important}
      .sf-grid-4{grid-template-columns:repeat(2,1fr) !important;gap:18px !important}
      .sf-stack-mobile{display:block !important}
    }
    @media(max-width:560px){
      .sf-grid-3{grid-template-columns:1fr !important}
      .sf-grid-4{grid-template-columns:repeat(2,1fr) !important}
      .container{padding:0 18px !important}
      .section-heading{font-size:28px !important}
    }
    /* Content always visible. AOS attribute kept for export compatibility but no hiding. */
    [data-aos]{opacity:1 !important;transform:none !important}
  `
}

function nav(site: SiteData, _activePage: Page, _theme: Theme) {
  const links = site.pages.map(p => `<a href="${p.slug==='/'?'index.html':p.slug.slice(1)+'.html'}">${p.name}</a>`).join('')
  const logo = site.logo
    ? `<img src="${site.logo}" alt="${site.name}" style="height:32px;width:auto;object-fit:contain">`
    : `<div class="nav-logo-icon"></div>`
  return `
<nav>
  <a class="nav-logo" href="index.html">
    ${logo}
    <span>${site.name}</span>
  </a>
  <div class="nav-links">${links}</div>
  <div class="nav-cta"><a href="#contact" class="btn btn-primary">Contact</a></div>
  <div class="hamburger" onclick="this.nextElementSibling.classList.toggle('open')">
    <span></span><span></span><span></span>
  </div>
</nav>
<div class="mobile-menu">${links}</div>
<div style="height:64px"></div>`
}

function wrapSection(secId: string, html: string): string {
  return html.replace(/^(<section)/, `<section data-section-id="${secId}"`)
}

function renderSection(sec: Section, theme: Theme, site: SiteData): string {
  const d = sec.data
  const dark = theme.style === 'dark'
  const cardBg = dark ? '#1a1a1a' : '#f8f9fa'
  const cardBorder = dark ? '1px solid #2a2a2a' : '1px solid #e5e7eb'
  const profile = getProfile(site)

  if (sec.type === 'custom21st') return `<section style="padding:60px 0">${d.html||''}</section>`

  switch (sec.type) {
    case 'hero': {
      const variant = d.variant || 'default'

      if (variant === 'split' && d.image) {
        return `
<section style="padding:60px 0">
  <div class="container">
    <div class="sf-grid-2" style="display:grid;grid-template-columns:1.05fr 1fr;gap:60px;align-items:center">
      <div data-aos="fade-right">
        <div class="section-label">✦ ${d.eyebrow||'Welcome'}</div>
        <h1 data-sf-field="headline" style="font-size:clamp(36px,5.5vw,64px);letter-spacing:-2px;margin-bottom:20px">${d.headline}</h1>
        <p data-sf-field="subtext" style="font-size:18px;line-height:1.75;margin-bottom:36px;max-width:520px;color:${dark?'#bbb':'#555'}">${d.subtext}</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <a href="${d.ctaUrl||'#contact'}" class="btn btn-primary sf-btn-primary" data-sf-field="ctaText">${d.ctaText}</a>
          ${d.ctaText2?`<a href="#" class="btn btn-outline" data-sf-field="ctaText2">${d.ctaText2}</a>`:''}
        </div>
      </div>
      <div data-aos="fade-left" data-aos-delay="100">
        <img src="${imgUrl(d.image,1200)}" ${srcSet(d.image,800)} alt="" data-sf-image="image" style="width:100%;height:540px;object-fit:cover;border-radius:var(--radius);box-shadow:0 30px 80px rgba(0,0,0,.18)">
      </div>
    </div>
  </div>
</section>`
      }

      if (variant === 'centered') {
        return `
<section style="min-height:80vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:80px 24px;background:${dark?'linear-gradient(135deg,#0a0a0a,#1a1a2e)':'linear-gradient(160deg,color-mix(in srgb,var(--primary) 6%,#fff),#fff)'}">
  <div data-aos="zoom-in" style="max-width:780px">
    <div class="section-label">✦ ${d.eyebrow||'Welcome'}</div>
    <h1 data-sf-field="headline" class="sf-gradient-text" style="font-size:clamp(40px,7vw,84px);letter-spacing:-2.5px;margin-bottom:24px;line-height:1.05;font-weight:900">${d.headline}</h1>
    <p data-sf-field="subtext" style="font-size:19px;line-height:1.75;margin:0 auto 36px;max-width:580px;color:${dark?'#bbb':'#555'}">${d.subtext}</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
      <a href="${d.ctaUrl||'#contact'}" class="btn btn-primary sf-btn-primary" data-sf-field="ctaText">${d.ctaText}</a>
      ${d.ctaText2?`<a href="#" class="btn btn-outline" data-sf-field="ctaText2">${d.ctaText2}</a>`:''}
    </div>
  </div>
</section>`
      }

      // Default / fullbleed: image background with parallax + counter-up stats.
      return `
<section ${d.image?'data-parallax="0.25"':''} style="min-height:90vh;display:flex;align-items:center;position:relative;overflow:hidden;${d.image?`background:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url('${d.image}') center/cover`:dark?'background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%)':'background:linear-gradient(160deg,color-mix(in srgb,var(--primary) 8%,#fff) 0%,#fff 60%)'}" data-sf-bgimage="image">
  <div class="container" style="position:relative;z-index:1;padding:60px 24px">
    <div style="max-width:680px" data-aos="fade-up">
      <div class="section-label" style="${d.image?'color:#fff':''}">✦ ${d.eyebrow||'Welcome'}</div>
      <h1 data-sf-field="headline" style="font-size:clamp(36px,5.5vw,64px);letter-spacing:-2px;margin-bottom:20px;${d.image?'color:#fff':''}">${d.headline}</h1>
      <p data-sf-field="subtext" style="font-size:18px;line-height:1.75;margin-bottom:36px;max-width:520px;${d.image?'color:rgba(255,255,255,.85)':dark?'color:#bbb':'color:#555'}">${d.subtext}</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <a href="${d.ctaUrl||'#contact'}" class="btn btn-primary sf-btn-primary" data-sf-field="ctaText">${d.ctaText}</a>
        ${d.ctaText2?`<a href="#" class="btn btn-outline" data-sf-field="ctaText2" style="${d.image?'color:#fff;border-color:rgba(255,255,255,.4)':''}">${d.ctaText2}</a>`:''}
      </div>
      ${d.showStats?`<div style="display:flex;gap:40px;margin-top:52px;padding-top:40px;border-top:1px solid ${d.image?'rgba(255,255,255,.15)':dark?'#2a2a2a':'#e5e7eb'};flex-wrap:wrap">
        ${[1,2,3,4].map(n=>{const v=d[`stat${n}val`],l=d[`stat${n}label`];if(!v&&!l)return'';return`<div><div data-sf-field="stat${n}val" style="font-size:26px;font-weight:900;color:${d.image?'#fff':'var(--primary)'}">${v||''}</div><div data-sf-field="stat${n}label" style="font-size:11px;${d.image||dark?'color:rgba(255,255,255,.6)':'color:#888'};margin-top:2px">${l||''}</div></div>`}).join('')}
      </div>`:''}
    </div>
  </div>
</section>`
    }

    case 'stats': return `
<section style="padding:40px 0;background:var(--primary)">
  <div class="container">
    <div class="sf-grid-4" style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center">
      ${['1','2','3','4'].map(n=>{
        const raw = String(d[`stat${n}val`] || '')
        // If the value contains a number, animate it counter-up.
        const numMatch = raw.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/)
        const counterAttrs = numMatch
          ? `data-counter="${numMatch[2].replace(/[.,]/g,'')}" data-prefix="${numMatch[1]}" data-suffix="${numMatch[3]}"`
          : ''
        return `<div data-aos="fade-up" data-aos-delay="${(parseInt(n)-1)*100}">
          <div data-sf-field="stat${n}val" ${counterAttrs} style="font-size:clamp(28px,4vw,42px);font-weight:900;color:#fff">${raw}</div>
          <div data-sf-field="stat${n}label" style="font-size:12px;color:rgba(255,255,255,.75);margin-top:4px;text-transform:uppercase;letter-spacing:.08em">${d[`stat${n}label`]||''}</div>
        </div>`
      }).join('')}
    </div>
  </div>
</section>`

    case 'services': return `
<section style="padding:80px 0;background:${dark?'#111':'#f9fafb'}">
  <div class="container">
    <div style="text-align:center;margin-bottom:52px" data-aos="fade-up">
      <div class="section-label">${d.heading}</div>
      <h2 class="section-heading" data-sf-field="heading">${d.heading}</h2>
      <p class="section-sub" data-sf-field="subheading" style="margin:0 auto">${d.subheading}</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">
      ${(d.items||[]).map((item: any, i: number) => `
      <div data-aos="fade-up" data-aos-delay="${i*100}" style="background:${cardBg};border:${cardBorder};border-radius:var(--radius);padding:32px;transition:transform .2s,box-shadow .2s" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='0 16px 40px rgba(0,0,0,.1)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
        <div style="width:48px;height:48px;border-radius:12px;background:color-mix(in srgb,var(--primary) 12%,transparent);color:var(--primary);display:flex;align-items:center;justify-content:center;margin-bottom:18px">${renderIcon(item.icon||'zap', 26)}</div>
        <h3 style="font-size:18px;font-weight:800;margin-bottom:10px">${item.title}</h3>
        <p style="font-size:14px;color:${dark?'#999':'#666'};line-height:1.7">${item.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`

    case 'features': return `
<section style="padding:80px 0">
  <div class="container">
    <div class="sf-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center">
      <div data-aos="fade-up">
        <div class="section-label">Why Us</div>
        <h2 class="section-heading" data-sf-field="heading">${d.heading}</h2>
        <p class="section-sub" data-sf-field="subheading">${d.subheading}</p>
      </div>
      <div class="sf-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:20px" data-aos="fade-up" data-aos-delay="100">
        ${(d.items||[]).map((item: any) => `
        <div style="background:${cardBg};border:${cardBorder};border-radius:var(--radius);padding:24px">
          <div style="width:36px;height:36px;border-radius:8px;background:color-mix(in srgb,var(--primary) 15%,transparent);display:flex;align-items:center;justify-content:center;margin-bottom:12px;color:var(--primary)">${renderIcon(item.icon||'check', 22)}</div>
          <div style="font-size:15px;font-weight:700;margin-bottom:6px">${item.title}</div>
          <div style="font-size:13px;color:${dark?'#999':'#777'};line-height:1.6">${item.desc}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</section>`

    case 'about': return `
<section style="padding:80px 0">
  <div class="container">
    <div class="sf-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center">
      <div data-aos="fade-up">
        <div class="section-label">Our Story</div>
        <h2 class="section-heading" data-sf-field="heading">${d.heading}</h2>
        <p data-sf-field="body" style="font-size:16px;color:${dark?'#bbb':'#555'};line-height:1.8;margin-bottom:16px">${d.body}</p>
        <p data-sf-field="body2" style="font-size:16px;color:${dark?'#bbb':'#555'};line-height:1.8;margin-bottom:28px">${d.body2||''}</p>
        ${d.ctaText?`<a href="#contact" class="btn btn-primary" data-sf-field="ctaText">${d.ctaText}</a>`:''}
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <img src="${imgUrl(d.image,800)}" ${srcSet(d.image,800)} alt="About us" loading="lazy" data-sf-image="image" style="border-radius:var(--radius);width:100%;height:460px;object-fit:cover;box-shadow:0 20px 60px rgba(0,0,0,.15)">
      </div>
    </div>
  </div>
</section>`

    case 'testimonials': {
      const variant = d.variant || 'cards'
      const items = d.items || []
      const card = (t: any, i: number) => `
        <div ${variant==='cards'?`data-aos="fade-up" data-aos-delay="${i*100}"`:''} class="sf-card" style="${variant==='marquee'?'flex-shrink:0;width:380px;':''}background:${cardBg};border:${cardBorder};border-radius:var(--radius);padding:28px">
          ${ratingStars(5)}
          <p style="font-size:15px;line-height:1.75;color:${dark?'#ccc':'#444'};margin-bottom:20px;font-style:italic">"${t.quote}"</p>
          <div style="display:flex;align-items:center;gap:12px">
            ${t.avatar ? `<img src="${t.avatar}" alt="${t.name}" loading="lazy" style="width:44px;height:44px;border-radius:50%;object-fit:cover">` : `<div style="width:44px;height:44px;border-radius:50%;background:color-mix(in srgb,var(--primary) 15%,transparent);color:var(--primary);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px">${(t.name||'?').slice(0,1).toUpperCase()}</div>`}
            <div><div style="font-weight:700;font-size:14px">${t.name}</div><div style="font-size:12px;color:${dark?'#777':'#999'}">${t.role}</div></div>
          </div>
        </div>`

      if (variant === 'marquee' && items.length >= 3) {
        // Duplicate the items so the loop is seamless.
        const all = [...items, ...items].map(card).join('')
        return `
<section style="padding:80px 0;background:${dark?'#111':'#f9fafb'};overflow:hidden">
  <div class="container">
    <div style="text-align:center;margin-bottom:40px" data-aos="fade-up">
      <div class="section-label">Testimonials</div>
      <h2 class="section-heading" data-sf-field="heading">${d.heading}</h2>
    </div>
  </div>
  <div class="sf-marquee" style="overflow:hidden;mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)">
    <div class="sf-marquee-track">${all}</div>
  </div>
</section>`
      }

      return `
<section style="padding:80px 0;background:${dark?'#111':'#f9fafb'}">
  <div class="container">
    <div style="text-align:center;margin-bottom:52px" data-aos="fade-up">
      <div class="section-label">Testimonials</div>
      <h2 class="section-heading" data-sf-field="heading">${d.heading}</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px">
      ${items.map(card).join('')}
    </div>
  </div>
</section>`
    }

    case 'gallery': return `
<section style="padding:80px 0">
  <div class="container">
    <div style="text-align:center;margin-bottom:52px" data-aos="fade-up">
      <div class="section-label">Gallery</div>
      <h2 class="section-heading" data-sf-field="heading">${d.heading}</h2>
      <p class="section-sub" data-sf-field="subheading" style="margin:0 auto">${d.subheading}</p>
    </div>
    <div class="sf-grid-3" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
      ${(d.images||[]).map((img: any, idx: number) => `
      <div data-aos="fade-up" data-aos-delay="${idx*50}" style="position:relative;overflow:hidden;border-radius:var(--radius);aspect-ratio:4/3;cursor:pointer" onmouseenter="this.querySelector('div').style.opacity='1'" onmouseleave="this.querySelector('div').style.opacity='0'">
        <img src="${imgUrl(img.url,600)}" ${srcSet(img.url,600)} alt="${img.alt}" loading="lazy" style="width:100%;height:100%;object-fit:cover;transition:transform .4s" onmouseenter="this.style.transform='scale(1.05)'" onmouseleave="this.style.transform=''">
        <div style="position:absolute;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;padding:16px;opacity:0;transition:.3s">
          <span style="color:#fff;font-weight:700;font-size:14px">${img.caption||''}</span>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>`

    case 'pricing': return `
<section style="padding:80px 0;background:${dark?'#111':'#f9fafb'}">
  <div class="container">
    <div style="text-align:center;margin-bottom:52px" data-aos="fade-up">
      <div class="section-label">Pricing</div>
      <h2 class="section-heading" data-sf-field="heading">${d.heading}</h2>
      <p class="section-sub" data-sf-field="subheading" style="margin:0 auto">${d.subheading}</p>
    </div>
    <div class="sf-grid-3" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">
      ${(d.items||[]).map((p: any, i: number) => `
      <div data-aos="fade-up" data-aos-delay="${i*100}" style="background:${p.highlighted?'var(--primary)':cardBg};border:${p.highlighted?'none':cardBorder};border-radius:var(--radius);padding:36px;position:relative;${p.highlighted?'transform:scale(1.02);box-shadow:0 20px 60px rgba(0,0,0,.2)':''}">
        ${p.highlighted?`<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--secondary);color:#fff;font-size:11px;font-weight:800;padding:4px 14px;border-radius:999px;text-transform:uppercase;letter-spacing:.08em">Most Popular</div>`:''}
        <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;color:${p.highlighted?'rgba(255,255,255,.8)':dark?'#999':'#888'}">${p.name}</div>
        <div style="font-size:42px;font-weight:900;margin-bottom:4px;color:${p.highlighted?'#fff':'inherit'}">${p.price}</div>
        <div style="font-size:13px;color:${p.highlighted?'rgba(255,255,255,.7)':dark?'#777':'#999'};margin-bottom:6px">${p.period||''}</div>
        ${profile.taxLabel !== 'none' ? `<div style="font-size:11px;color:${p.highlighted?'rgba(255,255,255,.65)':dark?'#666':'#aaa'};margin-bottom:22px;font-weight:600">${d.taxIncluded?`incl. ${profile.taxLabel}`:`excl. ${profile.taxLabel}`}</div>` : `<div style="margin-bottom:22px"></div>`}
        <div style="margin-bottom:28px">${(p.features||[]).map((f: string)=>`<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;font-size:14px;color:${p.highlighted?'rgba(255,255,255,.9)':dark?'#ccc':'#444'}"><span style="color:${p.highlighted?'#fff':'var(--primary)'};flex-shrink:0;line-height:0;margin-top:4px">${renderIcon('check', 16)}</span>${f}</div>`).join('')}</div>
        <a href="#contact" class="btn" style="width:100%;text-align:center;display:block;${p.highlighted?'background:#fff;color:var(--primary)':'background:var(--primary);color:#fff'}">${p.cta}</a>
      </div>`).join('')}
    </div>
  </div>
</section>`

    case 'team': return `
<section style="padding:80px 0">
  <div class="container">
    <div style="text-align:center;margin-bottom:52px" data-aos="fade-up">
      <div class="section-label">Our Team</div>
      <h2 class="section-heading" data-sf-field="heading">${d.heading}</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:28px">
      ${(d.members||[]).map((m: any, i: number) => `
      <div data-aos="fade-up" data-aos-delay="${i*100}" style="text-align:center">
        <img src="${m.image}" alt="${m.name}" loading="lazy" style="width:100px;height:100px;border-radius:50%;object-fit:cover;margin:0 auto 16px;border:3px solid var(--primary)">
        <div style="font-size:16px;font-weight:800;margin-bottom:4px">${m.name}</div>
        <div style="font-size:13px;color:var(--primary);font-weight:600;margin-bottom:10px">${m.role}</div>
        <p style="font-size:13px;color:${dark?'#888':'#777'};line-height:1.6">${m.bio}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`

    case 'faq': return `
<section style="padding:80px 0;background:${dark?'#111':'#f9fafb'}">
  <div class="container" style="max-width:760px">
    <div style="text-align:center;margin-bottom:52px" data-aos="fade-up">
      <div class="section-label">FAQ</div>
      <h2 class="section-heading" data-sf-field="heading">${d.heading}</h2>
    </div>
    <div data-aos="fade-up" data-aos-delay="100">
      ${(d.items||[]).map((item: any) => `
      <details style="margin-bottom:12px;background:${cardBg};border:${cardBorder};border-radius:var(--radius);overflow:hidden">
        <summary style="padding:20px 24px;font-weight:700;font-size:15px;cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center">
          ${item.q}
          <span style="color:var(--primary);font-size:20px;font-weight:300;flex-shrink:0;margin-left:16px">+</span>
        </summary>
        <div style="padding:0 24px 20px;font-size:14px;color:${dark?'#bbb':'#666'};line-height:1.75">${item.a}</div>
      </details>`).join('')}
    </div>
  </div>
</section>`

    case 'cta': return `
<section style="padding:80px 0;background:linear-gradient(135deg,var(--primary),var(--secondary))">
  <div class="container" style="text-align:center" data-aos="fade-up">
    <h2 data-sf-field="heading" style="font-size:clamp(28px,4vw,44px);letter-spacing:-1px;color:#fff;margin-bottom:16px">${d.heading}</h2>
    <p data-sf-field="subtext" style="font-size:17px;color:rgba(255,255,255,.82);max-width:520px;margin:0 auto 36px;line-height:1.75">${d.subtext}</p>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="${d.ctaUrl||'#contact'}" class="btn" data-sf-field="ctaText" style="background:#fff;color:var(--primary)">${d.ctaText}</a>
      ${d.ctaText2?`<a href="#" class="btn" data-sf-field="ctaText2" style="background:transparent;color:#fff;border:2px solid rgba(255,255,255,.5)">${d.ctaText2}</a>`:''}
    </div>
  </div>
</section>`

    case 'contact': return `
<section id="contact" style="padding:80px 0">
  <div class="container">
    <div class="sf-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:60px">
      <div data-aos="fade-up">
        <div class="section-label">Contact</div>
        <h2 class="section-heading" data-sf-field="heading">${d.heading}</h2>
        <p data-sf-field="subtext" style="font-size:16px;color:${dark?'#bbb':'#666'};line-height:1.75;margin-bottom:32px">${d.subtext}</p>
        <div style="display:flex;flex-direction:column;gap:16px">
          ${d.phone?`<div style="display:flex;align-items:center;gap:14px"><div style="width:44px;height:44px;border-radius:var(--radius);background:color-mix(in srgb,var(--primary) 12%,transparent);color:var(--primary);display:flex;align-items:center;justify-content:center;flex-shrink:0">${renderIcon('phone', 22)}</div><div><div style="font-size:12px;color:${dark?'#888':'#999'};margin-bottom:2px">Phone</div><a href="${phoneToTelLink(d.phone, profile)}" style="color:inherit;text-decoration:none"><div data-sf-field="phone" style="font-weight:600">${d.phone}</div></a></div></div>`:''}
          ${d.email?`<div style="display:flex;align-items:center;gap:14px"><div style="width:44px;height:44px;border-radius:var(--radius);background:color-mix(in srgb,var(--primary) 12%,transparent);color:var(--primary);display:flex;align-items:center;justify-content:center;flex-shrink:0">${renderIcon('mail', 22)}</div><div><div style="font-size:12px;color:${dark?'#888':'#999'};margin-bottom:2px">Email</div><a href="mailto:${d.email}" style="color:inherit;text-decoration:none"><div data-sf-field="email" style="font-weight:600">${d.email}</div></a></div></div>`:''}
          ${d.address?`<div style="display:flex;align-items:center;gap:14px"><div style="width:44px;height:44px;border-radius:var(--radius);background:color-mix(in srgb,var(--primary) 12%,transparent);color:var(--primary);display:flex;align-items:center;justify-content:center;flex-shrink:0">${renderIcon('map-pin', 22)}</div><div><div style="font-size:12px;color:${dark?'#888':'#999'};margin-bottom:2px">Address</div><div data-sf-field="address" style="font-weight:600">${d.address}</div></div></div>`:''}
          ${d.hours?`<div style="display:flex;align-items:center;gap:14px"><div style="width:44px;height:44px;border-radius:var(--radius);background:color-mix(in srgb,var(--primary) 12%,transparent);color:var(--primary);display:flex;align-items:center;justify-content:center;flex-shrink:0">${renderIcon('clock', 22)}</div><div><div style="font-size:12px;color:${dark?'#888':'#999'};margin-bottom:2px">Hours</div><div data-sf-field="hours" style="font-weight:600">${d.hours}</div></div></div>`:''}
        </div>
      </div>
      <div data-aos="fade-up" data-aos-delay="100" style="background:${cardBg};border:${cardBorder};border-radius:var(--radius);padding:36px">
        <h3 style="font-size:20px;font-weight:800;margin-bottom:24px">Send Us a Message</h3>
        ${d.formKey ? `
        <form action="https://api.web3forms.com/submit" method="POST" onsubmit="this.querySelector('button[type=submit]').textContent='Sending...';this.querySelector('button[type=submit]').disabled=true">
          <input type="hidden" name="access_key" value="${d.formKey}">
          <input type="hidden" name="subject" value="New enquiry from your website">
          <input type="hidden" name="from_name" value="Website contact form">
          <input type="checkbox" name="botcheck" style="display:none" tabindex="-1">
          <input type="hidden" name="redirect" value="https://web3forms.com/success">` : `
        <form action="mailto:${d.email||''}" method="POST" enctype="text/plain">`}
          <div class="sf-grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
            <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:6px;color:${dark?'#bbb':'#555'}">Name</label><input type="text" name="name" required placeholder="Your name" style="width:100%;padding:11px 14px;border-radius:var(--radius);border:1px solid ${dark?'#333':'#ddd'};background:${dark?'#1a1a1a':'#fff'};color:inherit;font-size:14px;outline:none"></div>
            <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:6px;color:${dark?'#bbb':'#555'}">Email</label><input type="email" name="email" required placeholder="your@email.com" style="width:100%;padding:11px 14px;border-radius:var(--radius);border:1px solid ${dark?'#333':'#ddd'};background:${dark?'#1a1a1a':'#fff'};color:inherit;font-size:14px;outline:none"></div>
          </div>
          <div style="margin-bottom:14px"><label style="font-size:12px;font-weight:600;display:block;margin-bottom:6px;color:${dark?'#bbb':'#555'}">Phone</label><input type="tel" name="phone" placeholder="+27 11 000 0000" style="width:100%;padding:11px 14px;border-radius:var(--radius);border:1px solid ${dark?'#333':'#ddd'};background:${dark?'#1a1a1a':'#fff'};color:inherit;font-size:14px;outline:none"></div>
          <div style="margin-bottom:20px"><label style="font-size:12px;font-weight:600;display:block;margin-bottom:6px;color:${dark?'#bbb':'#555'}">Message</label><textarea name="message" rows="4" required placeholder="Tell us about your project..." style="width:100%;padding:11px 14px;border-radius:var(--radius);border:1px solid ${dark?'#333':'#ddd'};background:${dark?'#1a1a1a':'#fff'};color:inherit;font-size:14px;outline:none;resize:vertical"></textarea></div>
          <button type="submit" class="btn btn-primary" style="width:100%">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>`

    case 'whatsapp': {
      const wa = phoneToWhatsApp(d.number||'', profile)
      const msg = encodeURIComponent(d.message||'')
      const link = wa ? `https://wa.me/${wa}${msg?`?text=${msg}`:''}` : '#'
      return `
<section style="padding:80px 0;background:${dark?'#0d1f15':'#e7f7ee'}">
  <div class="container">
    <div style="max-width:560px;margin:0 auto;text-align:center" data-aos="fade-up">
      <div style="font-size:48px;margin-bottom:16px">💬</div>
      <h2 class="section-heading" data-sf-field="heading">${d.heading||'Chat with us on WhatsApp'}</h2>
      <p style="font-size:15px;color:${dark?'#bbb':'#444'};line-height:1.7;margin:12px 0 28px" data-sf-field="subtext">${d.subtext||''}</p>
      <a href="${link}" target="_blank" rel="noopener" class="btn" style="background:#25D366;color:#fff;padding:14px 32px;font-size:15px;display:inline-flex;align-items:center;gap:10px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.821 11.821 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.687-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.512 5.26l-.999 3.648 3.976-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
        ${d.buttonText||'Open WhatsApp'}
      </a>
    </div>
  </div>
</section>`
    }

    case 'banking': return `
<section style="padding:80px 0">
  <div class="container" style="max-width:760px">
    <div data-aos="fade-up">
      <div class="section-label">Payment</div>
      <h2 class="section-heading" data-sf-field="heading">${d.heading||'Banking Details'}</h2>
      <p style="font-size:15px;color:${dark?'#bbb':'#555'};line-height:1.7;margin-bottom:28px" data-sf-field="subtext">${d.subtext||''}</p>
    </div>
    <div data-aos="fade-up" data-aos-delay="100" style="background:${cardBg};border:${cardBorder};border-radius:var(--radius);padding:28px;display:grid;grid-template-columns:1fr 1fr;gap:18px" class="sf-grid-2">
      ${[
        ['Account name', d.accountName],
        ['Bank', d.bank],
        ['Account number', d.accountNumber],
        ['Branch / IFSC / Sort code', d.branchCode],
        ['Reference', d.reference],
      ].filter(([,v])=>v).map(([label,val])=>`
        <div>
          <div style="font-size:11px;color:${dark?'#888':'#999'};font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">${label}</div>
          <div style="font-size:15px;font-weight:600;font-family:monospace;word-break:break-all">${val}</div>
        </div>
      `).join('')}
    </div>
    ${d.extra?`<div data-aos="fade-up" data-aos-delay="150" style="margin-top:14px;padding:18px;background:${cardBg};border:${cardBorder};border-radius:var(--radius)">
      <div style="font-size:11px;color:${dark?'#888':'#999'};font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Other payment options</div>
      ${String(d.extra).split('\n').filter(Boolean).map(l=>`<div style="font-size:14px;line-height:1.7">${escapeHtml(l)}</div>`).join('')}
    </div>`:''}
  </div>
</section>`

    case 'policy': {
      const body = d.autoGenerate
        ? generatePrivacyPolicy({
            businessName: site.name,
            email: site.pages.flatMap(p=>p.sections).find(s=>s.type==='contact')?.data?.email || '',
            address: site.pages.flatMap(p=>p.sections).find(s=>s.type==='contact')?.data?.address || '',
            country: profile,
          })
        : (d.customBody || '')
      return `
<section style="padding:80px 0">
  <div class="container" style="max-width:760px">
    <div data-aos="fade-up">
      <h2 class="section-heading" data-sf-field="heading" style="margin-bottom:24px">${d.heading||'Privacy Policy'}</h2>
      <div style="font-size:14px;color:${dark?'#ccc':'#444'};line-height:1.7">${renderMarkdown(body)}</div>
    </div>
  </div>
</section>`
    }

    case 'maps': {
      const src = d.embedUrl || (d.address ? `https://www.google.com/maps?q=${encodeURIComponent(d.address)}&output=embed` : '')
      return `
<section style="padding:80px 0;background:${dark?'#111':'#f9fafb'}">
  <div class="container">
    <div style="text-align:center;margin-bottom:32px" data-aos="fade-up">
      <div class="section-label">Location</div>
      <h2 class="section-heading" data-sf-field="heading">${d.heading||'Find Us'}</h2>
      ${d.subtext?`<p class="section-sub" data-sf-field="subtext" style="margin:0 auto">${d.subtext}</p>`:''}
    </div>
    ${src ? `<div data-aos="fade-up" data-aos-delay="100" style="border-radius:var(--radius);overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.1)">
      <iframe src="${src}" width="100%" height="420" style="border:0;display:block" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>` : `<div style="padding:48px;text-align:center;color:${dark?'#888':'#888'};border:2px dashed ${dark?'#333':'#ddd'};border-radius:var(--radius)">Add an address to show the map.</div>`}
  </div>
</section>`
    }

    case 'newsletter': {
      const action = d.provider === 'web3forms' ? 'https://api.web3forms.com/submit'
        : d.provider === 'formsubmit' ? `https://formsubmit.co/${encodeURIComponent(d.endpoint||'')}`
        : d.provider === 'mailto' ? `mailto:${d.endpoint||''}`
        : d.endpoint || '#'
      return `
<section style="padding:80px 0">
  <div class="container" style="max-width:560px;text-align:center">
    <div data-aos="fade-up">
      <h2 class="section-heading" data-sf-field="heading">${d.heading||'Stay in the loop'}</h2>
      <p class="section-sub" data-sf-field="subtext" style="margin:8px auto 28px">${d.subtext||''}</p>
      <form action="${action}" method="POST" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
        ${d.provider==='web3forms' && d.endpoint?`<input type="hidden" name="access_key" value="${d.endpoint}">`:''}
        <input type="email" name="email" required placeholder="you@email.com" style="flex:1;min-width:240px;padding:13px 16px;border-radius:var(--radius);border:1px solid ${dark?'#333':'#ddd'};background:${dark?'#1a1a1a':'#fff'};color:inherit;font-size:14px;outline:none">
        <button type="submit" class="btn btn-primary">${d.buttonText||'Subscribe'}</button>
      </form>
    </div>
  </div>
</section>`
    }

    default: return `<section style="padding:60px 0"><div class="container"><p>Section: ${sec.type}</p></div></section>`
  }
}

function footer(site: SiteData, theme: Theme): string {
  const dark = theme.style === 'dark'
  const links = site.pages.map(p => `<a href="${p.slug==='/'?'index.html':p.slug.slice(1)+'.html'}" style="color:${dark?'#888':'#666'};font-size:13px">${p.name}</a>`).join('')
  return `
<footer style="background:${dark?'#050505':'#111'};color:#fff;padding:48px 0 20px">
  <div class="container">
    <div style="display:grid;grid-template-columns:1fr auto;gap:40px;align-items:start;margin-bottom:32px">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          ${site.logo
            ? `<img src="${site.logo}" alt="${site.name}" style="height:28px;width:auto;object-fit:contain;background:#fff;padding:3px;border-radius:6px">`
            : `<div style="width:28px;height:28px;border-radius:6px;background:var(--primary)"></div>`}
          <span style="font-weight:900;font-size:16px">${site.name}</span>
        </div>
        <p style="font-size:13px;color:#777;line-height:1.7;max-width:280px">${site.tagline}</p>
      </div>
      <div style="display:flex;gap:24px">${links}</div>
    </div>
    <div style="border-top:1px solid #1a1a1a;padding-top:20px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:12px;color:#555">© ${new Date().getFullYear()} ${site.name}. All rights reserved.</span>
      <span style="font-size:12px;color:#555">Built with SiteForge</span>
    </div>
  </div>
</footer>`
}

function aosScript(): string {
  return `
<link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true, offset: 60, easing:'ease-out-cubic' });
    // Counter-up for stat numbers (any element with data-counter="<final number>").
    document.querySelectorAll('[data-counter]').forEach(function(el){
      var target = parseInt(el.getAttribute('data-counter'),10);
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      if (isNaN(target)) return;
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (!e.isIntersecting) return;
          io.unobserve(el);
          var start = 0, dur = 1400, t0 = performance.now();
          function tick(t){ var p = Math.min(1,(t-t0)/dur); var v = Math.round(target*(p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2)); el.textContent = prefix + v.toLocaleString() + suffix; if(p<1) requestAnimationFrame(tick) }
          requestAnimationFrame(tick);
        });
      });
      io.observe(el);
    });
    // Hero parallax for sections marked with [data-parallax].
    var parallax = document.querySelectorAll('[data-parallax]');
    if (parallax.length) {
      var onScroll = function(){
        var y = window.scrollY;
        parallax.forEach(function(el){
          var rate = parseFloat(el.getAttribute('data-parallax')) || .35;
          el.style.backgroundPosition = 'center calc(50% + ' + (y*rate) + 'px)';
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    // Liquid hover effect for primary buttons.
    document.querySelectorAll('.sf-btn-primary').forEach(function(btn){
      btn.addEventListener('mousemove', function(e){
        var r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
        btn.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
      });
    });
  });
</script>`
}

function renderJsonLd(site: SiteData, page: Page): string {
  if (page.slug !== '/') return ''
  const profile = getProfile(site)
  const contact = site.pages.flatMap(p => p.sections).find(s => s.type === 'contact')?.data
  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    description: site.tagline,
    url: '',
    address: {
      '@type': 'PostalAddress',
      addressCountry: profile.code,
      streetAddress: contact?.address || '',
    },
    priceRange: '$$',
  }
  if (contact?.phone) data.telephone = phoneToTelLink(contact.phone, profile).replace('tel:','')
  if (contact?.email) data.email = contact.email
  if (contact?.hours) data.openingHours = contact.hours
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`
}

function renderHeadMeta(site: SiteData, page: Page): string {
  const desc = site.tagline || ''
  const title = `${page.name} — ${site.name}`
  const ogImage = site.pages.flatMap(p => p.sections).find(s => s.type === 'hero')?.data?.image || ''
  return `
  <meta name="description" content="${escapeHtml(desc)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(desc)}">
  ${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(desc)}">
  ${ogImage ? `<meta name="twitter:image" content="${escapeHtml(ogImage)}">` : ''}
  ${site.favicon ? `<link rel="icon" href="${site.favicon}">` : site.logo ? `<link rel="icon" href="${site.logo}">` : ''}
  ${renderJsonLd(site, page)}`
}

function renderFloatingWidget(site: SiteData): string {
  const w = site.widget
  if (!w || !w.enabled || !w.number || w.channel === 'none') return ''
  const profile = getProfile(site)
  let href = '#'
  if (w.channel === 'whatsapp') {
    const num = phoneToWhatsApp(w.number, profile)
    href = `https://wa.me/${num}${w.message?`?text=${encodeURIComponent(w.message)}`:''}`
  } else if (w.channel === 'sms') {
    const link = phoneToTelLink(w.number, profile).replace('tel:','sms:')
    href = w.message ? `${link}?body=${encodeURIComponent(w.message)}` : link
  } else if (w.channel === 'tel') {
    href = phoneToTelLink(w.number, profile)
  }
  const bg = w.channel === 'whatsapp' ? '#25D366' : 'var(--primary)'
  const icon = w.channel === 'whatsapp'
    ? `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.821 11.821 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.687-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.512 5.26l-.999 3.648 3.976-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>`
    : w.channel === 'sms' ? '💬' : '📞'
  return `
<a href="${href}" target="_blank" rel="noopener" aria-label="Contact us"
  style="position:fixed;bottom:22px;right:22px;width:60px;height:60px;border-radius:50%;background:${bg};color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 12px 32px rgba(0,0,0,.25);z-index:90;text-decoration:none;font-size:26px;transition:transform .15s">
  ${icon}
</a>`
}

function renderCookieBanner(site: SiteData): string {
  const profile = getProfile(site)
  // Skip the banner if there's no privacy law that requires it (none of ours).
  return `
<div id="sf-cookies" style="position:fixed;bottom:0;left:0;right:0;background:#111;color:#fff;padding:14px 20px;display:none;align-items:center;gap:14px;z-index:80;flex-wrap:wrap;font-family:'Inter',system-ui,sans-serif">
  <span style="flex:1;min-width:240px;font-size:13px;line-height:1.5">We use cookies to make this site work and analyse traffic. By using the site you agree to our use of cookies under ${profile.privacyLaw}.</span>
  <a href="#privacy" style="color:#aaa;font-size:13px;text-decoration:underline">Learn more</a>
  <button type="button" onclick="localStorage.setItem('sf-cookies-ok','1');this.parentElement.style.display='none'" style="background:var(--primary);color:#fff;border:none;padding:8px 18px;border-radius:6px;font-weight:700;font-size:13px;cursor:pointer">Accept</button>
</div>
<script>(function(){if(!localStorage.getItem('sf-cookies-ok')){document.getElementById('sf-cookies').style.display='flex'}})();</script>`
}

export function renderPage(site: SiteData, page: Page, interactive = false): string {
  const theme = site.theme
  const sectionsHtml = page.sections.map(sec => {
    const h = renderSection(sec, theme, site)
    return interactive ? wrapSection(sec.id, h) : h
  }).join('\n')

  const interactiveScript = interactive ? `
<style>
  [data-section-id] { position: relative; transition: outline 0.15s; outline: 2px solid transparent; outline-offset: -2px }
  [data-section-id]:hover { outline-color: ${theme.primaryColor}66 }
  [data-section-id].sf-active { outline-color: ${theme.primaryColor} !important; outline-width: 3px }
  [data-sf-field], [data-sf-image] { position: relative; transition: outline 0.12s; outline: 1px dashed transparent; outline-offset: 3px; cursor: text }
  [data-sf-image] { cursor: zoom-in }
  [data-sf-field]:hover, [data-sf-image]:hover { outline-color: ${theme.primaryColor} }
  [data-sf-field][contenteditable="true"] { outline: 2px solid ${theme.primaryColor} !important; outline-offset: 4px; cursor: text; box-shadow: 0 0 0 6px ${theme.primaryColor}22 }
  .sf-edit-tip { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); background: #111; color: #fff; padding: 8px 14px; border-radius: 999px; font-size: 12px; font-family: 'Inter',system-ui,sans-serif; box-shadow: 0 8px 24px rgba(0,0,0,.25); z-index: 9999; pointer-events: none; opacity: 0; transition: opacity .2s }
  .sf-edit-tip.show { opacity: 1 }
</style>
<script>
  // Block link navigation entirely while editing.
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a');
    if (a) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  // Stop forms from submitting in the editor preview.
  document.addEventListener('submit', e => { e.preventDefault(); e.stopPropagation(); }, true);

  function showTip(msg) {
    let tip = document.querySelector('.sf-edit-tip');
    if (!tip) { tip = document.createElement('div'); tip.className = 'sf-edit-tip'; document.body.appendChild(tip); }
    tip.textContent = msg;
    tip.classList.add('show');
    clearTimeout(tip._t);
    tip._t = setTimeout(() => tip.classList.remove('show'), 1800);
  }

  function sectionIdFor(el) {
    const sec = el.closest('[data-section-id]');
    return sec ? sec.getAttribute('data-section-id') : null;
  }

  // Section click: highlights it and notifies parent (when click is not on a field/image).
  document.querySelectorAll('[data-section-id]').forEach(el => {
    el.addEventListener('click', e => {
      // If clicked on an editable field/image, let those handlers run.
      if (e.target.closest('[data-sf-field],[data-sf-image]')) return;
      e.preventDefault(); e.stopPropagation();
      const id = el.getAttribute('data-section-id');
      document.querySelectorAll('[data-section-id]').forEach(s => s.classList.remove('sf-active'));
      el.classList.add('sf-active');
      window.parent.postMessage({ type: 'section-click', id }, '*');
    });
  });

  // Inline text edit: click to edit immediately.
  document.querySelectorAll('[data-sf-field]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      if (el.getAttribute('contenteditable') === 'true') return;
      el.setAttribute('contenteditable', 'true');
      el.focus();
      const r = document.createRange();
      r.selectNodeContents(el);
      const s = window.getSelection();
      s.removeAllRanges(); s.addRange(r);
      showTip('Editing — press Enter or click away to save');
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); el.blur(); }
      if (e.key === 'Escape') { el.blur(); }
    });
    el.addEventListener('blur', () => {
      if (el.getAttribute('contenteditable') !== 'true') return;
      el.removeAttribute('contenteditable');
      const value = el.textContent.trim();
      const fieldKey = el.getAttribute('data-sf-field');
      const id = sectionIdFor(el);
      if (id && fieldKey) {
        window.parent.postMessage({ type: 'field-update', sectionId: id, fieldKey, value }, '*');
      }
    });
  });

  // Click-to-swap image
  document.querySelectorAll('[data-sf-image]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const fieldKey = el.getAttribute('data-sf-image');
      const id = sectionIdFor(el);
      if (id && fieldKey) {
        window.parent.postMessage({ type: 'image-click', sectionId: id, fieldKey }, '*');
      }
    });
  });

  // Listen for active section update or background image update from parent
  window.addEventListener('message', e => {
    if (!e.data) return;
    if (e.data.type === 'set-active' && e.data.id) {
      document.querySelectorAll('[data-section-id]').forEach(s => s.classList.remove('sf-active'));
      const target = document.querySelector('[data-section-id="' + e.data.id + '"]');
      if (target) { target.classList.add('sf-active'); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  });
</script>` : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.name} — ${site.name}</title>
  ${renderHeadMeta(site, page)}
  ${aosScript().split('<script')[0]}
  <style>${css(theme)}</style>
</head>
<body>
  ${nav(site, page, theme)}
  ${sectionsHtml}
  ${footer(site, theme)}
  ${interactive ? '' : renderFloatingWidget(site)}
  ${interactive ? '' : renderCookieBanner(site)}
  ${aosScript().split('</link>').slice(1).join('')}
  ${interactiveScript}
</body>
</html>`
}

export function exportSite(site: SiteData): Record<string, string> {
  const files: Record<string, string> = {}
  site.pages.forEach(page => {
    const filename = page.slug === '/' ? 'index.html' : page.slug.slice(1) + '.html'
    files[filename] = renderPage(site, page, false)
  })
  // sitemap.xml — relative URLs since the user will host wherever
  const lastmod = new Date().toISOString().slice(0, 10)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${site.pages.map(p => `  <url><loc>${p.slug==='/'?'index.html':p.slug.slice(1)+'.html'}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>`
  files['sitemap.xml'] = sitemap
  // robots.txt — allow all
  files['robots.txt'] = `User-agent: *\nAllow: /\nSitemap: sitemap.xml\n`
  return files
}
