document.addEventListener("DOMContentLoaded", function () {
  $("#mySidenav").load("../../app/admin-Sidenav/adminsidenav.html");
  fetchAllCourses();

  // Add event listener for Add Course button
  document
    .getElementById("addCourseButton")
    .addEventListener("click", function () {
      var addCourseModal = new bootstrap.Modal(
        document.getElementById("addCourseModal")
      );
      addCourseModal.show();
    });

  // Add event listener for form submission
  document
    .getElementById("addCourseForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      addCourse();
    });

  // Reset form when the modal is hidden
  var addCourseModalElement = document.getElementById("addCourseModal");
  addCourseModalElement.addEventListener("hidden.bs.modal", function () {
    document.getElementById("addCourseForm").reset();
  });
});

function fetchAllCourses() {
  const apiUrl = "http://localhost:8080/courses/all";

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched courses:", data);
      if (data.length === 0) {
        displayNoCoursesMessage();
      } else {
        displayCourses(data);
      }
    })
    .catch((error) => {
      console.error("Error fetching courses:", error);
    });
}

function displayCourses(courses) {
  console.log("Displaying courses:", courses);
  const coursesList = document.getElementById("coursesList");
  coursesList.innerHTML = "";

  courses.forEach((course) => {
    const card = document.createElement("div");
    card.classList.add("card", "mb-3");
    card.style.width = "18rem";

    const cardImg = document.createElement("img");
    cardImg.classList.add("card-img-top");
    cardImg.src = course.imageUrl;
    cardImg.alt = course.courseName;
    card.appendChild(cardImg);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "d-flex", "flex-column");

    const courseTitle = document.createElement("h5");
    courseTitle.classList.add("card-title");
    courseTitle.textContent = course.courseName;
    cardBody.appendChild(courseTitle);

    const courseDescription = document.createElement("p");
    courseDescription.classList.add("card-text");
    courseDescription.textContent = course.description;
    cardBody.appendChild(courseDescription);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-primary", "mt-auto");
    deleteButton.textContent = "Delete Course";
    deleteButton.addEventListener("click", function () {
      deleteCourse(course.courseId);
    });
    cardBody.appendChild(deleteButton);

    card.appendChild(cardBody);
    coursesList.appendChild(card);
  });
}

function deleteCourse(courseId) {
  if (confirm("Are you sure you want to delete this course?")) {
    const apiUrl = `http://localhost:8080/courses/removeCourse/${courseId}`;

    fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          alert("Course deleted successfully!");
          console.log("Course deleted successfully");
          fetchAllCourses();
        } else if (response.status === 404) {
          alert("Course not found. Please try again.");
          console.error("Course not found:", response);
        } else {
          throw new Error("Unexpected response status: " + response.status);
        }
      })
      .catch((error) => {
        console.error("Error deleting course:", error);
        alert("Error deleting course. Please try again.");
      });
  } else {
    console.log("Course deletion canceled.");
  }
}

function addCourse() {
  const courseName = document.getElementById("courseName").value.trim();
  const courseDescription = document
    .getElementById("courseDescription")
    .value.trim();
  const courseImageUrl = document.getElementById("courseImageUrl").value.trim();
  const courseUrl = document.getElementById("courseUrl").value.trim();

  if (courseName && courseDescription && courseImageUrl) {
    const apiUrl = "http://localhost:8080/courses/addcourse";
    const courseData = {
      courseName: courseName,
      description: courseDescription,
      imageUrl: courseImageUrl,
      courseUrl: courseUrl,
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Course added successfully:", data);
        alert("Course added successfully!");
        var addCourseModal = bootstrap.Modal.getInstance(
          document.getElementById("addCourseModal")
        );
        addCourseModal.hide();
        // Fetch all courses to update the list
        fetchAllCourses();
      })
      .catch((error) => {
        console.error("Error adding course:", error);
        alert("Error adding course. Please try again.");
      });
  } else {
    alert("Please fill in all fields.");
  }
}
