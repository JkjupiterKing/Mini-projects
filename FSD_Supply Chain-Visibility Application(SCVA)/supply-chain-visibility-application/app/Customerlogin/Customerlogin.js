document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submit");

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();

    // Retrieve input field data
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Make the GET request to the API endpoint to fetch user by username
    fetch(`http://localhost:8080/users/username/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((user) => {
        if (user && user.password) {
          const decodedPassword = atob(user.password);
          if (password === decodedPassword) {
            localStorage.setItem("loginMessage", "Login successful!");
            localStorage.setItem("username", username);
            localStorage.setItem("userDetails", JSON.stringify(user));
            window.location.href = "../../app/index/index.html";
          } else {
            alert("Invalid username or password.");
          }
        } else {
          alert("User not found.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  });

  const forgotPasswordLink = document.querySelector(".forgot-password-link");
  const modal = new bootstrap.Modal(
    document.getElementById("forgotPasswordModal")
  );

  forgotPasswordLink.addEventListener("click", function (event) {
    event.preventDefault();
    modal.show();
  });

  document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Get the username and new password entered by the user
      var username = document.getElementById("Username").value.trim();
      var newPassword = document.getElementById("newPassword").value.trim();

      // Ensure both fields are filled
      if (!username || !newPassword) {
        alert("Please enter both username and new password.");
        return;
      }

      // Send a request to your backend API to handle password reset
      var resetPasswordUrl = "http://localhost:8080/users/reset-password";
      fetch(resetPasswordUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: newPassword }),
      })
        .then((response) => {
          if (response.status === 404) {
            alert(
              "Username not found in the system, please enter a valid username."
            );
          } else if (response.ok) {
            alert(
              "Password has been reset. Please log in using the new password."
            );
            modal.hide();
          } else {
            alert("Failed to reset password. Please try again.");
            modal.hide();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to reset password. Please try again.");
        });
    });
});
