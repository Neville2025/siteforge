import Anthropic from '@anthropic-ai/sdk'

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'AI is not configured. Set ANTHROPIC_API_KEY in the deployment environment.' })

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

Write COMPELLING, INDUSTRY-SPECIFIC content. NOT generic placeholders. Every line should be specific to ${business.name} and ${business.industry}.

For testimonials: realistic South African names, real-sounding company titles, specific quotes about ${business.industry}.
For team: realistic names, appropriate roles, brief bios.
For services: industry-specific icons (emojis), specific titles and descriptions.
For pricing: appropriate prices in ZAR.
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
