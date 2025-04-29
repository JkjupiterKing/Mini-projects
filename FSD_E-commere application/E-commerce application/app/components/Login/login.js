// document.addEventListener("DOMContentLoaded", function() {
//     // Function to handle login button click
//     document.getElementById("submit").addEventListener("click", function() {
//         var username = document.getElementById("username");
//         var password = document.getElementById("password");

//         if (username !== "" && password !== "") {
//             var isLoggedIn = true;

//             if (isLoggedIn) {
//                 // Store login success message in local storage
//                 localStorage.setItem("loginMessage", "Login successful.");
//                 // Redirect to the cart page
//                 window.location.href = "/app/components/cart/cart.html";
//             } else {
//                 alert("Login failed. Please check your credentials.");
//             }
//         } else {
//             alert("Please enter username and password.");
//         }
//     });
// });

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
        const decodedPassword = atob(user.password);
        if (password === decodedPassword) {
          alert("login successfull!!");
          localStorage.setItem("loginMessage", "login successfull!!");
          window.location.href = "/app/index.html";
        } else {
          alert("Invalid username or password.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  });
});
