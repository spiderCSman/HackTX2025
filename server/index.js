import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createClient } from "@libsql/client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// --- Turso connection ---
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// --- Root ---
app.get("/", (req, res) => res.send("Astronomix API running ✅"));

// ============================================================================
// 🧍 AUTH ROUTES
// ============================================================================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await turso.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });
    const user = result.rows[0];
    if (!user)
      return res.status(401).json({ message: "Invalid credentials (User not found)." });

    const passwordMatch = user.password_hash === password;
    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid credentials (Password mismatch)." });

    res.json({
      message: "Login successful!",
      userId: user.id,
      username: user.username,
      email: user.email,
      isAdmin: !!user.isAdmin,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/create-account", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "Missing required fields." });

  try {
    const existing = await turso.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });
    if (existing.rows.length > 0)
      return res.status(400).json({ message: "Email already exists." });

    await turso.execute({
      sql: `
        INSERT INTO users (id, username, email, password_hash, created_at, isAdmin)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 0)
      `,
      args: [`usr_${username.toLowerCase()}`, username, email, password],
    });

    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error("Create account error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// ============================================================================
// 💹 STOCK TRACKING ROUTES
// ============================================================================
app.post("/api/stocks/add", async (req, res) => {
  const { user_id, ticker, shares, avg_price } = req.body;
  if (!user_id || !ticker)
    return res.status(400).json({ message: "Missing required fields." });

  try {
    await turso.execute({
      sql: `
        INSERT INTO user_stocks (id, user_id, ticker, shares, avg_price, created_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      args: [
        `stk_${Date.now()}`,
        user_id,
        ticker.toUpperCase(),
        shares || 0,
        avg_price || 0,
      ],
    });
    res.json({ message: "Stock added successfully!" });
  } catch (err) {
    console.error("Error adding stock:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/api/stocks/:user_id", async (req, res) => {
  try {
    const result = await turso.execute({
      sql: "SELECT * FROM user_stocks WHERE user_id = ?",
      args: [req.params.user_id],
    });
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching stocks:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.delete("/api/stocks/:id", async (req, res) => {
  try {
    await turso.execute({
      sql: "DELETE FROM user_stocks WHERE id = ?",
      args: [req.params.id],
    });
    res.json({ message: "Stock removed successfully!" });
  } catch (err) {
    console.error("Error deleting stock:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// ============================================================================
// 🌎 MARKET DATA ROUTES
// ============================================================================

// --- Get latest quote ---
app.get("/api/market/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const apiKey = process.env.TWELVEDATA_API_KEY;

  try {
    const response = await fetch(
      `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`
    );
    const data = await response.json();

    // ✅ Graceful fallback for invalid responses
    if (!data || data.status === "error" || !data.close) {
      return res.json({
        symbol,
        name: data?.message || "Unavailable",
        close: "0",
        percent_change: "0",
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching market data:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// --- Historical data for chart ---
app.get("/api/market/history/:symbol", async (req, res) => {
  const { symbol } = req.params;
  const apiKey = process.env.TWELVEDATA_API_KEY;

  try {
    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1h&outputsize=24&apikey=${apiKey}`
    );
    const data = await response.json();

    if (data.status === "error") {
      return res.status(400).json({ message: data.message });
    }

    const formatted = data.values
      .slice(0, 20)
      .reverse()
      .map((entry) => ({
        time: entry.datetime.split(" ")[1].slice(0, 5),
        price: parseFloat(entry.close),
      }));

    res.json({ symbol, history: formatted });
  } catch (err) {
    console.error("Error fetching time-series:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// ============================================================================
// 🚀 START SERVER
// ============================================================================
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
