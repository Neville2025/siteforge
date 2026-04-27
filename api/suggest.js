import Anthropic from '@anthropic-ai/sdk'

export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'AI is not configured. Set ANTHROPIC_API_KEY in the deployment environment.' })

  const { site, activePageId } = req.body || {}
  if (!site || !Array.isArray(site.pages)) return res.status(400).json({ error: 'site state required' })

  const activePage = site.pages.find(p => p.id === activePageId) || site.pages[0]

  // Trim the site snapshot so we stay well within token budget.
  const snapshot = {
    name: site.name,
    tagline: site.tagline,
    theme: site.theme,
    pages: site.pages.map(p => ({
      name: p.name,
      sections: p.sections.map(s => ({
        id: s.id,
        type: s.type,
        data: typeof s.data === 'object' ? Object.fromEntries(
          Object.entries(s.data || {}).map(([k, v]) => {
            if (typeof v === 'string') return [k, v.slice(0, 240)]
            return [k, v]
          })
        ) : s.data
      }))
    }))
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      tools: [{
        name: 'recommend',
        description: 'Return 5 concrete, actionable recommendations to improve this website.',
        input_schema: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array', minItems: 3, maxItems: 6,
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string', description: 'Short headline of the suggestion (max 60 chars).' },
                  reason: { type: 'string', description: 'One or two sentences explaining why this helps the business.' },
                  action: {
                    type: 'string',
                    enum: ['add-section','replace-section-data','set-theme','edit-page','note'],
                    description: 'What kind of change to apply.'
                  },
                  payload: {
                    type: 'object',
                    description: 'Action-specific data. For add-section: { type: "hero|services|stats|features|about|testimonials|gallery|pricing|team|faq|cta|contact" }. For replace-section-data: { sectionId: "<id from snapshot>", data: { fieldKey: newValue, ... } }. For set-theme: a partial theme object (primaryColor, secondaryColor, fontHeading, fontBody, borderRadius, style). For edit-page or note: empty.'
                  }
                },
                required: ['title','reason','action']
              }
            }
          },
          required: ['suggestions']
        }
      }],
      tool_choice: { type: 'tool', name: 'recommend' },
      messages: [{
        role: 'user',
        content: `You are a senior conversion-focused web designer reviewing this client's website. Return 5 concrete, prioritized recommendations.

CURRENT SITE STATE (JSON):
${JSON.stringify(snapshot).slice(0, 12000)}

ACTIVE PAGE: ${activePage?.name}

Recommendations should be tactical and specific. Mix of:
- Missing sections that would help conversion (e.g. "Add a Pricing section to your Services page" with payload {type:'pricing'}).
- Weak copy to rewrite (use replace-section-data with sectionId from the snapshot above and a partial data object with new field values).
- Theme issues (e.g. low-contrast or generic colors → set-theme).
- Sections that are still using default/generic copy and need to be made specific to the business.
- Industry-appropriate suggestions based on the business name and what's already on the site.

Be specific — don't say "improve copy", say WHAT to change to WHAT new value. For replace-section-data, write the actual new copy in the payload, ready to apply with one click.

Return via the recommend tool.`
      }]
    })

    const toolUse = message.content.find(c => c.type === 'tool_use')
    if (!toolUse) return res.status(500).json({ error: 'AI did not return a structured response.' })
    res.json({ suggestions: toolUse.input.suggestions || [] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
