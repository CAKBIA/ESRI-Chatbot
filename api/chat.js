// api/chat.js
import { GoogleGenAI } from '@google/genai';

// 1. This variable is only accessible inside this function on the server.
const apiKey = process.env.ESRIChatbot; 
const ai = new GoogleGenAI(apiKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get the prompt from the client's request body
  const { prompt } = req.body; 

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body.' });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-001",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // 2. Send the clean response back to your client-side code
    res.status(200).json({ text: response.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error('Serverless Function Error:', error);
    res.status(500).json({ error: 'Failed to generate content from Google AI.' });
  }
}
