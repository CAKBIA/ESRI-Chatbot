// api/chat.js
// We use the stable SDK: @google/generative-ai
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // 1. Check method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Check API Key
  const apiKey = process.env.ESRIChatbot;
  if (!apiKey) {
    console.error("Error: ESRIChatbot environment variable is missing.");
    return res.status(500).json({ error: 'Server configuration error: API Key missing.' });
  }

  // 3. Get Prompt
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body.' });
  }

  try {
    // 4. Call Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Send text back
    return res.status(200).json({ text: text });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'AI Generation Failed', details: error.message });
  }
}
