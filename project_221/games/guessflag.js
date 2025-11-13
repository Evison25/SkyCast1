const easyFlags = [
  { country: "India", code: "in" }, { country: "United States", code: "us" },
  { country: "France", code: "fr" }, { country: "Japan", code: "jp" },
  { country: "Brazil", code: "br" }, { country: "United Kingdom", code: "gb" },
  { country: "Canada", code: "ca" }, { country: "Italy", code: "it" },
  { country: "Germany", code: "de" }, { country: "Australia", code: "au" },
  { country: "China", code: "cn" }, { country: "Russia", code: "ru" },
  { country: "Mexico", code: "mx" }, { country: "South Korea", code: "kr" },
  { country: "Spain", code: "es" }, { country: "Argentina", code: "ar" },
  { country: "Netherlands", code: "nl" }, { country: "Sweden", code: "se" },
  { country: "Switzerland", code: "ch" }, { country: "South Africa", code: "za" },
  { country: "Portugal", code: "pt" }, { country: "Turkey", code: "tr" },
  { country: "New Zealand", code: "nz" }, { country: "Norway", code: "no" },
  { country: "Finland", code: "fi" }, { country: "Greece", code: "gr" },
  { country: "Poland", code: "pl" }, { country: "Denmark", code: "dk" },
  { country: "Ireland", code: "ie" }, { country: "Belgium", code: "be" }
];

const hardFlags = [
  { country: "Bhutan", code: "bt" }, { country: "Eswatini", code: "sz" },
  { country: "Kiribati", code: "ki" }, { country: "Seychelles", code: "sc" },
  { country: "Belize", code: "bz" }, { country: "Moldova", code: "md" },
  { country: "Mauritius", code: "mu" }, { country: "Vanuatu", code: "vu" },
  { country: "Malawi", code: "mw" }, { country: "Lesotho", code: "ls" },
  { country: "Brunei", code: "bn" }, { country: "Suriname", code: "sr" },
  { country: "Nauru", code: "nr" }, { country: "Andorra", code: "ad" },
  { country: "Comoros", code: "km" }, { country: "Liechtenstein", code: "li" },
  { country: "Palau", code: "pw" }, { country: "Micronesia", code: "fm" },
  { country: "San Marino", code: "sm" }, { country: "Togo", code: "tg" },
  { country: "Djibouti", code: "dj" }, { country: "Sao Tome and Principe", code: "st" },
  { country: "Timor-Leste", code: "tl" }, { country: "Saint Kitts and Nevis", code: "kn" },
  { country: "Barbados", code: "bb" }, { country: "Dominica", code: "dm" },
  { country: "Tuvalu", code: "tv" }, { country: "Samoa", code: "ws" },
  { country: "Tonga", code: "to" }, { country: "Solomon Islands", code: "sb" },
  { country: "Gabon", code: "ga" }, { country: "Burundi", code: "bi" },
  { country: "Eritrea", code: "er" }, { country: "Guyana", code: "gy" },
  { country: "Papua New Guinea", code: "pg" }, { country: "Mongolia", code: "mn" },
  { country: "Paraguay", code: "py" }, { country: "Laos", code: "la" },
  { country: "Cambodia", code: "kh" }, { country: "Fiji", code: "fj" },
  { country: "Namibia", code: "na" }, { country: "Qatar", code: "qa" }
];

let score = 0;
let currentFlag;
let isHardMode = false;
let playerName = "";

const flagImage = document.getElementById("flagImage");
const optionsContainer = document.getElementById("options");
const scoreDisplay = document.getElementById("score");
const message = document.getElementById("message");
const nextBtn = document.getElementById("nextBtn");
const hardModeToggle = document.getElementById("hardModeToggle");
const playerInput = document.getElementById("playerName");
const saveNameBtn = document.getElementById("saveNameBtn");
const leaderboardList = document.getElementById("leaderboardList");

// Switch between easy/hard
hardModeToggle.addEventListener("change", () => {
  isHardMode = hardModeToggle.checked;
  score = 0;
  scoreDisplay.textContent = score;
  nextFlag();
});

saveNameBtn.addEventListener("click", () => {
  const name = playerInput.value.trim();
  if (name !== "") {
    playerName = name;
    message.textContent = `Player set to: ${playerName}`;
    loadLeaderboard();
  }
});

function getRandomFlags(flagArray, count = 4) {
  let shuffled = [...flagArray].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function strtFlag() {
  const flags = isHardMode ? hardFlags : easyFlags;
  currentFlag = flags[Math.floor(Math.random() * flags.length)];
  flagImage.src = `https://flagcdn.com/w320/${currentFlag.code}.png`;
}

function nextFlag() {
  const flagArray = isHardMode ? hardFlags : easyFlags;
  const options = getRandomFlags(flagArray, 4);
  currentFlag = options[Math.floor(Math.random() * options.length)];

  flagImage.src = `https://flagcdn.com/w320/${currentFlag.code}.png`;
  optionsContainer.innerHTML = "";

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option.country;
    btn.classList.add("option-btn");
    btn.onclick = () => checkAnswer(option.country);
    optionsContainer.appendChild(btn);
  });

  message.textContent = "";
}

function checkAnswer(selected) {
  if (selected === currentFlag.country) {
    score++;
    scoreDisplay.textContent = score;
    message.textContent = "✅ Correct!";
    nextFlag();
  } else {
    message.textContent = `❌ Wrong! Game Over, ${playerName}!`;
    updateLeaderboard(playerName, score);
    score = 0;
    scoreDisplay.textContent = score;
    loadLeaderboard();
  }
}

function updateLeaderboard(name, score) {
  if (!name) return;
  fetch("update_leaderboard.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, score }),
  })
  .then(res => res.json())
  .then(() => loadLeaderboard());
}

function loadLeaderboard() {
  fetch("leaderboard.json")
    .then(res => res.json())
    .then(data => {
      leaderboardList.innerHTML = "";
      const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
      sorted.forEach(([name, score]) => {
        const li = document.createElement("li");
        li.textContent = `${name}: ${score}`;
        leaderboardList.appendChild(li);
      });
    });
}

nextBtn.addEventListener("click", nextFlag);
window.onload = () => { nextFlag(); loadLeaderboard(); };
strtFlag();