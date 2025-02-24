const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("./companies.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Get all companies
app.get("/companies", (req, res) => {
  const sql = `SELECT id, name, industries, investors, value_usd, last_funding_type, 
                      founded_date, num_employees, website, social_media_links, monthly_visits,
                      about, address, country_code, cb_rank, full_description, image 
               FROM companies`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get company by ID
app.get("/company/:id", (req, res) => {
  const sql = `SELECT id, name, industries, investors, value_usd, last_funding_type, 
                      founded_date, num_employees, website, social_media_links, monthly_visits,
                      about, address, country_code, cb_rank, full_description, image 
               FROM companies WHERE id = ?`;

  const id = req.params.id;
  
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Get insights by valuation
app.get("/insights/valuation", (req, res) => {
  const sql = `SELECT name, value_usd FROM companies ORDER BY value_usd DESC`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
