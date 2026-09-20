// Get the HTML elements that JavaScript will control.
const audio = document.querySelector("#audio");
const playButton = document.querySelector("#playButton");
const playerPanel = document.querySelector(".player-panel");
const currentEmotion = document.querySelector("#currentEmotion");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const timeline = document.querySelector("#timeline");
const volume = document.querySelector("#volume");
const emotionGrid = document.querySelector("#emotionGrid");
const emotionCards = document.querySelectorAll(".emotion-card");

let isSeeking = false;

// Change seconds into a time such as 1:25.
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function updateRangeFill(input, ratio) {
  input.style.setProperty("--range-progress", `${ratio * 100}%`);
}

function showPlayingState(isPlaying) {
  playButton.classList.toggle("is-playing", isPlaying);
  playerPanel.classList.toggle("is-playing", isPlaying);
  playButton.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
}

// Flip the selected card, load its recording, and start playing it.
function selectEmotion(card) {
  emotionCards.forEach((item) => {
    item.classList.toggle("is-flipped", item === card);
  });

  currentEmotion.textContent = card.dataset.name;
  audio.pause();
  audio.src = card.dataset.audio;
  audio.load();
  timeline.value = "0";
  currentTime.textContent = "0:00";
  updateRangeFill(timeline, 0);
  audio.play().catch((error) => console.log("Audio could not play:", error));
}

emotionGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".emotion-card");
  if (card) selectEmotion(card);
});

// The main play button can play or pause the current recording.
playButton.addEventListener("click", () => {
  if (audio.paused) {
    if (audio.ended) audio.currentTime = 0;
    audio.play().catch((error) => console.log("Audio could not play:", error));
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => showPlayingState(true));
audio.addEventListener("pause", () => showPlayingState(false));
audio.addEventListener("ended", () => showPlayingState(false));

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

// Keep the time and progress bar sync with the audio.
audio.addEventListener("timeupdate", () => {
  if (isSeeking || !Number.isFinite(audio.duration)) return;
  const ratio = audio.currentTime / audio.duration;
  timeline.value = String(ratio * 1000);
  currentTime.textContent = formatTime(audio.currentTime);
  updateRangeFill(timeline, ratio);
});

timeline.addEventListener("input", () => {
  isSeeking = true;
  const ratio = Number(timeline.value) / 1000;
  currentTime.textContent = formatTime(ratio * audio.duration);
  updateRangeFill(timeline, ratio);
});

timeline.addEventListener("change", () => {
  audio.currentTime = (Number(timeline.value) / 1000) * audio.duration;
  isSeeking = false;
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
  updateRangeFill(volume, Number(volume.value));
});

audio.volume = Number(volume.value);
updateRangeFill(volume, Number(volume.value));
showPlayingState(false);
