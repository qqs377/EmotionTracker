//word cloud

document.addEventListener("DOMContentLoaded", () => {

    const SUPABASE_URL = "https://vadnoeekoavournnxuqh.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZG5vZWVrb2F2b3Vybm54dXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NzA1NTIsImV4cCI6MjA1NjM0NjU1Mn0.RA0-beDK1Xk_9raOua0_XADbCxuFef3AVqEydkewbxY";
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);  
    
    const buttons = document.querySelectorAll(".emotion");
    const canvas = document.getElementById("wordCloud");
    const emotionLog = document.getElementById("emotion-log"); //global log
    const myEmotionsLog = document.getElementById("my-emotions-log");

    // Function to fetch emotion data from backend for word cloud
    async function fetchEmotions() {
        try {
            const { data, error } = await supabase
                .from('emotions')
                .select('emotion');

            if (error) throw error;
            
            //create an object to store the count of each emotion
            const emotionData = {};

            //count occurrences
            data.forEach(item => {
                if (emotionData[item.emotion]) {
                emotionData[item.emotion]++;
            } else {
                emotionData[item.emotion] = 1;
            }
            });

            //call the function to generate the word cloud
            generateWordCloud(emotionData);
            generateBarChart(emotionData);
            
        } catch (error) {
            console.error("Error fetching emotion data:", error);
        }
    }

    // Function to fetch emotion history and update the log
    async function fetchEmotionHistory() {
        try {
            const { data, error } = await supabase
                .from('emotions')
                .select('emotion, timestamp')
                .order('timestamp', { ascending: false });

            if (error) throw error;
            
            updateGlobalLog(data);

        } catch (error) {
            console.error("Error fetching emotion history:", error);
        }
    }


   // Function to update the global log UI
    function updateGlobalLog(data) {

            // Sort by timestamp (newest first)
            data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
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
        //console.log("Stored emotions:", storedMyEmotions); // debug report code

        // Sort emotions in descending order by timestamp
        storedMyEmotions.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

        myEmotionsLog.innerHTML = ""; // Clear before appending new items
        
        storedMyEmotions.forEach(entry => {
            const listItem = document.createElement("li");
            listItem.textContent = `${entry.timestamp} - ${entry.emotion}`;
            myEmotionsLog.prepend(listItem); // Prepend to add the newest at the top
        });
    }

// render logs
    function addEmotionToLog(logId, timestamp, emotion) {
    const logElement = document.getElementById(logId);
    if (!logElement) return;

    // Create a new list item
    const listItem = document.createElement("li");
    listItem.textContent = `${timestamp} ${emotion}`;

    // Add to the top of the list (most recent first)
    logElement.prepend(listItem);
}

function renderMyEmotions() {
    const myLogElement = document.getElementById("my-emotions-log");
    if (!myLogElement) return;

    // Retrieve saved emotions from local storage
    const myEmotions = JSON.parse(localStorage.getItem("myEmotions")) || [];

    // Sort by timestamp (newest first)
    myEmotions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Clear current list
    myLogElement.innerHTML = "";

    // Append each emotion to the list
    myEmotions.forEach(entry => {
        const listItem = document.createElement("li");
        listItem.textContent = `${entry.timestamp} ${entry.emotion}`;
        myLogElement.prepend(listItem);
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
        try{
            // Save to "My Emotions" log (local storage)
            const storedMyEmotions = JSON.parse(localStorage.getItem("myEmotions") || "[]");
            storedMyEmotions.push({ emotion, timestamp }); // Add new emotion
            localStorage.setItem("myEmotions", JSON.stringify(storedMyEmotions));

            // Update the user-specific emotion log instantly
            updateMyEmotionsLog(); 

            //insert emotion into Supabase SQL (backend)
            const { data, error } = await supabase
                .from('emotions')
                .insert([{ emotion, timestamp }]);

            if (error) throw error;
            
            // Update the global emotion log instantly
            addEmotionToLog("emotion-log", timestamp, emotion);
            
            fetchEmotionHistory(); // Refresh global log
                 
            // Also fetch the latest emotions to update the word cloud
            fetchEmotions();


        } catch (error) {
            console.error("Error sending emotion data:", error);
        }
    }

    
//generate word cloud
    
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
    
     // Ensure the canvas has valid dimensions before using it
    if (canvas) {
        canvas.width = window.innerWidth;  // Make the canvas span the full width
        canvas.height = window.innerHeight; // Adjust the height accordingly
    } else {
    console.error("Canvas not found!");
    return;
}


    // Check if the canvas width and height are valid before proceeding
    if (canvas.width <= 0 || canvas.height <= 0) {
        console.error("Invalid canvas size:", canvas.width, canvas.height);
        return;
    }
    
    // Use WordCloud.js to generate the cloud
    try{
     WordCloud(canvas, {
        list: words,
        gridSize: 8,
        weightFactor: 3,  // Increased weight factor for a wider size distribution
        color: "white",
        backgroundColor: "#7d6a66",
        drawOutOfBound: true, // Allow words to go outside the canvas
        //rotateRatio: 0, // Keep words unrotated to avoid them being pushed out
    });
    } catch (err) {
        console.error("Error generating word cloud:", err);
    }
}


//generate bar chart
function generateBarChart(emotionData) {
    const ctx = document.getElementById("emotionBarChart").getContext("2d");

    // Extract emotions and counts
    const emotions = Object.keys(emotionData);
    const counts = Object.values(emotionData);

    // Destroy existing chart instance if it exists (to prevent duplication)
    if (window.emotionBarChart instanceof Chart) {
        window.emotionBarChart.destroy();
    }

    // Create a new bar chart
    window.emotionBarChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: emotions,
            datasets: [{
                data: counts,
                backgroundColor: "white", // White bars
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "white" } // White text for labels
                },
                y: {
                    display: false // Hide Y-axis completely
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
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
    renderMyEmotions(); // Load user's personal emotions from local storage
});
