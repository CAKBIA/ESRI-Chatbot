// /api/chat.js
// THIS VERSION IS FOR GOOGLE GEMINI

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Get the API Key from Vercel Environment Variables
    // MAKE SURE your variable in Vercel is named "ESRIChatbot"
    const apiKey = process.env.ESRIChatbot; 

    if (!apiKey) {
      return res.status(500).json({ error: "Server Error: Missing API Key in Vercel" });
    }

    // 3. Get the user input
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: "No input provided" });
    }

    // 4. Call Google Gemini API (Using the stable 1.5 Flash model)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userInput }] }]
      })
    });

    const data = await response.json();

    // 5. Check for errors from Google
    if (data.error) {
        throw new Error(data.error.message || "Unknown error from Google Gemini");
    }

    // 6. Extract the text answer
    // Gemini hides the text deep in this structure: candidates[0].content.parts[0].text
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
        throw new Error("Gemini returned no text.");
    }

    // 7. Send back to frontend
    // We wrap it in this specific structure so your script.js works without changes
    res.status(200).json({ 
        choices: [
            { message: { content: aiText } }
        ] 
    });

  } catch (err) {
    console.error("API route error:", err);
    res.status(500).json({ error: err.message });
  }
}
