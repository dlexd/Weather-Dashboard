const apiKey = "13c22f86bd102ed4cfb8b46001987cc4";
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("search");
const weatherDiv = document.getElementById("weather");
const forecastDiv = document.getElementById("forecast-box");

// Load last searched city weather and forecast on page load
document.addEventListener("DOMContentLoaded", async () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        const weatherData = await fetchWeatherData(lastCity);
        displayWeather(weatherData);
        const forecastData = await fetchForecastData(lastCity);
        displayForecast(forecastData);
    }
});

searchBtn.addEventListener("click", async () => {
    const city = searchInput.value.trim();
    if (city) {
        const weatherData = await fetchWeatherData(city);
        displayWeather(weatherData);
        const forecastData = await fetchForecastData(city);
        displayForecast(forecastData);
        // Save the city to local storage
        localStorage.setItem("lastCity", city);
    }
});

async function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function fetchForecastData(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function displayWeather(data) {
    if (data.cod === "404") {
        weatherDiv.innerHTML = "City not found";
        return;
    }

    const weatherHtml = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp}°F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} mph</p>
    `;
    weatherDiv.innerHTML = weatherHtml;
}

function displayForecast(data) {
    if (data.cod === "404") {
        forecastDiv.innerHTML = "";
        return;
    }

    let forecastHtml = "";
    data.list.forEach((item, index) => {
        if (index % 8 === 0) {
            forecastHtml += `
                <div class="forecast-box border-black p-4 rounded-md">
                    <h3>${new Date(item.dt * 1000).toLocaleDateString()}</h3>
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                    <p>Temperature: ${item.main.temp}°F</p>
                    <p>Humidity: ${item.main.humidity}%</p>
                    <p>Wind: ${item.wind.speed} mph</p>
                </div>
            `;
        }
    });
    forecastDiv.innerHTML = forecastHtml;
}