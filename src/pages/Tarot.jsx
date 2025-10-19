import { useState } from "react";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";

const tarotDeck = [
  { name: "The Sun", meaning: "Success, vitality, joy", emoji: "☀️" },
  { name: "The Moon", meaning: "Intuition, illusion, dreams", emoji: "🌙" },
  { name: "The Star", meaning: "Hope, inspiration, serenity", emoji: "⭐" },
  { name: "The Fool", meaning: "New beginnings, trust, adventure", emoji: "🃏" },
  { name: "The Lovers", meaning: "Connection, harmony, choice", emoji: "💞" },
  { name: "The Tower", meaning: "Change, revelation, awakening", emoji: "⚡" },
  { name: "Death", meaning: "Transformation, endings, renewal", emoji: "💀" },
  { name: "Justice", meaning: "Truth, fairness, cause and effect", emoji: "⚖️" },
  { name: "The Magician", meaning: "Manifestation, power, resourcefulness", emoji: "🪄" },
];

export default function Tarot() {
  const [card, setCard] = useState(null);
  const [drawing, setDrawing] = useState(false);

  const drawCard = () => {
    const random = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    setDrawing(true);
    setTimeout(() => {
      setCard(random);
      setDrawing(false);
    }, 900); // simulate draw delay
  };

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

        {/* card container */}
        <motion.div
          className="relative w-72 h-96 cursor-pointer select-none perspective"
          onClick={drawCard}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl bg-[#12002b]/50 border border-yellow-200/20 shadow-[0_0_50px_rgba(255,255,200,0.1)] flex flex-col items-center justify-center backface-hidden"
            animate={{ rotateY: drawing ? 180 : 0 }}
            transition={{ duration: 0.8 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {!card ? (
              <p className="text-yellow-100/70 italic">Tap to reveal your destiny...</p>
            ) : (
              <>
                <div className="text-6xl mb-4">{card.emoji}</div>
                <h2 className="text-2xl font-bold text-yellow-300">{card.name}</h2>
                <p className="text-yellow-100/70 mt-2">{card.meaning}</p>
              </>
            )}
          </motion.div>

          {drawing && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#0b001f]/70 border border-yellow-200/20 text-yellow-300 text-2xl font-semibold"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 180 }}
              transition={{ duration: 0.8 }}
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            >
              🔮 Drawing...
            </motion.div>
          )}
        </motion.div>

        <p className="mt-8 text-sm text-yellow-100/60 italic">
          “The cards reveal not your fate, but your reflection.”
        </p>
      </section>
    </main>
  );
}
