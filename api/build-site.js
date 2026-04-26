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

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-cache')

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      messages: [{
        role: 'user',
        content: `You are a senior web designer building a complete multi-page website. Generate a JSON structure for a website based on the business information below.

═══════════════════════════════
BUSINESS INFO
═══════════════════════════════
Name: ${business.name}
Industry: ${business.industry}
Description: ${business.description}
Services offered: ${business.services}
Phone: ${business.phone}
Email: ${business.email}
Address: ${business.address}
Brand Colors: Primary ${business.primaryColor}, Secondary ${business.secondaryColor}
Tone: ${business.tone}

═══════════════════════════════
TASK
═══════════════════════════════
Generate a JSON object representing a complete 4-page website with sections appropriate for ${business.industry}. Use REAL, COMPELLING copy specific to ${business.name} — no generic placeholders. Write testimonials, team bios, service descriptions, etc. that sound real and industry-appropriate.

═══════════════════════════════
EXACT JSON STRUCTURE REQUIRED
═══════════════════════════════
{
  "name": "${business.name}",
  "tagline": "compelling 6-10 word tagline",
  "logo": "",
  "theme": {
    "primaryColor": "${business.primaryColor}",
    "secondaryColor": "${business.secondaryColor}",
    "accentColor": "complementary hex color",
    "fontHeading": "one of: Inter | Poppins | Raleway | Montserrat | Playfair Display | DM Sans",
    "fontBody": "one of: Inter | Poppins | Nunito | DM Sans | Open Sans",
    "borderRadius": "one of: none | small | medium | large | pill",
    "style": "light or dark"
  },
  "pages": [
    {
      "name": "Home", "slug": "/",
      "sections": [
        { "type": "hero", "data": { "headline": "...", "subtext": "...", "ctaText": "...", "ctaUrl": "#contact", "ctaText2": "...", "image": "https://images.unsplash.com/...?w=1400&q=80", "showStats": true } },
        { "type": "stats", "data": { "stat1val": "...", "stat1label": "...", "stat2val": "...", "stat2label": "...", "stat3val": "...", "stat3label": "...", "stat4val": "...", "stat4label": "..." } },
        { "type": "services", "data": { "heading": "...", "subheading": "...", "items": [ { "icon": "⚡", "title": "...", "desc": "..." } ] } },
        { "type": "features", "data": { "heading": "Why Choose Us", "subheading": "...", "items": [ { "icon": "✓", "title": "...", "desc": "..." } ] } },
        { "type": "testimonials", "data": { "heading": "...", "items": [ { "name": "...", "role": "...", "quote": "...", "avatar": "https://ui-avatars.com/api/?name=Full+Name&background=random" } ] } },
        { "type": "cta", "data": { "heading": "...", "subtext": "...", "ctaText": "...", "ctaUrl": "#contact", "ctaText2": "" } }
      ]
    },
    {
      "name": "About", "slug": "/about",
      "sections": [
        { "type": "about", "data": { "heading": "...", "subheading": "...", "body": "...", "body2": "...", "image": "https://images.unsplash.com/...?w=800&q=80", "ctaText": "..." } },
        { "type": "team", "data": { "heading": "Meet the Team", "members": [ { "name": "...", "role": "...", "bio": "...", "image": "https://ui-avatars.com/api/?name=Name&size=200&background=random" } ] } },
        { "type": "stats", "data": { "stat1val": "...", "stat1label": "...", "stat2val": "...", "stat2label": "...", "stat3val": "...", "stat3label": "...", "stat4val": "...", "stat4label": "..." } }
      ]
    },
    {
      "name": "Services", "slug": "/services",
      "sections": [
        { "type": "hero", "data": { "headline": "...", "subtext": "...", "ctaText": "...", "ctaUrl": "#contact", "ctaText2": "", "image": "", "showStats": false } },
        { "type": "services", "data": { "heading": "...", "subheading": "...", "items": [ {} ] } },
        { "type": "pricing", "data": { "heading": "...", "subheading": "...", "items": [ { "name": "...", "price": "...", "period": "...", "features": ["..."], "cta": "...", "highlighted": false } ] } },
        { "type": "faq", "data": { "heading": "Common Questions", "items": [ { "q": "...", "a": "..." } ] } },
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

═══════════════════════════════
CRITICAL RULES
═══════════════════════════════
1. Services array MUST have 3 items, each with industry-appropriate icon, title, and benefit-focused description
2. Features items MUST have 4 entries with ✓ icon
3. Testimonials MUST have 3 entries with realistic full names appropriate for South African context, real-sounding company roles, and specific industry-relevant quotes (NOT generic "great service")
4. Team members MUST have 3 entries with diverse names and specific roles
5. FAQ MUST have 4-5 industry-specific questions
6. Pricing MUST have 3 tiers, middle tier "highlighted: true"
7. Stats MUST be impressive but believable for ${business.industry} (e.g., "200+ clients", "98% satisfaction", "10yr experience", "24/7 support")
8. Use Unsplash images: https://images.unsplash.com/photo-... — pick relevant photos for ${business.industry}
9. Use ui-avatars.com for testimonial avatars and team photos
10. Tone should match "${business.tone}" — professional/bold/playful/minimal/luxury/corporate

Return ONLY the JSON object — no markdown, no code blocks, no explanation. Start with { and end with }`
      }]
    })

    let raw = ''
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        raw += chunk.delta.text
      }
    }

    raw = raw.trim().replace(/^```json\n?|```$/g, '').trim()
    let result
    try { result = JSON.parse(raw) }
    catch { return res.status(500).json({ error: 'AI returned invalid JSON. Try again.' }) }

    res.json({ site: result })
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message })
  }
}
