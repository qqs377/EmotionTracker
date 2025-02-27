//bubble chart
document.addEventListener("DOMContentLoaded", () => {
    // Set up initial emotion counts from localStorage or default to 0
    const emotions = ["happy", "sad", "angry", "excited", "calm", "anxious"];
    const emotionCounts = JSON.parse(localStorage.getItem("emotionCounts")) || {
        happy: 0, sad: 0, angry: 0, excited: 0, calm: 0, anxious: 0
    };

    const bubbleChartCanvas = document.getElementById("bubbleChart").getContext("2d");
    let bubbleChart;

    // Event listeners for emotion buttons
    document.querySelectorAll(".emotion").forEach(button => {
        button.addEventListener("click", () => {
            const emotion = button.getAttribute("data-emotion");
            emotionCounts[emotion]++;  // Increase count for that emotion
            localStorage.setItem("emotionCounts", JSON.stringify(emotionCounts));  // Update localStorage
            updateBubbleChart();
        });
    });

    // Function to update the bubble chart with current data
    function updateBubbleChart() {
        const bubbleData = emotions.map((emotion, index) => ({
            x: Math.random() * 10,  // Random placement for word-cloud effect
            y: Math.random() * 10,
            r: Math.max(10, emotionCounts[emotion] * 5),  // Size grows with input count
            backgroundColor: getColor(emotion),
            label: `${emotion}: ${emotionCounts[emotion]}`
        }));

        // Update or create the bubble chart
        if (bubbleChart) {
            bubbleChart.data.datasets[0].data = bubbleData;
            bubbleChart.update();
        } else {
            bubbleChart = new Chart(bubbleChartCanvas, {
                type: 'bubble',
                data: { datasets: [{ label: "Emotions", data: bubbleData }] },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => context.raw.label
                            }
                        }
                    },
                    scales: {
                        x: { display: false },  // Hide x-axis
                        y: { display: false },  // Hide y-axis
                    },
                    layout: {
                        padding: { top: 0, bottom: 0, left: 0, right: 0 }
                    },
                    elements: {
                        point: { radius: 0 }  // Remove point styling for cleaner bubbles
                    },
                    animation: {
                        duration: 0  // Disable animation for instant update
                    }
                }
            });
        }
    }

    // Function to determine bubble color based on emotion
    function getColor(emotion) {
        return {
            happy: "yellow", sad: "blue", angry: "red",
            excited: "orange", calm: "green", anxious: "purple"
        }[emotion];
    }

    // Initialize the chart with existing data
    updateBubbleChart();
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
