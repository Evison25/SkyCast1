const islogged = false;

function ToSignin() {
  window.location.href = "signin.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.querySelector(".city-input");
  const searchBtn = document.querySelector(".sub");
  const loader = document.querySelector(".loader");
  const cloud = document.querySelector(".cloud");

  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Show loader animation
    loader.classList.add("active");
    cloud.classList.remove("animate");
    void cloud.offsetWidth;
    cloud.classList.add("animate");

    const city = cityInput.value || "London";
    const days = 7;
    const weatherapi = "api_key";
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${weatherapi}&q=${city}&days=${days}&aqi=yes&alerts=no`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        alert("WeatherAPI error: " + data.error.message);
        return;
      }

      //Update Main Widget 
      console.log(data);
      document.querySelector("#widget-location").innerHTML = data.location.name;
      document.querySelector("#widget-time").innerHTML = `Local Time: ${data.location.localtime}`;
      document.querySelector(".temp-main").innerHTML = `${data.current.temp_c}°C`;
      document.querySelector(".condition").innerHTML = data.current.condition.text;
      document.querySelector(".feels-like").innerHTML = `${data.current.feelslike_c}°C`;
      document.querySelector(".aqi").innerHTML = `AQI: ${data.current.air_quality['us-epa-index']}`;

      // Update Today's Details 
      document.getElementById("feels-like-detail").innerText = `${data.current.feelslike_c}°`;
      document.getElementById("high-low").innerText = `${data.forecast.forecastday[0].day.maxtemp_c}° / ${data.forecast.forecastday[0].day.mintemp_c}°`;
      document.getElementById("humidity-detail").innerText = `${data.current.humidity}%`;
      document.getElementById("pressure").innerText = `${data.current.pressure_mb} mb`;
      document.getElementById("visibility").innerText = `${data.current.vis_km} km`;
      document.getElementById("wind").innerText = `${data.current.wind_kph} km/h ${data.current.wind_dir}`;
      document.getElementById("dewpoint").innerText = `${data.current.dewpoint_c || "N/A"}°`;
      document.getElementById("uvindex").innerText = data.current.uv || "--";
      document.getElementById("moonphase").innerText = data.forecast.forecastday[0].astro.moon_phase;
      document.getElementById("sunrise-sunset").innerText = `${data.forecast.forecastday[0].astro.sunrise} / ${data.forecast.forecastday[0].astro.sunset}`;

      // === Wind Widget Update ===
      const windSpeedEl = document.getElementById("wind-speed");
      const windDirectionEl = document.getElementById("wind-direction");
      const windGustEl = document.getElementById("wind-gust");
      const windArrowEl = document.getElementById("wind-arrow-icon");

      const windSpeed = data.current.wind_kph;
      const windDeg = data.current.wind_degree;
      const windGust = data.current.gust_kph || "--";

      if (windSpeedEl && windDirectionEl && windGustEl && windArrowEl) {
        windSpeedEl.textContent = `${windSpeed} km/h`;
        windDirectionEl.textContent = `${windDeg}° ${data.current.wind_dir}`;
        windGustEl.textContent = `${windGust} km/h`;

        
        windArrowEl.style.setProperty("--deg", `${windDeg}deg`);
      }

      // === Update Icons and Forecast ===
      iconselect(data);
      timelyWeather(data);
    } catch (err) {
      alert("Error fetching weather: " + err);
    } finally {
      setTimeout(() => {
        loader.classList.remove("active");
      }, 1500);
    }
  });
});

// === ICON SELECTOR ===
function iconselect(data) {
  const weatherIcon = document.querySelector(".weather-icon");
  const condition = data.current.condition.text.toLowerCase();

  let iconName = "default";
  if (condition.includes("sunny") || condition.includes("clear")) iconName = "clear";
  else if (condition.includes("partly")) iconName = "cloud";
  else if (condition.includes("cloudy") || condition.includes("overcast")) iconName = "clouds";
  else if (condition.includes("fog") || condition.includes("mist")) iconName = "misty";
  else if (condition.includes("rain") || condition.includes("drizzle")) iconName = "rain";
  else if (condition.includes("thunder")) iconName = "thunderstorm";
  else if (condition.includes("snow")) iconName = "snow";

  weatherIcon.innerHTML = `<img src="weather-images/${iconName}.png" alt="${data.current.condition.text}">`;
}

function getDayName(dateString) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date(dateString).getDay()];
}

// === 7-day Forecast Cards ===
function timelyWeather(data) {
  for (let i = 0; i < data.forecast.forecastday.length; i++) {
    const forecast = data.forecast.forecastday[i];
    const dayElement = document.querySelector(`#d${i + 1}`);
    const tempElement = document.querySelector(`#d${i + 1}-time-temp`);
    const iconElement = document.querySelector(`#d${i + 1}-time-icon img`);

    if (dayElement) dayElement.innerHTML = getDayName(forecast.date);
    if (tempElement) tempElement.innerHTML = `${forecast.day.avgtemp_c}°`;
    if (iconElement) {
      const iconName = mapConditionToIcon(forecast.day.condition.text);
      iconElement.src = `weather-images/${iconName}.png`;
      iconElement.alt = forecast.day.condition.text;
    }
  }
}

function mapConditionToIcon(condition) {
  condition = condition.toLowerCase();
  if (condition.includes("sunny") || condition.includes("clear")) return "clear";
  if (condition.includes("cloud") || condition.includes("overcast")) return "clouds";
  if (condition.includes("rain") || condition.includes("drizzle")) return "rain";
  if (condition.includes("snow")) return "snow";
  if (condition.includes("fog") || condition.includes("mist")) return "misty";
  if (condition.includes("thunder")) return "thunderstorm";
  return "default";
}

//signup
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const toLogin = document.getElementById("toLogin");
  const toSignup = document.getElementById("toSignup");

  if (toLogin && signupForm && loginForm) {
    toLogin.addEventListener("click", (e) => {
      e.preventDefault();
      signupForm.classList.remove("active");
      loginForm.classList.add("active");
    });
  }

  if (toSignup && signupForm && loginForm) {
    toSignup.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.remove("active");
      signupForm.classList.add("active");
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (!name || !email || !password || !confirmPassword) {
        e.preventDefault();
        alert("Please fill all fields.");
        return;
      }

     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailPattern.test(email)) {
  e.preventDefault();
  alert("Enter a valid email.");
  return;
}


      if (password.length < 6) {
        e.preventDefault();
        alert("Password must be at least 6 characters.");
        return;
      }

      if (password !== confirmPassword) {
        e.preventDefault();
        alert("Passwords do not match!");
        return;
      }

      localStorage.setItem("username", name);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      if (!email || !password) {
        e.preventDefault();
        alert("Enter both email and password.");
      }
    });
  }

  // Replace Sign In with username if logged in
  const signupBtn = document.querySelector(".signup");
  const storedName = localStorage.getItem("username");
  if (storedName && signupBtn) {
    signupBtn.textContent = storedName;
  }
});
