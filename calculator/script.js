let display = document.getElementById("display");
let historyDiv = document.getElementById("history");

/* SOUND */
function playSound() {
  // Create a typing-like sound using Web Audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Typing sound characteristics
    oscillator.frequency.setValueAtTime(500, audioContext.currentTime); // Lower frequency
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.05); // Slight pitch drop
    oscillator.type = 'triangle'; // Softer waveform
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Quieter
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08); // Quick fade
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.08); // Shorter duration
  } catch (e) {
    console.log("Sound not supported");
  }
}

/* APPEND */
function append(val) {
  playSound();
  if (display.innerText === "0") {
    display.innerText = val;
  } else if (display.innerText.length < 20) { // Limit input length
    display.innerText += val;
  }
}

/* CLEAR */
function clearDisplay() {
  playSound();
  display.innerText = "0";
}

/* DELETE */
function deleteLast() {
  playSound();
  let text = display.innerText;
  display.innerText = text.slice(0, -1) || "0";
}

/* CALCULATE */
function calculate() {
  playSound();
  try {
    let result = eval(display.innerText);
    
    // Format large numbers
    if (typeof result === 'number' && !isNaN(result)) {
      if (result.toString().length > 15) {
        result = result.toExponential(5);
      }
    }
    
    // Add to history
    historyDiv.innerHTML += `<div>${display.innerText} = ${result}</div>`;
    
    display.innerText = result;
  } catch {
    display.innerText = "Error";
  }
}

/* THEME TOGGLE */
function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* KEYBOARD SUPPORT */
document.addEventListener("keydown", function(e) {
  if (!isNaN(e.key) || "+-*/.".includes(e.key)) {
    append(e.key);
  } else if (e.key === "Enter") {
    calculate();
  } else if (e.key === "Backspace") {
    deleteLast();
  } else if (e.key === "Escape") {
    clearDisplay();
  }
});