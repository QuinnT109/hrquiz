function goToNextQuestion(){
  if(!currentQuestionAnsweredCorrectly)return;

  if(currentQuestionIndex<questions.length-1){
    currentQuestionIndex+=1;
    showQuestion();
    window.scrollTo({top:0,behavior:"smooth"});
  }else{
    finishQuiz();
  }
}

function updateProgress(){
  const percentage=(currentQuestionIndex/questions.length)*100;
  progressBar.style.width=`${percentage}%`;
  progressTrack.setAttribute("aria-valuenow",Math.round(percentage));
}

function finishQuiz(){
  progressBar.style.width="100%";
  progressTrack.setAttribute("aria-valuenow","100");
  quizScreen.hidden=true;
  completionScreen.hidden=false;
  participantName.focus();
  window.scrollTo({top:0,behavior:"smooth"});
}

function generateCertificate(event){
  event.preventDefault();
  const name=participantName.value.trim();

  if(!name){
    participantName.focus();
    return;
  }

  certificateName.textContent=name;
  certificateDate.textContent=new Date().toLocaleDateString("en-GB",{
    year:"numeric",
    month:"long",
    day:"numeric"
  });
  certificateScore.textContent=`${questions.length} of ${questions.length} Questions Completed`;
  completionScreen.hidden=true;
  certificateScreen.hidden=false;
  window.scrollTo({top:0,behavior:"smooth"});
}

nextButton.addEventListener("click",goToNextQuestion);
certificateForm.addEventListener("submit",generateCertificate);
printCertificateButton.addEventListener("click",()=>window.print());
initializeQuiz();
