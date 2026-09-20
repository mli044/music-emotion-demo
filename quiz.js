const quizEmotions = [
  {
    id: "anxious",
    name: "Anxious",
    axis: "Negative · High energy",
    cue: "Listen for the faster pulse, darker mode, irregular rhythm, and sharper accents.",
    icon: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 17h5l3-7 5 14 4-10 3 5h6"/><path d="M16 28C8 23 4 18 4 12a7 7 0 0 1 12-5 7 7 0 0 1 12 5c0 6-4 11-12 16Z"/></svg>`,
  },
  {
    id: "excited",
    name: "Excited",
    axis: "Positive · High energy",
    cue: "Listen for the faster tempo, bright tone, strong rhythm, and energetic motion.",
    icon: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M25.2 6.8l-2.8 2.8M9.6 22.4l-2.8 2.8"/><circle cx="16" cy="16" r="7"/><path d="M12 16c1.2 1.3 2.5 2 4 2s2.8-.7 4-2"/></svg>`,
  },
  {
    id: "happy",
    name: "Happy",
    axis: "Positive · Moderate energy",
    cue: "Listen for the bright tone, slightly faster tempo, lively movement, and staccato notes.",
    icon: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M27 5C15 6 8 12 8 21c0 4 3 6 6 6 8 0 13-10 13-22Z"/><path d="M5 28c4-7 9-12 17-17M14 22c0-3-.5-5-2-7M18 17c2 0 4 .5 5 1"/></svg>`,
  },
  {
    id: "sad",
    name: "Sad",
    axis: "Negative · Low energy",
    cue: "Listen for the slower tempo, darker tone, fewer notes, and longer sustained sounds.",
    icon: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 21h15a6 6 0 0 0 0-12 9 9 0 0 0-17 3 5 5 0 0 0 2 9Z"/><path d="M11 25l-1 3M17 25l-1 3M23 25l-1 3"/></svg>`,
  },
];

const melodies = ["M01", "M02", "M03"];

function audioPath(melodyId, emotionName) {
  return `./data/Audio/${melodyId.toLowerCase()}_${emotionName}.wav`;
}

function buildQuestionSet() {
  const questions = [];

  melodies.forEach((melodyId, groupIndex) => {
    // Mix the four emotions and use the first three for this melody.
    const selectedEmotions = shuffle(quizEmotions).slice(0, 3);

    selectedEmotions.forEach((emotion, subquestionIndex) => {
      questions.push({
        ...emotion,
        melodyId,
        groupIndex,
        groupPosition: groupIndex + 1,
        subquestionPosition: subquestionIndex + 1,
        stimulusId: `${melodyId}_${emotion.id.toUpperCase()}`,
        audio: audioPath(melodyId, emotion.name),
        referenceAudio: audioPath(melodyId, "Neutral"),
      });
    });
  });

  return questions;
}

const referenceAudio = document.querySelector("#referenceAudio");
const referencePlayer = document.querySelector("#referencePlayer");
const referencePlay = document.querySelector("#referencePlay");
const referenceTimeline = document.querySelector("#referenceTimeline");
const referenceCurrentTime = document.querySelector("#referenceCurrentTime");
const referenceDuration = document.querySelector("#referenceDuration");
const referenceMelody = document.querySelector("#referenceMelody");
const referenceNumber = document.querySelector("#referenceNumber");
const referenceSection = document.querySelector(".reference-section");
const questionAudio = document.querySelector("#questionAudio");
const mysteryPlayer = document.querySelector("#mysteryPlayer");
const mysteryPlay = document.querySelector("#mysteryPlay");
const mysteryStatus = document.querySelector("#mysteryStatus");
const mysteryTime = document.querySelector("#mysteryTime");
const answerGrid = document.querySelector("#answerGrid");
const questionCounter = document.querySelector("#questionCounter");
const scoreCounter = document.querySelector("#scoreCounter");
const quizProgressFill = document.querySelector("#quizProgressFill");
const feedbackPanel = document.querySelector("#feedbackPanel");
const feedbackIcon = document.querySelector("#feedbackIcon");
const feedbackLabel = document.querySelector("#feedbackLabel");
const feedbackTitle = document.querySelector("#feedbackTitle");
const feedbackText = document.querySelector("#feedbackText");
const nextButton = document.querySelector("#nextButton");
const quizStage = document.querySelector("#quizStage");
const resultsPanel = document.querySelector("#resultsPanel");
const resultScore = document.querySelector("#resultScore");
const resultTitle = document.querySelector("#resultTitle");
const resultMessage = document.querySelector("#resultMessage");
const resultReview = document.querySelector("#resultReview");
const restartButton = document.querySelector("#restartButton");
const resultsForm = document.querySelector("#resultsForm");
const submitResultsButton = document.querySelector("#submitResultsButton");
const submitStatus = document.querySelector("#submitStatus");

let questionOrder = [];
let answerOrder = [];
let questionIndex = 0;
let score = 0;
let answered = false;
let results = [];
let referenceSeeking = false;

function shuffle(items) {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [output[index], output[randomIndex]] = [output[randomIndex], output[index]];
  }
  return output;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function updateRangeFill(input, ratio) {
  const percentage = Math.max(0, Math.min(1, ratio)) * 100;
  input.style.setProperty("--range-progress", `${percentage}%`);
}

function pauseOtherAudio(activeAudio) {
  [referenceAudio, questionAudio].forEach((audio) => {
    if (audio !== activeAudio) audio.pause();
  });
}

function setReferencePlaying(isPlaying) {
  referencePlay.classList.toggle("is-playing", isPlaying);
  referencePlayer.classList.toggle("is-playing", isPlaying);
  referencePlay.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} Neutral reference`);
}

function setQuestionPlaying(isPlaying) {
  mysteryPlay.classList.toggle("is-playing", isPlaying);
  mysteryPlayer.classList.toggle("is-playing", isPlaying);
  mysteryStatus.textContent = isPlaying ? "Now playing" : questionAudio.ended ? "Replay the clip" : "Ready to listen";
  mysteryPlay.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} mystery performance`);
}

function answerTemplate(emotion) {
  return `
    <button class="answer-card ${emotion.id}" type="button" data-answer="${emotion.id}" aria-label="Choose ${emotion.name}">
      <span class="answer-inner">
        <span class="answer-face answer-front">
          <span class="answer-icon">${emotion.icon}</span>
          <span>
            <span class="answer-name">${emotion.name}</span>
            <span class="answer-axis">${emotion.axis}</span>
          </span>
        </span>
        <span class="answer-face answer-back">
          <span class="answer-result-icon"></span>
          <span class="answer-result-copy">
            <small></small>
            <strong></strong>
          </span>
        </span>
      </span>
    </button>`;
}

function renderQuestion() {
  answered = false;
  const current = questionOrder[questionIndex];
  answerOrder = shuffle(quizEmotions);

  questionCounter.textContent = `Melody ${current.groupPosition} of ${melodies.length} · Question ${current.subquestionPosition} of 3`;
  scoreCounter.textContent = `Overall ${questionIndex + 1} of ${questionOrder.length} · ${score} correct`;
  quizProgressFill.style.width = `${(questionIndex / questionOrder.length) * 100}%`;
  feedbackPanel.hidden = true;
  feedbackPanel.classList.remove("wrong");
  if (questionIndex === questionOrder.length - 1) {
    nextButton.innerHTML = `See my results <span aria-hidden="true">→</span>`;
  } else if (current.subquestionPosition === 3) {
    nextButton.innerHTML = `Next melody <span aria-hidden="true">→</span>`;
  } else {
    nextButton.innerHTML = `Next question <span aria-hidden="true">→</span>`;
  }

  answerGrid.innerHTML = answerOrder.map(answerTemplate).join("");
  if (referenceAudio.dataset.melodyId !== current.melodyId) {
    referenceAudio.pause();
    referenceAudio.dataset.melodyId = current.melodyId;
    referenceAudio.src = current.referenceAudio;
    referenceAudio.load();
    referenceMelody.textContent = `Melody ${current.groupPosition} reference`;
    referenceNumber.textContent = String(current.groupPosition).padStart(2, "0");
    referenceTimeline.value = "0";
    referenceCurrentTime.textContent = "0:00";
    referenceDuration.textContent = "0:00";
    updateRangeFill(referenceTimeline, 0);
    setReferencePlaying(false);
  }
  questionAudio.pause();
  questionAudio.src = current.audio;
  questionAudio.load();
  mysteryTime.textContent = "0:00";
  setQuestionPlaying(false);
}

function submitAnswer(answerId) {
  if (answered) return;
  answered = true;
  questionAudio.pause();

  const current = questionOrder[questionIndex];
  const isCorrect = answerId === current.id;
  const selectedCard = answerGrid.querySelector(`[data-answer="${answerId}"]`);
  const correctCard = answerGrid.querySelector(`[data-answer="${current.id}"]`);

  if (isCorrect) score += 1;
  const selectedEmotion = quizEmotions.find((emotion) => emotion.id === answerId);
  results.push({
    stimulusId: current.stimulusId,
    melodyId: current.melodyId,
    expected: current.name,
    selected: selectedEmotion.name,
    emotion: current,
    correct: isCorrect,
  });

  answerGrid.querySelectorAll(".answer-card").forEach((card) => card.classList.add("is-locked"));
  selectedCard.classList.add("is-flipped", isCorrect ? "is-correct" : "is-wrong");
  selectedCard.querySelector(".answer-result-icon").textContent = isCorrect ? "✓" : "×";
  selectedCard.querySelector(".answer-result-copy small").textContent = isCorrect ? "Correct" : "Not quite";
  selectedCard.querySelector(".answer-result-copy strong").textContent = isCorrect ? current.name : "Wrong answer";

  if (!isCorrect) correctCard.classList.add("is-answer");

  feedbackPanel.hidden = false;
  feedbackPanel.classList.toggle("wrong", !isCorrect);
  feedbackIcon.textContent = isCorrect ? "✓" : "×";
  feedbackLabel.textContent = isCorrect ? "You got it" : `Correct answer: ${current.name}`;
  feedbackTitle.textContent = isCorrect ? `${current.name} — well heard.` : `Listen once more for the clues.`;
  feedbackText.textContent = current.cue;
  scoreCounter.textContent = `Overall ${questionIndex + 1} of ${questionOrder.length} · ${score} correct`;
  quizProgressFill.style.width = `${((questionIndex + 1) / questionOrder.length) * 100}%`;
}

function showResults() {
  referenceAudio.pause();
  questionAudio.pause();
  quizStage.hidden = true;
  resultsPanel.hidden = false;

  let resultCopy;
  if (score === questionOrder.length) {
    resultCopy = { title: "Excellent ear!", message: "You identified every emotional performance correctly." };
  } else if (score >= 7) {
    resultCopy = { title: "Great listening!", message: "You have a strong ear for the musical signals behind emotion." };
  } else if (score >= 5) {
    resultCopy = { title: "You're hearing the differences", message: "You identified how performance choices can reshape familiar melodies." };
  } else if (score >= 3) {
    resultCopy = { title: "You're starting to hear it", message: "A second listen will make the musical clues even clearer." };
  } else {
    resultCopy = { title: "Keep listening", message: "Try again and focus on tempo, mode, articulation, and tone color." };
  }

  resultScore.textContent = `${score}/${questionOrder.length}`;
  resultTitle.textContent = resultCopy.title;
  resultMessage.textContent = resultCopy.message;
  resultReview.innerHTML = results
    .map(
      (result, index) => `
        <div class="result-item ${result.correct ? "correct" : "wrong"}">
          <span aria-hidden="true">${result.correct ? "✓" : "×"}</span>
          <strong>Melody ${result.emotion.groupPosition} · Q${result.emotion.subquestionPosition} · ${result.emotion.name}</strong>
        </div>`,
    )
    .join("");
  populateResultsForm();
  resultsPanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

function setFormValue(name, value) {
  const field = resultsForm.elements.namedItem(name);
  if (field) field.value = String(value);
}

function populateResultsForm() {
  results.forEach((result, index) => {
    const questionNumber = String(index + 1).padStart(2, "0");
    setFormValue(`q${questionNumber}_stimulus_id`, result.stimulusId);
    setFormValue(`q${questionNumber}_expected`, result.expected);
    setFormValue(`q${questionNumber}_selected`, result.selected);
    setFormValue(`q${questionNumber}_correct`, result.correct);
  });

  setFormValue("question_count", questionOrder.length);
  setFormValue("total_correct", score);
  setFormValue("accuracy", Math.round((score / questionOrder.length) * 100));
}

function resetResultsSubmission() {
  resultsForm.reset();
  resultsForm.querySelectorAll('input[type="hidden"]').forEach((field) => {
    if (field.name !== "form-name") field.value = "";
  });
  submitResultsButton.disabled = false;
  submitResultsButton.classList.remove("is-submitted");
  submitResultsButton.innerHTML = `Submit results <span aria-hidden="true">→</span>`;
  submitStatus.textContent = "";
  submitStatus.className = "submit-status";
}

function startQuiz() {
  questionOrder = buildQuestionSet();
  questionIndex = 0;
  score = 0;
  answered = false;
  results = [];
  referenceAudio.dataset.melodyId = "";
  resetResultsSubmission();
  quizStage.hidden = false;
  resultsPanel.hidden = true;
  renderQuestion();
}

referencePlay.addEventListener("click", async () => {
  if (referenceAudio.paused) {
    pauseOtherAudio(referenceAudio);
    if (referenceAudio.ended) referenceAudio.currentTime = 0;
    try {
      await referenceAudio.play();
    } catch (error) {
      console.warn("Reference audio could not start:", error);
    }
  } else {
    referenceAudio.pause();
  }
});

mysteryPlay.addEventListener("click", async () => {
  if (questionAudio.paused) {
    pauseOtherAudio(questionAudio);
    if (questionAudio.ended) questionAudio.currentTime = 0;
    try {
      await questionAudio.play();
    } catch (error) {
      console.warn("Question audio could not start:", error);
    }
  } else {
    questionAudio.pause();
  }
});

referenceAudio.addEventListener("play", () => setReferencePlaying(true));
referenceAudio.addEventListener("pause", () => setReferencePlaying(false));
referenceAudio.addEventListener("ended", () => setReferencePlaying(false));
referenceAudio.addEventListener("loadedmetadata", () => {
  referenceDuration.textContent = formatTime(referenceAudio.duration);
});
referenceAudio.addEventListener("timeupdate", () => {
  if (referenceSeeking || !Number.isFinite(referenceAudio.duration)) return;
  const ratio = referenceAudio.currentTime / referenceAudio.duration;
  referenceTimeline.value = String(Math.round(ratio * 1000));
  referenceCurrentTime.textContent = formatTime(referenceAudio.currentTime);
  updateRangeFill(referenceTimeline, ratio);
});

referenceTimeline.addEventListener("input", () => {
  referenceSeeking = true;
  const ratio = Number(referenceTimeline.value) / 1000;
  referenceCurrentTime.textContent = formatTime(ratio * referenceAudio.duration);
  updateRangeFill(referenceTimeline, ratio);
});
referenceTimeline.addEventListener("change", () => {
  if (Number.isFinite(referenceAudio.duration)) {
    referenceAudio.currentTime = (Number(referenceTimeline.value) / 1000) * referenceAudio.duration;
  }
  referenceSeeking = false;
});

questionAudio.addEventListener("play", () => setQuestionPlaying(true));
questionAudio.addEventListener("pause", () => setQuestionPlaying(false));
questionAudio.addEventListener("ended", () => setQuestionPlaying(false));
questionAudio.addEventListener("timeupdate", () => {
  mysteryTime.textContent = formatTime(questionAudio.currentTime);
});

answerGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".answer-card");
  if (card) submitAnswer(card.dataset.answer);
});

nextButton.addEventListener("click", () => {
  if (!answered) return;
  if (questionIndex === questionOrder.length - 1) {
    showResults();
  } else {
    questionIndex += 1;
    renderQuestion();
    const enteredNewMelody = questionOrder[questionIndex].subquestionPosition === 1;
    (enteredNewMelody ? referenceSection : quizStage).scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

restartButton.addEventListener("click", () => {
  startQuiz();
  quizStage.scrollIntoView({ behavior: "smooth", block: "start" });
});

resultsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (submitResultsButton.disabled || results.length !== questionOrder.length) return;

  submitResultsButton.disabled = true;
  submitResultsButton.textContent = "Submitting…";
  submitStatus.textContent = "";
  submitStatus.className = "submit-status";

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(resultsForm)).toString(),
    });

    if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);

    submitResultsButton.classList.add("is-submitted");
    submitResultsButton.innerHTML = `<span aria-hidden="true">✓</span> Submitted`;
    submitStatus.textContent = "Results submitted. Thank you for participating!";
    submitStatus.classList.add("success");
  } catch (error) {
    console.warn("Quiz results could not be submitted:", error);
    submitResultsButton.disabled = false;
    submitResultsButton.innerHTML = `Try submitting again <span aria-hidden="true">→</span>`;
    submitStatus.textContent = "We couldn't submit your results. Please check your connection and try again.";
    submitStatus.classList.add("error");
  }
});

updateRangeFill(referenceTimeline, 0);
setReferencePlaying(false);
setQuestionPlaying(false);
startQuiz();
