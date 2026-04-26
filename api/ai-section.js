import Anthropic from '@anthropic-ai/sdk'

export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { sectionType, currentData, siteName, prompt, fields } = req.body
  if (!sectionType || !prompt) return res.status(400).json({ error: 'Missing required fields' })

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const fieldList = (fields || []).map(f => `${f.key} (${f.type}): ${f.label}`).join('\n')

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
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

Return a JSON object with the updated fields ONLY (don't include unchanged fields). For "list" type fields, return the COMPLETE new array. Match the existing data structure exactly.

Return ONLY the JSON object, no markdown, no explanation. Format:
{ "fieldKey": "new value", "anotherField": [...] }`
      }]
    })

    const raw = message.content[0].text.trim().replace(/^```json\n?|```$/g, '').trim()
    let updatedData
    try { updatedData = JSON.parse(raw) }
    catch { return res.status(500).json({ error: 'AI returned invalid format. Try rephrasing.' }) }

    res.json({ updatedData })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
