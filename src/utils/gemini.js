import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzePurchase(description, amount) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are part of a celestial-themed wellbeing budgeting app called Astronomics.
    Given a transaction description and amount, respond concisely with its likely emotional or financial "aura."
    Example:
    - "Coffee, $5" → "+5 Joy ☕"
    - "Rent, $900" → "-5 Energy 🏠"
    - "Paycheck, $400" → "+8 Growth 💰"
    Keep it under 20 characters and use emojis.
    Transaction: "${description}", $${amount}
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim() || "Neutral ⚪";
  } catch (err) {
    console.error("Gemini API error:", err);
    return "Neutral ⚪";
  }
}
