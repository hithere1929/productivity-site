document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timerDisplay");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const statusText = document.getElementById("statusText");

  let timeLeft = 25 * 60;
  let timer;
  let isRunning = false;

  const dingSound = new Audio("ding.mp3");
  dingSound.volume = 0.5;

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    statusText.textContent = "Focus session";

    timer = setInterval(() => {
      timeLeft--;
      updateDisplay();

      if (timeLeft <= 0) {
        clearInterval(timer);
        isRunning = false;
        dingSound.play();
        statusText.textContent = "Break time! 🎉";
        timeLeft = 5 * 60;
        updateDisplay();
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timer);
    timeLeft = 25 * 60;
    isRunning = false;
    updateDisplay();
    statusText.textContent = "Focus session";
  }

  function adjustTime(change) {
    timeLeft += change;
    if (timeLeft < 0) timeLeft = 0;
    updateDisplay();
  }

  // ✅ This targets all buttons inside .adjust-group
  document.querySelectorAll(".adjust-group button").forEach(button => {
    button.addEventListener("click", () => {
      const change = parseInt(button.getAttribute("data-change"));
      adjustTime(change);
    });
  });

  startBtn.addEventListener("click", startTimer);
  resetBtn.addEventListener("click", resetTimer);

  updateDisplay();
});