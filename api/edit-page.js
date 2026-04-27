import Anthropic from '@anthropic-ai/sdk'

export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'AI is not configured. Set ANTHROPIC_API_KEY in the deployment environment.' })

  const { sections, instruction, businessName, industry } = req.body
  if (!sections || !instruction) return res.status(400).json({ error: 'sections and instruction required' })

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')

    // Use tool use for guaranteed valid JSON
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      tools: [{
        name: 'update_page',
        description: 'Update sections on a page based on user instruction',
        input_schema: {
          type: 'object',
          properties: {
            updates: {
              type: 'array',
              description: 'Array of section updates. Only include sections that need changes.',
              items: {
                type: 'object',
                properties: {
                  sectionIndex: { type: 'integer', description: 'Index of section in the original array (0-based)' },
                  data: { type: 'object', description: 'New data object for this section. Match the original schema exactly.' }
                },
                required: ['sectionIndex', 'data']
              }
            }
          },
          required: ['updates']
        }
      }],
      tool_choice: { type: 'tool', name: 'update_page' },
      messages: [{
        role: 'user',
        content: `You are editing a page on a website for "${businessName || 'a business'}" (${industry || 'unknown industry'}).

Current sections on this page (with index numbers):
${sections.map((s, i) => `${i}. ${s.type} — current data: ${JSON.stringify(s.data).slice(0, 600)}`).join('\n\n')}

User instruction: ${instruction}

Apply this instruction by updating the relevant section(s). Only return sections that need changes. Match the EXACT data structure of each section type. Be specific — write real industry-relevant copy, not generic placeholders.

Use the update_page tool.`
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
