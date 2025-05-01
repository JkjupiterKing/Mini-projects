document.addEventListener("DOMContentLoaded", () => {
  $("#mySidenav").load("../../app/admin-Sidenav/adminsidenav.html");

  const apiBaseUrl = "http://localhost:8080/employees";
  const employeeapi = "http://localhost:8080/employees/all";

  // Load all employees into the table
  function loadEmployees() {
    fetch(employeeapi)
      .then((response) => response.json())
      .then((data) => {
        const employeeTableBody = document.getElementById("employeeTableBody");
        employeeTableBody.innerHTML = ""; // Clear existing data
        data.forEach((employee) => {
          const row = document.createElement("tr");
          row.setAttribute("data-id", employee.employeeId);

          row.innerHTML = `
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${employee.position}</td>
                <td>${employee.hireDate}</td>
                <td>
                  <button class="btn btn-primary btn-sm edit-btn" data-id="${employee.employeeId}" data-bs-toggle="modal" data-bs-target="#updateEmployeeModal" id="updatebtn">Update</button>
                  <button class="btn btn-danger btn-sm delete-btn" data-id="${employee.employeeId}">Delete</button>
                </td>
              `;
          employeeTableBody.appendChild(row);
        });
      })
      .catch((error) => console.error("Error loading employees:", error));
  }

  // Call to load employees when the page loads
  loadEmployees();

  // Handle Add New Employee form submission
  const addEmployeeForm = document.getElementById("addEmployeeForm");

  let isFormSubmitting = false; // Flag to prevent multiple submissions

  addEmployeeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isFormSubmitting) return; // If the form is already being submitted, prevent further submissions

    isFormSubmitting = true; // Mark the form as submitting

    const formData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      department: document.getElementById("department").value,
      position: document.getElementById("position").value,
      hireDate: document.getElementById("hireDate").value,
      birthDate: document.getElementById("birthDate").value,
      address: document.getElementById("address").value,
      password: document.getElementById("password").value,
    };

    // Check if hireDate and birthDate are the same
    if (formData.hireDate === formData.birthDate) {
      alert(
        "Hire date and birth date cannot be the same. Please enter different dates."
      );
      isFormSubmitting = false; // Reset the flag
      return;
    }

    try {
      // POST request to add new employee
      const response = await fetch(`${apiBaseUrl}/addEmployee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      const responseData = await response.json();
      console.log("Employee added successfully:", responseData);
      alert("Employee added successfully");
      loadEmployees(); // Reload the employee list
      $("#addEmployeeModal").modal("hide"); // Close the modal
    } catch (error) {
      console.error("Error adding employee:", error.message);
    } finally {
      isFormSubmitting = false; // Reset the flag
    }
  });

  // Handle Edit button click - Pre-fill form with employee data
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-btn")) {
      const employeeId = event.target.getAttribute("data-id");

      // Fetch employee details and pre-fill the form
      fetch(`${apiBaseUrl}/${employeeId}`)
        .then((response) => response.json())
        .then((employee) => {
          // Pre-fill the update form with employee data
          document.getElementById("updateFirstName").value = employee.firstName;
          document.getElementById("updateLastName").value = employee.lastName;
          document.getElementById("updateEmail").value = employee.email;
          document.getElementById("updateDepartment").value =
            employee.department;
          document.getElementById("updatePosition").value = employee.position;
          document.getElementById("updateHireDate").value = employee.hireDate;
          document.getElementById("updateBirthDate").value = employee.birthDate;
          document.getElementById("updateAddress").value = employee.address;
          document.getElementById("updatePassword").value = employee.password;

          // Handle update form submission
          const updateEmployeeForm =
            document.getElementById("updateEmployeeForm");
          updateEmployeeForm.onsubmit = async (event) => {
            event.preventDefault();

            const updatedEmployeeData = {
              firstName: document.getElementById("updateFirstName").value,
              lastName: document.getElementById("updateLastName").value,
              email: document.getElementById("updateEmail").value,
              department: document.getElementById("updateDepartment").value,
              position: document.getElementById("updatePosition").value,
              hireDate: document.getElementById("updateHireDate").value,
              birthDate: document.getElementById("updateBirthDate").value,
              address: document.getElementById("updateAddress").value,
              password: document.getElementById("updatePassword").value,
            };

            try {
              // PUT request to update the employee
              const response = await fetch(
                `${apiBaseUrl}/update/${employeeId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatedEmployeeData),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to update employee");
              }

              const responseData = await response.json();
              console.log("Employee updated successfully:", responseData);
              alert("Employee updated successfully");
              loadEmployees(); // Reload employee list
              $("#updateEmployeeModal").modal("hide"); // Close the modal
            } catch (error) {
              console.error("Error updating employee:", error.message);
            }
          };
        })
        .catch((error) =>
          console.error("Error fetching employee data:", error)
        );
    }
  });

  // Handle Delete button click
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const employeeId = event.target.getAttribute("data-id");

      if (confirm("Are you sure you want to delete this employee?")) {
        // DELETE request to delete employee
        fetch(`${apiBaseUrl}/deleteEmployee/${employeeId}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to delete employee");
            }

            alert("Employee deleted successfully");
            loadEmployees(); // Reload employee list
          })
          .catch((error) => console.error("Error deleting employee:", error));
      }
    }
  });

  // Reset the form when Add Employee modal is shown
  const addEmployeeModal = document.getElementById("addEmployeeModal");
  addEmployeeModal.addEventListener("show.bs.modal", () => {
    // Reset the form when the modal is opened for adding a new employee
    addEmployeeForm.reset();
  });
});
