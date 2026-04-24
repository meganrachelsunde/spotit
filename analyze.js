// Vercel serverless function — proxies the Claude API so the key stays server-side.
// Put this file at: /api/analyze.js in your spotit project.
// Set ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables.

export default async function handler(req, res) {
  // CORS for local testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: 'Missing ANTHROPIC_API_KEY. Add it in Vercel → Settings → Environment Variables, then redeploy.'
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('spotit api error', err);
    return res.status(500).json({ error: err.message || 'Something broke server-side.' });
  }
}
