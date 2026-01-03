const API_KEY = "4049262e57f517b3b0f46e8670349fa5";
let weatherChart = null;

const searchInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const loader = document.getElementById('loader');



window.addEventListener('load', () => {
    getUserLocation();
});

searchBtn.addEventListener('click', () => {
    const city = searchInput.value;
    if (city) fetchWeatherByCity(city);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value;
        if (city) fetchWeatherByCity(city);
    }
});

// --- Core Logic ---

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
    } else {
        alert("Geolocation is not supported by this browser");
    }
}

function positionSuccess(position) {
    fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
}

function positionError(error) {
    console.warn(`Error (${error.code}): ${error.message}`);
    document.getElementById('location').innerText = "Location Denied. Search for a city!";
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!response.ok) throw new Error('Weather data not found');
        const data = await response.json();
        
        updateWeatherUI(data);
        fetchForecast(lat, lon);
        fetchAirQuality(lat, lon);
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

async function fetchWeatherByCity(city) {
    showLoader(); // 1. Show the spinner
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod === "404") {
            alert("City not found!");
            hideLoader(); // 2. Hide if city not found
            return
        }

        updateWeatherUI(data);
        fetchForecast(data.coord.lat, data.coord.lon);
        fetchAirQuality(data.coord.lat, data.coord.lon);
        searchInput.value = '';
    } catch (error) {
        console.error("Search Error:", error);
    } finally {
        hideLoader(); // 3. Hide spinner no matter what happens
    }
}

function updateWeatherUI(data) {
    const { name } = data;
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { description } = data.weather[0];

    document.getElementById('location').innerText = name;
    document.getElementById('temperature').innerText = `${Math.round(temp)}°C`;
    document.getElementById('description').innerText = description;
    document.getElementById('humidity').innerText = `${humidity}%`;
    document.getElementById('wind-speed').innerText = `${speed} km/h`;

    
    updateWeatherIcon(data.weather[0].main);
    changeBackground(data.weather[0].main);
}

function updateWeatherIcon(condition) {
    const iconContainer = document.querySelector('.temp-container'); // Get parent
    let oldIcon = document.getElementById('weather-icon');
    
    let iconClass = "fa-solid ";
    switch (condition) {
        case 'Clear': 
            iconClass += "fa-sun"; 
            break;
        case 'Clouds': 
            iconClass += "fa-cloud"; 
            break;
        case 'Rain': 
        case 'Drizzle': 
            iconClass += "fa-cloud-showers-heavy"; 
            break;
        case 'Thunderstorm': 
            iconClass += "fa-bolt-lightning"; 
            break;
        case 'Snow': 
            iconClass += "fa-snowflake"; 
            break;
        case 'Mist': 
        case 'Haze': 
        case 'Fog': 
            iconClass += "fa-smog";
            break;
        default: 
            iconClass += "fa-cloud-sun";
    }

    const newIcon = document.createElement('i');
    newIcon.id = "weather-icon";
    newIcon.className = iconClass;
    newIcon.style.fontSize = "4rem";
    newIcon.style.marginBottom = "10px";
    newIcon.style.display = "block"; // Ensure it takes its own line

    if (oldIcon) {
        iconContainer.replaceChild(newIcon, oldIcon);
    }
}

// --- Forecast & Charts ---

async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        updateChart(data); 
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

function updateChart(data) {
    const ctx = document.getElementById('forecast-chart').getContext('2d');
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    const labels = dailyData.map(item => new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }));
    const temps = dailyData.map(item => Math.round(item.main.temp));

    if (weatherChart) { weatherChart.destroy(); }
    Chart.register(ChartDataLabels);

    weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: temps,
                borderColor: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: {
                    align: 'top',
                    anchor: 'end',
                    color: '#fff',
                    formatter: (val) => val + '°'
                }
            },
            scales: {
                y: { display: false },
                x: { ticks: { color: '#fff' }, grid: { display: false } }
            }
        }
    });
}

async function fetchAirQuality(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();
        const aqi = data.list[0].main.aqi;
        const aqiLevels = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
        const aqiColors = ["", "#2ecc71", "#f1c40f", "#e67e22", "#e74c3c", "#8e44ad"];

        const aqiElement = document.getElementById('aqi-level');
        aqiElement.innerText = aqiLevels[aqi];
        aqiElement.style.color = aqiColors[aqi];
    } catch (error) {
        console.error("AQI Error:", error);
    }
}

function changeBackground(condition) {
    const body = document.body;
    let gradient = "";
    switch (condition) {
        case 'Clear' : 
            gradient = "linear-gradient(135deg, #f6d365 0%, #fda085 100% )"; 
            break;
        case 'Clouds': 
            gradient = "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)"; 
            break;
        case 'Rain' : 
        case 'Drizzle': 
            gradient = "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"; 
            break;
        default: 
            gradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
    body.style.background = gradient;
}

function showLoader() {
    loader.style.display = 'flex';
}

function hideLoader() {
    loader.style.display = 'none';
}