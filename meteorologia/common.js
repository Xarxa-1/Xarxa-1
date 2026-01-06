// common.js
// Variables globals compartides
const municipis = [
    { nom: "Espluga de Francolí", lat: 41.3862, lon: 1.1022 },
    { nom: "Les Borges Blanques", lat: 41.5194, lon: 0.8670 }
];

const dailyVars = [
    { key: "temperature_2m_max", label: "Temperatura màxima", unit: "°C", decimals: 1 },
    { key: "temperature_2m_min", label: "Temperatura mínima", unit: "°C", decimals: 1 },
    { key: "apparent_temperature_max", label: "Temperatura de sensació màxima", unit: "°C", decimals: 1 },
    { key: "apparent_temperature_min", label: "Temperatura de sensació mínima", unit: "°C", decimals: 1 },
    { key: "dew_point_2m_max", label: "Punt de rosada màxim", unit: "°C", decimals: 1 },
    { key: "dew_point_2m_min", label: "Punt de rosada mínim", unit: "°C", decimals: 1 },
    { key: "relative_humidity_2m_mean", label: "Humitat relativa mitjana", unit: "%", decimals: 0 },
    { key: "precipitation_sum", label: "Precipitació acumulada (avui)", unit: "mm", decimals: 1 },
    { key: "precipitation_hours", label: "Hores de precipitació", unit: "h", decimals: 0 },
    { key: "precipitation_probability_max", label: "Probabilitat màxima de precipitació", unit: "%", decimals: 0 },
    { key: "weathercode", label: "Codi de temps", unit: "", decimals: 0 },
    { key: "wind_speed_10m_max", label: "Velocitat màxima del vent", unit: "km/h", decimals: 1 },
    { key: "wind_gusts_10m_max", label: "Ràfegues màximes de vent", unit: "km/h", decimals: 1 },
    { key: "wind_direction_10m_dominant", label: "Direcció dominant del vent", unit: "°", decimals: 0 },
    { key: "pressure_msl_mean", label: "Pressió atmosfèrica mitjana", unit: "hPa", decimals: 1 },
    { key: "uv_index_max", label: "Índex UV màxim", unit: "", decimals: 1 },
    { key: "uv_index_clear_sky_max", label: "Índex UV cel clar màxim", unit: "", decimals: 1 },
    { key: "cloud_cover_mean", label: "Cobertura de núvols mitjana", unit: "%", decimals: 0 },
    { key: "shortwave_radiation_sum", label: "Radiciació d'ona curta acumulada", unit: "MJ/m²", decimals: 2 },
    { key: "et0_fao_evapotranspiration", label: "Evapotranspiració ET0", unit: "mm", decimals: 2 }
];

const sunriseVar = { key: "sunrise", label: "Sortida de sol" };
const sunsetVar = { key: "sunset", label: "Posta de sol" };

// Variables per al compte enrera
let countdown = 60;
let countdownInterval = null;

// Funció per inicialitzar el menú hamburguesa
function initMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Tancar el menú en fer clic a un enllaç
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
        
        // Marcar la pàgina actual com a activa
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }
}

// Funció per actualitzar el compte enrera a la pàgina
function updateCountdown() {
    const el = document.getElementById('countdown');
    if (el) {
        el.textContent = `Pròxima actualització en ${countdown} segons`;
    }
}

// Funció per iniciar/reiniciar el compte enrera
function startCountdown() {
    countdown = 60;
    updateCountdown();
    
    // Netejar l'interval anterior si existeix
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Iniciar nou interval que compta enrere cada segon
    countdownInterval = setInterval(() => {
        countdown--;
        if (countdown < 0) {
            countdown = 0;
        }
        updateCountdown();
    }, 1000);
}

// Funció per formatejar hora
function horaHM(str) {
    if (!str) return "-";
    return str.slice(11,16);
}

// URL per a dades actuals i previsió
function getUrl(lat, lon) {
    return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,dew_point_2m_max,dew_point_2m_min,relative_humidity_2m_mean,precipitation_sum,precipitation_hours,precipitation_probability_max,weathercode,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,pressure_msl_mean,uv_index_max,uv_index_clear_sky_max,cloud_cover_mean,sunrise,sunset,shortwave_radiation_sum,et0_fao_evapotranspiration&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,precipitation,wind_speed_10m&forecast_days=7&timezone=Europe/Madrid`;
}

// URL per a dades històriques
function getHistoricalUrl(lat, lon, start, end) {
    return `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,pressure_msl_mean,relative_humidity_2m_mean&start_date=${start}&end_date=${end}&timezone=Europe/Madrid`;
}

// Inicialitzar el menú quan es carrega la pàgina
document.addEventListener('DOMContentLoaded', initMenu);