document.addEventListener("DOMContentLoaded", function () {
  var loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      var emailInput = document.getElementById("email");
      var passwordInput = document.getElementById("password");

      var email = emailInput.value.trim();
      var password = passwordInput.value.trim();

      if (email !== "" && password !== "") {
        try {
          const response = await fetch("http://localhost:8080/employees/all", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const allEmployees = await response.json();
          const employee = allEmployees.find((emp) => emp.email === email);

          if (!employee) {
            throw new Error("No employee found with this email");
          }

          const storedPasswordHash = employee.password;

          // Decode stored password hash
          const decodedPassword = decodePasswordHash(storedPasswordHash);

          // Log fetched data and password for debugging
          console.log("Fetched employee data:", employee);
          console.log("Decoded password:", decodedPassword);

          // Verify the decoded password with user input password and email
          if (password === decodedPassword && email === employee.email) {
            if (employee.position === "Admin") {
              console.log("Login successful: Admin");

              // Save user info in localStorage or session storage if needed
              localStorage.setItem("currentUser", JSON.stringify(employee));

              // Redirect to admin dashboard upon successful login
              window.location.href =
                "../../app/Admin-dashborad/AdminDashboard.html";
            } else {
              throw new Error("Access denied: Only admins can log in here.");
            }
          } else {
            throw new Error("Login failed. Incorrect email or password.");
          }
        } catch (error) {
          console.error("Error logging in:", error.message);
          alert(error.message);
        }
      } else {
        alert("Please enter both email and password.");
      }
    });
  } else {
    console.error("Could not find loginForm element.");
  }
});

function decodePasswordHash(passwordHash) {
  try {
    const decodedPassword = atob(passwordHash);
    return decodedPassword;
  } catch (error) {
    console.error("Error decoding password hash:", error);
    return null;
  }
}
