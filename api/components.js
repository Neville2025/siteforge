export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const TWENTY_FIRST_KEY = process.env.TWENTY_FIRST_KEY
  if (!TWENTY_FIRST_KEY) return res.status(500).json({ error: 'Component search is not configured. Set TWENTY_FIRST_KEY in the deployment environment.' })

  const { query } = req.query
  if (!query) return res.status(400).json({ error: 'query required' })

  try {
    const r = await fetch(`https://api.21st.dev/api/search?query=${encodeURIComponent(query)}&api_key=${TWENTY_FIRST_KEY}`)
    const data = await r.json()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
