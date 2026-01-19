let currentQuestionIndex = 0;
interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  difficulty: string;
}
let questions: any[] = [];
let selectedAnswers: (string | null)[] = [];
let score = 0;

async function loadQuizData() {
  try {
    const quizResponseData = await fetch("quizData.json");
    const data = await quizResponseData.json();

    questions = data.quizData.questions;
    const savedProgress = localStorage.getItem("quizProgress");
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      currentQuestionIndex = progress.currentQuestionIndex;
      selectedAnswers = progress.selectedAnswers;
      score = progress.score;
    } else {
      selectedAnswers = new Array(questions.length).fill(null);
    }
  } catch (error) {
    console.error("Error loading quiz:", error);
  }

  showQuestion();
}
function updateButtonStates() {
  const prevButton =
    document.querySelector<HTMLButtonElement>(".previousbutton");
  const nextButton = document.querySelector<HTMLButtonElement>(".nextbutton");
  if (!prevButton || !nextButton) return;
  prevButton.disabled = currentQuestionIndex === 0;
  nextButton.disabled = currentQuestionIndex === questions.length - 1;
}

function showQuestion() {
  const questionHeading =
    document.querySelector<HTMLHeadingElement>(".quizQuestion h2");
  const optionButtons =
    document.querySelectorAll<HTMLButtonElement>(".quizOption button");

  if (!questionHeading || !optionButtons) return;

  const currentQuestion = questions[currentQuestionIndex];

  questionHeading.textContent = currentQuestion.question;
  updateButtonStates();

  renderOptions(optionButtons, currentQuestion);
}
function renderOptions(
  optionButtons: NodeListOf<HTMLButtonElement>,
  question: Question,
) {
  question.options.forEach((option, index) => {
    const button = optionButtons[index];
    if (!button) return;

    button.textContent = option;

    button.classList.toggle(
      "selected",
      selectedAnswers[currentQuestionIndex] === option,
    );

    button.onclick = () => {
      selectedAnswers[currentQuestionIndex] = option;

      optionButtons.forEach((btn) => btn.classList.remove("selected"));

      button.classList.add("selected");
      saveProgress();
    };
  });
}

function handleNext() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
    saveProgress();
  } else {
    alert("This is the last question!");
  }
}

function handlePrevious() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
    saveProgress();
  } else {
    alert("This is the first question!");
  }
}
function saveProgress() {
  localStorage.setItem(
    "quizProgress",
    JSON.stringify({
      currentQuestionIndex,
      selectedAnswers,
      score,
    }),
  );
}
function handleSubmit() {
  const allAnswered = selectedAnswers.every((ans) => ans !== null);

  if (!allAnswered) {
    alert("Please answer all questions before submitting!");
    return;
  }

  score = 0;
  questions.forEach((question, index) => {
    if (selectedAnswers[index] === question.answer) {
      score++;
    }
  });
  localStorage.removeItem("quizProgress");

  localStorage.setItem("lastScore", score.toString());

  alert(`Your total score is: ${score} / ${questions.length}`);

  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".nextbutton")?.addEventListener("click", handleNext);
  document
    .querySelector(".previousbutton")
    ?.addEventListener("click", handlePrevious);
  document
    .querySelector(".submitbutton")
    ?.addEventListener("click", handleSubmit);
});

loadQuizData();
