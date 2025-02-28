// Word Cloud
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".emotion");
    const canvas = document.getElementById("wordCloud");
    const ctx = canvas.getContext("2d");

    // Function to fetch emotion data from backend
    async function fetchEmotions() {
        try {
            // Update the URL to your Render backend
            const response = await fetch("https://emotiontracker.onrender.com/get-emotions");
            const data = await response.json();
            generateWordCloud(data);
        } catch (error) {
            console.error("Error fetching emotion data:", error);
        }
    }

    // Function to send emotion data to backend
    async function sendEmotion(emotion) {
        try {
            // Update the URL to your Render backend
            await fetch("https://emotiontracker.onrender.com/update-emotion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ emotion })
            });
            fetchEmotions(); // Refresh word cloud
        } catch (error) {
            console.error("Error sending emotion data:", error);
        }
    }

    function generateWordCloud(emotionData) {
        // Check the data before proceeding
        console.log("Emotion data:", emotionData);

        // Create a list of words in the format WordCloud.js expects
        const words = Object.entries(emotionData).map(([emotion, count]) => [emotion, count * 10]); // Scaling word size
        console.log("Words for word cloud:", words);

        // Clear any previous word cloud
        const canvas = document.getElementById("wordCloud");
        canvas.width = canvas.offsetWidth;  // Ensure it adapts to screen width
        canvas.height = 400; // Match the max-height from CSS

        // Use WordCloud.js to generate the cloud
        WordCloud(canvas, {
            list: words,
            gridSize: 10,
            weightFactor: 2,
            color: "white",
            backgroundColor: "#7d6a66",
        });
    }

    // Attach event listeners to buttons
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const emotion = button.dataset.emotion;
            sendEmotion(emotion);
        });
    });

    // Initial fetch to populate the word cloud
    fetchEmotions();
});

// Wave Graph
async function fetchEmotionHistory() {
    try {
        const response = await fetch("https://emotiontracker.onrender.com/get-emotion-history");
        const data = await response.json();
        plotWaveGraph(data);
    } catch (error) {
        console.error("Error fetching emotion history:", error);
    }
}

function plotWaveGraph(data) {
    const ctx = document.getElementById("waveGraph").getContext("2d");

    // Process data into timestamps and counts
    const labels = data.map(entry => new Date(entry.timestamp).toLocaleTimeString());
    const counts = {};

    data.forEach(entry => {
        counts[entry.timestamp] = (counts[entry.timestamp] || 0) + 1;
    });

    const values = Object.values(counts);

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Emotions Over Time",
                data: values,
                borderColor: "#ff6384",
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Time" } },
                y: { title: { display: true, text: "Emotion Count" } }
            }
        }
    });
}

// Attach event listeners to buttons for wave graph
buttons.forEach(button => {
    button.addEventListener("click", async () => {
        const emotion = button.dataset.emotion;
        await sendEmotion(emotion); // Send emotion to server
        fetchEmotionHistory(); // Fetch and update wave graph
    });
});

// Initial fetch to populate the wave graph
fetchEmotionHistory();
