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

function generateWordCloud(emotionData) {
    // Check the data before proceeding
    console.log("Emotion data:", emotionData);

    // Find the maximum count to use for normalization
    const maxCount = Math.max(...Object.values(emotionData));
    const maxWordSize = 100;  // Maximum size for the largest word
    const scaleFactor = maxWordSize / maxCount;
    
    // Create a list of words in the format WordCloud.js expects
    const words = Object.entries(emotionData).map(([emotion, count]) => {
        // Scale the word size proportionally
        const wordSize = count * scaleFactor;
        return [emotion, wordSize];
    });

    console.log("Words for word cloud:", words);


    // Clear any previous word cloud
    const canvas = document.getElementById("wordCloud");
        canvas.width = canvas.offsetWidth;
        canvas.height = 400; // Match the max-height from CSS
        

    // Use WordCloud.js to generate the cloud
    WordCloud(canvas, {
        list: words,
        gridSize: 10,
        weightFactor: 2,
        color: "white",
        backgroundColor: "#7d6a66",
        minSize: 10,  // Min font size
        maxSize: 50,  // Max font size
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
