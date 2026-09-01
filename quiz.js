/* =========================================================
   QUIZ QUESTIONS

   Replace this array with the real questions later.

   correctAnswer is the zero-based position:
   0 = first answer
   1 = second answer
   2 = third answer
   3 = fourth answer
========================================================= */

const questions = [
  {
    question: "What color is a typical banana when ripe?",
    answers: [
      "Blue",
      "Yellow",
      "Purple",
      "Invisible"
    ],
    correctAnswer: 1
  },

  {
    question: "How many legs does a normal dog have?",
    answers: [
      "2",
      "4",
      "7",
      "Approximately 38"
    ],
    correctAnswer: 1
  },

  {
    question: "Which of these is used to drink water?",
    answers: [
      "A cup",
      "A keyboard",
      "A bicycle tire",
      "A brick"
    ],
    correctAnswer: 0
  },

  {
    question: "What planet do humans live on?",
    answers: [
      "Mars",
      "Jupiter",
      "Earth",
      "The Sun"
    ],
    correctAnswer: 2
  },

  {
    question: "What is 2 + 2?",
    answers: [
      "3",
      "4",
      "22",
      "Fish"
    ],
    correctAnswer: 1
  }
];


/* =========================================================
   STATE
========================================================= */

let currentQuestionIndex = 0;
let currentQuestionAnsweredCorrectly = false;


/* =========================================================
   ELEMENTS
========================================================= */

const quizScreen = document.getElementById("quiz-screen");
const completionScreen = document.getElementById("completion-screen");
const certificateScreen = document.getElementById("certificate-screen");

const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");

const currentQuestionNumber =
  document.getElementById("current-question-number");

const totalQuestionCount =
  document.getElementById("total-question-count");

const progressBar =
  document.getElementById("progress-bar");

const progressTrack =
  document.querySelector(".progress-track");

const feedback =
  document.getElementById("feedback");

const nextButton =
  document.getElementById("next-button");

const certificateForm =
  document.getElementById("certificate-form");

const participantName =
  document.getElementById("participant-name");

const certificateName =
  document.getElementById("certificate-name");

const certificateDate =
  document.getElementById("certificate-date");

const certificateScore =
  document.getElementById("certificate-score");

const printCertificateButton =
  document.getElementById("print-certificate-button");


/* =========================================================
   INITIALIZE QUIZ
========================================================= */

function initializeQuiz() {
  totalQuestionCount.textContent = questions.length;

  // Update the completion screen so the 5-question test
  // doesn't still say "50 questions."
  const completionDescription =
    document.querySelector(".completion-description");

  if (completionDescription) {
    completionDescription.textContent =
      `You completed all ${questions.length} questions. ` +
      `Enter your full name below to generate your certificate of completion.`;
  }

  certificateScore.textContent =
    `${questions.length} of ${questions.length} Questions`;

  showQuestion();
}


/* =========================================================
   DISPLAY QUESTION
========================================================= */

function showQuestion() {
  currentQuestionAnsweredCorrectly = false;

  const question = questions[currentQuestionIndex];

  currentQuestionNumber.textContent =
    currentQuestionIndex + 1;

  questionText.textContent =
    question.question;

  answerOptions.innerHTML = "";

  feedback.hidden = true;
  feedback.textContent = "";
  feedback.className = "feedback";

  nextButton.disabled = true;

  if (currentQuestionIndex === questions.length - 1) {
    nextButton.textContent = "Finish Quiz";
  } else {
    nextButton.textContent = "Next Question";
  }

  question.answers.forEach((answer, answerIndex) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer-button";

    const letter =
      String.fromCharCode(65 + answerIndex);

    button.innerHTML = `
      <span class="answer-letter">${letter}</span>
      <span class="answer-label"></span>
    `;

    // Using textContent here means question text can't
    // accidentally inject HTML into the page.
    button.querySelector(".answer-label").textContent = answer;

    button.addEventListener("click", () => {
      checkAnswer(button, answerIndex);
    });

    answerOptions.appendChild(button);
  });

  updateProgress();
}


/* =========================================================
   CHECK ANSWER
========================================================= */

function checkAnswer(selectedButton, selectedAnswerIndex) {
  // Once correct, don't allow the question state to change.
  if (currentQuestionAnsweredCorrectly) {
    return;
  }

  const question = questions[currentQuestionIndex];

  const buttons =
    answerOptions.querySelectorAll(".answer-button");

  // Remove previous incorrect selection styling.
  buttons.forEach((button) => {
    button.classList.remove("selected", "incorrect");
  });

  selectedButton.classList.add("selected");

  if (selectedAnswerIndex === question.correctAnswer) {

    /* -------------------------
       CORRECT
    ------------------------- */

    currentQuestionAnsweredCorrectly = true;

    selectedButton.classList.remove("selected");
    selectedButton.classList.add("correct");

    feedback.textContent = "Correct.";
    feedback.className = "feedback correct-feedback";
    feedback.hidden = false;

    nextButton.disabled = false;

    // Lock answers after getting it correct.
    buttons.forEach((button) => {
      button.disabled = true;
    });

  } else {

    /* -------------------------
       INCORRECT
    ------------------------- */

    selectedButton.classList.add("incorrect");

    feedback.textContent = "Incorrect. Try again.";
    feedback.className = "feedback incorrect-feedback";
    feedback.hidden = false;

    nextButton.disabled = true;
  }
}


/* =========================================================
   NEXT QUESTION
========================================================= */

function goToNextQuestion() {
  if (!currentQuestionAnsweredCorrectly) {
    return;
  }

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;

    showQuestion();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  } else {
    finishQuiz();
  }
}


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress() {
  // Progress represents questions already completed.
  const completedQuestions =
    currentQuestionIndex;

  const percentage =
    (completedQuestions / questions.length) * 100;

  progressBar.style.width =
    `${percentage}%`;

  progressTrack.setAttribute(
    "aria-valuenow",
    Math.round(percentage)
  );
}


/* =========================================================
   FINISH QUIZ
========================================================= */

function finishQuiz() {
  progressBar.style.width = "100%";

  progressTrack.setAttribute(
    "aria-valuenow",
    "100"
  );

  quizScreen.hidden = true;
  completionScreen.hidden = false;

  participantName.focus();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   GENERATE CERTIFICATE
========================================================= */

function generateCertificate(event) {
  event.preventDefault();

  const name =
    participantName.value.trim();

  if (!name) {
    participantName.focus();
    return;
  }

  certificateName.textContent = name;

  const today = new Date();

  certificateDate.textContent =
    today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

  certificateScore.textContent =
    `${questions.length} of ${questions.length} Questions`;

  completionScreen.hidden = true;
  certificateScreen.hidden = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   PRINT / SAVE PDF
========================================================= */

function printCertificate() {
  window.print();
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

nextButton.addEventListener(
  "click",
  goToNextQuestion
);

certificateForm.addEventListener(
  "submit",
  generateCertificate
);

printCertificateButton.addEventListener(
  "click",
  printCertificate
);


/* =========================================================
   START
========================================================= */

initializeQuiz();
