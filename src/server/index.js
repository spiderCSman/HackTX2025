// server/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Turso Connection ---
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// --- Normalize keys (Turso sometimes returns uppercase) ---
const normalizeKeys = (obj) => {
  const normalized = {};
  for (const key in obj) {
    normalized[key.toLowerCase()] = obj[key];
  }
  return normalized;
};

// --- API Endpoint for Sign-In ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await turso.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email],
    });

    if (!result.rows.length) {
      return res.status(401).json({ message: 'Invalid credentials (User not found).' });
    }

    // normalize column names
    const user = normalizeKeys(result.rows[0]);
    console.log('Normalized user data:', user);

    // password check
    const passwordMatch = user.password_hash === password;

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials (Password mismatch).' });
    }

    res.json({
      message: 'Login successful!',
      userId: user.id,
      username: user.username,
      email: user.email,
      isAdmin: !!user.isadmin,
    });
  } catch (error) {
    console.error('Database or Server Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
