import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import background from "../assets/star-background.jpeg"; // or background-d.png
import star from "../assets/adult_happy.png";

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(true);

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
      navigate("/signin");
    }
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d1117] text-white animate-pulse">
        <h2 className="text-lg tracking-wide">Loading profile...</h2>
      </div>
    );
  }

  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen text-white px-8 py-20
      bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <NavBar user={user} />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Profile Section */}
      <section className="relative z-10 flex flex-col items-center text-center gap-10">
        {/* Floating Star */}
        <motion.img
          src={star}
          alt="Astronomix Star"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-44 h-44 md:w-64 md:h-64 drop-shadow-[0_0_80px_rgba(255,255,180,0.6)]"
        />

        {/* Profile Card */}
        <div className="bg-white/5 backdrop-blur-md border border-slate-700/50 rounded-3xl p-10 shadow-[0_0_40px_rgba(255,255,255,0.1)] max-w-lg w-full">
          <h2 className="text-3xl font-bold text-yellow-200 mb-6 tracking-wider">
            ✦ Your Cosmic Profile
          </h2>

          <div className="flex flex-col gap-5 text-left text-slate-300">
            <div>
              <p className="text-sm text-slate-400">Username</p>
              <p className="text-lg font-semibold text-yellow-100">{user.username}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Account Type</p>
              <p className="text-lg font-semibold text-yellow-100">
                {user.isAdmin ? "Administrator" : "Standard Traveler"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Joined the Cosmos</p>
              <p className="text-lg font-semibold text-yellow-100">
                {user.joinedDate || "March 2025"}
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => navigate("/home", { state: { user } })}
              className="px-6 py-3 bg-gradient-to-b from-yellow-300 to-yellow-500 text-black font-semibold rounded-xl 
              shadow-[0_0_25px_rgba(255,255,150,0.3)] hover:scale-105 transition-transform"
            >
              Return Home
            </button>
          </div>
        </div>

        {/* Quote */}
        <p className="mt-6 italic text-slate-400 text-sm max-w-md">
          “Even the smallest stars hold galaxies within.”
        </p>
      </section>
    </main>
  );
}
