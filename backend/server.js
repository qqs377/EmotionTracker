const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Supabase Credentials
const SUPABASE_URL = "https://vadnoeekoavournnxuqh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZG5vZWVrb2F2b3Vybm54dXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NzA1NTIsImV4cCI6MjA1NjM0NjU1Mn0.RA0-beDK1Xk_9raOua0_XADbCxuFef3AVqEydkewbxY";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to get the current timestamp in EST
function getESTTimestamp() {
    return new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        hour12: false,
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    });
}

// Endpoint to update emotion count
app.post("/update-emotion", async (req, res) => {
    const { emotion } = req.body;
    if (!emotion) return res.status(400).json({ error: "Emotion is required" });

    const timestamp = getESTTimestamp();

    // Insert emotion into Supabase
    const { error } = await supabase
        .from("emotions")
        .insert([{ emotion, timestamp }]);

    if (error) return res.status(500).json({ error: error.message });

    // Fetch updated emotion count
    const { data, error: fetchError } = await supabase
        .from("emotions")
        .select("emotion, count:emotion")
        .group("emotion");

    if (fetchError) return res.status(500).json({ error: fetchError.message });

    const emotions = Object.fromEntries(data.map(e => [e.emotion, e.count]));
    res.json(emotions);
});

// Endpoint to get all emotion counts
app.get("/get-emotions", async (req, res) => {
    const { data, error } = await supabase
        .from("emotions")
        .select("emotion, count:emotion")
        .group("emotion");

    if (error) return res.status(500).json({ error: error.message });

    const emotions = Object.fromEntries(data.map(e => [e.emotion, e.count]));
    res.json(emotions);
});

// Endpoint to fetch time-series emotion data 
app.get("/get-emotion-history", async (req, res) => {
    const { data, error } = await supabase
        .from("emotions")
        .select("emotion, timestamp")
        .order("timestamp", { ascending: false }) // Newest first
        .limit(1000);

    if (error) return res.status(500).json({ error: error.message });

    res.json(data.reverse()); // Reverse to maintain chronological order
});

// Automatically delete old entries, keeping only the last 1000
async function cleanOldEntries() {
    const { data, error } = await supabase
        .from("emotions")
        .select("id")
        .order("timestamp", { ascending: false });

    if (error) {
        console.error("Error fetching data:", error.message);
        return;
    }

    if (data.length > 1000) {
        const idsToDelete = data.slice(1000).map(entry => entry.id);
        await supabase.from("emotions").delete().in("id", idsToDelete);
    }
}

// Run cleanup every 12 hour in milliseconds
setInterval(cleanOldEntries, 12 * 60 * 60 * 1000);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
