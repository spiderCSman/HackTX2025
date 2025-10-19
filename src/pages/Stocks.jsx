import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import NavBar from "../components/NavBar";
import starBackground from "../assets/star-background.jpeg";

export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [ticker, setTicker] = useState("");
  const [shares, setShares] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [marketData, setMarketData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const userId = "usr_demo"; // TODO: replace with real user id

  // --- Fetch user's saved stocks from DB ---
  const fetchStocks = async () => {
    try {
      const res = await fetch(`http://localhost:5050/api/stocks/${userId}`);
      const data = await res.json();
      setStocks(data);
      if (data.length > 0) {
        fetchUserMarketData(data);
      } else {
        setMarketData([]);
        setChartData([]);
      }
    } catch (err) {
      console.error("Error fetching stocks:", err);
    }
  };

  // --- Fetch market data for user's stocks ---
  const fetchUserMarketData = async (userStocks) => {
    try {
      const tickers = userStocks.map((s) => s.ticker.toUpperCase());
      const results = await Promise.all(
        tickers.map(async (t) => {
          const res = await fetch(`http://localhost:5050/api/market/${t}`);
          return res.json();
        })
      );

      setMarketData(results);

      // Generate smooth fake trend lines for now
      const fakeData = Array.from({ length: 15 }, (_, i) => {
        const point = { time: `T${i + 1}` };
        results.forEach((stock) => {
          point[stock.symbol] =
            parseFloat(stock.close) +
            Math.sin(i / 2) * 2 +
            Math.random() * 0.5;
        });
        return point;
      });
      setChartData(fakeData);
    } catch (err) {
      console.error("Error fetching market data:", err);
    }
  };

  // --- Add new stock ---
  const addStock = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5050/api/stocks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          ticker,
          shares: parseInt(shares) || 0,
          avg_price: parseFloat(avgPrice) || 0,
        }),
      });
      setTicker("");
      setShares("");
      setAvgPrice("");
      fetchStocks();
    } catch (err) {
      console.error("Error adding stock:", err);
    }
  };

  // --- Delete a stock ---
  const deleteStock = async (id) => {
    try {
      await fetch(`http://localhost:5050/api/stocks/${id}`, { method: "DELETE" });
      fetchStocks();
    } catch (err) {
      console.error("Error deleting stock:", err);
    }
  };

  // --- Toggle which stocks are shown in the chart ---
  const toggleStockSelection = (symbol) => {
    setSelectedStocks((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // --- Determine visible stocks for chart ---
  const visibleStocks =
    selectedStocks.length > 0
      ? marketData.filter((s) => selectedStocks.includes(s.symbol))
      : marketData;

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-start text-white overflow-hidden relative"
      style={{
        backgroundImage: `url(${starBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* NavBar */}
      <NavBar />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,200,150,0.08),transparent_70%)] blur-3xl animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(150,200,255,0.08),transparent_70%)] blur-3xl animate-pulse" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl pt-28 pb-16 space-y-10 px-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT — User Portfolio */}
          <section className="bg-white/5 backdrop-blur-lg border border-slate-700/40 rounded-3xl p-8">
            <h2 className="text-4xl font-bold text-yellow-300 mb-6 text-center">
              ✦ Your Portfolio ✦
            </h2>

            <form
              onSubmit={addStock}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            >
              <input
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Ticker (e.g. AAPL)"
                className="w-full bg-black/40 border border-yellow-400/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300/50"
              />
              <input
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder="Shares"
                type="number"
                className="w-full bg-black/40 border border-yellow-400/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300/50"
              />
              <input
                value={avgPrice}
                onChange={(e) => setAvgPrice(e.target.value)}
                placeholder="Avg Price ($)"
                type="number"
                className="w-full bg-black/40 border border-yellow-400/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300/50"
              />
              <button
                type="submit"
                className="col-span-full bg-yellow-400 text-black font-semibold py-2 rounded-xl hover:bg-yellow-300 transition"
              >
                Add Stock
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="text-yellow-300 border-b border-slate-700">
                    <th className="p-3">Ticker</th>
                    <th className="p-3">Shares</th>
                    <th className="p-3">Avg Price</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-6 text-center text-slate-400 italic"
                      >
                        No stocks tracked yet 🌙
                      </td>
                    </tr>
                  ) : (
                    stocks.map((s) => (
                      <motion.tr
                        key={s.id}
                        className="border-b border-slate-800 hover:bg-white/5 transition"
                      >
                        <td className="p-3 font-semibold">{s.ticker}</td>
                        <td className="p-3">{s.shares}</td>
                        <td className="p-3">${s.avg_price}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => deleteStock(s.id)}
                            className="text-red-400 hover:text-red-300 transition font-medium"
                          >
                            ✕
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* RIGHT — User Stocks Overview */}
          <section className="bg-white/5 backdrop-blur-lg border border-slate-700/40 rounded-3xl p-8">
            <h2 className="text-4xl font-bold text-green-300 mb-8 text-center">
              ✦ Your Stocks ✦
            </h2>

            {marketData.length === 0 ? (
              <p className="text-slate-400 italic text-center">
                Add some stocks to see their live prices 🌌
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {marketData.map((stock) => {
                  const isSelected = selectedStocks.includes(stock.symbol);
                  return (
                    <div
                      key={stock.symbol}
                      onClick={() => toggleStockSelection(stock.symbol)}
                      className={`bg-black/40 border rounded-2xl p-6 text-center cursor-pointer transition ${
                        isSelected
                          ? "border-yellow-400 shadow-[0_0_15px_rgba(255,255,0,0.4)] scale-105"
                          : "border-slate-700/40 hover:border-yellow-400/60"
                      }`}
                    >
                      <h3 className="text-2xl font-bold text-teal-300">
                        {stock.symbol}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {stock.name || "Company"}
                      </p>
                      <p className="text-2xl font-semibold text-green-400">
                        ${parseFloat(stock.close).toFixed(2)}
                      </p>
                      <p
                        className={`text-sm ${
                          parseFloat(stock.percent_change) >= 0
                            ? "text-emerald-300"
                            : "text-red-400"
                        }`}
                      >
                        {parseFloat(stock.percent_change) >= 0 ? "▲" : "▼"}{" "}
                        {stock.percent_change}%
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Bottom Chart */}
        <section className="bg-white/5 backdrop-blur-lg border border-slate-700/40 rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-bold text-purple-300 mb-4">
            ✦ {selectedStocks.length > 0 ? "Focused Market Flow" : "Portfolio Flow"} ✦
          </h2>

          <motion.div
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="h-[450px] bg-gradient-to-r from-indigo-700/20 to-yellow-500/20 border border-slate-700/40 rounded-2xl p-4"
          >
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="time" stroke="#bbb" />
                  <YAxis stroke="#bbb" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0b0b1f",
                      border: "1px solid #444",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  {visibleStocks.map((stock, i) => (
                    <Line
                      key={stock.symbol}
                      type="monotone"
                      dataKey={stock.symbol}
                      stroke={[
                        "#FFD700",
                        "#00FFFF",
                        "#ADFF2F",
                        "#FF69B4",
                        "#FFA500",
                      ][i % 5]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 italic text-lg">
                [ Add stocks to visualize your portfolio ✨ ]
              </p>
            )}
          </motion.div>
        </section>
      </div>
    </main>
  );
}
