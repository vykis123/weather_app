const form = document.getElementById("form");
const cityInput = document.getElementById("search__input");
const forecastWrapper = document.querySelector(".wrapper");
const spinner = document.getElementById("spinner");
const forecastText = document.querySelector(".forcast__text");
console.log(forecastText);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let cityName = cityInput.value;
  const info = await gettingWeatherInfoByCity(cityName);
  console.log(info);

  creatingGlassHtml(info);
  creatingCityHtml(cityName);
  creatingEightDaysForecast(info);

  cityInput.value = "";
});

const headingDisplay = () => {
  const box = document.querySelectorAll(".forcast__box");

  if (forecastWrapper.innerHTML === "") {
    forecastText.innerHTML = "Enter city to get infomation";
  } else {
    forecastText.innerHTML = `Daily forecast for 8 days`;
  }
};

headingDisplay();

const gettingWeatherInfoByCity = async (cityName) => {
  const gettingLocation = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=c364660d479f89ce3472e450b1a599b1`;

  try {
    showSpinner();
    const response = await fetch(gettingLocation);
    const data = await response.json();

    let cityLat = data[0].lat;
    let cityLon = data[0].lon;

    const allDayWeatherInfo = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&appid=c364660d479f89ce3472e450b1a599b1&units=metric`
    );
    const returnedAllWeatherInfo = await allDayWeatherInfo.json();

    hideSpinner();
    return returnedAllWeatherInfo;
  } catch (error) {
    throw Error(error, "Error");
  }
};

const creatingCityHtml = (data) => {
  const cityBlock = document.querySelectorAll(".city");
  cityBlock.forEach((el) => el.remove());

  let date = new Date(),
    month = months[date.getMonth()],
    day = date.getDate(),
    year = date.getFullYear();

  const cityNameTemplate = `
  <div class="city">
  <h1 class="city__name">${data}</h1>
  <span class="current__date">${month} ${day}, ${year}</span>
  </div>
  `;

  form.insertAdjacentHTML("afterend", cityNameTemplate);
};

const creatingGlassHtml = (data) => {
  const glassDiv = document.querySelectorAll(".glass");
  glassDiv.forEach((el) => el.remove());

  const glassInfoTamplate = `
      <div class="glass">
      <div class="glass__info sunrise">
        <span class="sunrise__time">${convertMsToTime(
          data.current.sunrise
        )}</span>
        <span class="sunrise__text">Sunrise</span>
      </div>
      <div class="glass__info sunset">
      <span class="sunset__info">${convertMsToTime(data.current.sunset)}</span>
      <span class="sunset__text">Sunset</span>
    </div>
      <div class="glass__info wind">
        <span class="wind__speed">${parseFloat(data.current.wind_speed).toFixed(
          0
        )} m/s</span>
        <span class="wind__text">Wind</span>
      </div>
      <div class="glass__info maxtempreture">
      <span><img src="http://openweathermap.org/img/wn/${
        data.current.weather[0]["icon"]
      }.png"/></span>
        <span class="wind__info">${data.current.weather[0]["main"]}  </span>
      </div>
      <div class="glass__info mintempreture">
        <span class="wind__info">${parseFloat(data.current.temp).toFixed(
          0
        )} °C </span>
        <span class="wind__text">Current Temp</span>
      </div>
      <div class="glass__info rain">
        <span class="rain__info">${data.current.humidity} %</span>
        <span class="rain__text">Rain Probability</span>
      </div>

    </div>
      `;

  form.insertAdjacentHTML("afterend", glassInfoTamplate);
};

function convertMsToTime(miliseconds) {
  let date = new Date(miliseconds * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  hours = hours % 24;

  return `${hours}:${minutes}:${seconds}`;
}

function convertMsToDate(miliseconds) {
  let date = new Date(miliseconds * 1000),
    month = months[date.getMonth()],
    day = date.getDate(),
    year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

const creatingEightDaysForecast = (data) => {
  const box = document.querySelectorAll(".forcast__box");
  box.forEach((el) => el.remove());

  if (box === "none") {
    forecastText.innerHTML = "Enter city to get infomation";
  } else {
    forecastText.innerHTML = `Daily forecast for 8 days`;
  }

  data.daily.forEach((el) => {
    let forecastTag = `
    
            <div class="forcast__box">
            <span class='date'>${convertMsToDate(el.dt)}</span>
              <span class="sunrise">${convertMsToTime(el.sunrise)}</span>
              <span class="sunset">${convertMsToTime(el.sunset)}</span>
              <img src="http://openweathermap.org/img/wn/${
                el.weather[0]["icon"]
              }.png"/>
              <span class="max">${parseFloat(el.temp.day).toFixed(0)} °C</span>
              <span>${parseFloat(el.temp.night).toFixed(0)} °C</span>
            </div>
    
    `;
    forecastWrapper.insertAdjacentHTML("afterbegin", forecastTag);
  });
};

const showSpinner = () => {
  spinner.classList.add("vissible");
};

const hideSpinner = () => {
  spinner.classList.remove("vissible");
};
