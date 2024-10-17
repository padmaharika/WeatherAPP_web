"use strict"; 

const API = 'c3aa059a086b78e7b9fddd553293a4e3';  // remember that the API Key is a string !

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const btnEl = document.querySelector('.btn_search');
const inputEl = document.querySelector(".input_field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector('.list_content ul');

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]

// displaying the day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName; 

// display the date 
let month = day.toLocaleString("default", {month: "long"}); 
let date = day.getDate();
let year = day.getFullYear(); 
dateEl.textContent = date + " " + month + " " + year; 

// add an event 
btnEl.addEventListener("click", (e)=> {
    e.preventDefault();

    // check empty value
    if (inputEl.value !== "") {
        const Search = inputEl.value;  
        inputEl.value = "";  

        findLocation(Search);
    } else {
        console.log("Please Enter City or Country Name")
    }
});

async function findLocation(name) {
    iconsContainer.innerHTML = "";
    dayInfoEl.innerHTML = "";
    listContentEl.innerHTML = ""; 
    try {
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
        const data = await fetch(API_URL); 
        const result = await data.json();

        if (result.cod !== "404") {
            // display image content
            const ImageContent = displayImageContent(result);

            // display right side content
            const rightSide = rightSideContent(result);

            // forecast function
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

// display image content and temp 
function displayImageContent(result) {
    return ` <img src="https://openweathermap.org/img/wn/${result.weather[0].icon}@4x.png" alt=""/>
            <h2 class="weather_temp">${Math.round(result.main.temp - 275.15)}°C</h2>
            <h3 class="cloudtxt">${result.weather[0].description}</h3>`; 
}

// display the right side content
function rightSideContent(result){
    return `<div class="content">
                        <p class="title">NAME</p>
                        <span class="value">${result.name}</span>
                    </div>
                    <div class="content">
                        <p class="title">TEMP</p>
                        <span class="value">${Math.round(result.main.temp - 275.15)}°C</span>
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

async function displayForeCast(lat, long) {
    const ForeCast_API =  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`
    const data = await fetch(ForeCast_API); 
    const result = await data.json(); 
    
    // filter the forecast 
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

// forecast html element days
function foreCast(frContent) {
    const day = new Date(frContent.dt_txt);
    const dayName = days[day.getDay()];
    const joinDay = dayName.substring(0, 3);

    return `<li>
        <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png">
        <span>${joinDay}</span>
        <span class="day_temp">${Math.round(frContent.main.temp - 275.15)}°C</span>
        </li>`; 
}

  var api_key = '83e54857375c4776b39a0bb67239d550';

  // reverse geocoding example (coordinates to address)
  var latitude = '52.3877830';
  var longitude = '9.7334394';
  var query = latitude + ',' + longitude;

  // forward geocoding example (address to coordinate)
  // var query = 'Philipsbornstr. 2, 30165 Hannover, Germany';
  // note: query needs to be URI encoded (see below)

  var api_url = 'https://api.opencagedata.com/geocode/v1/json'

  var request_url = api_url
    + '?'
    + 'key=' + api_key
    + '&q=' + encodeURIComponent(query)
    + '&pretty=1'
    + '&no_annotations=1';

  // see full list of required and optional parameters:
  // https://opencagedata.com/api#required-params

  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {
    // see full list of possible response codes:
    // https://opencagedata.com/api#codes

    if (request.status === 200){
      // Success!
      var data = JSON.parse(request.responseText);
      alert(data.results[0].formatted); // print the location

    } else if (request.status <= 500){
      // We reached our target server, but it returned an error

      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.status.message);
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");
  };

  request.send();  // make the request

  function success(data) {
    var api_key = '83e54857375c4776b39a0bb67239d550';
    var latitude = 'data.coords.latitude';
    var longitude = 'data.coords.longitude';
  
    var api_url = 'https://api.opencagedata.com/geocode/v1/json'
  
    var request_url = api_url
      + '?'
      + 'key=' + api_key
      + '&q=' + encodeURIComponent(query)
      + '&pretty=1'
      + '&no_annotations=1';
      
    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);
  
    request.onload = function() {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes
  
      if (request.status === 200){
        var data = JSON.parse(request.responseText);
        alert(data.results[0].formatted); // print the location
  
      } else if (request.status <= 500){
        // We reached our target server, but it returned an error
  
        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log('error msg: ' + data.status.message);
      } else {
        console.log("server error");
      }
    };
  
    request.onerror = function() {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };
  
    request.send();  // make the request
    
  }

  navigator.geolocation.getCurrentPosition(success, console.error)
  