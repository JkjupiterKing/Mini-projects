$("#mySidenav").load("../../app/sidebar/sidebar.html");

document.addEventListener("DOMContentLoaded", function () {
  fetchProjectProgress();
});

// Function to fetch project progress data from the API
function fetchProjectProgress() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/projects/all", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const projects = JSON.parse(xhr.responseText);
      displayProjects(projects);
    } else {
      console.error("Error fetching projects:", xhr.statusText);
    }
  };
  xhr.onerror = function () {
    console.error("Request failed");
  };
  xhr.send();
}

// Function to display projects in card format
function displayProjects(projects) {
  const projectList = document.getElementById("projectList");
  projectList.innerHTML = "";

  projects.forEach((project) => {
    const col = document.createElement("div");
    col.className = "col-md-6 mb-4";

    const card = document.createElement("div");
    card.className = "card h-100";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = project.title;

    const description = document.createElement("p");
    description.className = "card-text";
    description.textContent = project.description;

    const progressBarContainer = document.createElement("div");
    progressBarContainer.className = "progress mb-3";

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    progressBar.style.width = `${project.progress}%`; // Assume progress is a percentage
    progressBar.setAttribute("aria-valuenow", project.progress);
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");

    // Create a span to display the percentage inside the progress bar
    const progressText = document.createElement("span");
    progressText.className = "progress-text";
    progressText.textContent = `${project.progress}%`;
    progressBar.appendChild(progressText); // Append percentage text to the progress bar

    // Append elements to the card
    progressBarContainer.appendChild(progressBar);
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(progressBarContainer);
    card.appendChild(cardBody);
    col.appendChild(card);
    projectList.appendChild(col);
  });
}

// Function to filter projects based on search input
function filterProjects() {
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const projectCards = document.querySelectorAll("#projectList .card");

  projectCards.forEach((card) => {
    const title = card.querySelector(".card-title").textContent.toLowerCase();
    card.style.display = title.includes(searchValue) ? "block" : "none";
  });
}
