document.addEventListener("DOMContentLoaded", () => {
    const emotions = document.querySelectorAll(".emotion");
    const bubbleChartCanvas = document.getElementById("bubbleChart").getContext("2d");
    const waveGraphCanvas = document.getElementById("waveGraph").getContext("2d");

    let emotionData = [];
    let bubbleChart, waveGraph;

    emotions.forEach(button => {
        button.addEventListener("click", () => {
            const emotion = button.getAttribute("data-emotion");
            const timestamp = new Date().toISOString();
            emotionData.push({ emotion, timestamp });

            updateCharts();
        });
    });

    function updateCharts() {
        updateBubbleChart();
        updateWaveGraph();
    }

    function updateBubbleChart() {
        const formattedData = emotionData.map((data, index) => ({
            x: index, y: Math.random() * 10, r: 10,
            backgroundColor: getColor(data.emotion),
            label: data.emotion
        }));

        if (bubbleChart) {
            bubbleChart.data.datasets = [{
                label: "Emotions Over Time",
                data: formattedData,
                backgroundColor: formattedData.map(d => d.backgroundColor)
            }];
            bubbleChart.update();
        } else {
            bubbleChart = new Chart(bubbleChartCanvas, {
                type: 'bubble',
                data: { datasets: [{ label: "Emotions Over Time", data: formattedData }] },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Emotion: ${context.raw.label}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }

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
