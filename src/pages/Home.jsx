import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";

export default function Home() {
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);

  useEffect(() => {
    console.log("User loaded into Home:", user);
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-white">
        <h2>Loading user data...</h2>
      </div>
    );
  }

  return (
    <main
      className="flex flex-col lg:flex-row items-center justify-center gap-16 px-10 py-20 min-h-screen 
      bg-gradient-to-b from-[#080015] via-[#0c0130] to-black text-white relative overflow-hidden"
    >
      <NavBar />

      {/* Animated nebula background (subtle motion layers) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,200,0.05),transparent_70%)] blur-3xl animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(100,100,255,0.1),transparent_60%)] blur-3xl animate-pulse" />

      {/* LEFT — Animated Star Character */}
      <section className="flex-1 flex flex-col items-center text-center relative z-10">
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-72 h-72 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-[0_0_60px_rgba(255,255,150,0.6)] 
          flex items-center justify-center text-6xl text-black/40 font-bold"
        >
          ⭐
        </motion.div>

        <h2 className="text-2xl mt-6 font-bold text-yellow-300">
          Hello, {user.username || "Traveler"}!
        </h2>

        <p className="text-lg mt-3 italic text-slate-300 max-w-sm">
          “Your star shines brightest when your balance does too.”
        </p>
      </section>

      {/* RIGHT — Expanded Cosmic Overview */}
      <section className="flex-1 max-w-2xl w-full bg-white/5 backdrop-blur-md border border-slate-700/50 
      rounded-3xl p-10 relative z-10 shadow-[0_0_60px_rgba(255,255,255,0.1)]">
        <h2 className="text-3xl font-bold text-center mb-10 tracking-wider text-yellow-200">
          COSMIC OVERVIEW
        </h2>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center bg-slate-800/40 border border-slate-600/30 rounded-xl p-6 shadow-inner">
            <p className="text-sm text-slate-400 mb-2">Account Balance</p>
            <p className="text-3xl font-bold text-green-300">$5,000</p>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-800/40 border border-slate-600/30 rounded-xl p-6 shadow-inner">
            <p className="text-sm text-slate-400 mb-2">Tarot Card</p>
            <p className="text-3xl font-semibold text-purple-300">The Sun ☀️</p>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-800/40 border border-slate-600/30 rounded-xl p-6 shadow-inner">
            <p className="text-sm text-slate-400 mb-2">Stock Trend</p>
            <p className="text-3xl font-semibold text-blue-300">📈 +7.2%</p>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-800/40 border border-slate-600/30 rounded-xl p-6 shadow-inner">
            <p className="text-sm text-slate-400 mb-2">Star Vitality</p>
            <p className="text-3xl font-semibold text-yellow-300">92%</p>
          </div>
        </div>

        <div className="mt-10 text-center text-slate-400 italic text-sm">
          “Balance your energy, and the cosmos will reward you.”
        </div>
      </section>
    </main>
  );
}
