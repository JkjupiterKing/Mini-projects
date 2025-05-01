// Load navBar
$("#mySidenav").load("../../app/user-Sidenav/sidenav.html");

const currentUser = JSON.parse(localStorage.getItem("User"));

document.addEventListener("DOMContentLoaded", function () {
  if (currentUser && currentUser.employeeId) {
    fetchCompletedCourses(currentUser.employeeId);
  } else {
    console.error(
      "No current user found or employee ID missing in localStorage."
    );
  }
});

function fetchCompletedCourses(employeeId) {
  const apiUrl = `http://localhost:8080/enrollments/status?employeeId=${employeeId}&status=Completed`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((enrollments) => {
      console.log("Completed Enrollments:", enrollments);
      if (enrollments.length === 0) {
        displayNoEnrolledCoursesMessage();
      } else {
        const courseDetails = enrollments.map((enrollment) => ({
          courseId: enrollment.course.courseId,
          enrollmentId: enrollment.enrollmentId,
          courseName: enrollment.course.courseName,
        }));
        fetchCoursesByEnrollments(courseDetails);
      }
    })
    .catch((error) => {
      console.error("Error fetching completed courses:", error);
    });
}

function fetchCoursesByEnrollments(courseDetails) {
  if (courseDetails.length === 0) {
    console.log("No completed courses found for the employee.");
    displayNoEnrolledCoursesMessage();
    return;
  }

  Promise.all(courseDetails.map((detail) => fetchCourseById(detail.courseId)))
    .then((responses) =>
      Promise.all(responses.map((response) => response.json()))
    )
    .then((courses) => {
      console.log("Courses:", courses);
      displayCourses(courses, courseDetails);
    })
    .catch((error) => {
      console.error("Error fetching courses:", error);
    });
}

function fetchCourseById(courseId) {
  const apiUrl = `http://localhost:8080/courses/${courseId}`;
  return fetch(apiUrl).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok for course ID " + courseId);
    }
    return response;
  });
}

function displayCourses(courses, courseDetails) {
  const container = document.getElementById("assessmentList");
  container.innerHTML = "";

  if (courses.length === 0) {
    displayNoEnrolledCoursesMessage();
    return;
  }

  courses.forEach((course) => {
    const courseDetail = courseDetails.find(
      (detail) => detail.courseId === course.courseId
    );
    if (!courseDetail) return;

    const courseHtml = `
           <div class="col-md-6 mb-4">
            <div class="assessment-item card">
                <img src="${course.imageUrl}" class="card-img-top" alt="${course.courseName}">
                <div class="card-body">
                    <h5 class="card-title">${course.courseName}</h5>
                    <p class="card-text">${course.description}</p>
                    <button class="btn btn-secondary retake-course"
                       data-course-id="${course.courseId}" 
                       data-enrollment-id="${courseDetail.enrollmentId}">Retake Course</button>        
                </div>
            </div>
        </div>
        `;
    container.innerHTML += courseHtml;
  });

  document.querySelectorAll(".start-assessment").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link behavior

      const courseName = this.getAttribute("data-course-name");
      const enrollmentId = this.getAttribute("data-enrollment-id");
      checkAttemptLimit(enrollmentId, courseName);
    });
  });

  document.querySelectorAll(".view-results").forEach((button) => {
    button.addEventListener("click", function () {
      const enrollmentId = this.getAttribute("data-enrollment-id");
      fetchAssessmentResults(enrollmentId, button);
    });
  });

  document.querySelectorAll(".retake-course").forEach((button) => {
    button.addEventListener("click", function () {
      const courseId = this.getAttribute("data-course-id");
      fetchVideoUrl(courseId);
    });
  });
}

function checkAttemptLimit(enrollmentId, courseName) {
  const apiUrl = `http://localhost:8080/assessment-results/getResults?enrollmentId=${enrollmentId}&employeeId=${currentUser.employeeId}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((results) => {
      const maxAttempts = 3;
      const attempts = results.length;

      if (attempts >= maxAttempts) {
        alert(
          "You have reached the maximum number of attempts for this assessment."
        );
      } else {
        localStorage.setItem("currentCourseName", courseName);
        localStorage.setItem("currentEnrollmentId", enrollmentId);
        window.open("../../app/Questions/question.html", "_blank");
      }
    })
    .catch((error) => {
      console.error("Error fetching assessment results:", error);
    });
}

function fetchAssessmentResults(enrollmentId, button) {
  const apiUrl = `http://localhost:8080/assessment-results/getResults?enrollmentId=${enrollmentId}&employeeId=${currentUser.employeeId}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((results) => {
      if (results.length === 0) {
        displayNoResultsMessage();
      } else {
        showResultsInModal(results);
      }
    })
    .catch((error) => {
      console.error("Error fetching assessment results:", error);
    });
}

function showResultsInModal(results) {
  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = "";

  let maxAttempt = 0;
  results.forEach((result, index) => {
    maxAttempt = Math.max(maxAttempt, index + 1);
    const resultHtml = `
        <p><strong>Attempt: </strong>${index + 1}</p>
        <p><strong>Course: </strong> ${result.enrollment.course.courseName}</p>
        <p><strong>Score: </strong> ${result.score}</p>
            <hr>
        `;
    modalBody.innerHTML += resultHtml;
  });

  localStorage.setItem("maxAttemptIndex", maxAttempt); // Save max attempt index

  const myModal = new bootstrap.Modal(document.getElementById("resultsModal"));
  myModal.show();
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
    .then((course) => {
      if (course && course.courseUrl) {
        window.open(course.courseUrl, "_blank");
      } else {
        console.error("Video URL not found in API response");
      }
    })
    .catch((error) => {
      console.error("Error fetching video URL:", error);
    });
}

function displayNoEnrolledCoursesMessage() {
  const container = $("#assessmentList");
  container.html("<p>No completed courses found.</p>");
}

function displayNoResultsMessage() {
  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = "<p>No results found.</p>";
  const myModal = new bootstrap.Modal(document.getElementById("resultsModal"));
  myModal.show();
}
