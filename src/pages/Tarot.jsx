import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the SDK
import NavBar from "../components/NavBar"; // Assuming you have this component

// Initialize Gemini API client directly on the frontend
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!geminiApiKey) {
    console.error("FATAL: VITE_GEMINI_API_KEY environment variable not set. Please check your .env file.");
    // In a real app, you might disable API features or show an error to the user.
}

const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

// Initial state for the cards (three face-down cards before any draw)
const initialCards = [
    { name: "Card 1", arcana: "Major", summary: "Tap 'Draw Cards' to begin your reading.", emoji: "🎴", revealed: false },
    { name: "Card 2", arcana: "Major", summary: "Tap 'Draw Cards' to begin your reading.", emoji: "🎴", revealed: false },
    { name: "Card 3", arcana: "Major", summary: "Tap 'Draw Cards' to begin your reading.", emoji: "🎴", revealed: false },
];

// JSON Schema for reliable generation (replicated for frontend use)
const tarotCardSchema = {
    type: "array",
    description: "An array of 3 tarot cards drawn for the user.",
    items: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "The name of the Major or Minor Arcana tarot card (e.g., 'The Tower', 'Five of Swords')."
            },
            arcana: {
                type: "string",
                description: "The type of arcana, either 'Major' or 'Minor'."
            },
            summary: {
                type: "string",
                description: "A concise, one-sentence description of the card's meaning in a reading."
            },
            emoji: {
                type: "string",
                description: "A single, relevant emoji for the card (e.g., '☀️', '🌙', '💀')."
            },
        },
        required: ["name", "arcana", "summary", "emoji"]
    }
};


// --- Card Component (to handle individual card display and flip) ---
const TarotCardDisplay = ({ card, index, onReveal }) => {
    const commonFlipProps = {
        transition: { duration: 0.8, ease: "easeInOut" },
        style: { transformStyle: "preserve-3d" },
        initial: { rotateY: 0 },
    };

    return (
        <motion.div
            className="relative w-64 h-96 cursor-pointer select-none perspective-1000"
            onClick={() => onReveal(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Card Back */}
            <motion.div
                {...commonFlipProps}
                animate={{ rotateY: card.revealed ? 180 : 0 }}
                className="absolute inset-0 rounded-2xl bg-[#12002b]/50 border border-yellow-200/20 shadow-[0_0_50px_rgba(255,255,200,0.1)] flex flex-col items-center justify-center backface-hidden"
            >
                 <p className="text-yellow-100/70 italic text-2xl font-bold">ARCANA</p>
                 <span className="text-6xl mt-4 text-yellow-300">🎴</span>
            </motion.div>

            {/* Card Front */}
            <motion.div
                {...commonFlipProps}
                animate={{ rotateY: card.revealed ? 0 : -180 }}
                className="absolute inset-0 rounded-2xl bg-[#0b001f]/70 border border-yellow-200/20 text-yellow-300 flex flex-col items-center justify-center p-6 text-center backface-hidden"
            >
                <div className="text-6xl mb-4">{card.emoji}</div>
                <h2 className="text-2xl font-bold text-yellow-300">{card.name}</h2>
                <p className="text-yellow-100/70 mt-2 text-sm">{card.summary}</p>
            </motion.div>
        </motion.div>
    );
};


// --- Main Tarot Component ---
export default function Tarot() {
    const [cards, setCards] = useState(initialCards);
    const [drawing, setDrawing] = useState(false);
    const [error, setError] = useState(null);
    const [hasDrawn, setHasDrawn] = useState(false);

    const handleDrawCards = useCallback(async () => {
        if (!genAI) {
            setError("API key not configured. Cannot draw cards.");
            return;
        }

        setDrawing(true);
        setError(null);
        setCards(initialCards.map(card => ({...card, revealed: false})));
        setHasDrawn(false);

        try {
            const prompt = `
            Generate a three-card tarot reading for a stock market outlook. Each card should represent a data-driven signal or trend relevant to financial analysis, interpreted mystically. For each card, provide:
            1. "name": The name of the Major or Minor Arcana tarot card (e.g., 'The Tower', 'Five of Swords').
            2. "arcana": The type of arcana, either 'Major' or 'Minor'.
            3. "summary": A concise, one-sentence mystical interpretation of the card's meaning as it relates to stock market trends or investor sentiment (e.g., "The Fool signifies new opportunities or risky trades ahead.", "The Tower warns of sudden market drops or unexpected upheavals.", "The Star indicates promising growth, optimism, or a period of recovery.", "The Hermit suggests a time for caution, observation, or holding investments.").
            4. "emoji": A single, relevant emoji for the card.
            Do not include introductory or concluding text, only the JSON structure.
            `;
            // --- IMPORTANT CHANGE HERE ---
            // Specify 'gemini-2.5-flash' as the model
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash', 
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: tarotCardSchema,
                },
            });
            // --- END IMPORTANT CHANGE ---

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const newCards = JSON.parse(response.text());

            setTimeout(() => {
                setCards(newCards.map(card => ({...card, revealed: false}))); // Ensure 'revealed' is false
                setHasDrawn(true);
                setDrawing(false);
            }, 900); 

        } catch (err) {
            console.error('Gemini API Error:', err);
            setError(`Failed to draw cards: ${err.message || 'Unknown error'}.`);
            setDrawing(false);
        }
    }, []);

    const handleRevealCard = useCallback((indexToReveal) => {
        if (!hasDrawn || drawing) return;

        setCards(prevCards => 
            prevCards.map((card, index) => 
                index === indexToReveal ? { ...card, revealed: !card.revealed } : card
            )
        );
    }, [hasDrawn, drawing]);

    const handleResetDraw = useCallback(() => {
        setCards(initialCards);
        setHasDrawn(false);
        setError(null);
    }, []);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-[#080015] via-[#0a0130] to-black text-white overflow-hidden">
            <NavBar />

            {/* soft nebula background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,200,0.07),transparent_70%)] blur-3xl animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(100,100,255,0.1),transparent_60%)] blur-3xl animate-pulse" />

            <section className="z-10 text-center px-6 mt-20">
                <h1 className="text-4xl font-bold text-yellow-300 drop-shadow-[0_0_15px_rgba(255,255,150,0.4)] mb-8">
                    ✦ Daily Cosmic Reading ✦
                </h1>

                <div className="flex flex-wrap justify-center gap-8 mb-8">
                    {cards.map((card, index) => (
                        <TarotCardDisplay
                            key={index}
                            card={card}
                            index={index}
                            onReveal={handleRevealCard}
                        />
                    ))}
                </div>

                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={handleDrawCards}
                        disabled={drawing}
                        className="py-3 px-8 bg-yellow-400 text-[#0a0130] font-bold rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {drawing ? 'Shuffling...' : hasDrawn ? 'Draw New Cards' : 'Begin Your Reading'}
                    </button>
                    {hasDrawn && (
                        <button
                            onClick={handleResetDraw}
                            disabled={drawing}
                            className="py-3 px-8 bg-gray-600 text-white font-bold rounded-full shadow-lg hover:bg-gray-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {error && <p className="text-red-400 mt-4 text-sm font-semibold">{error}</p>}

                {hasDrawn && !drawing && (
                    <p className="mt-8 text-sm text-yellow-100/60 italic">
                        Tap any card to reveal its cosmic wisdom.
                    </p>
                )}

                <p className="mt-8 text-sm text-yellow-100/60 italic">
                    “The cards reveal not your fate, but your reflection.”
                </p>
            </section>
        </main>
    );
}