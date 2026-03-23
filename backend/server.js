const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");   
require("dotenv").config();

const app = express();


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});


pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("PostgreSQL connection error ", err);
  else console.log("PostgreSQL connected  at", res.rows[0].now);
});


app.get("/", (req, res) => {
  res.send("Backend running ");
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email) return res.status(400).send("Name and email are required");

  try {
    const result = await pool.query(
      "INSERT INTO messages(name, email, message) VALUES($1, $2, $3) RETURNING *",
      [name, email, message]
    );
    res.status(201).json({ message: "Message saved!", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

setInterval(() => {
  console.log("Server still alive...");
}, 5000);