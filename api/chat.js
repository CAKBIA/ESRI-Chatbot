import { GoogleGenerativeAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.ESRIChatbot;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key is missing in Vercel Settings.' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is missing.' });
  }

  try {
    const genAI = new GoogleGenerativeAI({ apiKey });
    
    // FIX: Use 'gemini-1.5-flash-001' which is the specific stable version identifier
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text: text });

  } catch (error) {
    console.error('Google API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
