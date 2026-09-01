function shuffleAnswers(question){
  const items=question.answers.map((text,originalIndex)=>({text,originalIndex}));

  for(let i=items.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [items[i],items[j]]=[items[j],items[i]];
  }

  return items;
}

function initializeQuiz(){
  document.title="HRM Session Final Assessment";
  if(quizTitle)quizTitle.textContent="HRM Session Final Assessment";
  if(certificateCourseTitle)certificateCourseTitle.textContent="HRM Session Completion – Final Assessment";
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
    if(caseStudy){
      contextTitle.textContent=caseStudy.title;
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

  const displayedAnswers=shuffleAnswers(question);

  displayedAnswers.forEach((answerItem,answerIndex)=>{
    const button=document.createElement("button");
    button.type="button";
    button.className="answer-button";
    button.dataset.originalIndex=String(answerItem.originalIndex);

    const letterSpan=document.createElement("span");
    letterSpan.className="answer-letter";
    letterSpan.textContent=String.fromCharCode(65+answerIndex);

    const labelSpan=document.createElement("span");
    labelSpan.className="answer-label";
    labelSpan.textContent=answerItem.text;

    button.append(letterSpan,labelSpan);
    button.addEventListener("click",()=>checkAnswer(button,Number(button.dataset.originalIndex)));
    answerOptions.appendChild(button);
  });

  updateProgress();
}
