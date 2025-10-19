// server.js
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai'); // npm install @google/genai
require('dotenv').config();

const app = express();
const port = 3001;

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error("FATAL: GEMINI_API_KEY environment variable not set.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: geminiApiKey });

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const tarotCardSchema = {
  type: "array",
  description: "An array of 3 tarot cards drawn for the user.",
  items: {
    type: "object",
    properties: {
      name: { type: "string", description: "Tarot card name" },
      arcana: { type: "string", description: "Major or Minor" },
      summary: { type: "string", description: "One-sentence meaning" },
      revealed: { type: "boolean", description: "Always false (frontend reveals)" }
    },
    required: ["name", "arcana", "summary", "revealed"]
  }
};

app.post('/api/draw-cards', async (req, res) => {
  try {
    const prompt = "Draw three random tarot cards (Major or Minor Arcana) for a general reading. Provide their names, whether they are Major or Minor Arcana, and a brief summary of their meaning. Respond strictly as a JSON array of card objects, no extra text.";
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: tarotCardSchema,
      },
    });

    const cards = JSON.parse(response.text);
    res.json(cards);
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to draw tarot cards.' });
  }
});

app.listen(port, () => console.log(`Backend running at http://localhost:${port}`));
