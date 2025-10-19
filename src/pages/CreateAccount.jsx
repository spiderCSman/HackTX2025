import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5050/api/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Account created successfully!");
        navigate("/signin");
      } else {
        alert(data.message || "Error creating account.");
      }
    } catch (err) {
      console.error("Create account error:", err);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0b0b1f] text-yellow-100">
      <section className="bg-white/10 border border-yellow-200/20 rounded-3xl p-10 shadow-lg w-[22rem] text-center">
        <h1 className="text-3xl font-extrabold text-yellow-300 mb-6 tracking-wide">
          ✦ Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label className="text-sm font-medium text-yellow-200/90">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full mt-1 p-2 rounded-lg bg-[#080015]/50 border border-yellow-200/30 text-white"
            />
          </div>

          <div className="text-left">
            <label className="text-sm font-medium text-yellow-200/90">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2 rounded-lg bg-[#080015]/50 border border-yellow-200/30 text-white"
            />
          </div>

          <div className="text-left">
            <label className="text-sm font-medium text-yellow-200/90">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 rounded-lg bg-[#080015]/50 border border-yellow-200/30 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-b from-yellow-300 to-yellow-500 text-black font-semibold rounded-xl shadow-md hover:scale-105 transition-transform"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="w-full py-2 border border-yellow-300/20 rounded-xl text-yellow-200 text-sm hover:bg-yellow-200/10 transition"
          >
            Back to Sign In
          </button>
        </form>
      </section>
    </main>
  );
}
