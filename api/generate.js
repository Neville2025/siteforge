import Anthropic from '@anthropic-ai/sdk'

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { audit, template, instructions } = req.body
  if (!audit) return res.status(400).json({ error: 'Audit data required' })

  const TEMPLATE_STYLES = {
    dark:     'Dark background #0a0a0a, gradient text headings using brand colors, glowing CTA buttons, subtle grid pattern background, modern tech aesthetic. Use dark cards with slight border glow.',
    minimal:  'Pure white background, generous whitespace, clean black typography, barely-there borders, content-first layout. No decorative elements. Let the content breathe.',
    bold:     'High contrast. Use primary color as full-section backgrounds. Bold oversized typography. Strong geometric dividers. Corporate and authoritative structure.',
    creative: 'Asymmetric hero layout. One column wide text one side, large colored shape other side. Big display font. Overlapping elements. Diagonal section dividers. Modern agency energy.',
    warm:     'Off-white or cream background, warm muted tones, rounded corners everywhere (border-radius: 20px+), friendly font pairing, welcoming and approachable.',
    luxury:   'Deep navy or charcoal background, gold accent color, serif heading font, uppercase spaced-out labels, elegant thin dividers, premium and exclusive feel.',
  }

  const styleGuide = TEMPLATE_STYLES[template] || TEMPLATE_STYLES.minimal
  const services = audit.services?.map(s => `  - ${s.icon} ${s.title}: ${s.description}`).join('\n') || ''
  const social = Object.entries(audit.social || {}).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join(' | ')

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      messages: [{
        role: 'user',
        content: `You are a world-class web designer. Generate a COMPLETE, beautiful, production-ready single-file HTML website. This must be a FULL website — do not truncate, do not summarize, write EVERY section completely.

═══════════════════════════════
BRAND BRIEF
═══════════════════════════════
Business: ${audit.name}
Industry: ${audit.industry}
Tagline: ${audit.tagline}
Description: ${audit.description}
Tone: ${audit.tone} | Aesthetic: ${audit.aesthetic}
Target Audience: ${audit.targetAudience}
Brand Personality: ${audit.brandPersonality}
Primary Color: ${audit.primaryColor}
Secondary Color: ${audit.secondaryColor}
CTA Text: ${audit.ctaText || 'Get Started'}
Phone: ${audit.contact?.phone || ''}
Email: ${audit.contact?.email || ''}
Address: ${audit.contact?.address || ''}
Social: ${social}
SEO Title: ${audit.seoTitle || audit.name}

Services:
${services}

═══════════════════════════════
DESIGN STYLE: ${(template||'minimal').toUpperCase()}
═══════════════════════════════
${styleGuide}

═══════════════════════════════
CUSTOM INSTRUCTIONS FROM CLIENT
═══════════════════════════════
${instructions ? instructions : 'None — use your best design judgment.'}

═══════════════════════════════
REQUIRED SECTIONS (ALL MUST BE COMPLETE)
═══════════════════════════════
1. <head>: charset, viewport, title, meta description, Google Fonts (pick 2 matching the tone), Tailwind CDN, AOS CDN, custom CSS
2. Sticky navigation: Logo (colored box + name), nav links, CTA button, mobile hamburger (working with JS toggle)
3. Hero section: full viewport height, headline, subheadline, 2 buttons, animated elements
4. Trust/stats bar: 4 realistic stats for ${audit.industry}
5. Services section: all ${audit.services?.length || 3} services as beautiful cards with icons, titles, descriptions, hover effects
6. About section: who ${audit.name} is, what makes them different, compelling copy
7. Testimonials: 3 realistic client testimonials (generate real-sounding names + quotes for ${audit.industry}) with star ratings and ui-avatars.com profile images
8. Call-to-action: bold full-width section with gradient using ${audit.primaryColor}
9. Contact section: phone, email, address, simple contact form (HTML only)
10. Footer: logo, tagline, nav links, social links, copyright ${new Date().getFullYear()}

═══════════════════════════════
TECHNICAL REQUIREMENTS
═══════════════════════════════
- Tailwind: <script src="https://cdn.tailwindcss.com"></script> with config for brand colors
- AOS: link + script tags, initialize with AOS.init({duration:900, once:true})
- Google Fonts via link tag
- All animations via AOS data-aos="" and CSS transitions
- CSS custom properties: --primary, --secondary in :root
- Mobile hamburger menu working with vanilla JS
- Smooth scroll: html { scroll-behavior: smooth }
- Write REAL compelling copy — specific to ${audit.name} and ${audit.industry}
- Testimonials must sound genuine and industry-specific
- COMPLETE the entire file — do not cut short

RETURN: Only the raw HTML starting with <!DOCTYPE html>. No markdown. No code blocks. No explanation.`
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
