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

    // Create a list of words in the format WordCloud.js expects
    const words = Object.entries(emotionData).map(([emotion, count]) => [emotion, count * 10]); // Scaling word size
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



