// Function to fetch and insert header.html into the current page
export async function includeHeader(path) {
  //Load Header.html
  const response = await fetch(path); // Fetch header.html file
  const headerHtml = await response.text(); // Get the HTML text
  const headerElement = document.createElement("div"); // Create a <div> element
  headerElement.innerHTML = headerHtml; // Set its inner HTML to header.html content
  document.body.prepend(headerElement); // Prepend the <div> to the <body>

  // //Event to go to Home Page
  const homeButton = document.getElementById("homeButton");
  homeButton.addEventListener("click", function () {
    window.location.href = "/app/index.html";
  });

  //Event to go to Cart
  const cartButton = document.getElementById("cartButton");
  cartButton.addEventListener("click", function () {
    window.location.href = "/app/components/cart/cart.html";
  });

  // Logout functionality
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.clear();
      window.location.href = "/app/components/Login/login.html";
    });
  }
}
