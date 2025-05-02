$("#mySidenav").load("../../app/sidebar/sidebar.html");

let projects = [];
let employees = [];

document.addEventListener("DOMContentLoaded", function () {
  const pageSize = 10;
  let currentPage = 1;
  let totalPages = 0;

  fetchEmployees();

  // Function to fetch employees and populate the select options
  function fetchEmployees() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/users/all");
    xhr.onload = function () {
      if (xhr.status === 200) {
        employees = JSON.parse(xhr.responseText);
        populateEmployeeSelect();
      } else {
        console.error("Error fetching employees:", xhr.statusText);
      }
    };
    xhr.onerror = function () {
      console.error("Error fetching employees. Network error.");
    };
    xhr.send();
  }

  // Function to populate employee select options
  function populateEmployeeSelect() {
    var selectElementAdd = document.getElementById("assignedEmployee");
    var selectElementUpdate = document.getElementById("updateAssignedEmployee");

    if (!selectElementAdd || !selectElementUpdate) {
      console.error("Employee select elements are missing.");
      return;
    }

    selectElementAdd.innerHTML = '<option value="">Select an employee</option>';
    selectElementUpdate.innerHTML =
      '<option value="">Select an employee</option>';

    if (!employees || !Array.isArray(employees)) {
      console.error("Employees data is not available or not an array.");
      return;
    }

    employees.forEach(function (employee) {
      if (employee && employee.username) {
        var optionAdd = document.createElement("option");
        optionAdd.value = employee.username;
        optionAdd.textContent = employee.username;
        selectElementAdd.appendChild(optionAdd);

        var optionUpdate = document.createElement("option");
        optionUpdate.value = employee.username;
        optionUpdate.textContent = employee.username;
        selectElementUpdate.appendChild(optionUpdate);
      } else {
        console.error("Invalid employee data:", employee);
      }
    });
  }

  // Function to fetch projects
  function fetchProjects() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/projects/all");
    xhr.onload = function () {
      if (xhr.status === 200) {
        projects = JSON.parse(xhr.responseText);
        displayProjects(projects);
      } else {
        console.error("Error fetching projects:", xhr.statusText);
      }
    };
    xhr.onerror = function () {
      console.error("Error fetching projects. Network error.");
    };
    xhr.send();
  }

  // Function to display projects in the table for a specific page
  function displayProjects(projects) {
    var tableBody = document.getElementById("ManageProjectsTableData");
    tableBody.innerHTML = "";

    totalPages = Math.ceil(projects.length / pageSize);
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = startIndex + pageSize;
    var pageProjects = projects.slice(startIndex, endIndex);

    pageProjects.forEach(function (project) {
      var projectId = project.id;

      var row =
        '<tr data-project-id="' +
        projectId +
        '">' +
        "<td>" +
        project.title +
        "</td>" +
        "<td>" +
        project.description +
        "</td>" +
        "<td>" +
        project.status +
        "</td>" +
        "<td>" +
        (project.user ? project.user.username : "Unknown") +
        "</td>" +
        "<td>" +
        '<button type="button" class="btn btn-primary btn-sm btn-update" data-project-id="' +
        projectId +
        '">Update</button> ' +
        '<button type="button" class="btn btn-danger btn-sm btn-delete" data-project-id="' +
        projectId +
        '">Delete</button>' +
        "</td>" +
        "</tr>";
      tableBody.insertAdjacentHTML("beforeend", row);
    });

    updatePagination();
  }

  // Function to update pagination links
  function updatePagination() {
    var pagination = document.getElementById("pagination");
    var paginationHtml = "";

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

    pagination.innerHTML = paginationHtml;
  }

  // Function to navigate to a specific page
  window.gotoPage = function (pageNumber) {
    currentPage = pageNumber;
    fetchProjects();
  };

  // Function to handle adding a new project
  function addProject() {
    var addProjectForm = document.getElementById("AddProjectForm1");

    if (!addProjectForm) {
      console.error("AddProjectForm not found in the document.");
      return;
    }

    if (!(addProjectForm instanceof HTMLFormElement)) {
      console.error('Element with id "AddProjectForm" is not a form element.');
      return;
    }

    var formData = new FormData(addProjectForm);
    var projectData = {
      title: formData.get("projectTitle"),
      description: formData.get("projectDescription"),
      status: formData.get("status"),
      user: {
        username: formData.get("assignedEmployee"),
      },
      progress: 0,
    };

    if (!projectData.title || !projectData.description || !projectData.status) {
      console.error("Please fill out all fields.");
      alert("Please fill out all fields.");
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/projects/addproject");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        var response = JSON.parse(xhr.responseText);
        console.log("Project added successfully:", response);
        alert("Project added successfully");
        fetchProjects();
        displayManageProjects();
        addProjectForm.reset();
      } else {
        console.error("Error adding project:", xhr.statusText);
        alert(
          "Error adding project. Server returned error status: " + xhr.status
        );
      }
    };
    xhr.onerror = function () {
      console.error("Request failed. Status:", xhr.status);
      alert("Failed to add project. Network error. Check console for details.");
    };
    xhr.send(JSON.stringify(projectData));
  }

  // Event listener for showing manage projects (display table)
  var manageBtn = document.getElementById("manage-btn");
  if (manageBtn) {
    manageBtn.addEventListener("click", function () {
      fetchProjects();
      displayManageProjects();
    });
  }

  // Event listener for showing add new project form (display form)
  var addBtn = document.getElementById("add-btn");
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      displayAddProjectForm();
    });
  }

  // Event listener for add project form submission
  var addProjectBtn = document.getElementById("submitProject");
  if (addProjectBtn) {
    addProjectBtn.addEventListener("click", function (event) {
      event.preventDefault();
      addProject();
    });
  }

  // Event listener for update and delete buttons (inside the table)
  var tableBody = document.getElementById("ManageProjectsTableData");
  if (tableBody) {
    tableBody.addEventListener("click", function (event) {
      var target = event.target;

      if (target.classList.contains("btn-update")) {
        var projectId = target.getAttribute("data-project-id");
        if (projectId) {
          openUpdateForm(projectId);
        } else {
          console.error("Project ID is undefined or invalid.");
        }
      }

      if (target.classList.contains("btn-delete")) {
        var projectId = target.getAttribute("data-project-id");
        if (
          projectId &&
          confirm("Are you sure you want to delete this Project?")
        ) {
          deleteProject(projectId);
        }
      }
    });
  }

  // Function to fetch project details by projectId
  function fetchProjectDetails(projectId, callback) {
    if (!projectId) {
      console.error("Invalid project ID:", projectId);
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/projects/" + projectId);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var project = JSON.parse(xhr.responseText);
        callback(project);
      } else {
        console.error("Error fetching project details:", xhr.statusText);
      }
    };
    xhr.onerror = function () {
      console.error("Error fetching project details. Network error.");
    };
    xhr.send();
  }

  // Function to update project details through API
  function updateProject(projectData) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:8080/projects/update/" + projectData.id);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("Project updated successfully:", xhr.responseText);
        alert("Project updated successfully");
        fetchProjects();
        displayManageProjects();
      } else {
        console.error("Error updating project:", xhr.statusText);
        alert(
          "Error updating project. Server returned error status: " + xhr.status
        );
      }
    };
    xhr.onerror = function () {
      console.error("Error updating project. Network error.");
      alert(
        "Failed to update project. Network error. Check console for details."
      );
    };
    xhr.send(JSON.stringify(projectData));
  }

  // Event listener for update form submission
  var updateProjectForm = document.getElementById("UpdateProjectForm");
  if (updateProjectForm) {
    updateProjectForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var formData = new FormData(updateProjectForm);
      var projectData = {
        id: formData.get("updateProjectId"),
        title: formData.get("updateProjectTitle"),
        description: formData.get("updateProjectDescription"),
        status: formData.get("updateStatus"),
        user: {
          username: formData.get("updateAssignedEmployee"),
        },
      };

      if (
        !projectData.title ||
        !projectData.description ||
        !projectData.status
      ) {
        console.error("Please fill out all fields.");
        alert("Please fill out all fields.");
        return;
      }

      updateProject(projectData);
    });
  }

  // Function to open update form/modal with project details
  function openUpdateForm(projectId) {
    fetchProjectDetails(projectId, function (project) {
      document.getElementById("updateProjectId").value = project.id;
      document.getElementById("updateProjectTitle").value = project.title;
      document.getElementById("updateProjectDescription").value =
        project.description;
      document.getElementById("updateStatus").value = project.status;
      document.getElementById("updateAssignedEmployee").value = project.user
        ? project.user.username
        : "";

      var updateModal = new bootstrap.Modal(
        document.getElementById("UpdateProjectModal")
      );
      updateModal.show();
    });
  }

  // Function to delete project
  function deleteProject(projectId) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "http://localhost:8080/projects/delete/" + projectId);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log("Project deleted successfully.");
        alert("Project deleted successfully");
        removeProjectRow(projectId);
        fetchProjects();
      } else {
        console.error("Error deleting project:", xhr.statusText);
        alert(
          "Error deleting project. Server returned error status: " + xhr.status
        );
      }
    };
    xhr.onerror = function () {
      console.error("Request failed.");
      alert(
        "Failed to delete project. Network error. Check console for details."
      );
    };
    xhr.send();
  }

  // Function to remove project row from table
  function removeProjectRow(projectId) {
    var rowToRemove = document.querySelector(
      'tr[data-project-id="' + projectId + '"]'
    );
    if (rowToRemove) {
      rowToRemove.remove();
    } else {
      console.error("Project row not found in table:", projectId);
    }
  }

  // Function to display add project form and hide other elements
  function displayAddProjectForm() {
    document.getElementById("AddProjectForm").style.display = "block";
    document.getElementById("DisplayProjectsList").style.display = "none";
    document.getElementById("searchBar").style.display = "none";
    document.getElementById("ProjectManagementTitle").style.display = "none";
    document.getElementById("manage-btn").style.display = "block";
    document.getElementById("pagination").style.display = "none";
    document.getElementById("download-btn").style.display = "none";
    var addBtn = document.getElementById("add-btn");
    if (addBtn) {
      addBtn.style.display = "none";
    }
  }

  // Function to display manage projects table and hide add project form
  function displayManageProjects() {
    document.getElementById("AddProjectForm").style.display = "none";
    document.getElementById("DisplayProjectsList").style.display = "table";
    document.getElementById("searchBar").style.display = "block";
    document.getElementById("ProjectManagementTitle").style.display = "block";
    document.getElementById("manage-btn").style.display = "none";

    var addBtn = document.getElementById("add-btn");
    if (addBtn) {
      addBtn.style.display = "block";
    }
    window.location.reload();
  }

  // Function to perform search
  function performSearch() {
    const searchTerm = document
      .getElementById("searchInput")
      .value.trim()
      .toLowerCase();

    const filteredProjects = projects.filter((project) => {
      const title = project.title.toLowerCase();
      const description = project.description.toLowerCase();
      const status = project.status.toLowerCase();

      return (
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        status.includes(searchTerm)
      );
    });

    totalPages = Math.ceil(filteredProjects.length / pageSize);
    currentPage = 1;

    displayProjects(filteredProjects);
    updatePagination();
  }

  // Event listener for download button
  document
    .getElementById("download-btn")
    .addEventListener("click", function () {
      const table = document.getElementById("DisplayProjectsList");
      const clone = table.cloneNode(true);
      const headers = clone.querySelectorAll("thead th");
      const rows = clone.querySelectorAll("tbody tr");

      headers[headers.length - 1].remove();

      rows.forEach((row) => {
        row.querySelector("td:last-child").remove();
      });

      const wb = XLSX.utils.table_to_book(clone, { sheet: "Projects Details" });
      XLSX.writeFile(wb, "Projects Details.xlsx");
    });

  fetchProjects();
  document.getElementById("manage-btn").style.display = "none";
  document
    .getElementById("searchInput")
    .addEventListener("input", performSearch);
});
