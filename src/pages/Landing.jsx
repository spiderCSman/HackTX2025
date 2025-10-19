export default function Landing({ setPage }) {
  return (
    <main
      className="flex flex-col md:flex-row items-center justify-center gap-8 px-8 py-16 min-h-screen 
      bg-cover bg-center text-yellow-100"
      style={{
        backgroundImage: "url('/assets/space-bg-placeholder.jpg')", // 🪐 replace this later
      }}
    >
      {/* LEFT — image */}
      <section className="flex-1 flex justify-center">
        <div className="w-80 h-80 md:w-96 md:h-96 bg-yellow-300/20 rounded-full border border-yellow-200/30 
        shadow-[0_0_60px_rgba(255,230,130,0.4)] flex items-center justify-center text-black/40 text-xl font-bold">
          [Stars Image Here]
        </div>
      </section>

      {/* RIGHT — tagline */}
      <section className="flex-1 text-center md:text-left max-w-md">
        <h1 className="text-5xl font-extrabold text-yellow-300 mb-4 drop-shadow-[0_0_20px_rgba(255,255,100,0.3)]">
          ✦ Astronomix
        </h1>
        <p className="text-lg text-yellow-100/80 mb-10 leading-relaxed">
          Your cosmic companion in finance and fate. Align your stars — and your spending.
        </p>

        <div className="flex flex-col gap-4 items-center md:items-start">
          <button
            onClick={() => setPage("home")}
            className="w-48 py-3 bg-gradient-to-b from-yellow-200 to-yellow-400 text-black font-semibold rounded-xl 
            shadow-[0_0_30px_rgba(255,255,150,0.4)] hover:scale-105 transition-transform"
          >
            Sign In
          </button>
          <button
            onClick={() => setPage("home")}
            className="w-48 py-3 bg-gradient-to-b from-yellow-400 to-yellow-600 text-black font-semibold rounded-xl 
            shadow-[0_0_30px_rgba(255,255,150,0.4)] hover:scale-105 transition-transform"
          >
            Create Account
          </button>
        </div>
      </section>
    </main>
  );
}
