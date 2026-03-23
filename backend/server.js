const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ ONLY THIS CORS (enough)
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false },
});

// Test DB
pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("DB Error:", err);
  else console.log("DB Connected:", res.rows[0].now);
});

// Routes
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  console.log("Incoming:", req.body);

  if (!name || !email) {
    return res.status(400).send("Name and email required");
  }

  try {
    const result = await pool.query(
      "INSERT INTO messages(name, email, message) VALUES($1,$2,$3) RETURNING *",
      [name, email, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});