import type { SiteData, Page, Section, Theme } from './types'

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
    /* AOS */
    [data-aos]{opacity:0;transition:opacity .8s,transform .8s}
    [data-aos="fade-up"]{transform:translateY(30px)}
    [data-aos="fade-in"]{opacity:0}
    [data-aos].aos-animate{opacity:1;transform:none}
  `
}

function nav(site: SiteData, _activePage: Page, _theme: Theme) {
  const links = site.pages.map(p => `<a href="${p.slug==='/'?'index.html':p.slug.slice(1)+'.html'}">${p.name}</a>`).join('')
  return `
<nav>
  <a class="nav-logo" href="index.html">
    <div class="nav-logo-icon"></div>
    ${site.name}
  </a>
  <div class="nav-links">${links}</div>
  <div class="nav-cta"><a href="#contact" class="btn btn-primary">${site.tagline.split(' ').slice(0,2).join(' ') || 'Contact'}</a></div>
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

function renderSection(sec: Section, theme: Theme): string {
  const d = sec.data
  const dark = theme.style === 'dark'
  const cardBg = dark ? '#1a1a1a' : '#f8f9fa'
  const cardBorder = dark ? '1px solid #2a2a2a' : '1px solid #e5e7eb'

  if (sec.type === 'custom21st') return `<section style="padding:60px 0">${d.html||''}</section>`

  switch (sec.type) {
    case 'hero': return `
<section style="min-height:90vh;display:flex;align-items:center;position:relative;overflow:hidden;${d.image?`background:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url('${d.image}') center/cover`:dark?'background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 100%)':'background:linear-gradient(160deg,color-mix(in srgb,var(--primary) 8%,#fff) 0%,#fff 60%)'}">
  <div class="container" style="position:relative;z-index:1;padding:60px 24px">
    <div style="max-width:680px" data-aos="fade-up">
      <div class="section-label" style="${d.image?'color:#fff':''}">${theme.style==='dark'||d.image?'✦ Welcome':'✦ Welcome'}</div>
      <h1 style="font-size:clamp(36px,5.5vw,64px);letter-spacing:-2px;margin-bottom:20px;${d.image?'color:#fff':''}">${d.headline}</h1>
      <p style="font-size:18px;line-height:1.75;margin-bottom:36px;max-width:520px;${d.image?'color:rgba(255,255,255,.85)':dark?'color:#bbb':'color:#555'}">${d.subtext}</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <a href="${d.ctaUrl||'#contact'}" class="btn btn-primary">${d.ctaText}</a>
        ${d.ctaText2?`<a href="#" class="btn btn-outline" style="${d.image?'color:#fff;border-color:rgba(255,255,255,.4)':''}">${d.ctaText2}</a>`:''}
      </div>
      ${d.showStats?`<div style="display:flex;gap:40px;margin-top:52px;padding-top:40px;border-top:1px solid ${d.image?'rgba(255,255,255,.15)':dark?'#2a2a2a':'#e5e7eb'}">
        ${['200+|Clients','98%|Satisfaction','10yr|Experience','24/7|Support'].map(s=>{const[v,l]=s.split('|');return`<div><div style="font-size:26px;font-weight:900;color:var(--primary)">${v}</div><div style="font-size:11px;${d.image||dark?'color:rgba(255,255,255,.6)':'color:#888'};margin-top:2px">${l}</div></div>`}).join('')}
      </div>`:''}
    </div>
  </div>
</section>`

    case 'stats': return `
<section style="padding:40px 0;background:var(--primary)">
  <div class="container">
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center">
      ${['1','2','3','4'].map(n=>`
      <div data-aos="fade-up" data-aos-delay="${(parseInt(n)-1)*100}">
        <div style="font-size:clamp(28px,4vw,42px);font-weight:900;color:#fff">${d[`stat${n}val`]||''}</div>
        <div style="font-size:12px;color:rgba(255,255,255,.75);margin-top:4px;text-transform:uppercase;letter-spacing:.08em">${d[`stat${n}label`]||''}</div>
      </div>`).join('')}
    </div>
  </div>
</section>`

    case 'services': return `
<section style="padding:80px 0;background:${dark?'#111':'#f9fafb'}">
  <div class="container">
    <div style="text-align:center;margin-bottom:52px" data-aos="fade-up">
      <div class="section-label">${d.heading}</div>
      <h2 class="section-heading">${d.heading}</h2>
      <p class="section-sub" style="margin:0 auto">${d.subheading}</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">
      ${(d.items||[]).map((item: any, i: number) => `
      <div data-aos="fade-up" data-aos-delay="${i*100}" style="background:${cardBg};border:${cardBorder};border-radius:var(--radius);padding:32px;transition:transform .2s,box-shadow .2s" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='0 16px 40px rgba(0,0,0,.1)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
        <div style="font-size:32px;margin-bottom:16px">${item.icon||'⚡'}</div>
        <h3 style="font-size:18px;font-weight:800;margin-bottom:10px">${item.title}</h3>
        <p style="font-size:14px;color:${dark?'#999':'#666'};line-height:1.7">${item.desc}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`

    case 'features': return `
<section style="padding:80px 0">
  <div class="container">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center">
      <div data-aos="fade-up">
        <div class="section-label">Why Us</div>
        <h2 class="section-heading">${d.heading}</h2>
        <p class="section-sub">${d.subheading}</p>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px" data-aos="fade-up" data-aos-delay="100">
        ${(d.items||[]).map((item: any) => `
        <div style="background:${cardBg};border:${cardBorder};border-radius:var(--radius);padding:24px">
          <div style="width:36px;height:36px;border-radius:8px;background:color-mix(in srgb,var(--primary) 15%,transparent);display:flex;align-items:center;justify-content:center;margin-bottom:12px;color:var(--primary);font-weight:900;font-size:18px">${item.icon}</div>
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
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center">
      <div data-aos="fade-up">
        <div class="section-label">Our Story</div>
        <h2 class="section-heading">${d.heading}</h2>
        <p style="font-size:16px;color:${dark?'#bbb':'#555'};line-height:1.8;margin-bottom:16px">${d.body}</p>
        <p style="font-size:16px;color:${dark?'#bbb':'#555'};line-height:1.8;margin-bottom:28px">${d.body2||''}</p>
        ${d.ctaText?`<a href="#contact" class="btn btn-primary">${d.ctaText}</a>`:''}
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <img src="${d.image}" alt="About us" style="border-radius:var(--radius);width:100%;height:460px;object-fit:cover;box-shadow:0 20px 60px rgba(0,0,0,.15)">
      </div>
    </div>
  </div>
</section>`

    case 'testimonials': return `
<section style="padding:80px 0;background:${dark?'#111':'#f9fafb'}">
  <div class="container">
    <div style="text-align:center;margin-bottom:52px" data-aos="fade-up">
      <div class="section-label">Testimonials</div>
      <h2 class="section-heading">${d.heading}</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px">
      ${(d.items||[]).map((t: any, i: number) => `
      <div data-aos="fade-up" data-aos-delay="${i*100}" style="background:${cardBg};border:${cardBorder};border-radius:var(--radius);padding:28px">
        <div style="color:var(--primary);font-size:20px;margin-bottom:12px">★★★★★</div>
        <p style="font-size:15px;line-height:1.75;color:${dark?'#ccc':'#444'};margin-bottom:20px;font-style:italic">"${t.quote}"</p>
        <div style="display:flex;align-items:center;gap:12px">
          <img src="${t.avatar}" alt="${t.name}" style="width:44px;height:44px;border-radius:50%;object-fit:cover">
          <div><div style="font-weight:700;font-size:14px">${t.name}</div><div style="font-size:12px;color:${dark?'#777':'#999'}">${t.role}</div></div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>`

    case 'gallery': return `
<section style="padding:80px 0">
  <div class="container">
    <div style="text-align:center;margin-bottom:52px" data-aos="fade-up">
      <div class="section-label">Gallery</div>
      <h2 class="section-heading">${d.heading}</h2>
      <p class="section-sub" style="margin:0 auto">${d.subheading}</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
      ${(d.images||[]).map((img: any, idx: number) => `
      <div data-aos="fade-up" data-aos-delay="${idx*50}" style="position:relative;overflow:hidden;border-radius:var(--radius);aspect-ratio:4/3;cursor:pointer" onmouseenter="this.querySelector('div').style.opacity='1'" onmouseleave="this.querySelector('div').style.opacity='0'">
        <img src="${img.url}" alt="${img.alt}" style="width:100%;height:100%;object-fit:cover;transition:transform .4s" onmouseenter="this.style.transform='scale(1.05)'" onmouseleave="this.style.transform=''">
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
      <h2 class="section-heading">${d.heading}</h2>
      <p class="section-sub" style="margin:0 auto">${d.subheading}</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">
      ${(d.items||[]).map((p: any, i: number) => `
      <div data-aos="fade-up" data-aos-delay="${i*100}" style="background:${p.highlighted?'var(--primary)':cardBg};border:${p.highlighted?'none':cardBorder};border-radius:var(--radius);padding:36px;position:relative;${p.highlighted?'transform:scale(1.02);box-shadow:0 20px 60px rgba(0,0,0,.2)':''}">
        ${p.highlighted?`<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--secondary);color:#fff;font-size:11px;font-weight:800;padding:4px 14px;border-radius:999px;text-transform:uppercase;letter-spacing:.08em">Most Popular</div>`:''}
        <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;color:${p.highlighted?'rgba(255,255,255,.8)':dark?'#999':'#888'}">${p.name}</div>
        <div style="font-size:42px;font-weight:900;margin-bottom:4px;color:${p.highlighted?'#fff':'inherit'}">${p.price}</div>
        <div style="font-size:13px;color:${p.highlighted?'rgba(255,255,255,.7)':dark?'#777':'#999'};margin-bottom:28px">${p.period}</div>
        <div style="margin-bottom:28px">${(p.features||[]).map((f: string)=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;font-size:14px;color:${p.highlighted?'rgba(255,255,255,.9)':dark?'#ccc':'#444'}"><span style="color:${p.highlighted?'#fff':'var(--primary)'};font-weight:700">✓</span>${f}</div>`).join('')}</div>
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
      <h2 class="section-heading">${d.heading}</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:28px">
      ${(d.members||[]).map((m: any, i: number) => `
      <div data-aos="fade-up" data-aos-delay="${i*100}" style="text-align:center">
        <img src="${m.image}" alt="${m.name}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;margin:0 auto 16px;border:3px solid var(--primary)">
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
      <h2 class="section-heading">${d.heading}</h2>
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
    <h2 style="font-size:clamp(28px,4vw,44px);letter-spacing:-1px;color:#fff;margin-bottom:16px">${d.heading}</h2>
    <p style="font-size:17px;color:rgba(255,255,255,.82);max-width:520px;margin:0 auto 36px;line-height:1.75">${d.subtext}</p>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="${d.ctaUrl||'#contact'}" class="btn" style="background:#fff;color:var(--primary)">${d.ctaText}</a>
      ${d.ctaText2?`<a href="#" class="btn" style="background:transparent;color:#fff;border:2px solid rgba(255,255,255,.5)">${d.ctaText2}</a>`:''}
    </div>
  </div>
</section>`

    case 'contact': return `
<section id="contact" style="padding:80px 0">
  <div class="container">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px">
      <div data-aos="fade-up">
        <div class="section-label">Contact</div>
        <h2 class="section-heading">${d.heading}</h2>
        <p style="font-size:16px;color:${dark?'#bbb':'#666'};line-height:1.75;margin-bottom:32px">${d.subtext}</p>
        <div style="display:flex;flex-direction:column;gap:16px">
          ${d.phone?`<div style="display:flex;align-items:center;gap:14px"><div style="width:44px;height:44px;border-radius:var(--radius);background:color-mix(in srgb,var(--primary) 12%,transparent);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">📞</div><div><div style="font-size:12px;color:${dark?'#888':'#999'};margin-bottom:2px">Phone</div><div style="font-weight:600">${d.phone}</div></div></div>`:''}
          ${d.email?`<div style="display:flex;align-items:center;gap:14px"><div style="width:44px;height:44px;border-radius:var(--radius);background:color-mix(in srgb,var(--primary) 12%,transparent);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">📧</div><div><div style="font-size:12px;color:${dark?'#888':'#999'};margin-bottom:2px">Email</div><div style="font-weight:600">${d.email}</div></div></div>`:''}
          ${d.address?`<div style="display:flex;align-items:center;gap:14px"><div style="width:44px;height:44px;border-radius:var(--radius);background:color-mix(in srgb,var(--primary) 12%,transparent);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">📍</div><div><div style="font-size:12px;color:${dark?'#888':'#999'};margin-bottom:2px">Address</div><div style="font-weight:600">${d.address}</div></div></div>`:''}
          ${d.hours?`<div style="display:flex;align-items:center;gap:14px"><div style="width:44px;height:44px;border-radius:var(--radius);background:color-mix(in srgb,var(--primary) 12%,transparent);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🕐</div><div><div style="font-size:12px;color:${dark?'#888':'#999'};margin-bottom:2px">Hours</div><div style="font-weight:600">${d.hours}</div></div></div>`:''}
        </div>
      </div>
      <div data-aos="fade-up" data-aos-delay="100" style="background:${cardBg};border:${cardBorder};border-radius:var(--radius);padding:36px">
        <h3 style="font-size:20px;font-weight:800;margin-bottom:24px">Send Us a Message</h3>
        <form onsubmit="event.preventDefault();this.innerHTML='<p style=&quot;color:var(--primary);font-weight:600;font-size:16px&quot;>✓ Message sent! We will be in touch shortly.</p>'">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
            <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:6px;color:${dark?'#bbb':'#555'}">Name</label><input type="text" required placeholder="Your name" style="width:100%;padding:11px 14px;border-radius:var(--radius);border:1px solid ${dark?'#333':'#ddd'};background:${dark?'#1a1a1a':'#fff'};color:inherit;font-size:14px;outline:none"></div>
            <div><label style="font-size:12px;font-weight:600;display:block;margin-bottom:6px;color:${dark?'#bbb':'#555'}">Email</label><input type="email" required placeholder="your@email.com" style="width:100%;padding:11px 14px;border-radius:var(--radius);border:1px solid ${dark?'#333':'#ddd'};background:${dark?'#1a1a1a':'#fff'};color:inherit;font-size:14px;outline:none"></div>
          </div>
          <div style="margin-bottom:14px"><label style="font-size:12px;font-weight:600;display:block;margin-bottom:6px;color:${dark?'#bbb':'#555'}">Subject</label><input type="text" placeholder="How can we help?" style="width:100%;padding:11px 14px;border-radius:var(--radius);border:1px solid ${dark?'#333':'#ddd'};background:${dark?'#1a1a1a':'#fff'};color:inherit;font-size:14px;outline:none"></div>
          <div style="margin-bottom:20px"><label style="font-size:12px;font-weight:600;display:block;margin-bottom:6px;color:${dark?'#bbb':'#555'}">Message</label><textarea rows="4" placeholder="Tell us about your project..." style="width:100%;padding:11px 14px;border-radius:var(--radius);border:1px solid ${dark?'#333':'#ddd'};background:${dark?'#1a1a1a':'#fff'};color:inherit;font-size:14px;outline:none;resize:vertical"></textarea></div>
          <button type="submit" class="btn btn-primary" style="width:100%">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>`

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
          <div style="width:28px;height:28px;border-radius:6px;background:var(--primary)"></div>
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
    if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true, offset: 60 });
  });
</script>`
}

export function renderPage(site: SiteData, page: Page, interactive = false): string {
  const theme = site.theme
  const sectionsHtml = page.sections.map(sec => {
    const h = renderSection(sec, theme)
    return interactive ? wrapSection(sec.id, h) : h
  }).join('\n')

  const interactiveScript = interactive ? `
<style>
  [data-section-id] { position: relative; cursor: pointer; transition: outline 0.15s; outline: 2px solid transparent; outline-offset: -2px }
  [data-section-id]:hover { outline-color: ${theme.primaryColor}88 }
  [data-section-id].sf-active { outline-color: ${theme.primaryColor} !important; outline-width: 3px }
  [data-section-id]::before {
    content: attr(data-sf-label); position: absolute; top: 8px; left: 8px;
    background: ${theme.primaryColor}; color: #fff; padding: 4px 10px; border-radius: 6px;
    font-size: 11px; font-weight: 700; opacity: 0; transition: opacity 0.15s; z-index: 99; pointer-events: none;
    font-family: 'Inter', system-ui, sans-serif;
  }
  [data-section-id]:hover::before, [data-section-id].sf-active::before { opacity: 1 }
</style>
<script>
  document.querySelectorAll('[data-section-id]').forEach(el => {
    const id = el.getAttribute('data-section-id');
    el.setAttribute('data-sf-label', '✏️ Edit');
    el.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('[data-section-id]').forEach(s => s.classList.remove('sf-active'));
      el.classList.add('sf-active');
      window.parent.postMessage({ type: 'section-click', id }, '*');
    }, true);
  });
  // Listen for active section update from parent
  window.addEventListener('message', e => {
    if (e.data && e.data.type === 'set-active' && e.data.id) {
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
  <meta name="description" content="${site.tagline}">
  ${aosScript().split('<script')[0]}
  <style>${css(theme)}</style>
</head>
<body>
  ${nav(site, page, theme)}
  ${sectionsHtml}
  ${footer(site, theme)}
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
  return files
}
