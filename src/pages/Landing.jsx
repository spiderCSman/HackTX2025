import { useNavigate } from "react-router-dom";
import constellation from "../assets/constellation.png";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <main
      className="flex flex-col md:flex-row items-center justify-center gap-8 px-8 py-16 min-h-screen 
      bg-gradient-to-b from-[#070013] via-[#0c012a] to-black text-yellow-100 relative overflow-hidden"
    >
      {/* LEFT — oversized constellation */}
      <section className="flex-1 flex justify-center relative z-10">
        <motion.img
          src={constellation}
          alt="Astronomix Constellation"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-[36rem] h-[36rem] md:w-[56rem] md:h-[56rem] object-contain 
          mix-blend-screen brightness-125 drop-shadow-[0_0_120px_rgba(255,255,200,0.6)]
          animate-pulse-slow"
        />
      </section>

      {/* RIGHT — tagline + buttons */}
      <section className="flex-1 text-center md:text-left max-w-md relative z-10">
        <h1 className="text-5xl font-extrabold text-yellow-300 mb-4 drop-shadow-[0_0_25px_rgba(255,255,100,0.4)]">
          ✦ Astronomix
        </h1>
        <p className="text-lg text-yellow-100/80 mb-10 leading-relaxed">
          Your cosmic companion in finance and fate. Align your stars — and your spending.
        </p>

        <div className="flex flex-col gap-4 items-center md:items-start">
          <button
            onClick={() => navigate("/signin")}
            className="w-52 py-3 bg-gradient-to-b from-yellow-100 to-yellow-300 text-black font-semibold rounded-xl 
            shadow-[0_0_35px_rgba(255,255,200,0.6)] hover:scale-105 hover:shadow-[0_0_45px_rgba(255,255,180,0.8)] transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/create-account")}
            className="w-52 py-3 bg-gradient-to-b from-yellow-200 to-yellow-400 text-black font-semibold rounded-xl 
            shadow-[0_0_35px_rgba(255,255,200,0.6)] hover:scale-105 hover:shadow-[0_0_45px_rgba(255,255,180,0.8)] transition-all"
          >
            Create Account
          </button>
        </div>
      </section>
    </main>
  );
}
