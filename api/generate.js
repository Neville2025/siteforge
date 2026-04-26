import Anthropic from '@anthropic-ai/sdk'

export const config = { maxDuration: 60 }

const DESIGN_DIRECTIONS = {
  professional: 'Clean grid layouts, navy/slate tones, subtle shadows, conservative spacing, trust-building design',
  bold: 'High contrast, large typography, strong geometric shapes, powerful color blocks, confident layout',
  playful: 'Rounded corners, bright accent colors, organic shapes, fun illustrations-style elements, energetic layout',
  minimal: 'Extreme whitespace, thin typography, barely-there borders, content-first, elegant restraint',
  luxury: 'Gold or deep jewel tones, serif headings, generous whitespace, understated elegance, premium feel',
  corporate: 'Structured grid, professional blue palette, data-driven sections, formal hierarchy, trust signals',
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
  const socialLinks = Object.entries(audit.social || {}).filter(([,v]) => v).map(([k,v]) => `${k}: ${v}`).join(', ')

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `You are an award-winning web designer creating a premium website. Generate a COMPLETE, stunning, production-ready HTML file.

BRAND DATA:
- Business Name: ${audit.name}
- Industry: ${audit.industry}
- Tagline: ${audit.tagline}
- Description: ${audit.description}
- Tone: ${audit.tone} | Aesthetic: ${audit.aesthetic}
- Brand Personality: ${audit.brandPersonality}
- Target Audience: ${audit.targetAudience}
- Primary Color: ${audit.primaryColor}
- Secondary Color: ${audit.secondaryColor}
- Accent Color: ${audit.accentColor}
- CTA Text: ${audit.ctaText || 'Get Started'}
- Services:
${servicesHtml}
- Phone: ${audit.contact?.phone || ''}
- Email: ${audit.contact?.email || ''}
- Address: ${audit.contact?.address || ''}
- Social: ${socialLinks}
- SEO Title: ${audit.seoTitle || audit.name}

DESIGN DIRECTION (${audit.tone}): ${direction}

Generate a COMPLETE single HTML file with these sections:

1. HEAD: charset, viewport, title="${audit.seoTitle || audit.name}", Google Fonts (pick 2 fonts matching the brand tone), Tailwind CDN, AOS CDN for scroll animations, custom CSS with CSS variables for brand colors

2. STICKY NAV: Logo (colored square + business name), nav links (Services, About, Contact), CTA button in primary color, mobile hamburger menu

3. HERO SECTION: Full-height or near-full-height, powerful headline using the tagline, compelling subheading, 2 CTA buttons, floating/animated decorative elements (CSS only), background using brand colors or gradient

4. TRUST BAR: 4 stats relevant to ${audit.industry} (e.g. years in business, clients served, satisfaction rate, projects completed) — make them realistic and impressive

5. SERVICES: Beautiful card grid for each service, icon or emoji, hover effects using CSS transitions

6. ABOUT SECTION: Split layout with text + visual element, compelling copy about ${audit.name} and what makes them different, written specifically for ${audit.industry}

7. TESTIMONIALS: 3 realistic client testimonials with names, photos (use ui-avatars.com API for avatars), star ratings — make them specific to ${audit.industry}

8. CTA SECTION: Bold, full-width call to action with gradient background using brand colors, headline, subheading, button

9. FOOTER: Logo, short description, contact info (${audit.contact?.email || ''}, ${audit.contact?.phone || ''}, ${audit.contact?.address || ''}), social links, copyright

TECHNICAL REQUIREMENTS:
- Use Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
- Use AOS: <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"> and <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
- Initialize AOS with AOS.init({ duration: 800, once: true })
- Use Google Fonts via link tag — pick fonts that match "${audit.tone}" aesthetic
- Configure Tailwind with brand colors: tailwind.config = { theme: { extend: { colors: { primary: '${audit.primaryColor}', secondary: '${audit.secondaryColor}' } } } }
- All animations via AOS data-aos attributes and CSS transitions
- Mobile-first responsive design
- Smooth scroll behavior on html element
- Write REAL, compelling copy — NOT generic placeholders. Write specifically for ${audit.name} in the ${audit.industry} industry

Return ONLY the complete HTML starting with <!DOCTYPE html> — no explanation, no markdown code blocks, just the raw HTML.`
      }]
    })

    const html = message.content[0].text.trim()
    if (!html.startsWith('<!DOCTYPE') && !html.startsWith('<html')) {
      return res.status(500).json({ error: 'Failed to generate valid HTML. Please try again.' })
    }

    res.json({ html })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
