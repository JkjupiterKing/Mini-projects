let enrollmentId;
let employeeId;
let timerInterval;

document.addEventListener("DOMContentLoaded", function () {
  const courseName = localStorage.getItem("currentCourseName");
  enrollmentId = localStorage.getItem("currentEnrollmentId");
  const currentUser = JSON.parse(localStorage.getItem("User"));

  if (currentUser && currentUser.employeeId) {
    employeeId = currentUser.employeeId;
  } else {
    console.error(
      "No current user found or employee ID missing in localStorage."
    );
    return;
  }

  if (courseName) {
    fetchQuestionsByCourseName(courseName);
  } else {
    console.error("No course name found in localStorage.");
  }

  if (enrollmentId === null || isNaN(enrollmentId)) {
    console.error("Invalid or missing enrollmentId");
    return;
  }

  var myModalEl = document.getElementById("resultsModal");
  myModalEl.addEventListener("hidden.bs.modal", function (event) {
    window.close();
  });

  startTimer(2 * 60);
});

function startTimer(duration) {
  let timerDisplay = document.getElementById("timer");
  let endTime = Date.now() + duration * 1000;

  timerInterval = setInterval(function () {
    let remainingTime = Math.max(0, endTime - Date.now());
    let minutes = Math.floor(remainingTime / 60000);
    let seconds = Math.floor((remainingTime % 60000) / 1000);
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      evaluateAnswers();
      alert("Time Up!! Thank you for taking the assessment!");
      window.setTimeout(function () {
        var myModal = new bootstrap.Modal(
          document.getElementById("resultsModal")
        );
        myModal.show();
      }, 500);
    }
  }, 1000);
}

function fetchQuestionsByCourseName(courseName) {
  const apiUrl = `http://localhost:8080/questions/type/${courseName}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Shuffle the questions
      const shuffledQuestions = shuffleArray(data);

      const form = document.getElementById("questionsForm");
      form.innerHTML = "";
      correctAnswers = {};

      let questionNumber = 1;

      shuffledQuestions.forEach((question) => {
        const questionCard = document.createElement("div");
        questionCard.classList.add("card", "question-card");

        const questionBody = document.createElement("div");
        questionBody.classList.add("card-body");

        const questionHeader = document.createElement("h5");
        questionHeader.classList.add("card-title");
        questionHeader.textContent = `${questionNumber}. ${question.questionText}`;

        questionBody.appendChild(questionHeader);

        correctAnswers[questionNumber] = question.correctAnswer;

        const options = [
          { id: "option1", text: question.option1 },
          { id: "option2", text: question.option2 },
          { id: "option3", text: question.option3 },
          { id: "option4", text: question.option4 },
        ];

        options.forEach((option) => {
          if (option.text) {
            const formCheck = document.createElement("div");
            formCheck.classList.add("form-check");

            const input = document.createElement("input");
            input.classList.add("form-check-input");
            input.type = "radio";
            input.name = `question${questionNumber}`;
            input.id = `${questionNumber}-${option.id}`;
            input.value = option.text;

            const label = document.createElement("label");
            label.classList.add("form-check-label", "radio-label");
            label.htmlFor = input.id;
            label.textContent = option.text;

            formCheck.appendChild(input);
            formCheck.appendChild(label);

            questionBody.appendChild(formCheck);
          }
        });

        questionCard.appendChild(questionBody);
        form.appendChild(questionCard);
        questionNumber++;
      });

      let submitButton = document.querySelector(".submit-button");
      if (!submitButton) {
        submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.classList.add("btn", "btn-primary", "submit-button");
        submitButton.textContent = "Submit";
        submitButton.addEventListener("click", evaluateAnswers);
        form.appendChild(submitButton);
      }

      document.addEventListener("keydown", handleKeyDown);
    })
    .catch((error) => {
      alert("Failed to load questions. Please try again later.");
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function handleKeyDown(event) {
  const key = event.key;
  const focusedElement = document.activeElement;

  if (focusedElement && focusedElement.type === "radio") {
    const currentRadio = focusedElement;
    const form = document.getElementById("questionsForm");
    const radios = Array.from(
      form.querySelectorAll(`input[type="radio"][name="${currentRadio.name}"]`)
    );
    const currentIndex = radios.indexOf(currentRadio);

    let newIndex;

    if (key === "ArrowDown" || key === "ArrowRight") {
      newIndex = (currentIndex + 1) % radios.length;
    } else if (key === "ArrowUp" || key === "ArrowLeft") {
      newIndex = (currentIndex - 1 + radios.length) % radios.length;
    } else {
      return;
    }

    radios[newIndex].focus();
    event.preventDefault();
  }
}

function evaluateAnswers() {
  const form = document.getElementById("questionsForm");
  const userAnswers = {};
  let attemptedQuestions = 0;
  let correctAnswersCount = 0;

  form.querySelectorAll(".form-check-input:checked").forEach((input) => {
    const questionNumber = input.name.replace("question", "");
    userAnswers[questionNumber] = input.value;
  });

  Object.keys(correctAnswers).forEach((questionNumber) => {
    const correctAnswer = correctAnswers[questionNumber];
    const userAnswer = userAnswers[questionNumber] || "Not Answered";

    if (userAnswer !== "Not Answered") {
      attemptedQuestions++;
    }

    if (userAnswer === correctAnswer) {
      correctAnswersCount++;
    }
  });

  const totalQuestions = Object.keys(correctAnswers).length;
  const percentage = (correctAnswersCount / totalQuestions) * 100;

  const postData = {
    enrollment: { enrollmentId: parseInt(enrollmentId) },
    employee: { employeeId: parseInt(employeeId) },
    score: `${correctAnswersCount}`,
    attemptNumber: 1,
    assessmentDate: new Date().toISOString(),
    userAnswers: JSON.stringify(userAnswers),
    percentage: percentage,
  };

  postResults(postData);
  showResultsInModal(postData);
}

function postResults(postData) {
  const apiUrl =
    "http://localhost:8080/assessment-results/addassessmentresults";

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Results submitted successfully:", data);
      alert("Results submitted successfully!");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      alert("Failed to submit results. Please try again later.");
    });
}

function showResultsInModal(result) {
  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = "";
  const courseName = localStorage.getItem("currentCourseName");
  var comments = `You are an expert in ${courseName}! Learn other courses`;
  if (result.percentage >= 80) {
    comments = `You are an expert in ${courseName}! Learn other courses`;
  } else if (result.percentage >= 60) {
    comments = `You have Good knowledge in ${courseName}, However, you can strengthen the knowledge by taking the course again`;
  } else if (result.percentage >= 40) {
    comments = `Your knowledge in the ${courseName} is very basic, please strengthen the knowledge by taking the course again`;
  } else if (result.percentage >= 20) {
    comments = `Your knowledge in the ${courseName} is not satisfactory, You must take the course again`;
  } else if (result.percentage >= 0) {
    comments = `Results are too low to generate adaptive feedback. You must take the course again and retry the assessment`;
  } else {
    comments = `Evaluation was not possible for ${courseName}! Enjoy your learning`;
  }
  const resultHtml = `
        <p><strong>Course:</strong> ${courseName}</p>
        <p><strong>Score:</strong> ${result.score}</p>
        <p><strong>Percentage:</strong> ${result.percentage}</p>
        <p><strong>Comments:</strong> ${comments}</p>
        <hr>
    `;
  modalBody.innerHTML += resultHtml;

  const myModal = new bootstrap.Modal(document.getElementById("resultsModal"));
  myModal.show();
  localStorage.removeItem("currentCourseName");
  localStorage.removeItem("currentEnrollmentId");
}
