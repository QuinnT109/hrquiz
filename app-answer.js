function resolveQuestion(wasCorrect,selectedButton){
  const buttons=answerOptions.querySelectorAll(".answer-button");
  currentQuestionResolved=true;
  questionResults[currentQuestionIndex]=wasCorrect;

  if(wasCorrect){
    correctAnswerCount+=1;
    selectedButton.classList.add("correct");
    feedback.textContent="Correct. You can continue.";
    feedback.className="feedback correct-feedback";
  }else{
    selectedButton.classList.add("incorrect");
    feedback.textContent="Incorrect.";
    feedback.className="feedback incorrect-feedback";
  }

  feedback.hidden=false;
  nextButton.disabled=false;
  buttons.forEach(button=>{button.disabled=true;});
}

function checkAnswer(selectedButton,selectedOriginalIndex){
  if(currentQuestionResolved)return;

  const question=questions[currentQuestionIndex];
  currentQuestionAttempts+=1;

  if(selectedOriginalIndex===question.correctAnswer){
    resolveQuestion(true,selectedButton);
    return;
  }

  selectedButton.classList.add("incorrect");

  if(currentQuestionAttempts===1){
    selectedButton.disabled=true;
    feedback.textContent="Incorrect. Try again.";
    feedback.className="feedback incorrect-feedback";
    feedback.hidden=false;
    nextButton.disabled=true;
    return;
  }

  resolveQuestion(false,selectedButton);
}
