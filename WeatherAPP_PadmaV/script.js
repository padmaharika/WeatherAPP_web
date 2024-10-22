
// I will be leaving comments function by function 

// constants created to hold the api keys from OpenWeather and WeatherAPI and WeatherBit
const apiKey1 = 'c323f567c966bad0ef336c6c4721ee0e';  // OpenWeather
const apiKey2 = '355e188451c642158c482725242010';  // WeatherAPI
const apiKey3 = `a5d9788d252b4ddaab6f8f546044ca34`;  // WeatherBit
const weatherBitUrl = `https://api.weatherbit.io/v2.0/current/airquality?key=${apiKey3}&lat=`;
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey1}&units=metric`;


// Search button listener 
document.getElementById('search-button').addEventListener('click', () => {
    const location = document.getElementById('location').value; // this will capture the location entered by the user in input
    if (location) {
        getWeatherInformation(location); // calls this function if the city is found 
    } else {
        alert('Please enter a location');
    }
});

// when the geo button is clicked with the eventlistener it will call the getGeolocation function
document.getElementById('geo-button').addEventListener('click', getGeolocation);


// to get Weather Information
function getWeatherInformation(city) {
    const url = `${weatherUrl}&q=${city}`;
// fetches current weather for the city entered by the user. 
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {  // if successful it updates current weather using the function below 
                updateCurrentWeather(data);
                getForecastByCoordinates(data.coord.lat, data.coord.lon);
            } else {
                alert('City not found'); // if not found it displays an alert
            }
        })
        .catch(error => alert('Error fetching data: ' + error));
}


// function to get user's own location 
function getGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {  // checks if the browser supports the geolocation and if so it retrieves the coordinates
            const { latitude, longitude } = position.coords;
            const url = `${weatherUrl}&lat=${latitude}&lon=${longitude}`; // it uses the coordinates 
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    updateCurrentWeather(data);
                    getForecastByCoordinates(latitude, longitude);
                })
                .catch(error => alert('Error fetching data: ' + error));
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}


// updates the DOM with the current weather information 
function updateCurrentWeather(data) {
    document.getElementById('city').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed} Km/h`;

    const weatherDisplay = `
        <p><strong>${data.weather[0].main}:</strong> ${data.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
    `; // // icon representing the current weather is shown 
    document.getElementById('weatherDisplay').innerHTML = weatherDisplay;
    updateTheme(data.main.temp); // calls this function to update theme based on the temperature
}

function getForecastByCoordinates(lat, lon) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey2}&q=${lat},${lon}&days=7`; // this fethces 7 days forecast
    fetch(url)
        .then(response => response.json())
        .then(data => {
            getSevenDayForecast(data);
            getTwentyFourHourForecast(data);
        })
        .catch(error => alert('Error fetching forecast: ' + error));
}

// function to get 24 hours of data 
function getTwentyFourHourForecast(data) {
    const hourlyDisplay = document.getElementById('hourlyDisplay');
    hourlyDisplay.innerHTML = ''; 

    const hourlyForecast = data.forecast.forecastday[0].hour; 
    const currentTime = new Date().getHours();

    // // this function clears any previous hourly forecast and then loops through the forecast data starting from the user's CURRENT hour
    for (let i = currentTime; i < currentTime + 24; i++) {
        const hourData = hourlyForecast[i % 24];
        const hourElement = document.createElement('div');
        hourElement.classList.add('forecast-hour');
        const time = new Date(hourData.time).getHours();

        hourElement.innerHTML = `
            <h4>${time}:00</h4>
            <p>${Math.round(hourData.temp_c)}°C</p>
            <img src="https://cdn.weatherapi.com/weather/64x64/day/${hourData.condition.icon.split('/').pop()}" alt="${hourData.condition.text}">
            <p>${hourData.condition.text}</p>
        `;
        hourlyDisplay.appendChild(hourElement);
    // each hour gets time, temperature and weather condition - appended here
    }
}

// function to get 7 day forecast 
function getSevenDayForecast(data) {
    const forecastDisplay = document.getElementById('forecastDisplay');
    forecastDisplay.innerHTML = ''; // Clear previous forecast

    const forecastDays = data.forecast.forecastday;
    forecastDays.forEach(day => {
        const date = new Date(day.date);
        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-day');
        dayElement.innerHTML = `
            <h4>${date.toLocaleDateString('en-US', { weekday: 'short' })}</h4>
            <p>${Math.round(day.day.avgtemp_c)}°C</p>
            <img src="https://cdn.weatherapi.com/weather/64x64/day/${day.day.condition.icon.split('/').pop()}" alt="${day.day.condition.text}">
            <p>${day.day.condition.text}</p>
        `;
        forecastDisplay.appendChild(dayElement);
    });
}


// this function updates the overall theme of the web page based on the temperature 
function updateTheme(temp) {
    const container = document.querySelector('.container');  
    if (temp < 10) {
        container.className = 'container cold'; 
    } else if (temp > 20) {
        container.className = 'container hot';  
    } else {
        container.className = 'container';  
    } // based on the temperture it applies diffreent classes to the container for changing the background colour 
}

// this function displays the current date and day on the page. Uses the Js' Date object to get the current date and formats it using toLocaleString
function displayDateAndDay() {
    const today = new Date();
    const day = today.toLocaleDateString('en-US', { weekday: 'long' });
    const date = today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    document.getElementById('present-day').textContent = day;
    document.getElementById('present-date').textContent = date; // values are presented in the IDs !
}

function getForecastByCoordinates(lat, lon) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey2}&q=${lat},${lon}&days=7`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            getSevenDayForecast(data);
            getTwentyFourHourForecast(data);
            getWeatherBitData(lat, lon);  // Calls the new function to fetch data from WeatherBit API
        })
        .catch(error => alert('Error fetching forecast: ' + error));
}

// Function to get specific WeatherBit data; Air quality !
function getWeatherBitData(lat, lon) {
    const url = `${weatherBitUrl}${lat}&lon=${lon}`;  
    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateAirQuality(data.data[0].aqi);  
        })
        .catch(error => alert('Error fetching WeatherBit data: ' + error));
}

// Function to update the DOM with WeatherBit data 
function updateAirQuality(aqi) {
    const airQualityDisplay = document.getElementById('airQualityDisplay');
    airQualityDisplay.innerHTML = `<h3><strong>:</strong> ${aqi}</h3>`;
}

displayDateAndDay();