import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import star from "../assets/adult_happy.png";
import background from "../assets/background.png"; // or background-d.png

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(true);

  // 🪐 Handle user from location or localStorage
  useEffect(() => {
    const passedUser = location.state?.user;
    const storedUser = localStorage.getItem("user");

    if (passedUser) {
      setUser(passedUser);
      localStorage.setItem("user", JSON.stringify(passedUser));
      setLoading(false);
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      // Redirect to sign-in if no user found
      navigate("/signin");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    console.log("User loaded into Home:", user);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-white animate-pulse">
        <h2 className="text-lg tracking-wide">Loading user data...</h2>
      </div>
    );
  }

  return (
    <main
      className="flex flex-col lg:flex-row items-center justify-center gap-16 px-10 py-20 min-h-screen 
      bg-cover bg-center text-white relative overflow-hidden"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Navbar now receives user */}
      <NavBar user={user} />

      {/* Subtle dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* LEFT — Text ABOVE, Star BELOW */}
      <section className="flex-1 flex flex-col items-center text-center relative z-10">
        {/* Greeting and quote (lowered slightly) */}
        <div className="flex flex-col items-center mb-6 mt-20">
          <h2 className="text-2xl font-bold text-yellow-300">
            Hello, {user.username || "Traveler"}!
          </h2>
          <p className="text-lg mt-3 italic text-slate-300 max-w-sm">
            “Your star shines brightest when your balance does too.”
          </p>
        </div>

        {/* Floating Star positioned lower */}
        <motion.img
          src={star}
          alt="Astronomix Star Companion"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-72 h-72 md:w-96 md:h-96 object-contain drop-shadow-[0_0_100px_rgba(255,255,180,0.6)] mt-10"
        />
      </section>

      {/* RIGHT — Cosmic Overview */}
      <section
        className="flex-1 max-w-2xl w-full bg-white/5 backdrop-blur-md border border-slate-700/50 
        rounded-3xl p-10 relative z-10 shadow-[0_0_60px_rgba(255,255,255,0.1)]"
      >
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
