const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Proper CORS (FINAL FIX)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test DB
pool.query("SELECT NOW()")
  .then(res => console.log("✅ DB Connected:", res.rows[0]))
  .catch(err => console.error("❌ DB Error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO messages(name, email, message) VALUES($1, $2, $3) RETURNING *",
      [name, email, message]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Running on ${PORT}`);
});