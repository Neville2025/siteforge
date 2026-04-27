import Anthropic from '@anthropic-ai/sdk'

export const config = { maxDuration: 45 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'AI is not configured. Set ANTHROPIC_API_KEY in the deployment environment.' })

  const { site } = req.body || {}
  if (!site || !Array.isArray(site.pages)) return res.status(400).json({ error: 'site state required' })

  // Trim the snapshot for token budget.
  const snapshot = {
    name: site.name,
    tagline: site.tagline,
    country: site.country,
    theme: site.theme,
    hasLogo: !!site.logo,
    hasFavicon: !!site.favicon,
    widgetEnabled: !!site.widget?.enabled,
    pages: site.pages.map(p => ({
      name: p.name,
      sections: p.sections.map(s => ({
        type: s.type,
        data: typeof s.data === 'object' ? Object.fromEntries(
          Object.entries(s.data || {}).map(([k, v]) => [k, typeof v === 'string' ? v.slice(0, 200) : v])
        ) : s.data
      }))
    }))
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2500,
      tools: [{
        name: 'audit',
        description: 'Audit a website and return a score plus prioritized fixes.',
        input_schema: {
          type: 'object',
          properties: {
            score: { type: 'integer', minimum: 0, maximum: 100, description: 'Overall conversion + completeness score out of 100.' },
            grade: { type: 'string', enum: ['A','B','C','D','F'], description: 'Letter grade matching the score.' },
            summary: { type: 'string', description: '1-2 sentences summary of the site\'s state.' },
            categories: {
              type: 'array', minItems: 4, maxItems: 6,
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'e.g. Copy, Trust signals, SEO, Conversion, Visual design, Completeness' },
                  score: { type: 'integer', minimum: 0, maximum: 100 },
                  note: { type: 'string', description: 'One sentence explaining the score.' }
                },
                required: ['name','score','note']
              }
            },
            fixes: {
              type: 'array', minItems: 5, maxItems: 10,
              items: {
                type: 'object',
                properties: {
                  priority: { type: 'string', enum: ['high','medium','low'] },
                  title: { type: 'string', description: 'Short imperative title (max 70 chars).' },
                  reason: { type: 'string', description: '1-2 sentences why this matters.' },
                },
                required: ['priority','title','reason']
              }
            }
          },
          required: ['score','grade','summary','categories','fixes']
        }
      }],
      tool_choice: { type: 'tool', name: 'audit' },
      messages: [{
        role: 'user',
        content: `Audit this website and produce a score + prioritized fixes. Be honest — if the site is using mostly default placeholder copy, the score should reflect that.

Score categories like a senior conversion-focused designer would: Copy quality and specificity, Trust signals (testimonials, team, social proof), SEO + completeness (privacy policy, contact details, JSON-LD-friendly fields), Conversion (clear CTAs, contact methods), Visual design coherence, Industry/country fit (does the content sound generic or local?).

Country profile: ${snapshot.country || 'ZA'}

SITE SNAPSHOT:
${JSON.stringify(snapshot).slice(0, 14000)}

Return via the audit tool. Fixes must be specific and actionable — name the section, name the change.`
      }]
    })

    const toolUse = message.content.find(c => c.type === 'tool_use')
    if (!toolUse) return res.status(500).json({ error: 'AI did not return a structured response.' })
    res.json(toolUse.input)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
