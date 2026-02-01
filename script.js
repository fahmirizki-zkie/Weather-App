const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");

const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDateTxt = document.querySelector(".current-date-txt");

const forecastItemsContainer = document.querySelector(
  ".forcast-items-container",
);

const apiKey = "d205df114825a4d867f2218faaec7d62";

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(apiUrl);

  return response.json();
}

function getweatherIcon(id) {
  if (id <= 232) return "thunderstorm";
  if (id <= 321) return "drizzle";
  if (id <= 531) return "rain";
  if (id <= 622) return "snow";
  if (id <= 781) return "atmosphere";
  if (id <= 800) return "clear";
  else return "clouds";
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
}
async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);

  if (weatherData.cod != "200") {
    showDispalySection(notFoundSection);
    return;
  }
  console.log(weatherData);

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(temp) + "°C";
  conditionTxt.textContent = main;
  humidityValueTxt.textContent = humidity + "%";
  windValueTxt.textContent = speed + " M/s";

  currentDateTxt.textContent = getCurrentDate();
  weatherSummaryImg.src = `image/weather/${getweatherIcon(id)}.svg`;

  await updateForecastsInfo(city);
  showDispalySection(weatherInfoSection);
}

async function updateForecastsInfo(city) {
  const forecastsData = await getFetchData("forecast", city);

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemsContainer.innerHTML = "";
  forecastsData.list.forEach((forecastsWeather) => {
    if (
      forecastsWeather.dt_txt.includes(timeTaken) &&
      !forecastsWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastsItems(forecastsWeather);
    }
  });
}

function updateForecastsItems(weatherData) {
  console.log(weatherData);
  const {
    dt_txt : date,
    main: { temp },
    weather: [{ id }],
  } = weatherData;

  const dateTaken = new Date(date)
  const dateOptions = {
    day: "2-digit",
    month: "short"
  }
  
  const dateResult = dateTaken.toLocaleDateString("en-US", dateOptions);

  const forecastItem = `
    <div class="forcast-item">
        <h5 class="forcast-item-date reguler-txt">${dateResult}</h5>
        <img class="forcast-weather-img" src="image/weather/${getweatherIcon(id)}.svg" alt="weather icon" />
        <h5 class="forcast-item-temp">${Math.round(temp)}&#176;C</h5>
    </div>
  `

  forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
}

function showDispalySection(section) {
  [weatherInfoSection, notFoundSection, searchCitySection].forEach(
    (section) => (section.style.display = "none"),
  );

  section.style.display = "flex";
}
