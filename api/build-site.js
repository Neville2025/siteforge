import Anthropic from '@anthropic-ai/sdk'

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'AI is not configured. Set ANTHROPIC_API_KEY in the deployment environment.' })

  const { name, industry, description, services, phone, email, address, primaryColor, secondaryColor, tone, audit, country, persona, brandVoice } = req.body
  const voiceBlock = brandVoice && brandVoice.trim().length > 30
    ? `\n\n═══════════════════════════════\nBRAND VOICE (match this tone exactly)\n═══════════════════════════════\nThe business owner has provided these examples of their existing writing. Match the vocabulary, sentence rhythm, energy, and formality of these examples in everything you write — do not invent a different "voice".\n\n"""\n${String(brandVoice).slice(0, 3000)}\n"""\n`
    : ''
  const PERSONA_PROMPTS = {
    minimal:    'Minimal aesthetic. Lots of whitespace. Restrained typography. Subtle motion. Lighter palette unless dark requested. Use Inter/Inter, small radius.',
    bold:       'Bold and confident. High-contrast. Big type. Full-bleed sections. Use Poppins/Inter, medium radius, dark palette friendly.',
    luxury:     'Luxury aesthetic. Serif headings (Playfair Display). Deep colors with gold accent. Elegant spacing. Subtle motion. Small radius.',
    playful:    'Playful and friendly. Soft pastels. Rounded corners (large radius). Animated, lively. Poppins/Nunito.',
    corporate:  'Corporate and authoritative. Blues. Structured grid. Photography-led. Montserrat/Inter, small radius.',
    tech:       'Tech aesthetic. Dark mode default. Gradient hero. DM Sans. Medium radius. Lively motion.',
    wellness:   'Wellness aesthetic. Warm earth tones. Generous spacing. Calm motion. Merriweather/Inter, large radius.',
    editorial:  'Editorial / magazine style. Mixed serif + sans typography. Asymmetric layouts. Playfair Display + DM Sans.',
  }
  const personaHint = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.minimal

  if (!name && !audit?.name) return res.status(400).json({ error: 'Business name required' })

  // Country-specific prompt addendum so AI generates locally-appropriate copy.
  const COUNTRY_HINTS = {
    ZA: { currency:'ZAR', symbol:'R', law:'POPIA', cities:'Johannesburg, Cape Town, Durban', names:'Sarah Johnson, Sipho Dlamini, Thandi Naidoo, Andile Mokoena', tax:'VAT 15%', extra:'Use SA terms (panel beater, geyser, load shedding awareness).' },
    NG: { currency:'NGN', symbol:'₦', law:'NDPA', cities:'Lagos, Abuja, Port Harcourt', names:'Adeola Bakare, Chinedu Okafor, Aisha Bello, Tunde Adeyemi', tax:'VAT 7.5%', extra:'Common payment: bank transfer, POS, USSD.' },
    KE: { currency:'KES', symbol:'KSh', law:'DPA Kenya', cities:'Nairobi, Mombasa, Kisumu', names:'Wanjiru Kamau, Otieno Onyango, Aisha Hassan, Brian Mutua', tax:'VAT 16%', extra:'Common payment: M-Pesa Paybill/Till.' },
    IN: { currency:'INR', symbol:'₹', law:'DPDP/PDPA', cities:'Mumbai, Bangalore, Delhi, Pune, Hyderabad', names:'Priya Sharma, Arjun Patel, Anjali Reddy, Vikram Iyer', tax:'GST 18%', extra:'Use UPI as primary payment method. Use Indian English.' },
    BR: { currency:'BRL', symbol:'R$', law:'LGPD', cities:'São Paulo, Rio de Janeiro, Belo Horizonte', names:'Carla Silva, João Santos, Ana Oliveira, Bruno Costa', tax:'IVA 17%', extra:'Use Portuguese where appropriate. Common payment: PIX.' },
    US: { currency:'USD', symbol:'$', law:'CCPA', cities:'New York, Los Angeles, Chicago, Houston', names:'Sarah Johnson, Michael Davis, Emily Rodriguez, Brandon Kim', tax:'sales tax 7%', extra:'Use US English (gas station, realtor, auto body shop).' },
    GB: { currency:'GBP', symbol:'£', law:'UK GDPR', cities:'London, Manchester, Birmingham', names:'Sarah Thompson, James Walker, Emma Patel, Oliver Smith', tax:'VAT 20%', extra:'Use UK English (estate agent, solicitor, petrol).' },
    AU: { currency:'AUD', symbol:'A$', law:'APP', cities:'Sydney, Melbourne, Brisbane', names:'Sarah Wilson, Liam Murphy, Chloe Nguyen, Jack Thompson', tax:'GST 10% (incl)', extra:'Use Aussie English (tradie, ute).' },
    CA: { currency:'CAD', symbol:'C$', law:'PIPEDA', cities:'Toronto, Vancouver, Montréal', names:'Sarah MacDonald, Michael Tremblay, Priya Singh, Jacob Brown', tax:'GST 13%', extra:'Acknowledge bilingual context.' },
    DE: { currency:'EUR', symbol:'€', law:'GDPR/DSGVO', cities:'Berlin, München, Hamburg', names:'Sarah Müller, Lukas Schmidt, Anna Weber, Felix Becker', tax:'VAT 19% (Mehrwertsteuer)', extra:'Decimal comma. Place € after the number.' },
  }
  const hint = COUNTRY_HINTS[country] || COUNTRY_HINTS.ZA

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

  // When the user analysed an existing site, audit.extracted carries the REAL
  // content lifted verbatim from the page. We must NOT invent content for any
  // section where extraction returned empty — leave those arrays empty so the
  // editor can show "add your real X here" placeholders.
  const isAuditMode = !!audit?.extracted
  const ex = audit?.extracted || {}
  const haveTestimonials = Array.isArray(ex.testimonials) && ex.testimonials.length > 0
  const haveTeam = Array.isArray(ex.team) && ex.team.length > 0
  const havePricing = Array.isArray(ex.pricing) && ex.pricing.length > 0
  const haveFaq = Array.isArray(ex.faq) && ex.faq.length > 0
  const haveServices = Array.isArray(ex.services) && ex.services.length > 0
  const haveAbout = !!ex.about

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')

    // Build the schema. In audit mode we mark whether to use extracted content.
    const inputSchema = {
      type: 'object',
      properties: {
        tagline: { type: 'string', description: isAuditMode ? 'Use the audit.tagline verbatim. Only clean up if grammatically broken.' : '6-10 word powerful tagline' },
        accentColor: { type: 'string', description: 'Hex color complementing primary' },
        fontHeading: { type: 'string', enum: ['Inter','Poppins','Raleway','Montserrat','Playfair Display','DM Sans'] },
        fontBody: { type: 'string', enum: ['Inter','Poppins','Nunito','DM Sans','Open Sans'] },
        borderRadius: { type: 'string', enum: ['none','small','medium','large','pill'] },
        style: { type: 'string', enum: ['light','dark'] },
        heroHeadline: { type: 'string', description: isAuditMode && ex.hero?.headline ? 'Use audit.extracted.hero.headline VERBATIM.' : 'A compelling headline' },
        heroSubtext: { type: 'string', description: isAuditMode && ex.hero?.subtext ? 'Use audit.extracted.hero.subtext VERBATIM.' : 'A supporting paragraph' },
        heroImage: { type: 'string', description: 'Unsplash photo URL relevant to industry' },
        ctaText: { type: 'string', description: 'Main button text' },
        stats: {
          type: 'array', minItems: 0, maxItems: 4,
          description: 'ONLY include stats that you can verify from the source content. If unsure, return an empty array — do NOT invent metrics.',
          items: { type: 'object', properties: { val: { type:'string' }, label: { type:'string' } }, required:['val','label'] }
        },
        services: {
          type: 'array',
          minItems: isAuditMode ? (haveServices ? ex.services.length : 0) : 3,
          maxItems: isAuditMode ? (haveServices ? ex.services.length : 0) : 8,
          description: isAuditMode
            ? (haveServices
                ? 'Use audit.extracted.services VERBATIM — exactly the same titles and descriptions, just add a relevant emoji icon for each. Same number of items.'
                : 'Source had no services section. Return an empty array. DO NOT INVENT.')
            : 'Industry-specific services with emoji icon, title, description.',
          items: { type: 'object', properties: { icon: { type:'string' }, title: { type:'string' }, desc: { type:'string' } }, required:['icon','title','desc'] }
        },
        features: {
          type: 'array', minItems: 0, maxItems: 4,
          description: isAuditMode ? 'OPTIONAL. Only include features (e.g. "Why choose us") if they are explicit on the source. Otherwise return empty array.' : '4 specific features',
          items: { type: 'object', properties: { title: { type:'string' }, desc: { type:'string' } }, required:['title','desc'] }
        },
        aboutHeading: { type: 'string' },
        aboutSubheading: { type: 'string' },
        aboutBody: { type: 'string', description: isAuditMode && haveAbout ? 'Use audit.extracted.about VERBATIM.' : '2-3 sentences about the business' },
        aboutBody2: { type: 'string', description: isAuditMode ? 'Leave empty if no second about paragraph was extracted.' : '2 sentences about what makes them different' },
        aboutImage: { type: 'string', description: 'Unsplash photo URL' },
        testimonials: {
          type: 'array',
          minItems: isAuditMode ? (haveTestimonials ? ex.testimonials.length : 0) : 3,
          maxItems: isAuditMode ? (haveTestimonials ? ex.testimonials.length : 0) : 3,
          description: isAuditMode
            ? (haveTestimonials
                ? 'Use audit.extracted.testimonials VERBATIM. Copy quote, name, role exactly. Do NOT invent any new ones.'
                : 'Source had no testimonials. Return an empty array. DO NOT INVENT testimonials — fabricated reviews are illegal in many jurisdictions and break customer trust.')
            : '3 realistic testimonials',
          items: { type:'object', properties:{ name:{type:'string'}, role:{type:'string'}, quote:{type:'string'}}, required:['name','role','quote'] }
        },
        team: {
          type: 'array',
          minItems: isAuditMode ? (haveTeam ? ex.team.length : 0) : 3,
          maxItems: isAuditMode ? (haveTeam ? ex.team.length : 0) : 3,
          description: isAuditMode
            ? (haveTeam
                ? 'Use audit.extracted.team VERBATIM. Same names, roles, bios. Do NOT invent any new team members.'
                : 'Source had no team section. Return an empty array. DO NOT INVENT employees.')
            : '3 team members',
          items: { type:'object', properties:{ name:{type:'string'}, role:{type:'string'}, bio:{type:'string'}}, required:['name','role','bio'] }
        },
        pricing: {
          type: 'array',
          minItems: isAuditMode ? (havePricing ? ex.pricing.length : 0) : 3,
          maxItems: isAuditMode ? (havePricing ? ex.pricing.length : 0) : 3,
          description: isAuditMode
            ? (havePricing
                ? 'Use audit.extracted.pricing VERBATIM. Same plan names, prices, features. Highlight the middle plan.'
                : 'Source had no pricing. Return an empty array. DO NOT INVENT prices.')
            : '3 pricing tiers',
          items: { type:'object', properties:{ name:{type:'string'}, price:{type:'string'}, period:{type:'string'}, features:{type:'array',items:{type:'string'}}, cta:{type:'string'}, highlighted:{type:'boolean'}}, required:['name','price','features','cta','highlighted'] }
        },
        faq: {
          type: 'array',
          minItems: isAuditMode ? (haveFaq ? ex.faq.length : 0) : 4,
          maxItems: isAuditMode ? (haveFaq ? ex.faq.length : 0) : 5,
          description: isAuditMode
            ? (haveFaq
                ? 'Use audit.extracted.faq VERBATIM. Same questions, same answers.'
                : 'Source had no FAQ. Return an empty array. DO NOT INVENT.')
            : '4-5 FAQs',
          items: { type:'object', properties:{ q:{type:'string'}, a:{type:'string'}}, required:['q','a'] }
        },
      },
      required: ['tagline','accentColor','fontHeading','fontBody','borderRadius','style','heroHeadline','heroSubtext','heroImage','ctaText','services','features','aboutHeading','aboutBody','aboutImage','testimonials','team','pricing','faq','stats']
    }

    // Use Claude's structured output via tool use - guarantees valid JSON
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      tools: [{
        name: 'build_website',
        description: 'Generate a complete multi-page website',
        input_schema: inputSchema,
      }],
      tool_choice: { type: 'tool', name: 'build_website' },
      messages: [{
        role: 'user',
        content: isAuditMode ? `You are organising the contents of an EXISTING REAL business website into a structured site spec.

═══════════════════════════════════════════════════════
CRITICAL RULE — NO INVENTION
═══════════════════════════════════════════════════════
This is a real business. Inventing testimonials, team members, prices, or facts that are not in the source is unacceptable. It would mislead the business owner and their customers, and fabricated reviews are illegal under the Consumer Protection Act in many countries.

Where the source has data, COPY IT VERBATIM. Where the source is silent, return an empty array. The editor will show a "[add your real X here]" placeholder.

You are ALLOWED to:
- Pick an ICON NAME (not emoji) for each service from this list, matching the service title: zap, star, check, check-circle, award, rocket, target, shield, lock, thumbs-up, clock, calendar, bolt, phone, mail, message, map-pin, users, briefcase, heart, trending-up, dollar, chart, wrench, paint, scissors, truck, code, cpu, cloud, smartphone, leaf, smile, home, scale, globe, search, settings, gift, lightbulb, sparkles, car.
- Pick fonts, border radius, style, accent color from the brand context.
- Pick a relevant Unsplash photo URL for the hero and about images.
- Pick a primary CTA button label that matches the call-to-action visible on the source.

═══════════════════════════════════════════════════════
SOURCE DATA (use VERBATIM where applicable)
═══════════════════════════════════════════════════════
Business: ${business.name}
Industry (inferred): ${business.industry}
Detected primary color: ${business.primaryColor}
Tagline (from source): ${audit?.tagline || ''}
Description (from source): ${business.description}

EXTRACTED HERO:
  Headline: "${ex.hero?.headline || ''}"
  Subtext: "${ex.hero?.subtext || ''}"

EXTRACTED ABOUT:
${ex.about ? `  "${ex.about}"` : '  (none — use empty aboutBody)'}

EXTRACTED SERVICES (${haveServices ? ex.services.length : 0}):
${haveServices ? ex.services.map(s => `  - ${s.title}: ${s.description}`).join('\n') : '  (none — return services: [])'}

EXTRACTED TESTIMONIALS (${haveTestimonials ? ex.testimonials.length : 0}):
${haveTestimonials ? ex.testimonials.map(t => `  - "${t.quote}" — ${t.name}${t.role ? ', ' + t.role : ''}`).join('\n') : '  (none — return testimonials: [])'}

EXTRACTED TEAM (${haveTeam ? ex.team.length : 0}):
${haveTeam ? ex.team.map(m => `  - ${m.name} (${m.role}): ${m.bio}`).join('\n') : '  (none — return team: [])'}

EXTRACTED PRICING (${havePricing ? ex.pricing.length : 0}):
${havePricing ? ex.pricing.map(p => `  - ${p.name}: ${p.price}${p.period ? ' ' + p.period : ''} — features: ${(p.features||[]).join('; ')}`).join('\n') : '  (none — return pricing: [])'}

EXTRACTED FAQ (${haveFaq ? ex.faq.length : 0}):
${haveFaq ? ex.faq.map(f => `  Q: ${f.q}\n  A: ${f.a}`).join('\n') : '  (none — return faq: [])'}

Country: ${country || 'ZA'} (use ${hint.currency} ${hint.symbol})

Use the build_website tool. Remember: VERBATIM where source data exists, EMPTY ARRAY where it does not.`
        : `Generate website content for "${business.name}" - a ${business.industry} business.

Description: ${business.description}
Services they offer: ${business.services}
Contact: phone ${business.phone}, email ${business.email}, located ${business.address}
Brand: ${business.tone} tone, primary color ${business.primaryColor}

Country: ${country || 'ZA'}
Currency: ${hint.currency} (symbol "${hint.symbol}")
Privacy law: ${hint.law}
Tax: ${hint.tax}
Use these realistic names: ${hint.names}
Reference these cities (when location-relevant): ${hint.cities}
${hint.extra}

DESIGN PERSONA: ${persona || 'minimal'}. ${personaHint}
${voiceBlock}
Write COMPELLING, INDUSTRY-SPECIFIC content. NOT generic placeholders. Every line should be specific to ${business.name} and ${business.industry}.

For testimonials: realistic local names from the list above, real-sounding company titles, specific quotes about ${business.industry}.
For team: realistic local names, appropriate roles, brief bios.
For services: pick an icon NAME from this list (NOT an emoji): zap, star, check, check-circle, award, rocket, target, shield, lock, thumbs-up, clock, calendar, bolt, phone, mail, message, map-pin, users, briefcase, heart, trending-up, dollar, chart, wrench, paint, scissors, truck, code, cpu, cloud, smartphone, leaf, smile, home, scale, globe, search, settings, gift, lightbulb, sparkles, car. Specific titles and descriptions.
For pricing: appropriate prices using "${hint.symbol}" symbol and ${hint.currency} amounts that match local market reality.
For images: real Unsplash URLs relevant to ${business.industry} (e.g. https://images.unsplash.com/photo-XXX?w=1400&q=80).
For stats: impressive but realistic for ${business.industry}.

Use the build_website tool to return your response.`
      }]
    })

    let toolInput = ''
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'input_json_delta') {
        const text = chunk.delta.partial_json
        if (text) {
          toolInput += text
          res.write(text)
        }
      }
    }
    res.end()
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ error: err.message })
    else res.end()
  }
}
