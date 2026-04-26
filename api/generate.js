import Anthropic from '@anthropic-ai/sdk'

export const config = { maxDuration: 60 }

const DESIGN_DIRECTIONS = {
  professional: 'Clean grid layouts, navy/slate tones, subtle shadows, conservative spacing, trust-building design',
  bold: 'High contrast, large typography, strong geometric shapes, powerful color blocks, confident layout',
  playful: 'Rounded corners, bright accent colors, organic shapes, fun energetic layout',
  minimal: 'Extreme whitespace, thin typography, barely-there borders, content-first, elegant restraint',
  luxury: 'Deep jewel tones, serif headings, generous whitespace, understated elegance, premium feel',
  corporate: 'Structured grid, professional blue palette, formal hierarchy, data-driven sections, trust signals',
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { audit } = req.body
  if (!audit) return res.status(400).json({ error: 'Audit data required' })

  const direction = DESIGN_DIRECTIONS[audit.tone] || DESIGN_DIRECTIONS.professional
  const servicesHtml = audit.services?.map(s => `- ${s.icon} ${s.title}: ${s.description}`).join('\n') || ''
  const socialLinks = Object.entries(audit.social || {}).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join(', ')

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    // Stream the response so Vercel doesn't timeout
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `You are an award-winning web designer. Generate a COMPLETE, stunning, production-ready single HTML file website.

BRAND DATA:
- Business: ${audit.name}
- Industry: ${audit.industry}
- Tagline: ${audit.tagline}
- Description: ${audit.description}
- Tone: ${audit.tone} | Aesthetic: ${audit.aesthetic}
- Brand Personality: ${audit.brandPersonality}
- Target Audience: ${audit.targetAudience}
- Primary Color: ${audit.primaryColor}
- Secondary Color: ${audit.secondaryColor}
- Services:
${servicesHtml}
- Phone: ${audit.contact?.phone || ''}
- Email: ${audit.contact?.email || ''}
- Address: ${audit.contact?.address || ''}
- Social: ${socialLinks}
- SEO Title: ${audit.seoTitle || audit.name}

DESIGN DIRECTION (${audit.tone}): ${direction}

Generate a COMPLETE HTML file with:
1. HEAD: Google Fonts (2 fonts matching tone), Tailwind CDN, AOS CDN, custom CSS with CSS variables
2. STICKY NAV: Logo + links + CTA button + mobile menu
3. HERO: Full-height, powerful headline, subtext, 2 CTA buttons, animated decorative elements
4. STATS BAR: 4 impressive numbers relevant to ${audit.industry}
5. SERVICES: Beautiful card grid, hover effects
6. ABOUT: Split layout, compelling copy about ${audit.name}
7. TESTIMONIALS: 3 realistic client testimonials with avatars from ui-avatars.com
8. CTA SECTION: Bold full-width with gradient background
9. FOOTER: Logo, description, contact info, social links, copyright

RULES:
- Use exact brand colors: primary ${audit.primaryColor}, secondary ${audit.secondaryColor}
- Write REAL compelling copy, not placeholder text
- AOS data-aos attributes for scroll animations
- Mobile responsive with Tailwind
- Include AOS.init({ duration: 800, once: true }) in script
- Tailwind config: tailwind.config = { theme: { extend: { colors: { primary: '${audit.primaryColor}', secondary: '${audit.secondaryColor}' } } } }

Return ONLY the HTML starting with <!DOCTYPE html> — no markdown, no explanation.`
      }]
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        res.write(chunk.delta.text)
      }
    }

    res.end()
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message })
    } else {
      res.end()
    }
  }
}
