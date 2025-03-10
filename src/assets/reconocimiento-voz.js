const startButton = document.getElementById("startButton");
const outputDiv = document.getElementById("output");
const clearButton = document.getElementById("clear");

// Config
const LANG = "es";
clearButton.addEventListener("click", () => {
    outputDiv.textContent = "";
});

const recognition = new (window.SpeechRecognition ||
window.webkitSpeechRecognition ||
window.mozSpeechRecognition ||
window.msSpeechRecognition)();

recognition.lang = LANG;

recognition.onresult = (event) => {
const transcript = event.results[0][0].transcript;
outputDiv.textContent += ` ${transcript}`;
};

recognition.onstart = () => startButton.textContent = "Listening...";;
recognition.onend = () => startButton.textContent = "Start Voice Input";;
startButton.addEventListener("click", () => recognition.start());