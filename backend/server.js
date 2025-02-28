const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = 3000;
const db = new sqlite3.Database("./emotions.db");

// Middleware
app.use(express.json());
app.use(cors());

// Initialize database
db.run(`
    CREATE TABLE IF NOT EXISTS emotions (
        emotion TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0
    )
`);

// Endpoint to update emotion count
app.post("/update-emotion", (req, res) => {
    const { emotion } = req.body;
    db.run(
        "INSERT INTO emotions (emotion, count) VALUES (?, 1) ON CONFLICT(emotion) DO UPDATE SET count = count + 1",
        [emotion],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Emotion updated" });
        }
    );
});

// Endpoint to get all emotion counts
app.get("/get-emotions", (req, res) => {
    db.all("SELECT * FROM emotions", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const emotions = {};
        rows.forEach(row => emotions[row.emotion] = row.count);
        res.json(emotions);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
