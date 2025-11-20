export default async function handler(req, res) {
  try {
    const apiKey = process.env.ESRIChatbot; // your Vercel key

    if (!apiKey) {
      return res.status(500).json({ error: "Missing ESRIChatbot API key" });
    }

    const { userInput, esriKnowledgeBase } = req.body;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "grok-4-latest",
        messages: [
          { role: "system", content: `You are BIA Geo-Assist. Use the knowledge base:\n\n${esriKnowledgeBase}` },
          { role: "user", content: userInput }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    res.status(200).json({ text: data.choices[0].message.content });

  } catch (err) {
    console.error("API route error:", err);
    res.status(500).json({ error: err.message });
  }
}
