import Anthropic from '@anthropic-ai/sdk'
import * as cheerio from 'cheerio'

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'AI is not configured. Set ANTHROPIC_API_KEY in the deployment environment.' })

  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'URL required' })

  try {
    const target = url.startsWith('http') ? url : `https://${url}`
    const response = await fetch(target, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SiteForge/1.0)' },
      signal: AbortSignal.timeout(10000),
    })
    const html = await response.text()
    const $ = cheerio.load(html)
    $('script,noscript,svg,path').remove()
    const cleanText = $('body').text().replace(/\s+/g,' ').trim().slice(0,8000)
    const metaDesc = $('meta[name="description"]').attr('content')||''
    const ogTitle = $('meta[property="og:title"]').attr('content')||$('title').text()||''
    const themeColor = $('meta[name="theme-color"]').attr('content')||''
    const allColors = extractColors(html, $)
    const fonts = extractFonts($, html)
    const social = extractSocial($)
    const emailMatch = cleanText.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g)||[]
    const email = emailMatch.find(e=>!e.match(/sentry|example|schema|wix|wordpress/i))||''
    const phoneMatch = cleanText.match(/(?:\+27|0)[0-9\s\-().]{8,14}/g)||[]
    const phone = phoneMatch[0]?.replace(/\s+/g,' ').trim()||''

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are a senior brand strategist and web designer. Analyze this website and return a JSON object only — no markdown, no explanation, just pure JSON.

Website URL: ${url}
Page title: ${ogTitle}
Meta description: ${metaDesc}
Theme color: ${themeColor}
Detected colors: ${allColors.join(', ')}
Detected fonts: ${fonts.join(', ')}
Page content: ${cleanText}

Return this exact JSON structure:
{
  "name": "business name",
  "tagline": "an improved, powerful tagline",
  "description": "2 compelling sentences about what they do and value they provide",
  "industry": "specific industry label",
  "tone": "one of: professional | bold | playful | minimal | luxury | corporate",
  "aesthetic": "one of: modern | classic | tech | creative | warm | cool",
  "targetAudience": "who their customers are",
  "brandPersonality": "3 words describing the brand",
  "primaryColor": "${allColors[0]||themeColor||'#6366f1'}",
  "secondaryColor": "${allColors[1]||'#a855f7'}",
  "accentColor": "${allColors[2]||'#ec4899'}",
  "backgroundColor": "#ffffff",
  "textColor": "#0f172a",
  "services": [
    { "title": "service name", "description": "1 sentence benefit-focused", "icon": "one emoji" }
  ],
  "whatsWorking": ["3 things done well on current site"],
  "improvements": ["4 specific improvements needed"],
  "componentRecommendations": ["hero section", "features grid", "testimonials", "contact form"],
  "contact": { "email": "${email}", "phone": "${phone}", "address": "" },
  "social": ${JSON.stringify(social)},
  "seoTitle": "improved SEO page title",
  "ctaText": "main call to action button text"
}`
      }]
    })

    let result
    try {
      const raw = message.content[0].text.trim()
      result = JSON.parse(raw.replace(/^```json\n?|```$/g,'').trim())
    } catch {
      return res.status(500).json({ error: 'Analysis returned invalid data. Try again.' })
    }

    result.allColors = allColors
    result.fonts = fonts.length ? fonts : ['Inter', 'system-ui']
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
