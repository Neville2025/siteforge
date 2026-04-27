import Anthropic from '@anthropic-ai/sdk'

export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'AI is not configured. Set ANTHROPIC_API_KEY in the deployment environment.' })

  const { sectionType, currentData, siteName, prompt, fields, brandVoice } = req.body
  if (!sectionType || !prompt) return res.status(400).json({ error: 'Missing required fields' })
  const voiceBlock = brandVoice && brandVoice.trim().length > 30
    ? `\n\nBRAND VOICE — match this tone:\n"""\n${String(brandVoice).slice(0, 1500)}\n"""\nUse the same vocabulary, sentence length, and energy.`
    : ''

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const fieldList = (fields || []).map(f => `${f.key} (${f.type}): ${f.label}`).join('\n')

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      tools: [{
        name: 'update_section',
        description: 'Return the updated data fields for this website section',
        input_schema: {
          type: 'object',
          properties: {
            updates: {
              type: 'object',
              description: 'An object whose keys are the section field keys to update. Only include keys that should change. For list fields return the COMPLETE new array, matching the existing structure exactly.'
            }
          },
          required: ['updates']
        }
      }],
      tool_choice: { type: 'tool', name: 'update_section' },
      messages: [{
        role: 'user',
        content: `You are helping edit a website section. Update the section data based on the user's request.

SITE: ${siteName}
SECTION TYPE: ${sectionType}

AVAILABLE FIELDS:
${fieldList}

CURRENT DATA:
${JSON.stringify(currentData, null, 2)}

USER REQUEST: ${prompt}
${voiceBlock}
Use the update_section tool to return the updates. Only include fields that should change. Match the existing data structure exactly. Be specific — write real industry-relevant copy, not generic placeholders.`
      }]
    })

    const toolUse = message.content.find(c => c.type === 'tool_use')
    if (!toolUse) return res.status(500).json({ error: 'AI did not return a structured response. Try rephrasing.' })
    res.json({ updatedData: toolUse.input.updates || {} })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
