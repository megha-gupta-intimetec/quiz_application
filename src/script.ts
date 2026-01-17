let currentQuestionIndex = 0;
let questions: any[] = [];
let selectedAnswers: (string | null)[] = []; 
let score = 0;

async function loadQuizData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    questions = data.quiz.questions;

   
    selectedAnswers = new Array(questions.length).fill(null);

  } catch (error) {
    console.error('Error loading quiz:', error);
  }

  showQuestion();
}

function showQuestion() {
  const questionHeading = document.querySelector<HTMLHeadingElement>('.quizQuestion h2');
  const optionButtons = document.querySelectorAll<HTMLButtonElement>('.quizOption button');

  if (!questionHeading || !optionButtons) return;

  const currentQuestion = questions[currentQuestionIndex];
  questionHeading.textContent = currentQuestion.question;

  currentQuestion.options.forEach((option: string, index: number) => {
    const button = optionButtons[index];
    if (button) {
      button.textContent = option;

    
      if (selectedAnswers[currentQuestionIndex] === option) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }

      
      button.onclick = () => {
        selectedAnswers[currentQuestionIndex] = option;

       
        optionButtons.forEach((button) => button.classList.remove('selected'));
        button.classList.add('selected');
      };
    }
  });
}

function handleNext() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    alert('This is the last question!');
  }
}

function handlePrevious() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  } else {
    alert('This is the first question!');
  }
}


function handleSubmit() {
  
  const allAnswered = selectedAnswers.every((ans) => ans !== null);

  if (!allAnswered) {
    alert('Please answer all questions before submitting!');
    return;
  }

  score = 0;
  questions.forEach((question, index) => {
    if (selectedAnswers[index] === question.answer) {
      score++; 
    }
  });

  localStorage.setItem('lastScore', score.toString());

  alert(`Your total score is: ${score} / ${questions.length}`);

 
  window.location.href = 'index.html';
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.nextbutton')?.addEventListener('click', handleNext);
  document.querySelector('.previousbutton')?.addEventListener('click', handlePrevious);
  document.querySelector('.submitbutton')?.addEventListener('click', handleSubmit);
});

loadQuizData();

const allAnswered = selectedAnswers.every((ans) => ans !== null);
if (!allAnswered) {
  alert('Please answer all questions before submitting!');
  
}
