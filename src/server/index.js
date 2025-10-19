// server/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Turso Connection Setup ---
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// --- API Endpoint for Sign-In ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const result = await turso.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email],
    });

    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials (User not found).' });

    // Simple password comparison (later replace with bcrypt)
    const passwordMatch = user.password_hash === password;
    if (!passwordMatch)
      return res.status(401).json({ message: 'Invalid credentials (Password mismatch).' });

    // Successful login
    res.json({
      message: 'Login successful!',
      userId: user.id,
      username: user.username,
      email: user.email,
      isAdmin: !!user.isAdmin,
    });
  } catch (error) {
    console.error('Database or Server Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// --- API Endpoint for Account Creation ---
app.post('/api/create-account', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // Check if email already exists
    const existing = await turso.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email],
    });

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'An account with that email already exists.' });
    }

    // Create the new user
    await turso.execute({
      sql: `
        INSERT INTO users (id, username, email, password_hash, created_at, isAdmin)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 0)
      `,
      args: [`usr_${username.toLowerCase()}`, username, email, password],
    });

    res.status(201).json({ message: 'Account created successfully!' });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
