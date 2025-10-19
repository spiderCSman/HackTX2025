import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NavBar({ user: initialUser }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUser || null);

  // 🪐 Load user from localStorage if not passed as prop
  useEffect(() => {
    if (!initialUser) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } else {
      // Keep storage up to date
      localStorage.setItem("user", JSON.stringify(initialUser));
    }
  }, [initialUser]);

  // Helper to navigate with user data preserved
  const goTo = (path) => {
    if (user) navigate(path, { state: { user } });
    else navigate(path);
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-yellow-300/10 
      bg-[#080015]/70 flex items-center justify-between px-8 py-4 
      shadow-[0_0_25px_rgba(255,255,200,0.08)]"
    >
      {/* Logo / Title */}
      <h1
        onClick={() => goTo("/home")}
        className="text-yellow-300 text-xl font-bold tracking-wide cursor-pointer 
        drop-shadow-[0_0_10px_rgba(255,255,150,0.4)] hover:scale-105 transition-transform"
      >
        ✦ Astronomix
      </h1>

      {/* Nav Buttons */}
      <div className="flex gap-6 text-sm font-medium">
        <button
          onClick={() => goTo("/home")}
          className="text-yellow-100/80 hover:text-yellow-300 transition-all duration-200"
        >
          Home
        </button>

        <button
          onClick={() => goTo("/tarot")}
          className="text-yellow-100/80 hover:text-yellow-300 transition-all duration-200"
        >
          Tarot
        </button>

        <button
          onClick={() => goTo("/stocks")}
          className="text-yellow-100/80 hover:text-yellow-300 transition-all duration-200"
        >
          Stocks
        </button>

        <button
          onClick={() => goTo("/profile")}
          className="text-yellow-100/80 hover:text-yellow-300 transition-all duration-200"
        >
          Profile
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
          className="bg-gradient-to-b from-yellow-400 to-yellow-500 text-black font-semibold 
          px-4 py-1 rounded-lg shadow-[0_0_15px_rgba(255,255,150,0.3)] hover:scale-105 transition-transform"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
