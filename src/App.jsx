import { useState } from "react";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Stocks from "./pages/Stocks";
import Tarot from "./pages/Tarot";

export default function App() {
  const [page, setPage] = useState("landing");

  const renderPage = () => {
    switch (page) {
      case "finance": return <Finance />;
      case "stocks": return <Stocks />;
      case "tarot": return <Tarot />;
      case "home": return <Home />;
      default: return <Landing setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen text-white font-[Inter]">
      {page !== "landing" && (
        <header className="sticky top-0 w-full flex justify-between items-center px-10 py-4 bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-wider text-yellow-300 drop-shadow-[0_0_10px_rgba(255,255,150,0.4)]">
            ✦ ASTRONOMIX
          </h1>
          <nav className="space-x-8 text-sm uppercase tracking-wide text-slate-200">
            <button onClick={() => setPage("home")} className="hover:text-yellow-300">Home</button>
            <button onClick={() => setPage("finance")} className="hover:text-yellow-300">Finance</button>
            <button onClick={() => setPage("stocks")} className="hover:text-yellow-300">Stocks</button>
            <button onClick={() => setPage("tarot")} className="hover:text-yellow-300">Tarot</button>
          </nav>
        </header>
      )}
      {renderPage()}
    </div>
  );
}
