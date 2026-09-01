const questions = [
  {
    question: "What color is a typical ripe banana?",
    answers: ["Blue", "Yellow", "Purple", "Invisible"],
    correctAnswer: 1
  },
  {
    question: "How many legs does a typical dog have?",
    answers: ["2", "4", "7", "38"],
    correctAnswer: 1
  },
  {
    question: "Which item is normally used to drink water?",
    answers: ["A cup", "A keyboard", "A bicycle tire", "A brick"],
    correctAnswer: 0
  },
  {
    question: "What planet do humans live on?",
    answers: ["Mars", "Jupiter", "Earth", "The Sun"],
    correctAnswer: 2
  },
  {
    question: "What is 2 + 2?",
    answers: ["3", "4", "22", "Fish"],
    correctAnswer: 1
  }
];

let currentQuestionIndex = 0;
let currentQuestionAnsweredCorrectly = false;

const quizScreen = document.getElementById("quiz-screen");
const completionScreen = document.getElementById("completion-screen");
const certificateScreen = document.getElementById("certificate-screen");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const currentQuestionNumber = document.getElementById("current-question-number");
const totalQuestionCount = document.getElementById("total-question-count");
const progressBar = document.getElementById("progress-bar");
const progressTrack = document.querySelector(".progress-track");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("next-button");
const certificateForm = document.getElementById("certificate-form");
const participantName = document.getElementById("participant-name");
const certificateName = document.getElementById("certificate-name");
const certificateDate = document.getElementById("certificate-date");
const certificateScore = document.getElementById("certificate-score");
const printCertificateButton = document.getElementById("print-certificate-button");
const completionDescription = document.querySelector(".completion-description");

function initializeQuiz() {
  totalQuestionCount.textContent = questions.length;
  certificateScore.textContent = `${questions.length} of ${questions.length} Questions`;

  if (completionDescription) {
    completionDescription.textContent =
      `You completed all ${questions.length} questions. Enter your full name below to generate your certificate of completion.`;
  }

  showQuestion();
}

function showQuestion() {
  currentQuestionAnsweredCorrectly = false;
  const question = questions[currentQuestionIndex];

  currentQuestionNumber.textContent = currentQuestionIndex + 1;
  questionText.textContent = question.question;
  answerOptions.innerHTML = "";
  feedback.hidden = true;
  feedback.textContent = "";
  feedback.className = "feedback";
  nextButton.disabled = true;
  nextButton.textContent =
    currentQuestionIndex === questions.length - 1
      ? "Finish Quiz"
      : "Next Question";

  question.answers.forEach((answer, answerIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";

    const letterSpan = document.createElement("span");
    letterSpan.className = "answer-letter";
    letterSpan.textContent = String.fromCharCode(65 + answerIndex);

    const labelSpan = document.createElement("span");
    labelSpan.className = "answer-label";
    labelSpan.textContent = answer;

    button.appendChild(letterSpan);
    button.appendChild(labelSpan);
    button.addEventListener("click", () => checkAnswer(button, answerIndex));
    answerOptions.appendChild(button);
  });

  updateProgress();
}

function checkAnswer(selectedButton, selectedAnswerIndex) {
  if (currentQuestionAnsweredCorrectly) return;

  const question = questions[currentQuestionIndex];
  const buttons = answerOptions.querySelectorAll(".answer-button");

  buttons.forEach((button) => button.classList.remove("incorrect"));

  if (selectedAnswerIndex === question.correctAnswer) {
    currentQuestionAnsweredCorrectly = true;
    selectedButton.classList.add("correct");
    feedback.textContent = "Correct.";
    feedback.className = "feedback correct-feedback";
    feedback.hidden = false;
    nextButton.disabled = false;
    buttons.forEach((button) => {
      button.disabled = true;
    });
  } else {
    selectedButton.classList.add("incorrect");
    feedback.textContent = "Incorrect. Try again.";
    feedback.className = "feedback incorrect-feedback";
    feedback.hidden = false;
    nextButton.disabled = true;
  }
}

function goToNextQuestion() {
  if (!currentQuestionAnsweredCorrectly) return;

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex += 1;
    showQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    finishQuiz();
  }
}

function updateProgress() {
  const percentage = (currentQuestionIndex / questions.length) * 100;
  progressBar.style.width = `${percentage}%`;
  progressTrack.setAttribute("aria-valuenow", Math.round(percentage));
}

function finishQuiz() {
  progressBar.style.width = "100%";
  progressTrack.setAttribute("aria-valuenow", "100");
  quizScreen.hidden = true;
  completionScreen.hidden = false;
  participantName.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function generateCertificate(event) {
  event.preventDefault();
  const name = participantName.value.trim();

  if (!name) {
    participantName.focus();
    return;
  }

  certificateName.textContent = name;
  certificateDate.textContent = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  certificateScore.textContent = `${questions.length} of ${questions.length} Questions`;
  completionScreen.hidden = true;
  certificateScreen.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

nextButton.addEventListener("click", goToNextQuestion);
certificateForm.addEventListener("submit", generateCertificate);
printCertificateButton.addEventListener("click", () => window.print());

initializeQuiz();
