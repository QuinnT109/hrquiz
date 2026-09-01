function checkAnswer(selectedButton,selectedAnswerIndex){
  if(currentQuestionAnsweredCorrectly)return;

  const question=questions[currentQuestionIndex];
  const buttons=answerOptions.querySelectorAll(".answer-button");
  buttons.forEach(button=>button.classList.remove("incorrect"));

  if(selectedAnswerIndex===question.correctAnswer){
    currentQuestionAnsweredCorrectly=true;
    selectedButton.classList.add("correct");
    feedback.textContent="Correct. You can continue.";
    feedback.className="feedback correct-feedback";
    feedback.hidden=false;
    nextButton.disabled=false;
    buttons.forEach(button=>{button.disabled=true;});
  }else{
    selectedButton.classList.add("incorrect");
    feedback.textContent="Incorrect. Try again.";
    feedback.className="feedback incorrect-feedback";
    feedback.hidden=false;
    nextButton.disabled=true;
  }
}
