import React, { useEffect, useState } from "react";
import Pet from "./components/Pet";
import purchases from "./data/purchases.json";
import { analyzePurchase } from "./utils/gemini";

export default function App() {
  const [analyzed, setAnalyzed] = useState([]);

  useEffect(() => {
    async function runAnalysis() {
      const results = [];
      for (const p of purchases) {
        const effect = await analyzePurchase(p.description, p.amount);
        results.push({ ...p, effect });
      }
      setAnalyzed(results);
    }
    runAnalysis();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-slate-200 p-6 space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Astronomics 🌙</h1>
        <p className="text-gray-600">
          Your celestial companion for mindful finance ✨
        </p>
      </div>

      <Pet />

      <section className="w-full max-w-md bg-white rounded-2xl shadow-md p-4 border">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Recent Transactions
        </h2>
        <ul className="divide-y divide-gray-200">
          {analyzed.length === 0 && (
            <p className="text-center text-gray-400">Consulting the stars...</p>
          )}
          {analyzed.map((p) => (
            <li key={p._id} className="py-3 flex flex-col">
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">{p.description}</span>
                <span className="text-gray-600">${p.amount.toFixed(2)}</span>
              </div>
              <div className="text-sm text-indigo-500">{p.effect}</div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="text-xs text-gray-400 mt-10">
        <p>Astronomics • HackTX 2025</p>
      </footer>
    </main>
  );
}
