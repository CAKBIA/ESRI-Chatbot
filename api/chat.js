// api/chat.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // 1. CORS and Method Check
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. API Key Check
  const apiKey = process.env.ESRIChatbot;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server Error: API Key is missing in Vercel.' });
  }

  // 3. Input Check
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Client Error: No prompt provided.' });
  }

  try {
    // 4. Setup Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We use 'gemini-1.5-flash' which works with this SDK version
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 5. Generate Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Success Response
    return res.status(200).json({ text: text });

  } catch (error) {
    console.error('Google AI Error:', error);
    // Return the specific error message for debugging
    return res.status(500).json({ error: error.message });
  }
}
