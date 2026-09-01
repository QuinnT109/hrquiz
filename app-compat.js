Object.defineProperty(window,"caseSudy",{
  configurable:true,
  get(){
    const question=questions[currentQuestionIndex];
    return question&&question.caseStudy?caseStudies[question.caseStudy]:null;
  }
});
