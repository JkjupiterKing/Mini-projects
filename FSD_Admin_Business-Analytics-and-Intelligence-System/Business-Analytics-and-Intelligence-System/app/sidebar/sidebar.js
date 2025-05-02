// Handle logout link click
const logoutLink = document.querySelector(".logout-link a");
if (logoutLink) {
  logoutLink.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("user");
    window.location.href = "../../app/Login/login.html";
  });
}
