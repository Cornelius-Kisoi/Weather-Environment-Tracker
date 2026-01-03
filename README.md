🌤️ Weather Forecast Web App

A modern, responsive weather application built with Vanilla JavaScript that fetches real-time weather data using the OpenWeatherMap API.
The app supports automatic location detection, city-based search, 5-day temperature forecasts, and air quality index (AQI) visualization.

🚀 Features

📍 Auto-detect user location using browser Geolocation API

🔎 Search weather by city name

🌡️ Displays:

Current temperature

Weather description

Humidity

Wind speed

📊 5-day forecast chart (daily noon temperatures)

🫁 Air Quality Index (AQI) with color-coded levels

🎨 Dynamic weather icons (Font Awesome)

🌈 Dynamic background gradients based on weather condition

⏳ Loading spinner for better UX

📱 Responsive and user-friendly UI

🛠️ Technologies Used

HTML5

CSS3

JavaScript (ES6+)

OpenWeatherMap API

Chart.js

Chart.js Data Labels Plugin

Font Awesome

Browser Geolocation API

📦 Project Structure
├── index.html
├── style.css
├── script.js   // (contains the provided code)
└── assets/

🔑 API Setup

This project uses the OpenWeatherMap API.

Create a free account at
👉 https://openweathermap.org/api

Generate an API key.

Replace the API key in script.js:

const API_KEY = "YOUR_API_KEY_HERE";


⚠️ Security Tip:
For production apps, never expose API keys directly in client-side JavaScript. Use a backend or environment variables.

▶️ How It Works
1. On Page Load

Detects user’s current location

Fetches weather, forecast, and air quality data

2. Search by City

User enters a city name

Fetches weather data using city-based API request

Updates UI dynamically

3. Forecast Chart

Uses OpenWeatherMap 5-day forecast

Extracts daily temperatures at 12:00 PM

Displays results in a smooth line chart

4. Air Quality

Displays AQI level:

Good

Fair

Moderate

Poor

Very Poor

Applies color-coded feedback

📊 AQI Levels Reference
AQI Value	Level
1	Good
2	Fair
3	Moderate
4	Poor
5	Very Poor
🧪 Browser Compatibility

✅ Chrome

✅ Firefox

✅ Edge

⚠️ Safari (Geolocation requires HTTPS)

🧩 Dependencies (CDN Example)

Make sure these are included in your index.html:

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

📌 Possible Improvements

🌍 Add unit toggle (°C / °F)

🕒 Hourly forecast

🗺️ Weather map integration

🔐 Backend proxy for API key protection

📱 Progressive Web App (PWA) support

📄 License

This project is open-source and available under the MIT License.

👤 Author

Cornelius Kisoi
Built as a JavaScript weather & data visualization project.
