//word cloud

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".emotion");
    const canvas = document.getElementById("wordCloud");
    const emotionLog = document.getElementById("emotion-log"); //global log
    const myEmotionsLog = document.getElementById("my-emotions-log");
    

    // Function to fetch emotion data from backend for word cloud
    async function fetchEmotions() {
        try {
            const response = await fetch("https://emotiontracker.onrender.com/get-emotions");
            const data = await response.json();
            generateWordCloud(data);
        } catch (error) {
            console.error("Error fetching emotion data:", error);
        }
    }

    // Function to fetch emotion history and update the log
    async function fetchEmotionHistory() {
        try {
            const response = await fetch("https://emotiontracker.onrender.com/get-emotion-history");
            const data = await response.json();
            updateGlobalLog(data);

        } catch (error) {
            console.error("Error fetching emotion history:", error);
        }
    }


   // Function to update the global log UI
    function updateGlobalLog(data) {
            // Clear previous log entries
            emotionLog.innerHTML = "";

            // Add each emotion entry to the log
            data.forEach(entry => {
                const listItem = document.createElement("li");
                listItem.textContent = `${entry.timestamp} - ${entry.emotion}`;
                emotionLog.appendChild(listItem);
            });
    }

    // Function to update "My Emotions" log UI
    function updateMyEmotionsLog() {
        const storedMyEmotions = JSON.parse(localStorage.getItem("myEmotions") || "[]");
        myEmotionsLog.innerHTML = ""; // Clear before appending new items

        storedMyEmotions.forEach(entry => {
            const listItem = document.createElement("li");
            listItem.textContent = `${entry.timestamp} - ${entry.emotion}`;
            myEmotionsLog.appendChild(listItem);
        });
    }

    // Function to send an emotion to the backend and save it locally
    async function sendEmotion(emotion) {
        const timestamp = new Date().toLocaleString("en-US", {
            timeZone: "America/New_York",
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        });

        try {
            await fetch("https://emotiontracker.onrender.com/update-emotion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emotion })
            });

            fetchEmotionHistory(); // Refresh global log

            // Save to "My Emotions" log (local storage)
            const storedMyEmotions = JSON.parse(localStorage.getItem("myEmotions") || "[]");
            storedMyEmotions.push({ emotion, timestamp }); // Add new emotion
            localStorage.setItem("myEmotions", JSON.stringify(storedMyEmotions));

            updateMyEmotionsLog(); // Refresh user-specific log
        } catch (error) {
            console.error("Error sending emotion data:", error);
        }
    }

    
    // Function to send emotion data to backend
    async function sendEmotion(emotion) {
        try {
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
        console.log("Emotion data:", emotionData);

        // Find the maximum count to use for normalization
        const maxCount = Math.max(...Object.values(emotionData));
        const maxWordSize = 100;  // Maximum size for the largest word
        const scaleFactor = maxWordSize / maxCount;
        
        // Create a list of words in the format WordCloud.js expects
        const words = Object.entries(emotionData).map(([emotion, count]) => {
            // Scale the word size proportionally, ensuring it's at least 10
            const wordSize = Math.max(count * scaleFactor, 10);  // Min size to prevent too small words
            return [emotion, wordSize];
        });

        console.log("Words for word cloud:", words);

        // Clear any previous word cloud
        const canvas = document.getElementById("wordCloud");
            //canvas.width = canvas.offsetWidth;
            canvas.width = window.innerWidth;  // Make the canvas span the full width
            canvas.height = window.innerHeight; 

    // Use WordCloud.js to generate the cloud
     WordCloud(canvas, {
        list: words,
        gridSize: 8,
        weightFactor: 3,  // Increased weight factor for a wider size distribution
        color: "white",
        backgroundColor: "#7d6a66",
        drawOutOfBound: true, // Allow words to go outside the canvas
        //rotateRatio: 0, // Keep words unrotated to avoid them being pushed out
    });
}



    // Attach event listeners to buttons
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const emotion = button.dataset.emotion;
            sendEmotion(emotion);
        });
    });

    // Initial fetch, load stored data on page load
    fetchEmotions();
    fetchEmotionHistory();
});
