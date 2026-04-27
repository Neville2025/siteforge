import Anthropic from '@anthropic-ai/sdk'

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'AI is not configured. Set ANTHROPIC_API_KEY in the deployment environment.' })

  const { name, industry, description, services, phone, email, address, primaryColor, secondaryColor, tone, audit, country } = req.body

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

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')

    // Use Claude's structured output via tool use - guarantees valid JSON
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      tools: [{
        name: 'build_website',
        description: 'Generate a complete multi-page website',
        input_schema: {
          type: 'object',
          properties: {
            tagline: { type: 'string', description: '6-10 word powerful tagline' },
            accentColor: { type: 'string', description: 'Hex color complementing primary' },
            fontHeading: { type: 'string', enum: ['Inter','Poppins','Raleway','Montserrat','Playfair Display','DM Sans'] },
            fontBody: { type: 'string', enum: ['Inter','Poppins','Nunito','DM Sans','Open Sans'] },
            borderRadius: { type: 'string', enum: ['none','small','medium','large','pill'] },
            style: { type: 'string', enum: ['light','dark'] },
            heroHeadline: { type: 'string' },
            heroSubtext: { type: 'string' },
            heroImage: { type: 'string', description: 'Unsplash photo URL relevant to industry' },
            ctaText: { type: 'string', description: 'Main button text' },
            stats: {
              type: 'array', minItems: 4, maxItems: 4,
              items: { type: 'object', properties: { val: { type:'string' }, label: { type:'string' } }, required:['val','label'] }
            },
            services: {
              type: 'array', minItems: 3, maxItems: 3,
              items: { type: 'object', properties: { icon: { type:'string' }, title: { type:'string' }, desc: { type:'string' } }, required:['icon','title','desc'] }
            },
            features: {
              type: 'array', minItems: 4, maxItems: 4,
              items: { type: 'object', properties: { title: { type:'string' }, desc: { type:'string' } }, required:['title','desc'] }
            },
            aboutHeading: { type: 'string' },
            aboutSubheading: { type: 'string' },
            aboutBody: { type: 'string', description: '2-3 sentences about the business' },
            aboutBody2: { type: 'string', description: '2 sentences about what makes them different' },
            aboutImage: { type: 'string', description: 'Unsplash photo URL' },
            testimonials: {
              type: 'array', minItems: 3, maxItems: 3,
              items: { type:'object', properties:{ name:{type:'string'}, role:{type:'string'}, quote:{type:'string'}}, required:['name','role','quote'] }
            },
            team: {
              type: 'array', minItems: 3, maxItems: 3,
              items: { type:'object', properties:{ name:{type:'string'}, role:{type:'string'}, bio:{type:'string'}}, required:['name','role','bio'] }
            },
            pricing: {
              type: 'array', minItems: 3, maxItems: 3,
              items: { type:'object', properties:{ name:{type:'string'}, price:{type:'string'}, period:{type:'string'}, features:{type:'array',items:{type:'string'}}, cta:{type:'string'}, highlighted:{type:'boolean'}}, required:['name','price','features','cta','highlighted'] }
            },
            faq: {
              type: 'array', minItems: 4, maxItems: 5,
              items: { type:'object', properties:{ q:{type:'string'}, a:{type:'string'}}, required:['q','a'] }
            },
          },
          required: ['tagline','accentColor','fontHeading','fontBody','borderRadius','style','heroHeadline','heroSubtext','heroImage','ctaText','stats','services','features','aboutHeading','aboutBody','aboutImage','testimonials','team','pricing','faq']
        }
      }],
      tool_choice: { type: 'tool', name: 'build_website' },
      messages: [{
        role: 'user',
        content: `Generate website content for "${business.name}" - a ${business.industry} business.

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

Write COMPELLING, INDUSTRY-SPECIFIC content. NOT generic placeholders. Every line should be specific to ${business.name} and ${business.industry}.

For testimonials: realistic local names from the list above, real-sounding company titles, specific quotes about ${business.industry}.
For team: realistic local names, appropriate roles, brief bios.
For services: industry-specific icons (emojis), specific titles and descriptions.
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
