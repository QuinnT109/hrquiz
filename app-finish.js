function goToNextQuestion(){
  if(!currentQuestionAnsweredCorrectly)return;

  if(currentQuestionIndex<questions.length-1){
    const nextQuestionIndex=currentQuestionIndex+1;
    const currentSection=questions[currentQuestionIndex].section;
    const nextSection=questions[nextQuestionIndex].section;

    if(currentSection!==nextSection){
      showSectionIntro(nextSection,nextQuestionIndex,false);
    }else{
      currentQuestionIndex=nextQuestionIndex;
      showQuestion();
      window.scrollTo({top:0,behavior:"smooth"});
    }
  }else{
    finishQuiz();
  }
}

function beginPendingSection(){
  if(pendingQuestionIndex===null)return;

  currentQuestionIndex=pendingQuestionIndex;
  pendingQuestionIndex=null;
  showQuestion();
  window.scrollTo({top:0,behavior:"smooth"});
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
  sectionScreen.hidden=true;
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
sectionContinueButton.addEventListener("click",beginPendingSection);
certificateForm.addEventListener("submit",generateCertificate);
printCertificateButton.addEventListener("click",()=>window.print());
initializeQuiz();
