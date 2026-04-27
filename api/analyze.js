import Anthropic from '@anthropic-ai/sdk'
import * as cheerio from 'cheerio'

export const config = { maxDuration: 30 }

// ── Color extraction (unchanged) ──────────────────────────────
function extractColors(html, $) {
  const colors = new Map()
  const addColor = (raw) => {
    if (!raw) return
    const matches = raw.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) || []
    matches.forEach(c => {
      const hex = c.toLowerCase()
      const r = parseInt(hex.slice(1,3)||'ff',16), g = parseInt(hex.slice(3,5)||'ff',16), b = parseInt(hex.slice(5,7)||'ff',16)
      const brightness = (r*299+g*587+b*114)/1000
      if (brightness < 240 && brightness > 10) colors.set(hex, (colors.get(hex)||0)+1)
    })
  }
  $('style').each((_,el) => addColor($(el).html()))
  $('[style]').each((_,el) => addColor($(el).attr('style')))
  addColor(html)
  return [...colors.entries()].sort((a,b)=>b[1]-a[1]).slice(0,12).map(([hex])=>hex)
}

function extractFonts($, html) {
  const fonts = new Set()
  const re = /font-family\s*:\s*([^;}"']+)/gi
  let m
  const css = $('style').map((_,el)=>$(el).html()).get().join(' ')
  while ((m=re.exec(css))!==null) {
    m[1].split(',').forEach(f=>{
      const name = f.replace(/['"]/g,'').trim().split(' ')[0]
      if (name.length>2 && !name.match(/^(sans|serif|mono|inherit|initial|system|ui-)/i)) fonts.add(name)
    })
  }
  const gfMatch = html.match(/fonts\.googleapis\.com\/css[^"']+family=([^&"'|:]+)/g)||[]
  gfMatch.forEach(u=>{ const fm=u.match(/family=([^&"'|:]+)/); if(fm) fonts.add(decodeURIComponent(fm[1]).replace(/\+/g,' ')) })
  return [...fonts].slice(0,5)
}

function extractSocial($) {
  const s={}
  const map={facebook:'facebook.com',instagram:'instagram.com',twitter:'twitter.com',linkedin:'linkedin.com',tiktok:'tiktok.com',youtube:'youtube.com'}
  Object.entries(map).forEach(([k,domain])=>{ $(`a[href*="${domain}"]`).each((_,el)=>{ if(!s[k]) s[k]=$(el).attr('href') }) })
  return s
}

// ── Structured content extractors ─────────────────────────────

function clean(s) { return String(s||'').replace(/\s+/g, ' ').trim() }

/**
 * Resolve a URL relative to the page's URL. Returns absolute http(s) URL or empty string.
 */
function abs(src, baseUrl) {
  if (!src) return ''
  try {
    return new URL(src, baseUrl).toString()
  } catch { return '' }
}

/**
 * Extract a logo image URL. Look for typical logo selectors.
 */
function extractLogo($, baseUrl) {
  const candidates = [
    'header img[alt*="logo" i]',
    'a[href="/"] img',
    'nav img',
    'img[class*="logo" i]',
    'img[id*="logo" i]',
    'header img',
  ]
  for (const sel of candidates) {
    const el = $(sel).first()
    const src = el.attr('src') || el.attr('data-src')
    if (src) return abs(src, baseUrl)
  }
  // og:image fallback
  const og = $('meta[property="og:image"]').attr('content')
  return og ? abs(og, baseUrl) : ''
}

/**
 * Hero: largest h1 + the closest paragraph that follows it.
 */
function extractHero($) {
  const h1 = $('h1').first()
  const headline = clean(h1.text())
  // First paragraph in the same section / close to the h1.
  let subtext = ''
  if (h1.length) {
    const next = h1.nextAll('p').first()
    if (next.length) subtext = clean(next.text())
    if (!subtext) {
      const parentP = h1.parent().find('p').first()
      if (parentP.length) subtext = clean(parentP.text())
    }
  }
  if (!subtext) subtext = clean($('meta[name="description"]').attr('content') || '')
  return { headline, subtext }
}

/**
 * Testimonials: search for actual testimonial-shaped content.
 *  - Schema.org Review markup
 *  - Elements with class name containing "testimonial" or "review"
 *  - <blockquote> with attribution
 */
function extractTestimonials($) {
  const results = []
  const seen = new Set()
  const push = (quote, name, role) => {
    const q = clean(quote)
    if (!q || q.length < 25) return
    const key = q.toLowerCase().slice(0, 120)
    if (seen.has(key)) return
    seen.add(key)
    results.push({ quote: q, name: clean(name), role: clean(role) })
  }
  $('[itemtype*="Review" i], [itemtype*="Testimonial" i]').each((_, el) => {
    const $el = $(el)
    const quote = $el.find('[itemprop="reviewBody"], [itemprop="description"]').first().text() || $el.text()
    const name = $el.find('[itemprop="author"], [itemprop="name"]').first().text()
    push(quote, name, '')
  })
  $('[class*="testimonial" i], [class*="review-card" i], [class*="quote-card" i], [data-testimonial]').each((_, el) => {
    const $el = $(el)
    const quote = $el.find('p, [class*="quote" i], [class*="text" i]').first().text() || $el.text()
    const name = $el.find('[class*="author" i], [class*="name" i], cite, h3, h4').first().text()
    const role = $el.find('[class*="role" i], [class*="title" i], [class*="position" i], [class*="company" i]').first().text()
    push(quote, name, role)
  })
  $('blockquote').each((_, el) => {
    const $el = $(el)
    const quote = $el.find('p').first().text() || $el.contents().filter(function(){return this.type === 'text'}).text() || $el.text()
    const cite = $el.find('cite, footer').first().text()
    push(quote, cite, '')
  })
  return results.slice(0, 6)
}

/**
 * Team members: look for repeated h3 + role + img patterns.
 */
function extractTeam($, baseUrl) {
  const out = []
  const seen = new Set()
  const push = (name, role, bio, image) => {
    const n = clean(name)
    if (!n) return
    const key = n.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push({ name: n, role: clean(role), bio: clean(bio), image: image ? abs(image, baseUrl) : '' })
  }
  $('[class*="team" i] [class*="member" i], [class*="staff" i], [class*="people" i] > *, [class*="founder" i]').each((_, el) => {
    const $el = $(el)
    const name = $el.find('h2, h3, h4, [class*="name" i]').first().text()
    const role = $el.find('[class*="role" i], [class*="title" i], [class*="position" i], p').first().text()
    const bio = $el.find('p').slice(1).first().text()
    const image = $el.find('img').first().attr('src')
    push(name, role, bio, image)
  })
  return out.slice(0, 8)
}

/**
 * Services: heuristic — sections with 2+ children that have heading + paragraph.
 * We look for grids/cards with similar siblings.
 */
function extractServices($) {
  const out = []
  const seen = new Set()
  const push = (title, desc) => {
    const t = clean(title)
    if (!t || t.length > 60) return
    const key = t.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push({ title: t, description: clean(desc) })
  }
  // Sections with class hint
  $('[class*="service" i], [class*="offering" i], [class*="solution" i], [id*="service" i]').find('h2, h3, h4').each((_, el) => {
    const $el = $(el)
    const desc = $el.next('p').text() || $el.parent().find('p').first().text()
    push($el.text(), desc)
  })
  // Generic card grids with similar siblings
  if (out.length < 3) {
    $('section, div').each((_, sec) => {
      if (out.length >= 6) return false
      const $sec = $(sec)
      const cards = $sec.children().filter(function() {
        return $(this).find('h2, h3, h4').length === 1 && $(this).find('p').length >= 1
      })
      if (cards.length >= 3 && cards.length <= 8) {
        cards.each((_, c) => {
          const $c = $(c)
          push($c.find('h2, h3, h4').first().text(), $c.find('p').first().text())
        })
      }
    })
  }
  return out.slice(0, 8)
}

/**
 * FAQ: <details>/<summary> or h3+p inside a faq-like container.
 */
function extractFaq($) {
  const out = []
  const seen = new Set()
  const push = (q, a) => {
    const Q = clean(q), A = clean(a)
    if (!Q || !A || A.length < 20) return
    const key = Q.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push({ q: Q, a: A })
  }
  $('details').each((_, el) => {
    const $el = $(el)
    push($el.find('summary').first().text(), $el.contents().not('summary').text())
  })
  $('[class*="faq" i] h3, [class*="faq" i] h4, [class*="question" i]').each((_, el) => {
    const $el = $(el)
    const a = $el.next('p').text() || $el.next('div').text() || $el.parent().next('p').text()
    push($el.text(), a)
  })
  return out.slice(0, 8)
}

/**
 * Pricing: <table> with price-shaped data, or repeated cards with currency-symbol prices.
 */
function extractPricing($) {
  const out = []
  const seen = new Set()
  const priceRe = /(?:R|\$|£|€|₹|₦|KSh|A\$|C\$|R\$)\s?\d[\d,.\s]*/i
  const push = (name, price, period, features) => {
    const n = clean(name), p = clean(price)
    if (!n || !p) return
    const key = n.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push({ name: n, price: p, period: clean(period), features })
  }
  $('[class*="pric" i], [class*="plan" i], [class*="package" i], [class*="tier" i]').each((_, el) => {
    const $el = $(el)
    const text = $el.text()
    if (!priceRe.test(text)) return
    const name = $el.find('h2, h3, h4').first().text()
    const priceEl = $el.find('*').filter((_, e) => priceRe.test($(e).text()) && $(e).children().length === 0).first()
    const price = priceEl.text().match(priceRe)?.[0] || ''
    const period = $el.find('[class*="period" i], small').first().text()
    const features = $el.find('li').map((_, li) => clean($(li).text())).get().filter(Boolean).slice(0, 8)
    push(name, price, period, features)
  })
  return out.slice(0, 4)
}

function extractAbout($) {
  // Look for an "About" section
  let body = ''
  $('h1, h2, h3').each((_, el) => {
    const t = clean($(el).text()).toLowerCase()
    if (t.match(/^(about|our story|who we are|why us|mission|why choose)/)) {
      const ps = $(el).nextAll('p').slice(0, 3).map((_, p) => clean($(p).text())).get().filter(Boolean)
      if (ps.length) { body = ps.join(' '); return false }
    }
  })
  return body
}

// ── Main handler ──────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'AI is not configured. Set ANTHROPIC_API_KEY in the deployment environment.' })

  const { url, country } = req.body
  if (!url) return res.status(400).json({ error: 'URL required' })

  try {
    const target = url.startsWith('http') ? url : `https://${url}`
    const response = await fetch(target, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SiteForge/1.0)' },
      signal: AbortSignal.timeout(12000),
    })
    if (!response.ok) {
      return res.status(400).json({ error: `Could not fetch the site (HTTP ${response.status}). Check the URL is correct and publicly accessible.` })
    }
    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract metadata first BEFORE removing scripts
    const metaDesc = $('meta[name="description"]').attr('content')||''
    const ogTitle = $('meta[property="og:title"]').attr('content')||$('title').text()||''
    const themeColor = $('meta[name="theme-color"]').attr('content')||''
    const ogImage = $('meta[property="og:image"]').attr('content') || ''
    const allColors = extractColors(html, $)
    const fonts = extractFonts($, html)
    const social = extractSocial($)
    const logo = extractLogo($, target)

    // Extract structured content
    const hero = extractHero($)
    const testimonials = extractTestimonials($)
    const team = extractTeam($, target)
    const services = extractServices($)
    const faq = extractFaq($)
    const pricing = extractPricing($)
    const about = extractAbout($)

    // Now strip and get clean text for context
    $('script,noscript,svg,path,style').remove()
    const cleanText = $('body').text().replace(/\s+/g,' ').trim().slice(0, 6000)
    const emailMatch = cleanText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g)||[]
    const email = emailMatch.find(e=>!e.match(/sentry|example|schema|wix|wordpress|cloudflare/i))||''
    const phoneMatch = cleanText.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,3}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/g)||[]
    const phone = phoneMatch.find(p=>p.replace(/\D/g,'').length >= 9 && p.replace(/\D/g,'').length <= 15) || ''

    // Now ask Claude to ORGANISE — not invent. Strict schema.
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2200,
      tools: [{
        name: 'audit',
        description: 'Organise the EXTRACTED website content into our schema. NEVER invent content that is not present in the inputs.',
        input_schema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Business name as it appears on the site (page title or H1).' },
            tagline: { type: 'string', description: 'A tagline as written on the site. If none, use the meta description verbatim. If neither, leave empty.' },
            description: { type: 'string', description: 'A 2-sentence summary of what they do, derived ONLY from text on the site. Do not invent claims.' },
            industry: { type: 'string', description: 'One short label inferred from the content (e.g. "Plumbing", "Real estate"). Be conservative.' },
            primaryColor: { type: 'string', description: 'Best primary brand color (hex). Pick from the detected colors list. If none clearly dominant, return the theme-color or the first detected.' },
            secondaryColor: { type: 'string', description: 'Second best brand color from detected colors.' },
            services: {
              type: 'array',
              description: 'Use the EXTRACTED services verbatim — do not paraphrase, do not add new ones. If extraction returned empty, return empty array.',
              items: { type: 'object', properties: { title:{type:'string'}, description:{type:'string'}, icon:{type:'string'} }, required:['title','description'] }
            },
            seoTitle: { type: 'string' },
            ctaText: { type: 'string', description: 'Primary CTA text used on the source site if visible (e.g. "Get a Quote", "Contact Us"). If unsure, use "Contact Us".' }
          },
          required: ['name','tagline','description','industry','primaryColor','services','ctaText']
        }
      }],
      tool_choice: { type: 'tool', name: 'audit' },
      messages: [{
        role: 'user',
        content: `You are organising the contents of a real existing website into structured fields. CRITICAL RULES:
1. DO NOT INVENT CONTENT. Only use what's in the EXTRACTED data below.
2. If a field's source data is empty, return an empty string or empty array — do not generate plausible-sounding content.
3. For services: copy the title and description as written. Add an emoji icon based on the service title only.
4. For tagline / description: prefer the page's own meta description or H1 wording. Light cleanup only.

URL: ${url}
Page title: ${ogTitle}
Meta description: ${metaDesc}
Theme color: ${themeColor}
Detected colors (most common first): ${allColors.join(', ')}

EXTRACTED HERO:
  Headline: "${hero.headline}"
  Subtext: "${hero.subtext}"

EXTRACTED ABOUT (verbatim):
${about ? `"${about}"` : '(none found)'}

EXTRACTED SERVICES (verbatim — use these exactly, do not add or remove):
${services.length ? services.map(s => `- ${s.title}: ${s.description}`).join('\n') : '(none found — return empty array)'}

EXTRACTED CONTACT FROM PAGE TEXT:
  Email: ${email}
  Phone: ${phone}

Page text excerpt (only for context, do not quote anything not specifically referenced above): ${cleanText.slice(0, 4000)}

Use the audit tool to return the structured data. Remember: NO INVENTION.`
      }]
    })

    const toolUse = message.content.find(c => c.type === 'tool_use')
    if (!toolUse) return res.status(500).json({ error: 'AI did not return structured data. Try again.' })
    const result = toolUse.input

    // Attach the raw extracted blocks so build-site can use them verbatim.
    result.contact = { email, phone, address: '' }
    result.social = social
    result.allColors = allColors
    result.fonts = fonts.length ? fonts : ['Inter', 'system-ui']
    result.logo = logo
    result.ogImage = ogImage
    result.country = country || 'ZA'

    // Pass the extracted real content through. build-site MUST use these verbatim.
    result.extracted = {
      hero,                 // { headline, subtext }
      about,                // verbatim about-section paragraph
      services: result.services && result.services.length ? result.services : services,
      testimonials,         // [{ quote, name, role }] — verbatim from source
      team,                 // [{ name, role, bio, image }]
      faq,                  // [{ q, a }]
      pricing,              // [{ name, price, period, features }]
    }

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
