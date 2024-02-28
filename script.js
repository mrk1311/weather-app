searchBox = document.getElementById("search");
locationForm = document.getElementById("location-form");

locationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeatherData(searchBox.value);
  searchBox.value = "";
});

async function getWeatherData(location) {
  const current = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=2a65f85fe682482ebaa103832242502&q=${location}`,
    { mode: "cors" }
  );
  const currentWeatherData = await current.json();
  processTodaysData(currentWeatherData);

  const forecast = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=2a65f85fe682482ebaa103832242502&q=${location}&days=14`,
    { mode: "cors" }
  );
  const forecastData = await forecast.json();
  showHourlyForecast(forecastData);

  showDailyForecast(forecastData);
}

function processTodaysData(data) {
  processedData = {
    location: data.location.name,
    temperature_c: data.current.temp_c,
    temperature_f: data.current.temp_f,
    feelsLike_c: data.current.feelslike_c,
    feelsLike_f: data.current.feelslike_f,
    humidity: data.current.humidity,
    wind_mph: data.current.wind_mph,
    wind_kph: data.current.wind_kph,
    wind_dir: data.current.wind_dir,
    precip_in: data.current.precip_in,
    precip_mm: data.current.precip_mm,
    condition: data.current.condition.text,
    icon: data.current.condition.icon,
  };
  showTodaysWeather(processedData);
  //   console.log(processedData);
  console.log(data);
}

showTodaysWeather = (data) => {
  weatherToday = document.getElementById("weather-today");
  locationText = document.getElementById("location");
  locationText.textContent = data.location;

  weatherToday.innerHTML = "";

  const temperature = document.createElement("div");
  temperature.classList.add("temperature");
  temperature.textContent = `${data.temperature_c}°C`;

  const condition = document.createElement("div");
  condition.classList.add("condition");
  condition.textContent = data.condition;

  const icon = document.createElement("img");
  icon.src = data.icon;
  icon.alt = data.condition;

  const feelsLike = document.createElement("div");
  feelsLike.classList.add("feels-like");
  feelsLike.textContent = `Feels like: ${data.feelsLike_c}°C`;

  const humidity = document.createElement("div");
  humidity.classList.add("humidity");
  humidity.textContent = `Humidity: ${data.humidity}%`;

  const wind = document.createElement("div");
  wind.classList.add("wind");
  wind.textContent = `Wind: ${data.wind_kph} kph ${data.wind_dir}`;

  const precip = document.createElement("div");
  precip.classList.add("precip");
  precip.textContent = `Precipitation: ${data.precip_mm} mm`;

  temperature.appendChild(icon);
  weatherToday.appendChild(temperature);
  weatherToday.appendChild(condition);
  weatherToday.appendChild(feelsLike);
  weatherToday.appendChild(humidity);
  weatherToday.appendChild(wind);
  weatherToday.appendChild(precip);
};

function showHourlyForecast(data) {
  console.log(data);

  const forecastData = data.forecast.forecastday;
  const hourlyForecast = forecastData[0].hour;

  const hourlyForecastDiv = document.getElementById("hourly-forecast");
  hourlyForecastDiv.innerHTML = "";

  const timeEpoch = data.location.localtime_epoch;
  const nextHours = hourlyForecast.filter((hour) => {
    return hour.time_epoch > timeEpoch;
  });

  nextHours.forEach((hour) => {
    const hourDiv = document.createElement("div");
    hourDiv.classList.add("hour");
    hourDiv.innerHTML = `
            <p>${hour.time.slice(11, 16)}</p>
            <img src="${hour.condition.icon}" alt="${hour.condition.text}">
            <p>${hour.temp_c}°C</p>
        `;
    hourlyForecastDiv.appendChild(hourDiv);
  });

  for (i = 0; i < 24 - nextHours.length; i++) {
    const hourDiv = document.createElement("div");
    hourDiv.classList.add("hour");
    hourDiv.innerHTML = `
            <p>${hourlyForecast[i].time.slice(11, 16)}</p>
            <img src="${hourlyForecast[i].condition.icon}" alt="${
      hourlyForecast[i].condition.text
    }">
            <p>${hourlyForecast[i].temp_c}°C</p>
        `;

    hourlyForecastDiv.appendChild(hourDiv);
  }
}

function showDailyForecast(data) {
  const forecastData = data.forecast.forecastday;
  const dailyForecast = document.getElementById("daily-forecast");
  dailyForecast.innerHTML = "";

  forecastData.forEach((day) => {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.innerHTML = `
                <div>${day.date.slice(5, 10)}</div>
                <img src="${day.day.condition.icon}" alt="${
      day.day.condition.text
    }">
                <p>max: ${day.day.maxtemp_c}°C</p>
                <p>min: ${day.day.mintemp_c}°C</p>
            `;
    dailyForecast.appendChild(dayDiv);
  });
}

getWeatherData("Olsztyn");
