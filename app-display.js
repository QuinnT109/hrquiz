function initializeQuiz(){
  document.title="HRM Session Final Assessment";
  if(quizTitle)quizTitle.textContent="HRM Session Final Assessment";
  if(certificateCourseTitle)certificateCourseTitle.textContent="BNF LDP HRM Sessions";
  totalQuestionCount.textContent=questions.length;
  certificateScore.textContent=`${questions.length} of ${questions.length} Questions Completed`;

  if(completionDescription){
    completionDescription.textContent=`You completed all ${questions.length} questions. Enter your full name below to generate your certificate of completion.`;
  }

  if(questions.length===0){
    questionText.textContent="Questions could not be loaded. Please refresh the page.";
    return;
  }

  showQuestion();
}

function showQuestion(){
  currentQuestionAnsweredCorrectly=false;
  const question=questions[currentQuestionIndex];

  currentQuestionNumber.textContent=currentQuestionIndex+1;
  questionText.textContent=question.question;
  if(sectionLabel)sectionLabel.textContent=question.section;

  if(questionContext&&contextTitle&&contextText){
    const caseStudy=question.caseStudy?caseStudies[question.caseStudy]:null;
    if(caseSudy){
      contextTitle.textContent=caseSudy.title;
      contextText.textContent=caseStudy.text;
      questionContext.hidden=false;
      questionContext.open=true;
    }else{
      questionContext.hidden=true;
      contextTitle.textContent="";
      contextText.textContent="";
    }
  }

  answerOptions.innerHTML="";
  feedback.hidden=true;
  feedback.textContent="";
  feedback.className="feedback";
  nextButton.disabled=true;
  nextButton.textContent=currentQuestionIndex===questions.length-1?"Finish Assessment":"Next Question";

  question.answers.forEach((answer,answerIndex)=>{
    const button=document.createElement("button");
    button.type="button";
    button.className="answer-button";

    const letterSpan=document.createElement("span");
    letterSpan.className="answer-letter";
    letterSpan.textContent=String.fromCharCode(65+answerIndex);

    const labelSpan=document.createElement("span");
    labelSpan.className="answer-label";
    labelSpan.textContent=answer;

    button.append(letterSpan,labelSpan);
    button.addEventListener("click",()=>checkAnswer(button,answerIndex));
    answerOptions.appendChild(button);
  });

  updateProgress();
}
