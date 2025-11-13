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

    // Show loader
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

      // Update weather widget
      document.querySelector("#widget-location").innerHTML = data.location.name;
      document.querySelector("#widget-time").innerHTML = `Local Time: ${data.location.localtime}`;
      document.querySelector(".temp-main").innerHTML = `${data.current.temp_c}°C`;
      document.querySelector(".condition").innerHTML = data.current.condition.text;
      document.querySelector(".feels-like").innerHTML = `${data.current.feelslike_c}°C`;
      document.querySelector(".aqi").innerHTML = `AQI: ${data.current.air_quality['us-epa-index']}`;

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

  switch (condition) {
    case "clear":
    case "sunny":
      weatherIcon.innerHTML = '<img src="weather-images/clear.png" alt="Sunny">';
      break;
    case "partly cloudy":
      weatherIcon.innerHTML = '<img src="weather-images/cloud.png" alt="Partly Cloudy">';
      break;
    case "cloudy":
    case "overcast":
      weatherIcon.innerHTML = '<img src="weather-images/clouds.png" alt="Cloudy">';
      break;
    case "fog":
    case "mist":
      weatherIcon.innerHTML = '<img src="weather-images/misty.png" alt="Misty">';
      break;
    case "light rain":
       case "light drizzle":
       case "light rain shower":
    case "patchy rain nearby":
      weatherIcon.innerHTML = '<img src="weather-images/drizzle.png" alt="Drizzle">';
      break;
    case "moderate or heavy rain shower":
    case "moderate rain":
      weatherIcon.innerHTML = '<img src="weather-images/rain.png" alt="Rain">';
      break;
    case "heavy rain":
      weatherIcon.innerHTML = '<img src="weather-images/heavy-rain.png" alt="Heavy Rain">';
      break;
    case "thunderstorm":
      weatherIcon.innerHTML = '<img src="weather-images/thunderstorm.png" alt="Thunderstorm">';
      break;
    case "moderate snow":
    case "heavy snow":
    case "light snow":
      weatherIcon.innerHTML = '<img src="weather-images/snow.png" alt="Snow">';
      break;
    default:
      weatherIcon.innerHTML = '<img src="weather-images/default.png" alt="Weather">';
      break;
  }
}


function getDayName(dateString) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(dateString);
  return days[date.getDay()];
}


function timelyWeather(data) {
  for (let i = 0; i < data.forecast.forecastday.length; i++) {
    const forecast = data.forecast.forecastday[i];

  
    const dayElement = document.querySelector(`#d${i + 1}`);
    if (dayElement) dayElement.innerHTML = getDayName(forecast.date);

  
    const tempElement = document.querySelector(`#d${i + 1}-time-temp`);
    if (tempElement) tempElement.innerHTML = `${forecast.day.avgtemp_c}°`;

 
    const iconElement = document.querySelector(`#d${i + 1}-time-icon img`);
    if (iconElement) {
      iconElement.src = `weather-images/${mapConditionToIcon(forecast.day.condition.text)}.png`;
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



//login and signup
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const toLogin = document.getElementById("toLogin");
  const toSignup = document.getElementById("toSignup");

  // Toggle between forms
  toLogin.addEventListener("click", (e) => {
    e.preventDefault();
    signupForm.classList.remove("active");
    loginForm.classList.add("active");
  });

  toSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
  });

  // Sign Up validation
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

    // Allow normal submit to signup.php
  });

  // Login validation
  loginForm.addEventListener("submit", (e) => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      e.preventDefault();
      alert("Enter both email and password.");
      return;
    }
  });
});

