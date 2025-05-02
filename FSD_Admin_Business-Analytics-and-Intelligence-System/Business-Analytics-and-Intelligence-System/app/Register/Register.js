document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the form
  var registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
    registrationForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Retrieve form input values
      var usernameInput = document.getElementById("username");
      var emailInput = document.getElementById("email");
      var phoneInput = document.getElementById("phone");
      var addressInput = document.getElementById("address");
      var roleInput = document.getElementById("role");
      var passwordInput = document.getElementById("password");

      // Get values and trim whitespace
      var username = usernameInput.value.trim();
      var email = emailInput.value.trim();
      var phone = phoneInput.value.trim();
      var address = addressInput.value.trim();
      var role = roleInput.value.trim();
      var password = passwordInput.value.trim();

      // Validate input
      if (
        username === "" ||
        email === "" ||
        phone === "" ||
        address === "" ||
        role === "" ||
        password === ""
      ) {
        alert("Please fill in all fields.");
        return;
      }

      // Create user object
      var user = {
        username: username,
        email: email,
        password: password,
        phone: phone,
        address: address,
        role: { roleId: parseInt(role) },
        salary: 0.0,
      };

      // Send POST request to backend
      fetch("http://localhost:8080/users/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Registration failed.");
          }
        })
        .then((data) => {
          alert("Registration successful!!");
          window.location.href = "../../app/Login/login.html";
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred. Please try again later.");
        });
    });
  } else {
    console.error("Could not find registration form element.");
  }
});
