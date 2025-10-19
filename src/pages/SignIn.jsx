import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5050/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/home", {
          state: {
            user: {
              username: data.username,
              email: data.email,
              isAdmin: data.isAdmin,
            },
          },
        });
      } else {
        alert(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check your network or server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center 
      text-yellow-100 relative"
      style={{
        backgroundImage: "url('/assets/space-bg-placeholder.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <section className="z-10 bg-white/10 border border-yellow-200/20 rounded-3xl p-10 
      shadow-[0_0_40px_rgba(255,255,150,0.2)] w-[22rem] text-center">
        <h1 className="text-3xl font-extrabold text-yellow-300 mb-6 tracking-wide">
          ✦ Astronomix
        </h1>
        <p className="text-yellow-100/70 text-sm mb-8">
          Welcome back, explorer. Align your stars and sign in.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label className="text-sm font-medium text-yellow-200/90">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2 rounded-lg bg-[#080015]/50 border border-yellow-200/30 
              text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="text-left">
            <label className="text-sm font-medium text-yellow-200/90">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 rounded-lg bg-[#080015]/50 border border-yellow-200/30 
              text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-b from-yellow-300 to-yellow-500 text-black font-semibold 
            rounded-xl shadow-[0_0_30px_rgba(255,255,150,0.4)] hover:scale-105 transition-transform"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/create-account")}
            className="w-full py-2 bg-yellow-200/10 border border-yellow-300/20 rounded-xl text-yellow-200 
            text-sm hover:bg-yellow-200/20 transition"
          >
            Create Account
          </button>
        </form>
      </section>
    </main>
  );
}
