// charts.js
let precChart = null, tempChart = null, pressChart = null, humChart = null;
let rainHourChart = null, tempHourChart = null, apparentTempHourChart = null;

// Funció per carregar i mostrar el gràfic de precipitació
function loadPrecipitationChart() {
    const today = new Date();
    const endDate = today.toISOString().slice(0,10);
    const startDate = new Date(today.getTime() - 29 * 24 * 3600 * 1000).toISOString().slice(0,10);

    Promise.all(municipis.map(m => fetch(getHistoricalUrl(m.lat, m.lon, startDate, endDate)).then(r => r.json())))
        .then(histResults => {
            const precip30_0 = histResults[0].daily.precipitation_sum;
            const precip30_1 = histResults[1].daily.precipitation_sum;
            const total0 = precip30_0.reduce((a, b) => a + (b !== null && b !== undefined ? b : 0), 0);
            const total1 = precip30_1.reduce((a, b) => a + (b !== null && b !== undefined ? b : 0), 0);
            const dates30 = histResults[0].daily.time;

            // Gràfic de precipitació
            if (precChart) precChart.destroy();
            precChart = new Chart(document.getElementById('precChart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: dates30,
                    datasets: [
                        {
                            label: `Espluga de Francolí (${total0.toFixed(1)} mm)`,
                            data: precip30_0,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: `Les Borges Blanques (${total1.toFixed(1)} mm)`,
                            data: precip30_1,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { title: { display: true, text: 'Data' } },
                        y: { title: { display: true, text: 'mm' }, beginAtZero: true }
                    }
                }
            });
            
            startCountdown();
        })
        .catch(error => {
            console.error(error);
            startCountdown();
        });
}

// Funció per carregar i mostrar el gràfic de temperatures
function loadTemperatureChart() {
    const today = new Date();
    const endDate = today.toISOString().slice(0,10);
    const startDate = new Date(today.getTime() - 29 * 24 * 3600 * 1000).toISOString().slice(0,10);

    Promise.all(municipis.map(m => fetch(getHistoricalUrl(m.lat, m.lon, startDate, endDate)).then(r => r.json())))
        .then(histResults => {
            const tempMax0 = histResults[0].daily.temperature_2m_max;
            const tempMin0 = histResults[0].daily.temperature_2m_min;
            const tempMax1 = histResults[1].daily.temperature_2m_max;
            const tempMin1 = histResults[1].daily.temperature_2m_min;
            const dates30 = histResults[0].daily.time;

            if (tempChart) tempChart.destroy();
            tempChart = new Chart(document.getElementById('tempChart').getContext('2d'), {
                type: 'line',
                data: {
                    labels: dates30,
                    datasets: [
                        {
                            label: 'Espluga (màxima)',
                            data: tempMax0,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.15)',
                            tension: 0.3,
                            pointRadius: 0
                        },
                        {
                            label: 'Espluga (mínima)',
                            data: tempMin0,
                            borderColor: 'rgba(54, 162, 235, 0.7)',
                            backgroundColor: 'rgba(54, 162, 235, 0.07)',
                            tension: 0.3,
                            pointRadius: 0
                        },
                        {
                            label: 'Borges (màxima)',
                            data: tempMax1,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.15)',
                            tension: 0.3,
                            pointRadius: 0
                        },
                        {
                            label: 'Borges (mínima)',
                            data: tempMin1,
                            borderColor: 'rgba(255, 99, 132, 0.7)',
                            backgroundColor: 'rgba(255, 99, 132, 0.07)',
                            tension: 0.3,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { title: { display: true, text: 'Data' } },
                        y: { title: { display: true, text: '°C' }, beginAtZero: false }
                    }
                }
            });
            
            startCountdown();
        })
        .catch(error => {
            console.error(error);
            startCountdown();
        });
}

// Funció per carregar i mostrar el gràfic de pressió
function loadPressureChart() {
    const today = new Date();
    const endDate = today.toISOString().slice(0,10);
    const startDate = new Date(today.getTime() - 29 * 24 * 3600 * 1000).toISOString().slice(0,10);

    Promise.all(municipis.map(m => fetch(getHistoricalUrl(m.lat, m.lon, startDate, endDate)).then(r => r.json())))
        .then(histResults => {
            const press0 = histResults[0].daily.pressure_msl_mean;
            const press1 = histResults[1].daily.pressure_msl_mean;
            const dates30 = histResults[0].daily.time;

            if (pressChart) pressChart.destroy();
            pressChart = new Chart(document.getElementById('pressChart').getContext('2d'), {
                type: 'line',
                data: {
                    labels: dates30,
                    datasets: [
                        {
                            label: 'Espluga de Francolí',
                            data: press0,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.15)',
                            tension: 0.3,
                            pointRadius: 0
                        },
                        {
                            label: 'Les Borges Blanques',
                            data: press1,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.15)',
                            tension: 0.3,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { title: { display: true, text: 'Data' } },
                        y: { title: { display: true, text: 'hPa' }, beginAtZero: false }
                    }
                }
            });
            
            startCountdown();
        })
        .catch(error => {
            console.error(error);
            startCountdown();
        });
}

// Funció per carregar i mostrar el gràfic d'humitat
function loadHumidityChart() {
    const today = new Date();
    const endDate = today.toISOString().slice(0,10);
    const startDate = new Date(today.getTime() - 29 * 24 * 3600 * 1000).toISOString().slice(0,10);

    Promise.all(municipis.map(m => fetch(getHistoricalUrl(m.lat, m.lon, startDate, endDate)).then(r => r.json())))
        .then(histResults => {
            const hum0 = histResults[0].daily.relative_humidity_2m_mean;
            const hum1 = histResults[1].daily.relative_humidity_2m_mean;
            const dates30 = histResults[0].daily.time;

            if (humChart) humChart.destroy();
            humChart = new Chart(document.getElementById('humChart').getContext('2d'), {
                type: 'line',
                data: {
                    labels: dates30,
                    datasets: [
                        {
                            label: 'Espluga de Francolí',
                            data: hum0,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.15)',
                            tension: 0.3,
                            pointRadius: 0
                        },
                        {
                            label: 'Les Borges Blanques',
                            data: hum1,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.15)',
                            tension: 0.3,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { title: { display: true, text: 'Data' } },
                        y: { title: { display: true, text: '%' }, beginAtZero: true, max: 100 }
                    }
                }
            });
            
            startCountdown();
        })
        .catch(error => {
            console.error(error);
            startCountdown();
        });
}

// Funció per carregar i mostrar el gràfic de pluja hora a hora
function loadRainHourChart() {
    Promise.all(municipis.map(m => fetch(getUrl(m.lat, m.lon)).then(r => r.json())))
        .then(results => {
            const hourlys = results.map(r => r.hourly);
            const hourLabels = hourlys[0].time.map(t => t.slice(5,16).replace('T',' '));

            if (rainHourChart) rainHourChart.destroy();
            rainHourChart = new Chart(document.getElementById('rainHourChart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: hourLabels,
                    datasets: [
                        {
                            label: 'Espluga de Francolí',
                            data: hourlys[0].precipitation,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Les Borges Blanques',
                            data: hourlys[1].precipitation,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'top' } },
                    scales: {
                        x: { title: { display: true, text: 'Hora' }, ticks: { maxTicksLimit: 24 } },
                        y: { title: { display: true, text: 'mm/hora' }, beginAtZero: true }
                    }
                }
            });
            
            startCountdown();
        })
        .catch(error => {
            console.error(error);
            startCountdown();
        });
}

// Funció per carregar i mostrar el gràfic de temperatura hora a hora
function loadTempHourChart() {
    Promise.all(municipis.map(m => fetch(getUrl(m.lat, m.lon)).then(r => r.json())))
        .then(results => {
            const hourlys = results.map(r => r.hourly);
            const hourLabels = hourlys[0].time.map(t => t.slice(5,16).replace('T',' '));

            if (tempHourChart) tempHourChart.destroy();
            tempHourChart = new Chart(document.getElementById('tempHourChart').getContext('2d'), {
                type: 'line',
                data: {
                    labels: hourLabels,
                    datasets: [
                        {
                            label: 'Espluga de Francolí',
                            data: hourlys[0].temperature_2m,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.1)',
                            tension: 0.3,
                            pointRadius: 0
                        },
                        {
                            label: 'Les Borges Blanques',
                            data: hourlys[1].temperature_2m,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.1)',
                            tension: 0.3,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { title: { display: true, text: 'Hora' }, ticks: { maxTicksLimit: 24 } },
                        y: { title: { display: true, text: '°C' }, beginAtZero: false }
                    }
                }
            });
            
            startCountdown();
        })
        .catch(error => {
            console.error(error);
            startCountdown();
        });
}

// Funció per carregar i mostrar el gràfic de temperatura de sensació hora a hora
function loadApparentTempHourChart() {
    Promise.all(municipis.map(m => fetch(getUrl(m.lat, m.lon)).then(r => r.json())))
        .then(results => {
            const hourlys = results.map(r => r.hourly);
            const hourLabels = hourlys[0].time.map(t => t.slice(5,16).replace('T',' '));

            if (apparentTempHourChart) apparentTempHourChart.destroy();
            apparentTempHourChart = new Chart(document.getElementById('apparentTempHourChart').getContext('2d'), {
                type: 'line',
                data: {
                    labels: hourLabels,
                    datasets: [
                        {
                            label: 'Espluga de Francolí',
                            data: hourlys[0].apparent_temperature,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.1)',
                            tension: 0.3,
                            pointRadius: 0
                        },
                        {
                            label: 'Les Borges Blanques',
                            data: hourlys[1].apparent_temperature,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.1)',
                            tension: 0.3,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { title: { display: true, text: 'Hora' }, ticks: { maxTicksLimit: 24 } },
                        y: { title: { display: true, text: '°C' }, beginAtZero: false }
                    }
                }
            });
            
            startCountdown();
        })
        .catch(error => {
            console.error(error);
            startCountdown();
        });
}

// Carregar el gràfic corresponent segons la pàgina actual
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'precipitacio.html':
            loadPrecipitationChart();
            setInterval(loadPrecipitationChart, 60000);
            break;
        case 'temperatures.html':
            loadTemperatureChart();
            setInterval(loadTemperatureChart, 60000);
            break;
        case 'pressio.html':
            loadPressureChart();
            setInterval(loadPressureChart, 60000);
            break;
        case 'humitat.html':
            loadHumidityChart();
            setInterval(loadHumidityChart, 60000);
            break;
        case 'pluja_hora.html':
            loadRainHourChart();
            setInterval(loadRainHourChart, 60000);
            break;
        case 'temperatura_hora.html':
            loadTempHourChart();
            setInterval(loadTempHourChart, 60000);
            break;
        case 'sensacio_hora.html':
            loadApparentTempHourChart();
            setInterval(loadApparentTempHourChart, 60000);
            break;
    }
    
    startCountdown();
});