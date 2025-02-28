//word cloud

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

    // Generate word cloud from emotion data
    function generateWordCloud(emotionData) {
        const words = Object.entries(emotionData).map(([emotion, count]) => [emotion, count * 10]); // Scale word size
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        WordCloud(canvas, { list: words, gridSize: 10, weightFactor: 2, color: "white" });
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



//wave graph

    function updateWaveGraph() {
        const labels = emotionData.map(data => new Date(data.timestamp).toLocaleTimeString());
        const values = emotionData.map((_, index) => Math.random() * 10);

        if (waveGraph) {
            waveGraph.data.labels = labels;
            waveGraph.data.datasets[0].data = values;
            waveGraph.update();
        } else {
            waveGraph = new Chart(waveGraphCanvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Emotion Trends',
                        data: values,
                        borderColor: 'white',
                        fill: false
                    }]
                },
                options: { responsive: true }
            });
        }
    }

    function getColor(emotion) {
        const colors = {
            happy: "yellow",
            sad: "blue",
            angry: "red",
            excited: "orange",
            calm: "green",
            anxious: "purple"
        };
        return colors[emotion] || "white";
    }
