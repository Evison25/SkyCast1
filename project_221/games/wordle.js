import words from "an-array-of-english-words";

const fiveLetterWords = words.filter(w => w.length === 5);
console.log(fiveLetterWords.slice(0, 10));

document.addEventListener("keyup", (event) => {
  console.log("Key pressed:", event.key);
});
