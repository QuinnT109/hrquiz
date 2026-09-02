function goToNextQuestion(){
  if(!currentQuestionResolved)return;

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
  if(assessmentIntroActive){
    assessmentIntroActive=false;
    showSectionIntro(questions[0].section,0,true);
    return;
  }

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

function determineOutcome(correctCount=correctAnswerCount){
  const ratio=questions.length?correctCount/questions.length:0;
  if(ratio>=0.8)return"completion";
  if(ratio>=0.6)return"participation";
  return"retry";
}

function calculateScorePercentage(correctCount=correctAnswerCount){
  return questions.length?Math.round((correctCount/questions.length)*1000)/10:0;
}

function formatPercentage(value){
  return Number.isInteger(value)?`${value}%`:`${value.toFixed(1)}%`;
}

function clearCertificateAccessError(){
  certificateAccessError.hidden=true;
  certificateAccessError.textContent="";
  participantEmail.removeAttribute("aria-invalid");
}

function showResultScreen(){
  currentScorePercentage=calculateScorePercentage();
  currentCertificateOutcome=determineOutcome();

  quizScreen.hidden=true;
  sectionScreen.hidden=true;
  certificateScreen.hidden=true;
  completionScreen.hidden=false;

  resultScore.textContent=`${correctAnswerCount} of ${questions.length} correct · ${formatPercentage(currentScorePercentage)}`;
  certificateForm.hidden=true;
  participationRestartButton.hidden=true;
  restartPanel.hidden=true;
  participantName.value="";
  participantEmail.value="";
  clearCertificateAccessError();

  if(currentCertificateOutcome==="completion"){
    completionIcon.textContent="✓";
    completionIcon.classList.remove("retry-icon");
    resultEyebrow.textContent="Assessment Complete";
    resultTitle.textContent="Successful Completion";
    resultSummary.textContent="You achieved the 80% successful completion standard. Enter your full name and approved email address to view and print your Certificate of Completion.";
    certificateSubmitButton.textContent="View Completion Certificate";
    certificateForm.hidden=false;
    participantName.focus();
  }else if(currentCertificateOutcome==="participation"){
    completionIcon.textContent="✓";
    completionIcon.classList.remove("retry-icon");
    resultEyebrow.textContent="Assessment Complete";
    resultTitle.textContent="Successful Participation";
    resultSummary.textContent="A score of 80% or higher awards a Certificate of Successful Completion. You may restart the quiz and attempt to get a higher score, or enter your full name and approved email address to view and print your Certificate of Successful Participation.";
    certificateSubmitButton.textContent="View Participation Certificate";
    participationRestartButton.hidden=false;
    certificateForm.hidden=false;
    participantName.focus();
  }else{
    completionIcon.textContent="↻";
    completionIcon.classList.add("retry-icon");
    resultEyebrow.textContent="Assessment Result";
    resultTitle.textContent="Re-Appear for the Test";
    resultSummary.textContent="A score of at least 60% is required to receive a certificate. Review the session material, then restart the assessment.";
    restartPanel.hidden=false;
    restartAssessmentButton.focus();
  }

  window.scrollTo({top:0,behavior:"smooth"});
}

function finishQuiz(){
  assessmentIntroActive=false;
  progressBar.style.width="100%";
  progressTrack.setAttribute("aria-valuenow","100");
  showResultScreen();
}

function renderCertificate(name,outcome,scorePercentage=null){
  const isCompletion=outcome==="completion";
  currentCertificateOutcome=outcome;
  currentScorePercentage=scorePercentage===null?currentScorePercentage:scorePercentage;

  certificateHeading.textContent=isCompletion?"Certificate of Completion":"Certificate of Participation";
  certificateCopy.textContent=isCompletion
    ?"For successful completion of the Human Resources Management Sessions"
    :"For successful participation in the Human Resources Management Sessions";
  certificateName.textContent=name;
  certificateDate.textContent=new Date().toLocaleDateString("en-GB",{
    year:"numeric",
    month:"long",
    day:"numeric"
  });
  certificate.setAttribute("aria-label",isCompletion?"Certificate of Completion":"Certificate of Participation");
  certificate.dataset.score=String(currentScorePercentage);
  certificateRestartButton.hidden=isCompletion;

  quizScreen.hidden=true;
  sectionScreen.hidden=true;
  completionScreen.hidden=true;
  certificateScreen.hidden=false;
  window.scrollTo({top:0,behavior:"smooth"});
}

function normalizeEmail(email){
  return email.trim().toLowerCase();
}

async function sha256Hex(value){
  if(!window.isSecureContext||!globalThis.crypto||!crypto.subtle){
    throw new Error("Secure email verification is unavailable.");
  }

  const encoded=new TextEncoder().encode(value);
  const digest=await crypto.subtle.digest("SHA-256",encoded);
  return Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,"0")).join("");
}

async function isWhitelistedEmail(email){
  if(!Array.isArray(allowedEmailHashes)||allowedEmailHashes.length===0)return false;
  const emailHash=await sha256Hex(normalizeEmail(email));
  return allowedEmailHashes.includes(emailHash);
}

async function generateCertificate(event){
  event.preventDefault();
  clearCertificateAccessError();

  if(!certificateForm.reportValidity())return;

  const name=participantName.value.trim();
  const email=normalizeEmail(participantEmail.value);
  const defaultButtonText=currentCertificateOutcome==="completion"
    ?"View Completion Certificate"
    :"View Participation Certificate";

  certificateSubmitButton.disabled=true;
  certificateSubmitButton.textContent="Checking access…";

  try{
    const allowed=await isWhitelistedEmail(email);
    if(!allowed){
      certificateAccessError.textContent="Email not found.";
      certificateAccessError.hidden=false;
      participantEmail.setAttribute("aria-invalid","true");
      participantEmail.focus();
      return;
    }

    renderCertificate(name,currentCertificateOutcome,currentScorePercentage);
  }catch(error){
    console.error("Email authorization failed",error);
    certificateAccessError.textContent="Certificate access could not be verified. Please reload the page and try again.";
    certificateAccessError.hidden=false;
    participantEmail.setAttribute("aria-invalid","true");
  }finally{
    certificateSubmitButton.disabled=false;
    certificateSubmitButton.textContent=defaultButtonText;
  }
}

function resetAssessmentState(showIntro=true){
  currentQuestionIndex=0;
  currentQuestionResolved=false;
  currentQuestionAttempts=0;
  correctAnswerCount=0;
  questionResults=new Array(questions.length).fill(null);
  pendingQuestionIndex=null;
  assessmentIntroActive=false;
  currentCertificateOutcome=null;
  currentScorePercentage=0;
  participantName.value="";
  participantEmail.value="";
  clearCertificateAccessError();
  feedback.hidden=true;
  feedback.textContent="";
  nextButton.disabled=true;
  progressBar.style.width="0%";
  progressTrack.setAttribute("aria-valuenow","0");

  if(showIntro)showAssessmentIntro();
}

function handleCertificateTestShortcut(){
  if(quizScreen.hidden)return;

  if(currentQuestionIndex===1){
    renderCertificate("TEST","completion",100);
  }else if(currentQuestionIndex===2){
    renderCertificate("TEST","participation",75);
  }
}

nextButton.addEventListener("click",goToNextQuestion);
sectionContinueButton.addEventListener("click",beginPendingSection);
certificateForm.addEventListener("submit",generateCertificate);
participantEmail.addEventListener("input",clearCertificateAccessError);
restartAssessmentButton.addEventListener("click",()=>resetAssessmentState(true));
participationRestartButton.addEventListener("click",()=>resetAssessmentState(true));
certificateRestartButton.addEventListener("click",()=>resetAssessmentState(true));
questionCounterTrigger.addEventListener("click",handleCertificateTestShortcut);
printCertificateButton.addEventListener("click",()=>window.print());
initializeQuiz();
