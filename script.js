//word cloud
let emotionCounts = {
    happy: 0,
    sad: 0,
    angry: 0,
    excited: 0,
    calm: 0,
    anxious: 0
};

// Initialize WordCloud only when the library is loaded
function initializeWordCloud() {
    if (typeof WordCloud === "undefined") {
        console.error("WordCloud library not loaded");
        return;
    }

    // Handle click events for each emotion button
    document.querySelectorAll('.emotion').forEach(button => {
        button.addEventListener('click', () => {
            const emotion = button.dataset.emotion;
            emotionCounts[emotion]++;

            // Update word cloud based on the counts
            updateWordCloud();
        });
    });
}

// Function to update the word cloud with current emotion counts
function updateWordCloud() {
    const wordCloudData = Object.keys(emotionCounts).map(emotion => ({
        text: emotion,
        weight: emotionCounts[emotion] * 10, // Adjust weight to increase/decrease the size
        className: emotion // Add the emotion as a class for color styling
    }));

    // WordCloud expects a list of pairs [text, weight]
    const wordList = wordCloudData.map(data => [data.text, data.weight]);

    // Ensure WordCloud is defined before attempting to use it
    if (typeof WordCloud === "function") {
        WordCloud(document.getElementById('wordCloud'), {
            list: wordList, // Pass the word list to WordCloud
            gridSize: 18,
            weightFactor: 5,
            fontFamily: 'Arial',
            color: 'random-dark',
            backgroundColor: '#fff',
            hover: function (event, word, item) {
                // Apply the emotion class on hover to change color
                item.classList.add(word.className);
            },
            click: function (event, word, item) {
                // Optional: Handle click event for the words
                console.log(word.text + " clicked!");
            }
        });
    } else {
        console.error("WordCloud function is not defined");
    }
}


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
