const pageSize = 10;
let currentPage = 1;
let totalPages = 0;
let allUsers;
let allRoles;
let allManagers;
let addUserForm;

$("#mySidenav").load("../../app/sidebar/sidebar.html");

document.addEventListener("DOMContentLoaded", function () {
  fetchUsers();
  fetchAllRoles();
  fetchManagers();

  window.gotoPage = function (pageNumber) {
    currentPage = pageNumber;
    fetchUsers();
  };

  // Initialize the form element globally
  addUserForm = document.getElementById("AddUserForm1");

  if (addUserForm) {
    addUserForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addUser();
    });
  }

  // Event listener for showing manage users (display table)
  var manageBtn = document.getElementById("manage-btn");
  if (manageBtn) {
    manageBtn.addEventListener("click", function () {
      fetchUsers();
      displayManageUsers();
    });
  }

  // Event listener for showing add new user form (display form)
  var addBtn = document.getElementById("add-btn");
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      displayAddUserForm();
    });
  }

  // Event delegation for update and delete buttons (inside the table)
  var tableBody = document.getElementById("ManageUsersTableData");
  console.log("tableBody", tableBody);
  if (tableBody) {
    tableBody.addEventListener("click", function (event) {
      var target = event.target;
      console.log("target", target);

      // Handle update button click
      if (target.classList.contains("btn-update")) {
        var userID = target.getAttribute("data-user-id");
        if (userID) {
          openUpdateForm(userID);
        } else {
          console.error("User ID is undefined or invalid.");
        }
      }

      // Handle delete button click
      if (target.classList.contains("btn-delete")) {
        var userID = target.getAttribute("data-user-id");
        if (userID && confirm("Are you sure you want to delete this User?")) {
          deleteUser(userID);
        }
      }
    });
    document
      .getElementById("searchInput")
      .addEventListener("input", performSearch);
  }

  // Event listener for update form submission
  document
    .getElementById("UpdateUserForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      var formData = new FormData(this);
      const newRoleId = formData.get("updaterole");
      const updatedRoleObject = allRoles.filter(
        (role) => role.roleId == newRoleId
      )[0];
      var userData = {
        userId: formData.get("updateuserid"),
        username: formData.get("updateusername"),
        email: formData.get("updateEmail"),
        phone: formData.get("updatePhone"),
        address: formData.get("updateAddress"),
      };
      updateUser(userData);
    });

  fetchRolesAndPopulateDropdown();
  document.getElementById("manage-btn").style.display = "none";
});

// Function to fetch roles from API and populate the dropdown
function fetchRolesAndPopulateDropdown() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/roles/all");
  xhr.onload = function () {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      var selectDropdown = document.getElementById("role");
      selectDropdown.innerHTML = ""; // Clear existing options

      // Populate options with fetched roles
      data.forEach(function (role) {
        var option = document.createElement("option");
        option.value = role.roleId;
        option.textContent = role.roleName;
        selectDropdown.appendChild(option);
      });
    } else {
      console.error("Error fetching roles:", xhr.statusText);
    }
  };
  xhr.onerror = function () {
    console.error("Request failed");
  };
  xhr.send();
}

// Function to fetch roles and populate update dropdown
function fetchAllRoles() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/roles/all");
  xhr.onload = function () {
    if (xhr.status === 200) {
      allRoles = JSON.parse(xhr.responseText);
    } else {
      console.error("Error fetching roles:", xhr.statusText);
    }
  };
  xhr.onerror = function () {
    console.error("Request failed");
  };
  xhr.send();
}

// Function to fetch users from API with pagination support
function fetchUsers() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/users/all");
  xhr.onload = function () {
    if (xhr.status === 200) {
      allUsers = JSON.parse(xhr.responseText);
      totalPages = Math.ceil(allUsers.length / pageSize);
      displayUsers(allUsers);
      updatePagination();
    } else {
      console.error("Error fetching users:", xhr.statusText);
    }
  };
  xhr.onerror = function () {
    console.error("Error fetching users. Network error.");
  };
  xhr.send();
}

// Function to fetch managers and populate dropdowns
function fetchManagers() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/users/all");
  xhr.onload = function () {
    if (xhr.status === 200) {
      allManagers = JSON.parse(xhr.responseText).filter(
        (user) => user.role.roleId === 2
      ); // Filter for Managers
      populateManagerDropdowns();
    } else {
      console.error("Error fetching users:", xhr.statusText);
    }
  };
  xhr.onerror = function () {
    console.error("Request failed");
  };
  xhr.send();
}

// Function to populate manager dropdowns in both forms
function populateManagerDropdowns() {
  var managerDropdown = document.getElementById("manager");
  var updateManagerDropdown = document.getElementById("updatemanager");

  if (managerDropdown && updateManagerDropdown) {
    allManagers.forEach(function (manager) {
      var option = document.createElement("option");
      option.value = manager.username;
      option.textContent = manager.username;
      managerDropdown.appendChild(option);
      updateManagerDropdown.appendChild(option.cloneNode(true));
    });
  }
}

// Function to display users for the current page
function displayUsers(users) {
  console.log("users", users);
  var tableBody = document.getElementById("ManageUsersTableData");
  tableBody.innerHTML = "";

  // Calculate start and end indices for the current page
  var startIndex = (currentPage - 1) * pageSize;
  var endIndex = startIndex + pageSize;
  var paginatedUsers = users.slice(startIndex, endIndex);

  // Populate table with users for the current page
  paginatedUsers.forEach(function (user) {
    var userId = user.userId;

    var row =
      '<tr data-user-id="' +
      userId +
      '">' +
      "<td>" +
      user.username +
      "</td>" +
      "<td>" +
      user.email +
      "</td>" +
      "<td>" +
      user.phone +
      "</td>" +
      "<td>" +
      user.address +
      "</td>" +
      "<td>" +
      '<button type="button" class="btn btn-primary btn-sm btn-update" data-user-id="' +
      userId +
      '">Update</button> ' +
      '<button type="button" class="btn btn-danger btn-sm btn-delete" data-user-id="' +
      userId +
      '">Delete</button>' +
      "</td>" +
      "</tr>";
    tableBody.insertAdjacentHTML("beforeend", row);
  });
}

// Function to update pagination links
function updatePagination() {
  var pagination = document.getElementById("pagination");
  var paginationHtml = "";

  // Generate pagination HTML dynamically
  for (var i = 1; i <= totalPages; i++) {
    paginationHtml +=
      '<li class="page-item ' +
      (currentPage === i ? "active" : "") +
      '"><a class="page-link" href="#" onclick="gotoPage(' +
      i +
      ')">' +
      i +
      "</a></li>";
  }

  // Update the pagination container with the generated HTML
  pagination.innerHTML = paginationHtml;
}

function addUser() {
  var formData = new FormData(addUserForm);
  var userData = {
    username: formData.get("username"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    password: "password123",
  };

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8080/users/adduser");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("User created successfully:", xhr.responseText);
      alert("User added successfully");
      fetchUsers();
      displayManageUsers();
      addUserForm.reset();
    } else {
      console.error("Error creating user:", xhr.statusText);
      addUserForm.reset();
    }
  };
  xhr.onerror = function () {
    console.error("Request failed");
  };
  xhr.send(JSON.stringify(userData));
}

// Function to display add user form
function displayAddUserForm() {
  document.getElementById("AddUserForm").style.display = "block"; // Show the add user form
  document.getElementById("add-btn").style.display = "none"; // Hide the add user button
  document.getElementById("searchInput").style.display = "none"; // Hide the search bar
  document.getElementById("ProjectManagementTitle").style.display = "none"; // Hide the project management title
  document.getElementById("DisplayUsersList").style.display = "none"; // Hide manage users table
  document.getElementById("manage-btn").style.display = "block";
  document.getElementById("pagination").style.display = "none";
}

// Function to display manage users table
function displayManageUsers() {
  document.getElementById("AddUserForm").style.display = "none"; // Hide the add user form
  document.getElementById("add-btn").style.display = "block"; // Show the add user button
  document.getElementById("searchInput").style.display = "block"; // Show the search bar
  document.getElementById("ProjectManagementTitle").style.display = "block"; // Show the project management title
  document.getElementById("DisplayUsersList").style.display = "table"; // Show manage users table
  document.getElementById("manage-btn").style.display = "none";
  window.location.reload();
}

function performSearch() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  // Filter users based on search term
  const filteredUsers = allUsers.filter((user) => {
    const username = user.username.toLowerCase();
    return username.includes(searchTerm);
  });

  // Calculate total pages based on filtered results
  totalPages = Math.ceil(filteredUsers.length / pageSize);
  currentPage = 1;

  // Display filtered users for the current page
  displayUsers(filteredUsers);
  updatePagination();
}

// Function to update user details through API
function updateUser(userData) {
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", "http://localhost:8080/users/update/" + userData.userId);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(userData));
  xhr.onload = function () {
    if (xhr.status === 200) {
      alert("user updated successfully!");
      console.log("User updated successfully:", xhr.responseText);
      var updateModal = new bootstrap.Modal(
        document.getElementById("UpdateUserModal")
      );
      updateModal.hide(); // Hide the modal after successful update
      fetchUsers(); // Refresh user list
      displayManageUsers(); // Display manage users table
    } else {
      console.error("Error updating user:", xhr.statusText);
    }
  };
  xhr.onerror = function () {
    console.error("Error updating user. Network error.");
  };
}

// Function to open update form/modal with user details
function openUpdateForm(userId) {
  // Find the user with the given userId
  const user = allUsers.find((user) => user.userId == userId);
  if (!user) {
    console.error("User not found:", userId);
    return;
  }

  // Populate form fields with user data
  document.getElementById("updateuserid").value = user.userId;
  document.getElementById("updateusername").value = user.username;
  document.getElementById("updateEmail").value = user.email;
  document.getElementById("updatePhone").value = user.phone;
  document.getElementById("updateAddress").value = user.address;

  var updateModal = new bootstrap.Modal(
    document.getElementById("UpdateUserModal")
  );
  updateModal.show();
}

// Function to delete user
function deleteUser(userId) {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", "http://localhost:8080/users/delete/" + userId);
  xhr.onload = function () {
    if (xhr.status === 204) {
      console.log("Employee deleted successfully.");
      alert("Employee deleted successfully");
      removeUserRow(userId);
    } else {
      console.error("Error deleting user:", xhr.statusText);
      alert("error in deleting the user.");
    }
  };
  xhr.onerror = function () {
    console.error("Request failed.");
    alert("error in deleting the user.");
  };
  xhr.send();
}

// Function to remove user row from table
function removeUserRow(userId) {
  var rowToRemove = document.querySelector('tr[data-user-id="' + userId + '"]');
  if (rowToRemove) {
    rowToRemove.remove();
  } else {
    console.error("User row not found in table:", userId);
  }
}
