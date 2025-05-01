$("#mySidenav").load("../../app/user-Sidenav/sidenav.html");

var allCourses;
var enrolledCourses;
var onGoingCourses;
var completedCourses;

// Initialize UI when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display username (firstname)
  fetchUsername();

  // Initialize the UI with zero ongoing and completed courses
  initializeUI();

  // Fetch enrolled courses and wait for the response before executing other functions
  fetchEnrolledCourses()
    .then(() => {
      // Execute other functions after `fetchEnrolledCourses` completes
      addEventListnersToCountCards();
      fetchAllCourses("");
    })
    .catch((error) => {
      console.error("Error fetching enrolled courses:", error);
      // Handle error appropriately, such as displaying an error message
    });
});

document.getElementById("searchButton").addEventListener("click", function () {
  const searchQuery = document.getElementById("courseSearchInput").value.trim();
  if (searchQuery !== "") {
    console.log("Searched");
    fetchAllCourses(searchQuery);
  }
});

function fetchUsername() {
  const currentUser = JSON.parse(localStorage.getItem("User"));
  const firstName = currentUser.firstName;
  document.getElementById(
    "welcomeMessage"
  ).textContent = `Welcome, ${firstName}!`;
}

// Function to initialize the UI with zero ongoing and completed courses
function initializeUI() {
  const ongoingCoursesList = document.getElementById("ongoingCoursesList");
  const enrolledCoursesList = document.getElementById("enrolledCoursesList");
  const completedCoursesList = document.getElementById("completedCoursesList");
  const ongoingCoursesNotFound = document.getElementById(
    "ongoingCoursesNotFound"
  );
  const completedCoursesNotFound = document.getElementById(
    "completedCoursesNotFound"
  );

  ongoingCoursesList.textContent = "0"; // Set ongoing courses count to 0
  enrolledCoursesList.textContent = "0"; // Set completed courses count to 0
  completedCoursesList.textContent = "0"; // Set completed courses count to 0
  ongoingCoursesNotFound.style.display = "none"; // Hide "No ongoing courses found" message
  completedCoursesNotFound.style.display = "none"; // Hide "No completed courses found" message
}

function addEventListnersToCountCards() {
  const ongoingCoursesCard = document.getElementById("ongoingCoursesList");
  ongoingCoursesCard.addEventListener("click", function (event) {
    event.preventDefault();
    displayCourses(onGoingCourses.map((onGoingCourse) => onGoingCourse.course));
  });
  const enrolledCoursesCard = document.getElementById("enrolledCoursesList");
  enrolledCoursesCard.addEventListener("click", function (event) {
    event.preventDefault();
    displayCourses(
      enrolledCourses.map((enrolledCourse) => enrolledCourse.course)
    );
  });
  const completedCoursesCard = document.getElementById("completedCoursesList");
  completedCoursesCard.addEventListener("click", function (event) {
    event.preventDefault();
    displayCourses(
      completedCourses.map((completedCourse) => completedCourse.course)
    );
  });
}
// Function to update ongoing courses count
function updateCounts() {
  const ongoingCoursesList = document.getElementById("ongoingCoursesList");
  ongoingCoursesList.textContent = onGoingCourses.length;
  const enrolledCoursesList = document.getElementById("enrolledCoursesList");
  enrolledCoursesList.textContent = enrolledCourses.length.toString();
  const completedCoursesList = document.getElementById("completedCoursesList");
  completedCoursesList.textContent = completedCourses.length.toString();
}

function displayCourses(courses, searchQuery) {
  console.log("displayCourses enrolledCourses ", enrolledCourses);
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = ""; // Clear previous search results

  if (courses.length > 0) {
    courses.forEach((course) => {
      // Create card container
      const card = document.createElement("div");
      card.classList.add("card", "mb-3");
      card.style.width = "10rem"; // Set card width
      card.id = "coursescard";

      // Create card image
      const cardImg = document.createElement("img");
      cardImg.classList.add("card-img-top");
      cardImg.src = course.imageUrl; // Replace with actual URL from course object
      cardImg.alt = course.courseName; // Use course name as alt text
      card.appendChild(cardImg);

      // Create card body
      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      // Create card title
      const courseTitle = document.createElement("h5");
      courseTitle.classList.add("card-title");
      courseTitle.textContent = course.courseName; // Course name
      cardBody.appendChild(courseTitle);

      // Create card text (description)
      const courseDescription = document.createElement("p");
      courseDescription.classList.add("card-text");
      courseDescription.textContent = course.description; // Course description
      cardBody.appendChild(courseDescription);

      // Create enroll button
      console.log("course-->", course);
      const enrollButton = document.createElement("button");
      if (alredayEnrolled(course)) {
        enrollButton.classList.add("btn");
        enrollButton.textContent = "Already Enrolled";
        enrollButton.disabled = true;
      } else {
        enrollButton.classList.add("btn", "btn-primary");
        enrollButton.textContent = "Enroll";
      }

      // Event listener for enroll button click
      enrollButton.addEventListener("click", function (event) {
        event.preventDefault();
        enrollAndFetch(course.courseId, searchQuery);
        // fetchAllCourses("");
      });

      cardBody.appendChild(enrollButton);

      // Append card body to card
      card.appendChild(cardBody);

      // Append card to search results container
      searchResults.appendChild(card);
    });
  } else {
    // Display message when no courses found
    searchResults.innerHTML = "<h2>No courses found.</h2>";
  }
}

function alredayEnrolled(course) {
  console.log("alredayEnrolled enrolledCourse", enrolledCourses);
  // if(enrolledCourses) {
  const result = enrolledCourses.filter(
    (enrolledCourse) => enrolledCourse.course.courseId === course.courseId
  );
  return result.length > 0;
  // } else {
  //     return false;
  // }
}

async function enrollAndFetch(courseId, searchQuery) {
  await enrollCourse(courseId);
  await fetchEnrolledCourses();
  fetchAllCourses(searchQuery);
}

function enrollCourse(courseId) {
  const apiUrl = `http://localhost:8080/enrollments/addenrollment`;
  const currentUser = JSON.parse(localStorage.getItem("User"));

  if (!currentUser || !currentUser.employeeId) {
    console.error(
      "Current user not found or missing employeeId in localStorage"
    );
    alert("Failed to enroll in the course. Please log in again.");
    return;
  }

  if (!courseId) {
    console.error("Invalid courseId:", courseId);
    alert("Failed to enroll in the course. Invalid course selected.");
    return;
  }

  const enrollmentData = {
    course: { courseId: courseId },
    employee: { employeeId: currentUser.employeeId }, // Retrieve employee ID from localStorage
    enrollmentDate: new Date().toISOString(), // Current date/time
  };

  return fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enrollmentData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to enroll in the course");
      }
      updateCounts(); // Update ongoing courses list after enrollment
      alert("Enrollment successful!");
      window.location.reload();
      return response;
    })
    .catch((error) => {
      console.error("Error enrolling in course:", error);
      alert("Failed to enroll in the course. Please try again.");
    });
}

// Event listener for search button click
function fetchEnrolledCourses() {
  console.log("fetchEnrolledCourses Begin");
  const currentUser = JSON.parse(localStorage.getItem("User"));
  if (!currentUser || !currentUser.employeeId) {
    console.error(
      "Current user not found or missing employeeId in localStorage"
    );
    // Handle error appropriately, such as redirecting to login
    return;
  }

  const apiUrl = `http://localhost:8080/enrollments?employeeId=${currentUser.employeeId}`;

  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch ongoing courses");
      }
      return response.json();
    })
    .then((data) => {
      enrolledCourses = data;
      console.log("fetchEnrolledCourses END");
      console.log("fetchEnrolledCourses enrolledCourses", enrolledCourses);

      onGoingCourses = enrolledCourses.filter(
        (enrolledCourse) => enrolledCourse.status == "Ongoing"
      );
      completedCourses = enrolledCourses.filter(
        (enrolledCourse) => enrolledCourse.status == "Completed"
      );
      updateCounts();
    })
    .catch((error) => {
      console.error("Error fetching ongoing courses:", error);
    });
}

//Function to fetch courses based on search query
function fetchAllCourses(searchQuery) {
  const apiUrl = `http://localhost:8080/courses/all`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      allCourses = data;
      console.log("fetchAllCourses allCourses", allCourses);
      if (searchQuery) {
        const filteredCourses = data.filter((course) => {
          return course.courseName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        });
        displayCourses(filteredCourses, searchQuery);
      } else {
        displayCourses(allCourses, searchQuery);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
