//bubble chart
document.addEventListener("DOMContentLoaded", () => {
    const emotions = ["happy", "sad", "angry", "excited", "calm", "anxious"];
    const emotionCounts = { happy: 0, sad: 0, angry: 0, excited: 0, calm: 0, anxious: 0 };

    const bubbleChartCanvas = document.getElementById("bubbleChart").getContext("2d");
    let bubbleChart;

    document.querySelectorAll(".emotion").forEach(button => {
        button.addEventListener("click", () => {
            const emotion = button.getAttribute("data-emotion");
            emotionCounts[emotion]++;  // Increase count for that emotion
            updateBubbleChart();
        });
    });

    function updateBubbleChart() {
        const bubbleData = emotions.map((emotion, index) => ({
            x: Math.random() * 10,  // Random placement for word-cloud effect
            y: Math.random() * 10,
            r: Math.max(10, emotionCounts[emotion] * 5),  // Size grows with input count
            backgroundColor: getColor(emotion),
            label: `${emotion}: ${emotionCounts[emotion]}`
        }));

        if (bubbleChart) {
            bubbleChart.data.datasets[0].data = bubbleData;
            bubbleChart.update();
        } else {
            bubbleChart = new Chart(bubbleChartCanvas, {
                type: 'bubble',
                data: { datasets: [{ label: "Emotions Over Time", data: bubbleData }] },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => context.raw.label
                            }
                        }
                    }
                }
            });
        }
    }

    function getColor(emotion) {
        return {
            happy: "yellow", sad: "blue", angry: "red",
            excited: "orange", calm: "green", anxious: "purple"
        }[emotion];
    }
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
});
