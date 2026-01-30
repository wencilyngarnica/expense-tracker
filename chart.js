// chart.js - Chart initialization and updates

let expenseChart = null;

function initChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF4444', '#FF6B6B', '#FF9999', '#27AE60', 
                    '#2ECC71', '#52BE80', '#E74C3C', '#C0392B',
                    '#16A085', '#1ABC9C', '#F39C12', '#E67E22'
                ],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
    
    updateChartData();
}

function updateChartData() {
    if (!expenseChart) return;
    
    const categoryTotals = getCategoryTotals();
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    
    // If no expenses, show a placeholder
    if (labels.length === 0) {
        expenseChart.data.labels = ['No expenses'];
        expenseChart.data.datasets[0].data = [1];
        expenseChart.data.datasets[0].backgroundColor = ['#f0f0f0'];
    } else {
        expenseChart.data.labels = labels;
        expenseChart.data.datasets[0].data = data;
    }
    
    expenseChart.update();
}

// Initialize chart when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChart);
} else {
    initChart();
}