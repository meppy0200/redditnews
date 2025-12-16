/**
 * Chart.js yapılandırmaları ve grafik oluşturma fonksiyonları
 */

// Chart.js global ayarları
Chart.defaults.color = '#475569'; // Slate 600
Chart.defaults.borderColor = '#e2e8f0'; // Slate 200
Chart.defaults.font.family = 'Inter, sans-serif';

/**
 * Yıllık gönderi sayısı grafiği
 */
function createYearlyPostsChart(data) {
    const ctx = document.getElementById('yearly-posts-chart');
    if (!ctx) return;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.years,
            datasets: [{
                label: 'Gönderi Sayısı',
                data: data.postCounts,
                borderColor: '#4f46e5', // Indigo 600
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2.5,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    titleFont: { size: 13, weight: '600' },
                    bodyFont: { size: 13 },
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            return `${context.parsed.y.toLocaleString()} Gönderi`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        drawBorder: false,
                    },
                    ticks: {
                        callback: value => value.toLocaleString()
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Ortalama score grafiği
 */
function createAvgScoreChart(data) {
    const ctx = document.getElementById('avg-score-chart');
    if (!ctx) return;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.years,
            datasets: [{
                label: 'Ortalama Score',
                data: data.avgScores,
                backgroundColor: '#f59e0b', // Amber 500
                borderRadius: 4,
                hoverBackgroundColor: '#d97706'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 10,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { drawBorder: false },
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

/**
 * Ortalama yorum sayısı grafiği
 */
function createAvgCommentsChart(data) {
    const ctx = document.getElementById('avg-comments-chart');
    if (!ctx) return;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.years,
            datasets: [{
                label: 'Ortalama Yorum',
                data: data.avgComments,
                borderColor: '#10b981', // Emerald 500
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 10,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { drawBorder: false },
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

/**
 * En popüler kelimeler grafiği
 */
function createTopWordsChart(data) {
    const ctx = document.getElementById('top-words-chart');
    if (!ctx) return;

    const topWords = data.words.slice(0, 15);
    const topFreqs = data.frequencies.slice(0, 15);

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topWords,
            datasets: [{
                label: 'Kullanım',
                data: topFreqs,
                backgroundColor: '#6366f1', // Indigo 500
                borderRadius: 4,
                barPercentage: 0.7
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 10,
                    callbacks: {
                        label: function (context) {
                            return `${context.parsed.x.toLocaleString()} kez`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { display: true, drawBorder: false },
                    ticks: { callback: value => value.toLocaleString() }
                },
                y: {
                    grid: { display: false }
                }
            }
        }
    });
}
