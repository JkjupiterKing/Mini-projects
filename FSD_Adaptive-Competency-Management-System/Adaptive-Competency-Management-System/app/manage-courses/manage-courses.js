$("#mySidenav").load("../../app/user-Sidenav/sidenav.html");

var enrollments;
var enrolledCourses;
document.addEventListener("DOMContentLoaded", function () {
  // Initialize UI with enrolled courses for the current user
  const currentUser = JSON.parse(localStorage.getItem("User"));
  if (currentUser && currentUser.employeeId) {
    fetchEnrolledCourses(currentUser.employeeId);
  } else {
    console.error(
      "No current user found or employee ID missing in localStorage."
    );
  }
});

// Function to mark course as completed
function updatedProgress(enrollment, status) {
  console.log("updatedProgress enrollment", enrollment);
  const currentUser = JSON.parse(localStorage.getItem("User"));
  const apiUrl = `http://localhost:8080/enrollments/${enrollment.enrollmentId}`;
  enrollment.status = status;
  fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enrollment),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to mark course as completed");
      }
      if (status == "Completed") alert("Course marked as complete");
      return response.json();
    })
    .then(() => {
      fetchEnrolledCourses(currentUser.employeeId);
    })
    .catch((error) => {
      console.error("Error marking course as completed:", error);
      alert("Failed to mark course as completed. Please try again.");
    });
}

function fetchVideoUrl(courseId) {
  const apiUrl = `http://localhost:8080/courses/${courseId}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((video) => {
      // Assuming the API returns a JSON object with video URL
      if (video && video.courseUrl) {
        // Example: Open video in a new tab
        window.open(video.courseUrl, "_blank");
      } else {
        console.error("Video URL not found in API response");
      }
    })
    .catch((error) => {
      console.error("Error fetching video URL:", error);
    });
}

function fetchEnrolledCourses(employeeId) {
  const apiUrl = `http://localhost:8080/enrollments?employeeId=${employeeId}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("data", data);
      if (data.length === 0) {
        displayNoEnrolledCoursesMessage();
      } else {
        enrollments = data;
        displayCourses(enrollments);
      }
    })
    .catch((error) => {
      console.error("Error fetching enrolled courses:", error);
    });
}

function displayCourses(enrollments) {
  console.log("enrolledCourse", enrollments);
  const coursesList = document.getElementById("coursesList");
  coursesList.innerHTML = ""; // Clear previous content

  enrollments.forEach((enrollment) => {
    const course = enrollment.course;

    // Create card container
    const card = document.createElement("div");
    card.classList.add("card", "mb-3");
    card.style.width = "18rem"; // Set card width

    // Create card image
    const cardImg = document.createElement("img");
    cardImg.classList.add("card-img-top");
    cardImg.src = course.imageUrl;
    cardImg.alt = course.courseName;
    card.appendChild(cardImg);

    // Create card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "d-flex", "flex-column");

    // Create course title
    const courseTitle = document.createElement("h5");
    courseTitle.classList.add("card-title");
    courseTitle.textContent = course.courseName;
    cardBody.appendChild(courseTitle);

    // Create course description
    const courseDescription = document.createElement("p");
    courseDescription.classList.add("card-text");
    courseDescription.textContent = course.description;
    cardBody.appendChild(courseDescription);

    // Create div for buttons with flex utility class
    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("d-flex", "justify-content-between", "mt-auto");

    // Create "Start Learning" button
    const startLearningButton = document.createElement("a");
    startLearningButton.id = `startLearning_${course.courseId}`;
    startLearningButton.classList.add("btn", "btn-primary");
    startLearningButton.href = "#";
    startLearningButton.textContent =
      enrollment.status === "Ongoing" || enrollment.status === "Completed"
        ? "Continue Learning"
        : "Start Learning";

    // Create "Mark as Completed" button
    const markCompletedButton = document.createElement("button");
    markCompletedButton.id = `markCompleted_${course.courseId}`;
    markCompletedButton.classList.add("btn", "btn-primary", "ml-2");
    markCompletedButton.textContent = "Mark as Completed";
    markCompletedButton.style.display = "none"; // Initially hidden

    // Add event listener to handle "Start Learning" button click
    startLearningButton.addEventListener("click", function (event) {
      event.preventDefault();
      fetchVideoUrl(course.courseId);
      console.log('Clicked "Start Learning" for course:', course);
      if (enrollment.status === "Enrolled") {
        updatedProgress(enrollment, "Ongoing");
      }
      markCompletedButton.style.display = "block"; // Show the "Mark as Completed" button
    });
    buttonGroup.appendChild(startLearningButton);

    // Add event listener to handle "Mark as Completed" button click
    markCompletedButton.addEventListener("click", function (event) {
      event.preventDefault();
      updatedProgress(enrollment, "Completed");
    });
    buttonGroup.appendChild(markCompletedButton);

    // Append button group to card body
    cardBody.appendChild(buttonGroup);

    // Append card body to card
    card.appendChild(cardBody);

    // Append card to courses list
    coursesList.appendChild(card);
  });
}
