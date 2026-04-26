import Anthropic from '@anthropic-ai/sdk'

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, industry, description, services, phone, email, address, primaryColor, secondaryColor, tone, audit } = req.body

  if (!name && !audit?.name) return res.status(400).json({ error: 'Business name required' })

  const business = {
    name: name || audit?.name,
    industry: industry || audit?.industry || 'Professional Services',
    description: description || audit?.description || '',
    services: services || audit?.services?.map(s => s.title).join(', ') || '',
    phone: phone || audit?.contact?.phone || '',
    email: email || audit?.contact?.email || '',
    address: address || audit?.contact?.address || '',
    primaryColor: primaryColor || audit?.primaryColor || '#2563eb',
    secondaryColor: secondaryColor || audit?.secondaryColor || '#7c3aed',
    tone: tone || audit?.tone || 'professional',
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    // Stream so Vercel keeps connection alive
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      messages: [{
        role: 'user',
        content: `You are a senior web designer building a complete multi-page website. Generate a JSON structure for ${business.name} based on the business info below.

BUSINESS:
- Name: ${business.name}
- Industry: ${business.industry}
- Description: ${business.description}
- Services: ${business.services}
- Phone: ${business.phone}
- Email: ${business.email}
- Address: ${business.address}
- Brand Colors: Primary ${business.primaryColor}, Secondary ${business.secondaryColor}
- Tone: ${business.tone}

TASK: Generate a JSON object for a 4-page website. Use REAL, COMPELLING copy specific to ${business.name} — no generic placeholders. Write industry-specific testimonials, team bios, service descriptions, FAQs.

EXACT JSON SCHEMA (return only this structure, no other text):

{
  "name": "${business.name}",
  "tagline": "compelling 6-10 word tagline",
  "logo": "",
  "theme": {
    "primaryColor": "${business.primaryColor}",
    "secondaryColor": "${business.secondaryColor}",
    "accentColor": "complementary hex",
    "fontHeading": "Inter|Poppins|Raleway|Montserrat|Playfair Display|DM Sans",
    "fontBody": "Inter|Poppins|Nunito|DM Sans|Open Sans",
    "borderRadius": "small|medium|large",
    "style": "light or dark"
  },
  "pages": [
    {
      "name": "Home", "slug": "/",
      "sections": [
        { "type": "hero", "data": { "headline": "...", "subtext": "...", "ctaText": "...", "ctaUrl": "#contact", "ctaText2": "...", "image": "https://images.unsplash.com/photo-INDUSTRY-RELEVANT?w=1400&q=80", "showStats": true } },
        { "type": "stats", "data": { "stat1val": "...", "stat1label": "...", "stat2val": "...", "stat2label": "...", "stat3val": "...", "stat3label": "...", "stat4val": "...", "stat4label": "..." } },
        { "type": "services", "data": { "heading": "...", "subheading": "...", "items": [ { "icon": "emoji", "title": "...", "desc": "..." }, { "icon": "emoji", "title": "...", "desc": "..." }, { "icon": "emoji", "title": "...", "desc": "..." } ] } },
        { "type": "features", "data": { "heading": "Why Choose Us", "subheading": "...", "items": [ { "icon": "✓", "title": "...", "desc": "..." }, { "icon": "✓", "title": "...", "desc": "..." }, { "icon": "✓", "title": "...", "desc": "..." }, { "icon": "✓", "title": "...", "desc": "..." } ] } },
        { "type": "testimonials", "data": { "heading": "...", "items": [ { "name": "Real Name", "role": "Title, Company", "quote": "Specific quote about ${business.industry}", "avatar": "https://ui-avatars.com/api/?name=First+Last&background=2563eb&color=fff" }, { "name": "Real Name", "role": "Title, Company", "quote": "Specific quote", "avatar": "https://ui-avatars.com/api/?name=First+Last&background=16a34a&color=fff" }, { "name": "Real Name", "role": "Title, Company", "quote": "Specific quote", "avatar": "https://ui-avatars.com/api/?name=First+Last&background=ea580c&color=fff" } ] } },
        { "type": "cta", "data": { "heading": "...", "subtext": "...", "ctaText": "...", "ctaUrl": "#contact", "ctaText2": "" } }
      ]
    },
    {
      "name": "About", "slug": "/about",
      "sections": [
        { "type": "about", "data": { "heading": "...", "subheading": "...", "body": "compelling story 2-3 sentences", "body2": "what makes us different 2 sentences", "image": "https://images.unsplash.com/photo-INDUSTRY-RELEVANT?w=800&q=80", "ctaText": "..." } },
        { "type": "team", "data": { "heading": "Meet the Team", "members": [ { "name": "Real Name", "role": "Position", "bio": "...", "image": "https://ui-avatars.com/api/?name=First+Last&size=200&background=2563eb&color=fff" }, { "name": "Real Name", "role": "Position", "bio": "...", "image": "https://ui-avatars.com/api/?name=First+Last&size=200&background=16a34a&color=fff" }, { "name": "Real Name", "role": "Position", "bio": "...", "image": "https://ui-avatars.com/api/?name=First+Last&size=200&background=ea580c&color=fff" } ] } },
        { "type": "stats", "data": { "stat1val": "...", "stat1label": "...", "stat2val": "...", "stat2label": "...", "stat3val": "...", "stat3label": "...", "stat4val": "...", "stat4label": "..." } }
      ]
    },
    {
      "name": "Services", "slug": "/services",
      "sections": [
        { "type": "hero", "data": { "headline": "...", "subtext": "...", "ctaText": "...", "ctaUrl": "#contact", "ctaText2": "", "image": "", "showStats": false } },
        { "type": "services", "data": { "heading": "...", "subheading": "...", "items": [ { "icon": "emoji", "title": "...", "desc": "..." }, { "icon": "emoji", "title": "...", "desc": "..." }, { "icon": "emoji", "title": "...", "desc": "..." } ] } },
        { "type": "pricing", "data": { "heading": "...", "subheading": "...", "items": [ { "name": "...", "price": "R...", "period": "...", "features": ["...", "...", "...", "..."], "cta": "...", "highlighted": false }, { "name": "...", "price": "R...", "period": "...", "features": ["...", "...", "...", "...", "..."], "cta": "...", "highlighted": true }, { "name": "...", "price": "Custom", "period": "", "features": ["...", "...", "...", "..."], "cta": "Contact Us", "highlighted": false } ] } },
        { "type": "faq", "data": { "heading": "Common Questions", "items": [ { "q": "Industry-specific question?", "a": "..." }, { "q": "...", "a": "..." }, { "q": "...", "a": "..." }, { "q": "...", "a": "..." } ] } },
        { "type": "cta", "data": { "heading": "...", "subtext": "...", "ctaText": "...", "ctaUrl": "#contact", "ctaText2": "" } }
      ]
    },
    {
      "name": "Contact", "slug": "/contact",
      "sections": [
        { "type": "contact", "data": { "heading": "Get in Touch", "subtext": "...", "phone": "${business.phone}", "email": "${business.email}", "address": "${business.address}", "hours": "..." } }
      ]
    }
  ]
}

CRITICAL: Return ONLY the JSON object — start with { and end with }. No markdown blocks, no commentary. The JSON must be valid and parseable.`
      }]
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(chunk.delta.text)
      }
    }
    res.end()
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message })
    else res.end()
  }
}
