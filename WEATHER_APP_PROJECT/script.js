"use strict"; 

// Constant for API key and UI elements
const API = 'c3aa059a086b78e7b9fddd553293a4e3';  // remember that the API Key is a string !
const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const btnEl = document.querySelector('.btn_search');
const inputEl = document.querySelector(".input_field");
const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector('.list_content ul');

// Array of day names
const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]

// displaying the current day and the date
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName; 

let month = day.toLocaleString("default", {month: "long"}); 
let date = day.getDate();
let year = day.getFullYear(); 
dateEl.textContent = date + " " + month + " " + year; 

// add an event listener to the search button 
btnEl.addEventListener("click", (e)=> {
    e.preventDefault();
    if (inputEl.value !== "") {
        const Search = inputEl.value;  
        inputEl.value = "";  
        findLocation(Search);
    } else {
        console.log("Please Enter City or Country Name")
    }
});

// function to find the location based on the user input
async function findLocation(name) {
    iconsContainer.innerHTML = "";
    dayInfoEl.innerHTML = "";
    listContentEl.innerHTML = ""; 

    try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
        const data = await fetch(API_URL); 
        const result = await data.json();

        if (result.cod !== "404") {
            const ImageContent = displayImageContent(result);
            const rightSide = rightSideContent(result);
            displayForeCast(result.coord.lat, result.coord.lon); 
            
            setTimeout(() => {
               iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
               iconsContainer.classList.add("fadeIn");
               dayInfoEl.insertAdjacentHTML("afterbegin", rightSide);
            }, 1500);

        } else {
            const message = `<h2 class="weather_temp">${result.cod}</h2>
                            <h3 class="cloudtxt">${result.message}</h3>`; 
            iconsContainer.insertAdjacentHTML("afterbegin", message);  
        }
    } catch (error) {
        console.error("Error fetching fata:", error);
    }     
}

// display image content and temperature
function displayImageContent(result) {
    return ` <img src="https://openweathermap.org/img/wn/${result.weather[0].icon}@4x.png" alt=""/>
            <h2 class="weather_temp">${Math.round(result.main.temp - 273.15)}°C</h2>
            <h3 class="cloudtxt">${result.weather[0].description}</h3>`; 
}

// function to display the right side content with weather details
function rightSideContent(result){
    return `<div class="content">
                        <p class="title">NAME</p>
                        <span class="value">${result.name}</span>
                    </div>
                    <div class="content">
                        <p class="title">TEMP</p>
                        <span class="value">${Math.round(result.main.temp - 273.15)}°C</span>
                    </div>
                    <div class="content">
                        <p class="title">HUMIDITY</p>
                        <span class="value">${result.main.humidity}%</span>
                    </div>
                    <div class="content">
                        <p class="title">WIND SPEED</p>
                        <span class="value">${result.wind.speed}</span>
                    </div>`; 
}

// function to display the weather forecast based on coordinates
async function displayForeCast(lat, long) {
    const ForeCast_API =  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`
    const data = await fetch(ForeCast_API); 
    const result = await data.json(); 
    
    const uniqueForeCastDays = [];
    const ForecastDays = result.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate(); 
        if(!uniqueForeCastDays.includes(forecastDate)) {
            uniqueForeCastDays.push(forecastDate); 
            return true;
        } 
        return false;   
    });
    ForecastDays.forEach((content, indx) => {
        if (indx <= 3) {
            listContentEl.insertAdjacentHTML("afterbegin", foreCast(content));
        }
    });

}

// function to create HTML for forecast days
function foreCast(frContent) {
    const day = new Date(frContent.dt_txt);
    const dayName = days[day.getDay()];
    const joinDay = dayName.substring(0, 3);

    return `<li>
        <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png">
        <span>${joinDay}</span>
        <span class="day_temp">${Math.round(frContent.main.temp - 273.15)}°C</span>
        </li>`; 
}

// funtcion to perform reverse geocoding using OpenCage API

async function reverseGeocode(latitude, longitude) {
    const api_key = '83e54857375c4776b39a0bb67239d550';
    const query = `${latitude},${longitude}`;
    const api_url = 'https://api.opencagedata.com/geocode/v1/json';
    const request_url = `${api_url}?key=${api_key}&q=${encodeURIComponent(query)}&pretty=1&no_annotations=1`;

    try {
        const response = await fetch(request_url);
        if (response.ok) {
            const data = await response.json();
            alert(data.results[0].formatted); // Show location in an alert (consider updating the UI instead)
        } else {
            console.log("Unable to geocode! Response code: " + response.status);
            const errorData = await response.json();
            console.log('Error message: ' + errorData.status.message);
        }
    } catch (error) {
        console.log("Unable to connect to server", error);
    }
}

// Function to handle successful geolocation retrieval
function success(data) {
    reverseGeocode(data.coords.latitude, data.coords.longitude);
}

// Check if geolocation is available and fetch the location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, console.error);
} else {
    console.log("Geolocation is not supported by this browser.");
}

// Event listener for search button
document.querySelector(".search button").addEventListener("click", function () {
    findLocation(inputEl.value); // Call findLocation with input value
});

// Event listener for enter key press in search bar
document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        findLocation(inputEl.value); // Call findLocation with input value
    }
});

// Fetch location on load
geocode.getLocation();
  
