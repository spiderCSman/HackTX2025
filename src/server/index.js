// server/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client'; // ⬅️ NEW IMPORT
// import bcrypt from 'bcrypt'; // You will use this for real password hashing later

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
// ------------------------------

// --- API Endpoint for Sign-In ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Query the 'users' table by email
        const result = await turso.execute({
            sql: 'SELECT * FROM users WHERE email = ?',
            args: [email]
        });

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials (User not found).' });
        }

        // 2. Simple Password Check (Replace with bcrypt.compare for security!)
        // Since we inserted 'testpassword' in the table, we'll check against that for now.
        const passwordMatch = user.password_hash === password; 

        if (passwordMatch) {
            // SUCCESS: In a real app, you would generate and return a JWT token here.
            res.json({ message: 'Login successful!', userId: user.id });
        } else {
            res.status(401).json({ message: 'Invalid credentials (Password mismatch).' });
        }
    } catch (error) {
        console.error("Database or Server Error:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});