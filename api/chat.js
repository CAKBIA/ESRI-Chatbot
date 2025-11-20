// /api/chat.js  (Vercel Serverless API Route)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'Missing userInput' });
    }

    const apiKey = process.env.XAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key missing on server' });
    }

    const aiRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [{ role: "user", content: userInput }]
      })
    });

    const data = await aiRes.json();
    return res.status(aiRes.status).json(data);

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
