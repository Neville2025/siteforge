const TWENTY_FIRST_KEY = 'an_sk_f5835a496ebb15a8abe2b11dae3de1a37915ac38a1feee3163be371f0822623b'

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

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
