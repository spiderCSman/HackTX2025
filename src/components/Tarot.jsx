import React, { useEffect, useMemo, useState, useCallback } from "react";
import "../assets/global.css";

const STORAGE_KEY = "tarot_cards_state_v1";
const MODEL = "gemini-2.5-flash"; // fast JSON-capable model

async function generateCardsWithGemini(n = 3) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY env var");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `You are a tarot master and creative storyteller. 
                Invent ${n} unique tarot cards as if they belonged to a brand new deck inspired by both ancient mysticism and modern life.
                Each card should have:
                - "name": a poetic or symbolic card title (e.g., "The Fool", "The Architect of Dreams").
                - "arcana": "Major" or "Minor".
                - "suit": if Minor Arcana, choose from Cups, Wands, Swords, or Pentacles; if Major, use null.
                - "keywords": a few evocative keywords (1–5 words).
                - "upright_meaning": a short paragraph describing the card’s upright meaning.
                - "reversed_meaning": a short paragraph describing the reversed interpretation.
                - "imagery": a vivid, imaginative scene describing the card’s visual design and symbolism.
                Return ONLY valid JSON as an array of objects, no markdown or extra text. Example:
                [
                {
                    "name": "The Fool",
                    "arcana": "Major",
                    "suit": null,
                    "keywords": ["beginnings", "adventure", "innocence"],
                    "upright_meaning": "Represents new journeys and trust in the unknown.",
                    "reversed_meaning": "Warns against recklessness and ignoring consequences.",
                    "imagery": "A carefree traveler stands on a cliff’s edge beneath a rising sun, a white dog at their heels."
                }
                ]`,

          },
        ],
      },
    ],
    generationConfig: {
      response_mime_type: "application/json",
      temperature: 0.8,
    },
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Gemini error ${resp.status}: ${t}`);
  }

  const data = await resp.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no content");

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Gemini did not return valid JSON");
    parsed = JSON.parse(match[0]);
  }

  return parsed.map((c, i) => ({ id: i + 1, name: c.name, description: c.description, revealed: false }));
}

export default function Tarot({ maxReveals = null, count = 3 }) {
  // Start with NO preset cards
  const [cards, setCards] = useState([]);
  const [loadingAI, setLoadingAI] = useState(true);
  const [errorAI, setErrorAI] = useState("");

  const revealedCount = useMemo(() => cards.filter((c) => c.revealed).length, [cards]);
  const canRevealMore = maxReveals == null || revealedCount < maxReveals;

  const onGenerate = useCallback(async () => {
    setLoadingAI(true);
    setErrorAI("");
    try {
      const aiCards = await generateCardsWithGemini(count);
      setCards(aiCards);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(aiCards)); } catch {}
    } catch (err) {
      console.error(err);
      setErrorAI(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingAI(false);
    }
  }, [count]);

  // Generate on first mount (AI-only deck)
  useEffect(() => {
    // Clear any prior saved deck so we don't load presets
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    onGenerate();
  }, [onGenerate]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cards)); } catch {}
  }, [cards]);

  const revealCard = (id) => {
    if (!canRevealMore) return;
    setCards((prev) => prev.map((card) => (card.id === id ? { ...card, revealed: true } : card)));
  };

  const handleCardActivate = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      revealCard(id);
    }
  };

  const onShuffle = () => {
    setCards((prev) => {
      const a = prev.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    });
  };

  const onReset = () => {
    setCards((prev) => prev.map((c) => ({ ...c, revealed: false })));
  };

  const allRevealed = cards.every((c) => c.revealed);

  return (
    <div className="tarot-wrap">
      <header className="tarot-header" aria-live="polite">
        <h1>Tarot Card Reading</h1>
        <p className="subtitle">
          {maxReveals ? `${revealedCount}/${maxReveals} revealed` : `${revealedCount} revealed`}
        </p>
        <div className="controls">
          <button className="btn" onClick={onShuffle} aria-label="Shuffle cards" disabled={cards.length === 0}>Shuffle</button>
          <button className="btn" onClick={onReset} aria-label="Reset revealed state" disabled={revealedCount === 0}>Reset</button>
          <button className="btn" onClick={onGenerate} aria-label="Generate cards with AI" disabled={loadingAI}>
            {loadingAI ? "Generating…" : "Regenerate with AI"}
          </button>
          {maxReveals != null && <span className="hint" role="status">Max reveals: {maxReveals}</span>}
        </div>
        {errorAI && <p className="hint" role="alert">{errorAI}</p>}
      </header>

      {loadingAI && (
        <div className="banner" role="status">Generating cards…</div>
      )}

      {!loadingAI && (
        <div className="tarot-row" role="list">
          {cards.map((card) => (
            <article
              role="listitem"
              key={card.id}
              className={`tarot-card ${card.revealed ? "is-revealed" : ""} ${!canRevealMore && !card.revealed ? "is-locked" : ""}`}
            >
              <button
                className="card-inner"
                onClick={() => revealCard(card.id)}
                onKeyDown={(e) => handleCardActivate(e, card.id)}
                aria-pressed={card.revealed}
                aria-label={card.revealed ? `${card.name} revealed` : `Reveal card ${card.id}`}
                disabled={card.revealed || !canRevealMore}
              >
                <div className="card-face card-front">
                  <span>Click or press Enter</span>
                </div>
                <div className="card-face card-back">
                  <h2>{card.name}</h2>
                  <p>{card.description}</p>
                </div>
              </button>
            </article>
          ))}
        </div>
      )}

      {allRevealed && !loadingAI && (
        <div className="banner" role="status">All cards revealed ✨</div>
      )}
    </div>
  );
}