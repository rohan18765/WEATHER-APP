 
document.addEventListener('DOMContentLoaded' , () =>{

    const form = document.getElementById('search-form');
    const feelsLike = document.getElementById('feels-like');
    const windSpeed = document.getElementById('wind-speed');
    const humidity = document.getElementById('humidity');
    const city_name = document.getElementById('city-name');
    const current_temp = document.getElementById('current-temp');
    const current_date = document.getElementById('current-date-time');
    const weather_description = document.getElementById('weather-description');
    const search_button = document.getElementById('search-button');
    const forecastContainer = document.getElementById("forecast-container");
    const weatherDisplay = document.getElementById('weather-display');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
   

    form.addEventListener('submit' , (event)=>
    {   
        event.preventDefault() ;
        const location = document.getElementById('city-input').value ;
        if (!location.trim()) {
        alert("Please enter a city name");
        return;
        }

        
        showLoading();
        hideError();
        weatherDisplay.classList.add('hidden');


 
   
    function  ChangeDateToString(data)
    {
        const localtime = data.location.localtime; // "2025-11-01 13:18"
        const dateObj = new Date(localtime.replace(" ", "T")); // convert to valid Date format

        const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "numeric",
        hour12: true
        }

        return dateObj.toLocaleString("en-US", options);
        
    };


      

       

        function UpdateForecast(forecastData) {
        
        const forecast= document.getElementById('forecast');
        forecast.innerHTML = "3-Day Forecast" ;
        forecastContainer.innerHTML = ""; // clear previous forecast

        forecastData.forEach(day => {
            const dateObj = new Date(day.date);
            const weekday = dateObj.toLocaleString("en-US", { weekday: "short" });
            
            const card = `
                <div class="forecast-card">
                    <p>${weekday}</p>
                    <img src="https:${day.day.condition.icon}" alt="">
                    <p>${day.day.avgtemp_c}°C</p>
                    <p>${day.day.condition.text}</p>
                </div>
            `;
            
            forecastContainer.innerHTML += card;
        });
        }

        

    function UpdateData(data)
    {
        city_name.innerHTML = data.location.name ;
        current_temp.innerHTML = `${data.current.temp_c}°C`;
        current_date.innerHTML = ChangeDateToString(data);
        weather_description.innerHTML = data.current.condition.text ;
        feelsLike.innerHTML =  `${data.current.feelslike_c}°C`;
        windSpeed.innerHTML = `${data.current.wind_kph} Km/h`;
        humidity.innerHTML = `${data.current.humidity} % ` ;
    }
    
    const promise = fetch(`https://api.weatherapi.com/v1/forecast.json?key=bee2ce3efd4a4eda87b84918250111&q=${location}&days=3&aqi=yes`)
    .then(res => 
    {
        if(!res.ok) throw new Error("Could not find weather data for that city. Please try again.");
        return res.json()
    }
     )
    .then(data => {
        hideLoading();
        weatherDisplay.classList.remove('hidden');
        UpdateData(data);
        UpdateForecast(data.forecast.forecastday);
    })
  .catch(error => {
    hideLoading();
    showError(error.message || "Something went wrong. Try again later.");
});

  function showLoading() {
        loadingSpinner.classList.remove('hidden');
    }

    function hideLoading() {
        loadingSpinner.classList.add('hidden');
    }

    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }

 
})

});
