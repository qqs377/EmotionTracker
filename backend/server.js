const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = 3000;
const db = new sqlite3.Database("./emotions.db");

// Middleware
app.use(express.json());
app.use(cors());

// Initialize database with timestamp
db.run(`
    CREATE TABLE IF NOT EXISTS emotions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        emotion TEXT NOT NULL,
        timestamp TEXT NOT NULL
    )
`);

// Endpoint to update emotion count
app.post("/update-emotion", (req, res) => {
    const { emotion } = req.body;
    const timestamp = new Date().toISOString(); // Current time

    // Insert new emotion entry with timestamp
    db.run(
        "INSERT INTO emotions (emotion, timestamp) VALUES (?, ?)",
        [emotion, timestamp],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }

            // Fetch updated emotion count
            db.all(
                "SELECT emotion, COUNT(*) as count FROM emotions GROUP BY emotion",
                [],
                (err, rows) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    const emotions = Object.fromEntries(rows.map(e => [e.emotion, e.count]));
                    res.json(emotions);
                }
            );
        }
    );
});

// Endpoint to get all emotion counts
app.get("/get-emotions", (req, res) => {
    db.all("SELECT emotion, COUNT(*) as count FROM emotions GROUP BY emotion", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const emotions = Object.fromEntries(rows.map(e => [e.emotion, e.count]));
        res.json(emotions);
    });
});

// Endpoint to fetch time-series emotion data for wave graph
app.get("/get-emotion-history", (req, res) => {
    db.all("SELECT emotion, timestamp FROM emotions ORDER BY timestamp ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(rows);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
