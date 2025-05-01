$("#mySidenav").load("../../app/admin-Sidenav/adminsidenav.html");

document.addEventListener("DOMContentLoaded", function () {
  const apiEndpoints = {
    totalCourses: "http://localhost:8080/courses/all",
    totalUsers: "http://localhost:8080/employees/all",
    totalEnrolledCourses: "http://localhost:8080/enrollments/all",
    totalCoursesInProgress: "http://localhost:8080/enrollments/all",
    totalCoursesCompleted: "http://localhost:8080/enrollments/all",
    totalAssessmentsTaken: "http://localhost:8080/assessment-results/all",
  };

  // Function to fetch and display detailed information
  function fetchDetails(apiUrl, type) {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        let detailsHtml = "";

        switch (type) {
          case "totalCourses":
            detailsHtml = `<h4>Course Details</h4><ul class="list-group">`;
            data.forEach((course) => {
              detailsHtml += `
                                <li class="list-group-item">
                                    <h5>${course.courseName}</h5>
                                    <p>${course.description}</p>
                                </li>
                            `;
            });
            detailsHtml += `</ul>`;
            break;

          case "totalUsers":
            detailsHtml = `<h4>Registered Users</h4><table class="table table-striped">
                            <thead>
                                <tr><th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Position</th></tr>
                            </thead>
                            <tbody>`;
            data.forEach((user) => {
              if (user.position !== "Admin") {
                detailsHtml += `
                                    <tr>
                                        <td>${user.employeeId}</td>
                                        <td>${user.firstName} ${user.lastName}</td>
                                        <td>${user.email}</td>
                                        <td>${user.department}</td>
                                        <td>${user.position}</td>
                                    </tr>
                                `;
              }
            });
            detailsHtml += `</tbody></table>`;
            break;

          case "totalEnrolledCourses":
            detailsHtml = `<h4>Enrolled Courses</h4><ul class="list-group">`;
            data.forEach((enrollment) => {
              detailsHtml += `
                                <li class="list-group-item">
                                    <h5>${enrollment.course.courseName}</h5>
                                    <p>Status: ${enrollment.status}</p>
                                    <p>Employee name: ${enrollment.employee.firstName}</p>
                                </li>
                            `;
            });
            detailsHtml += `</ul>`;
            break;

          case "totalCoursesInProgress":
            detailsHtml = `<h4>Courses In Progress</h4><ul class="list-group">`;
            data.forEach((enrollment) => {
              if (enrollment.status === "Ongoing") {
                detailsHtml += `
                                    <li class="list-group-item">
                                        <h5>${enrollment.course.courseName}</h5>
                                        <p>Enrollment Date: ${new Date(
                                          enrollment.enrollmentDate
                                        ).toLocaleDateString()}</p>
                                        <p>Employee name: ${
                                          enrollment.employee.firstName
                                        }</p>
                                    </li>
                                `;
              }
            });
            detailsHtml += `</ul>`;
            break;

          case "totalCoursesCompleted":
            detailsHtml = `<h4>Completed Courses</h4><ul class="list-group">`;
            data.forEach((enrollment) => {
              if (enrollment.status === "Completed") {
                detailsHtml += `
                                    <li class="list-group-item">
                                        <h5>${enrollment.course.courseName}</h5>
                                        <p>Completion Date: ${new Date(
                                          enrollment.enrollmentDate
                                        ).toLocaleDateString()}</p>
                                        <p>Employee name: ${
                                          enrollment.employee.firstName
                                        }</p>
                                    </li>
                                `;
              }
            });
            detailsHtml += `</ul>`;
            break;

          case "totalAssessmentsTaken":
            detailsHtml = `<h4>Assessments Taken</h4><ul class="list-group">`;
            data.forEach((result) => {
              detailsHtml += `
                                <li class="list-group-item">
                                    <h5>Assessment ID: ${result.resultId}</h5>
                                    <p>Course: ${
                                      result.enrollment.course.courseName
                                    }</p>
                                    <p>Score: ${result.score}</p>
                                    <p>Date: ${new Date(
                                      result.assessmentDate
                                    ).toLocaleDateString()}</p>
                                    <p>Employee name: ${
                                      result.employee.firstName
                                    }</p>
                                </li>
                            `;
            });
            detailsHtml += `</ul>`;
            break;

          default:
            detailsHtml = `<p>No details available for this section.</p>`;
        }

        document.getElementById("results").innerHTML = detailsHtml;
      })
      .catch((error) => {
        console.error("Error fetching details:", error);
        document.getElementById(
          "results"
        ).innerHTML = `<p>Error fetching details. Please try again later.</p>`;
      });
  }

  // Function to update dashboard data
  function updateDashboard() {
    fetch(apiEndpoints.totalCourses)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("TotalCoursesFound").textContent =
          data.length || "0";
      })
      .catch((error) => console.error("Error fetching total courses:", error));

    // Fetch and update total registered users, excluding those with position "Admin"
    fetch(apiEndpoints.totalUsers)
      .then((response) => response.json())
      .then((data) => {
        const filteredUsers = data.filter((user) => user.position !== "Admin");
        document.getElementById("TotalregisteredUserFound").textContent =
          filteredUsers.length || "0";
      })
      .catch((error) => console.error("Error fetching total users:", error));

    // Fetch and update total courses enrolled by all users
    fetch(apiEndpoints.totalEnrolledCourses)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("TotalenrolledCoursesFound").textContent =
          data.length || "0";
      })
      .catch((error) =>
        console.error("Error fetching total enrolled courses:", error)
      );

    // Fetch and update total courses in-progress by all users
    fetch(apiEndpoints.totalCoursesInProgress)
      .then((response) => response.json())
      .then((data) => {
        const filteredInProgressCourses = data.filter(
          (enrollment) => enrollment.status === "Ongoing"
        );
        document.getElementById("totalCoursesInProgress").textContent =
          filteredInProgressCourses.length || "0";
      })
      .catch((error) =>
        console.error("Error fetching total courses in progress:", error)
      );

    // Fetch and update total courses completed by all users
    fetch(apiEndpoints.totalCoursesCompleted)
      .then((response) => response.json())
      .then((data) => {
        const filteredCompletedCourses = data.filter(
          (enrollment) => enrollment.status === "Completed"
        );
        document.getElementById("totalCoursesCompleted").textContent =
          filteredCompletedCourses.length || "0";
      })
      .catch((error) =>
        console.error("Error fetching total courses completed:", error)
      );

    // Fetch and update total assessments taken by all users
    fetch(apiEndpoints.totalAssessmentsTaken)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("totalAssessmentsTaken").textContent =
          data.length || "0";
      })
      .catch((error) =>
        console.error("Error fetching total assessments taken:", error)
      );
  }

  // Update the dashboard initially
  updateDashboard();

  // Add event listeners to each card to show detailed information on click
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function () {
      const cardId = card.querySelector(".card-title").textContent.trim();

      let apiUrl;
      let type;
      switch (cardId) {
        case "Total Courses Published":
          apiUrl = apiEndpoints.totalCourses;
          type = "totalCourses";
          break;
        case "Total registered users":
          apiUrl = apiEndpoints.totalUsers;
          type = "totalUsers";
          break;
        case "Total courses enrolled by all users":
          apiUrl = apiEndpoints.totalEnrolledCourses;
          type = "totalEnrolledCourses";
          break;
        case "Total Courses In-Progress by All Users":
          apiUrl = apiEndpoints.totalCoursesInProgress;
          type = "totalCoursesInProgress";
          break;
        case "Total Courses Completed by All Users":
          apiUrl = apiEndpoints.totalCoursesCompleted;
          type = "totalCoursesCompleted";
          break;
        case "Total Assessments Taken by All Users":
          apiUrl = apiEndpoints.totalAssessmentsTaken;
          type = "totalAssessmentsTaken";
          break;
        default:
          console.error("Unknown card title:", cardId);
          return;
      }

      fetchDetails(apiUrl, type);
    });
  });
});
