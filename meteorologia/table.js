// table.js - Versió amb transició gradual del color
let previousValues = {};
let lastUpdateTime = new Date();

function fetchAndUpdate() {
    const today = new Date();
    const endDate = today.toISOString().slice(0,10);
    const startDate = new Date(today.getTime() - 29 * 24 * 3600 * 1000).toISOString().slice(0,10);

    Promise.all(municipis.map(m => fetch(getUrl(m.lat, m.lon)).then(r => r.json())))
        .then(results => {
            const actuals = results.map(r => r.current_weather);
            const dailys = results.map(r => r.daily);
            const hourlys = results.map(r => r.hourly);

            // Càlculs de precipitació i temperatura aparent actual
            let prec24h = [null, null];
            let prec7d = [null, null];
            let prec24hForecast = [null, null];
            let prec3hForecast = [null, null];
            let apparentTempNow = [null, null];

            for (let i = 0; i < municipis.length; i++) {
                prec24h[i] = dailys[i].precipitation_sum[0] !== undefined ? dailys[i].precipitation_sum[0] : null;
                prec7d[i] = dailys[i].precipitation_sum.slice(0, 7).reduce((a, b) => a + (b !== null && b !== undefined ? b : 0), 0);
                prec24hForecast[i] = dailys[i].precipitation_sum[1] !== undefined ? dailys[i].precipitation_sum[1] : null;

                // Temperatura aparent actual (hora actual)
                if (hourlys[i] && hourlys[i].apparent_temperature && hourlys[i].time) {
                    const now = new Date();
                    let idx = hourlys[i].time.findIndex(t => new Date(t) >= now);
                    if (idx === -1) idx = hourlys[i].time.length - 1;
                    apparentTempNow[i] = hourlys[i].apparent_temperature[idx];
                }

                // Previsió pròximes 3 hores
                if (hourlys[i] && hourlys[i].precipitation && hourlys[i].time) {
                    const now = new Date();
                    let idx = hourlys[i].time.findIndex(t => new Date(t) >= now);
                    if (idx === -1) idx = hourlys[i].time.length - 3;
                    let sum = 0;
                    for (let h = 0; h < 3; h++) {
                        if (hourlys[i].precipitation[idx + h] !== undefined)
                            sum += hourlys[i].precipitation[idx + h];
                    }
                    prec3hForecast[i] = sum;
                } else {
                    prec3hForecast[i] = null;
                }
            }

            Promise.all(municipis.map(m => fetch(getHistoricalUrl(m.lat, m.lon, startDate, endDate)).then(r => r.json())))
                .then(histResults => {
                    let precDays = [];
                    for (let i = 0; i < municipis.length; i++) {
                        precDays[i] = [];
                        if (histResults[i].daily && histResults[i].daily.precipitation_sum) {
                            let arr = histResults[i].daily.precipitation_sum;
                            for (let d = 2; d <= 30; d++) {
                                let sum = arr.slice(-d).reduce((a, b) => a + (b !== null && b !== undefined ? b : 0), 0);
                                precDays[i][d] = sum;
                            }
                        } else {
                            for (let d = 2; d <= 30; d++) precDays[i][d] = null;
                        }
                    }

                    // --- TAULA COMPLETA ---
                    let html = "";

                    // Hora de l'actualització
                    html += `<tr>
                        <td>Hora de l'actualització</td>
                        <td id="update_time_0">${formatUpdateTime(actuals[0].time)}</td>
                        <td id="update_time_1">${formatUpdateTime(actuals[1].time)}</td>
                    </tr>`;

                    // Dades actuals
                    html += `<tr>
                        <td>Temperatura actual</td>
                        <td id="actual_temp_0">${actuals[0].temperature !== undefined ? actuals[0].temperature.toFixed(1) + " °C" : "-"}</td>
                        <td id="actual_temp_1">${actuals[1].temperature !== undefined ? actuals[1].temperature.toFixed(1) + " °C" : "-"}</td>
                    </tr>`;

                    // Temperatura de sensació actual
                    html += `<tr>
                        <td>Temperatura actual de sensació</td>
                        <td id="apparent_temp_now_0">${apparentTempNow[0] !== null ? apparentTempNow[0].toFixed(1) + " °C" : "-"}</td>
                        <td id="apparent_temp_now_1">${apparentTempNow[1] !== null ? apparentTempNow[1].toFixed(1) + " °C" : "-"}</td>
                    </tr>`;

                    html += `<tr>
                        <td>Velocitat vent actual</td>
                        <td id="actual_windspeed_0">${actuals[0].windspeed !== undefined ? actuals[0].windspeed.toFixed(1) + " km/h" : "-"}</td>
                        <td id="actual_windspeed_1">${actuals[1].windspeed !== undefined ? actuals[1].windspeed.toFixed(1) + " km/h" : "-"}</td>
                    </tr>`;

                    html += `<tr>
                        <td>Direcció vent actual</td>
                        <td id="actual_winddirection_0">${actuals[0].winddirection !== undefined ? actuals[0].winddirection.toFixed(0) + "°" : "-"}</td>
                        <td id="actual_winddirection_1">${actuals[1].winddirection !== undefined ? actuals[1].winddirection.toFixed(0) + "°" : "-"}</td>
                    </tr>`;

                    html += `<tr>
                        <td>Codi temps actual</td>
                        <td id="actual_weathercode_0">${actuals[0].weathercode !== undefined ? actuals[0].weathercode : "-"}</td>
                        <td id="actual_weathercode_1">${actuals[1].weathercode !== undefined ? actuals[1].weathercode : "-"}</td>
                    </tr>`;

                    // Variables diàries completes
                    dailyVars.forEach(v => {
                        html += `<tr>
                            <td>${v.label}</td>
                            <td id="${v.key}_0">${dailys[0][v.key] && dailys[0][v.key][0] !== undefined ? dailys[0][v.key][0].toFixed(v.decimals) + " " + v.unit : "-"}</td>
                            <td id="${v.key}_1">${dailys[1][v.key] && dailys[1][v.key][0] !== undefined ? dailys[1][v.key][0].toFixed(v.decimals) + " " + v.unit : "-"}</td>
                        </tr>`;
                    });

                    // Previsions i acumulacions
                    html += `<tr>
                        <td>Precipitació pròximes 3 hores</td>
                        <td id="prec3hForecast_0">${prec3hForecast[0] !== null ? prec3hForecast[0].toFixed(1) + " mm" : "-"}</td>
                        <td id="prec3hForecast_1">${prec3hForecast[1] !== null ? prec3hForecast[1].toFixed(1) + " mm" : "-"}</td>
                    </tr>`;

                    html += `<tr>
                        <td>Precipitació pròximes 24h</td>
                        <td id="prec24hForecast_0">${prec24hForecast[0] !== null ? prec24hForecast[0].toFixed(1) + " mm" : "-"}</td>
                        <td id="prec24hForecast_1">${prec24hForecast[1] !== null ? prec24hForecast[1].toFixed(1) + " mm" : "-"}</td>
                    </tr>`;

                    html += `<tr>
                        <td>Precipitació últimes 24h</td>
                        <td id="prec24_0">${prec24h[0] !== null ? prec24h[0].toFixed(1) + " mm" : "-"}</td>
                        <td id="prec24_1">${prec24h[1] !== null ? prec24h[1].toFixed(1) + " mm" : "-"}</td>
                    </tr>`;

                    html += `<tr>
                        <td>Precipitació últims 7 dies</td>
                        <td id="prec7d_0">${precDays[0][7] !== null ? precDays[0][7].toFixed(1) + " mm" : "-"}</td>
                        <td id="prec7d_1">${precDays[1][7] !== null ? precDays[1][7].toFixed(1) + " mm" : "-"}</td>
                    </tr>`;

                    html += `<tr>
                        <td>Precipitació últims 15 dies</td>
                        <td id="prec15d_0">${precDays[0][15] !== null ? precDays[0][15].toFixed(1) + " mm" : "-"}</td>
                        <td id="prec15d_1">${precDays[1][15] !== null ? precDays[1][15].toFixed(1) + " mm" : "-"}</td>
                    </tr>`;

                    html += `<tr>
                        <td>Precipitació últims 30 dies</td>
                        <td id="prec30d_0">${precDays[0][30] !== null ? precDays[0][30].toFixed(1) + " mm" : "-"}</td>
                        <td id="prec30d_1">${precDays[1][30] !== null ? precDays[1][30].toFixed(1) + " mm" : "-"}</td>
                    </tr>`;

                    // Hores de sol
                    html += `<tr>
                        <td>Sortida de sol</td>
                        <td id="sunrise_0">${horaHM(dailys[0][sunriseVar.key] && dailys[0][sunriseVar.key][0])}</td>
                        <td id="sunrise_1">${horaHM(dailys[1][sunriseVar.key] && dailys[1][sunriseVar.key][0])}</td>
                    </tr>`;

                    html += `<tr>
                        <td>Posta de sol</td>
                        <td id="sunset_0">${horaHM(dailys[0][sunsetVar.key] && dailys[0][sunsetVar.key][0])}</td>
                        <td id="sunset_1">${horaHM(dailys[1][sunsetVar.key] && dailys[1][sunsetVar.key][0])}</td>
                    </tr>`;

                    document.getElementById('weather').innerHTML = html;

                    // Netejar les animacions anteriors abans de marcar nous canvis
                    clearPreviousHighlights();

                    // Marcatge de canvis per a TOTES les dades (EXCEPTE l'hora de l'actualització)
                    checkAndMarkChange('actual_temp_0', actuals[0].temperature);
                    checkAndMarkChange('actual_temp_1', actuals[1].temperature);
                    checkAndMarkChange('apparent_temp_now_0', apparentTempNow[0]);
                    checkAndMarkChange('apparent_temp_now_1', apparentTempNow[1]);
                    checkAndMarkChange('actual_windspeed_0', actuals[0].windspeed);
                    checkAndMarkChange('actual_windspeed_1', actuals[1].windspeed);
                    checkAndMarkChange('actual_winddirection_0', actuals[0].winddirection);
                    checkAndMarkChange('actual_winddirection_1', actuals[1].winddirection);
                    checkAndMarkChange('actual_weathercode_0', actuals[0].weathercode);
                    checkAndMarkChange('actual_weathercode_1', actuals[1].weathercode);

                    dailyVars.forEach(v => {
                        checkAndMarkChange(`${v.key}_0`, dailys[0][v.key] ? dailys[0][v.key][0] : undefined);
                        checkAndMarkChange(`${v.key}_1`, dailys[1][v.key] ? dailys[1][v.key][0] : undefined);
                    });

                    checkAndMarkChange('prec3hForecast_0', prec3hForecast[0]);
                    checkAndMarkChange('prec3hForecast_1', prec3hForecast[1]);
                    checkAndMarkChange('prec24hForecast_0', prec24hForecast[0]);
                    checkAndMarkChange('prec24hForecast_1', prec24hForecast[1]);
                    checkAndMarkChange('prec24_0', prec24h[0]);
                    checkAndMarkChange('prec24_1', prec24h[1]);
                    checkAndMarkChange('prec7d_0', precDays[0][7]);
                    checkAndMarkChange('prec7d_1', precDays[1][7]);
                    checkAndMarkChange('prec15d_0', precDays[0][15]);
                    checkAndMarkChange('prec15d_1', precDays[1][15]);
                    checkAndMarkChange('prec30d_0', precDays[0][30]);
                    checkAndMarkChange('prec30d_1', precDays[1][30]);

                    // Actualitza previousValues per a totes les dades
                    previousValues = {
                        'actual_temp_0': actuals[0].temperature,
                        'actual_temp_1': actuals[1].temperature,
                        'apparent_temp_now_0': apparentTempNow[0],
                        'apparent_temp_now_1': apparentTempNow[1],
                        'actual_windspeed_0': actuals[0].windspeed,
                        'actual_windspeed_1': actuals[1].windspeed,
                        'actual_winddirection_0': actuals[0].winddirection,
                        'actual_winddirection_1': actuals[1].winddirection,
                        'actual_weathercode_0': actuals[0].weathercode,
                        'actual_weathercode_1': actuals[1].weathercode,
                        'prec3hForecast_0': prec3hForecast[0],
                        'prec3hForecast_1': prec3hForecast[1],
                        'prec24hForecast_0': prec24hForecast[0],
                        'prec24hForecast_1': prec24hForecast[1],
                        'prec24_0': prec24h[0],
                        'prec24_1': prec24h[1],
                        'prec7d_0': precDays[0][7],
                        'prec7d_1': precDays[1][7],
                        'prec15d_0': precDays[0][15],
                        'prec15d_1': precDays[1][15],
                        'prec30d_0': precDays[0][30],
                        'prec30d_1': precDays[1][30]
                    };

                    dailyVars.forEach(v => {
                        previousValues[`${v.key}_0`] = dailys[0][v.key] ? dailys[0][v.key][0] : undefined;
                        previousValues[`${v.key}_1`] = dailys[1][v.key] ? dailys[1][v.key][0] : undefined;
                    });

                    // Guardem també l'hora de l'actualització
                    previousValues['update_time_0'] = actuals[0].time;
                    previousValues['update_time_1'] = actuals[1].time;

                    // Actualitzem l'hora de l'última actualització
                    lastUpdateTime = new Date();

                    // Reiniciar el compte enrera després d'una actualització exitosa
                    startCountdown();
                })
                .catch(error => {
                    document.getElementById('error').textContent = "No s'han pogut carregar les dades històriques.";
                    console.error(error);
                    startCountdown();
                });
        })
        .catch(error => {
            document.getElementById('error').textContent = "No s'han pogut carregar les dades.";
            console.error(error);
            startCountdown();
        });
}

// Funció per netejar els ressaltats anteriors
function clearPreviousHighlights() {
    // Aturem i reiniciem les animacions per forçar un nou cicle
    const allCells = document.querySelectorAll('.weather-table td');
    allCells.forEach(cell => {
        // Eliminem les classes per aturar qualsevol animació en curs
        cell.classList.remove('up');
        cell.classList.remove('down');

        // Força un reflow per reiniciar les animacions
        void cell.offsetWidth;
    });
}

// Funció per formatejar l'hora de l'actualització
function formatUpdateTime(timeString) {
    if (!timeString) return "-";

    try {
        const date = new Date(timeString);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error("Error al formatejar l'hora:", error);
        return timeString;
    }
}

// Funció per marcar canvis amb animació gradual
function checkAndMarkChange(id, newValue) {
    const cell = document.getElementById(id);
    if (!cell || newValue === undefined || newValue === null) return;
    const prev = previousValues[id];
    if (prev === undefined) return;

    // No comparem valors per als codis de temps, direccions de vent, hores de sol o hores d'actualització
    if (id.includes('weathercode') || id.includes('winddirection') ||
        id.includes('sunrise') || id.includes('sunset') || id.includes('update_time')) {
        return;
    }

    // Calcula la diferència percentual per ajustar la intensitat inicial
    let intensity = 1;
    if (typeof prev === 'number' && prev !== 0) {
        const percentChange = Math.abs((newValue - prev) / prev) * 100;
        intensity = Math.min(1, percentChange / 50); // Cap a 50% de canvi màxim per intensitat
    }

    if (newValue > prev) {
        // Per a valors que augmenten (vermell)
        cell.classList.add('up');

        // Ajusta la intensitat inicial basant-se en el canvi percentual
        if (intensity < 1) {
            const startColor = interpolateColor('#ffffff', '#ff9999', intensity);
            cell.style.setProperty('--start-red', startColor);
        }
    } else if (newValue < prev) {
        // Per a valors que disminueixen (blau)
        cell.classList.add('down');

        // Ajusta la intensitat inicial basant-se en el canvi percentual
        if (intensity < 1) {
            const startColor = interpolateColor('#ffffff', '#80b3ff', intensity);
            cell.style.setProperty('--start-blue', startColor);
        }
    }
}

// Funció auxiliar per interpolar colors
function interpolateColor(color1, color2, factor) {
    const hex = color => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgb1 = hex(color1);
    const rgb2 = hex(color2);

    if (!rgb1 || !rgb2) return color1;

    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

    return `rgb(${r}, ${g}, ${b})`;
}

// Inicialització
document.addEventListener('DOMContentLoaded', () => {
    fetchAndUpdate();
    startCountdown(); // Iniciar el compte enrera inicial
    setInterval(fetchAndUpdate, 60000); // Actualitza cada minut
});