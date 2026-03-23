const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection (Render-safe)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, // ❌ removed localhost fallback
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false, // ✅ REQUIRED for Render PostgreSQL
  },
});

// Test DB connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ PostgreSQL connection error:", err);
  } else {
    console.log("✅ PostgreSQL connected at", res.rows[0].now);
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Contact route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("📩 Incoming data:", name, email, message);

    if (!name || !email) {
      return res.status(400).send("Name and email are required");
    }

    const result = await pool.query(
      "INSERT INTO messages(name, email, message) VALUES($1, $2, $3) RETURNING *",
      [name, email, message]
    );

    console.log("✅ Data inserted:", result.rows[0]);

    res.status(201).json({
      message: "Message saved!",
      data: result.rows[0],
    });

  } catch (err) {
    console.error("❌ ERROR in /contact:", err);
    res.status(500).send("Server error");
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Keep alive log (optional)
setInterval(() => {
  console.log("💓 Server still alive...");
}, 10000);

