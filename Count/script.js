let count = parseInt(localStorage.getItem("count")) || 0;

function updateDisplay() {
  const countDisplay = document.getElementById("count");
  countDisplay.textContent = count;
  countDisplay.style.transform = "scale(1.1)";
  setTimeout(() => {
    countDisplay.style.transform = "scale(1)";
  }, 150);
  localStorage.setItem("count", count);
}

function increaseCount() {
  count++;
  updateDisplay();
}

function decreaseCount() {
  count--;
  updateDisplay();
}

function resetCount() {
  count = 0;
  updateDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
  updateDisplay();

  document.getElementById('increase-btn').addEventListener('click', increaseCount);
  document.getElementById('decrease-btn').addEventListener('click', decreaseCount);
  document.getElementById('reset-btn').addEventListener('click', resetCount);
});
