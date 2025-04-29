// Load the side navigation menu
$("#mySidenav").load("../common/sidenav.html");

document.addEventListener("DOMContentLoaded", function () {
  let suppliers = [];
  let filteredSuppliers = [];
  const pageSize = 10;
  let currentPage = 1;
  let totalPages = 0;

  // Function to calculate total pages based on filtered data
  function calculateTotalPages() {
    totalPages = Math.ceil(filteredSuppliers.length / pageSize);
  }

  // Function to render table rows for a given page number
  function renderTableRows(pageNumber) {
    const tableBody = document.getElementById("supplierTableBody");
    tableBody.innerHTML = ""; // Clear existing rows

    // Calculate start and end index for current page
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageSuppliers = filteredSuppliers.slice(startIndex, endIndex);

    // Render rows for the current page
    pageSuppliers.forEach((supplier) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${supplier.id}</td>
                <td>${supplier.name}</td>
                <td>${supplier.contactPerson}</td>
                <td>${supplier.email}</td>
                <td>${supplier.phone}</td>
                <td>${supplier.address}</td>
                 <td>${supplier.password}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-primary btn-update" data-supplier-id="${supplier.id}">Update</button>
                    <button type="button" class="btn btn-sm btn-danger btn-delete" data-supplier-id="${supplier.id}">Delete</button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  }

  // Function to display pagination links
  function updatePagination() {
    const pagination = document.getElementById("pagination");
    let paginationHtml = "";

    // Generate pagination HTML dynamically
    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `<li class="page-item ${
        currentPage === i ? "active" : ""
      }"><a class="page-link" href="#" onclick="gotoPage(${i})">${i}</a></li>`;
    }

    // Update the pagination container with the generated HTML
    pagination.innerHTML = paginationHtml;
  }

  // Function to navigate to a specific page
  window.gotoPage = function (pageNumber) {
    currentPage = pageNumber; // Update current page
    renderTableRows(pageNumber); // Render table rows for the selected page
    updatePagination(); // Update pagination links
  };

  // Function to fetch supplier data
  function fetchSuppliers() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/getAllSuppliers");
    xhr.onload = function () {
      if (xhr.status === 200) {
        suppliers = JSON.parse(xhr.responseText);
        filteredSuppliers = suppliers; // Initialize filtered suppliers
        calculateTotalPages(); // Calculate total pages based on fetched data
        gotoPage(1); // Display first page of suppliers
      } else {
        console.error("Error fetching suppliers. Status code: " + xhr.status);
      }
    };
    xhr.onerror = function () {
      console.error("Error fetching suppliers. Network error.");
    };
    xhr.send();
  }

  // Fetch and display suppliers
  fetchSuppliers();
  document.getElementById("manage-btn").style.display = "none";

  // Handle form submission for adding new supplier
  document
    .getElementById("addSupplierFormElement")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      addSupplier();
    });

  // Event listener for showing manage suppliers
  document.getElementById("manage-btn").addEventListener("click", function () {
    showManageSuppliers();
  });

  // Event listener for showing add new supplier form
  document.getElementById("add-btn").addEventListener("click", function () {
    showAddSupplierForm();
  });

  // Event listener for handling search input changes
  document.getElementById("searchInput").addEventListener("input", function () {
    const searchText = this.value.toLowerCase().trim();
    filterSuppliers(searchText);
  });

  // Event delegation for update and delete buttons
  document
    .getElementById("supplierTableBody")
    .addEventListener("click", function (event) {
      const target = event.target;

      // Handle update button click
      if (target.classList.contains("btn-update")) {
        const supplierId = target.getAttribute("data-supplier-id");
        openUpdateForm(supplierId); // Call function to open update form with supplier data
      }

      // Handle delete button click
      if (target.classList.contains("btn-delete")) {
        const supplierId = target.getAttribute("data-supplier-id");
        if (confirm("Are you sure you want to delete this supplier?")) {
          deleteSupplier(supplierId);
        }
      }
    });

  // JavaScript for handling logout button click
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      // Redirect to login page
      window.location.href = "/app/login/login.html"; // Replace with your actual login page URL
    });
  } else {
    console.error("logoutBtn not found.");
  }

  // Function to filter suppliers based on search text
  function filterSuppliers(searchText) {
    const searchLower = searchText.toLowerCase(); // Convert search text to lowercase once

    filteredSuppliers = suppliers.filter((supplier) => {
      const idMatch = supplier.id.toString().includes(searchText); // Convert id to string for comparison
      const nameMatch = supplier.name.toLowerCase().includes(searchLower);
      const contactPersonMatch = supplier.contactPerson
        .toLowerCase()
        .includes(searchLower);

      // Return true if any of the fields match
      return idMatch || nameMatch || contactPersonMatch;
    });

    calculateTotalPages(); // Recalculate total pages for filtered data
    gotoPage(1); // Display first page of filtered suppliers
  }

  // Function to show manage suppliers section
  window.showManageSuppliers = function () {
    document.getElementById("manageSuppliersTable").style.display = "table";
    document.getElementById("addSupplierForm").style.display = "none";
    document.getElementById("manage-btn").style.display = "none";
    document.getElementById("searchInput").style.display = "block";
    document.getElementById("title").style.display = "block";
    document.getElementById("add-btn").style.display = "block";
    document.getElementById("pagination").style.display = "inline";
    document.getElementById("pagination").style.justifyContent = "center";
    window.location.reload();
  };

  // Function to show add new supplier form
  window.showAddSupplierForm = function () {
    document.getElementById("manageSuppliersTable").style.display = "none";
    document.getElementById("addSupplierForm").style.display = "block";
    document.getElementById("manage-btn").style.display = "block";
    document.getElementById("searchInput").style.display = "none";
    document.getElementById("title").style.display = "none";
    document.getElementById("add-btn").style.display = "none";
    document.getElementById("pagination").style.display = "none";
  };

  // Function to open update form with supplier data
  function openUpdateForm(supplierId) {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "http://localhost:8080/getSupplierById/" + encodeURIComponent(supplierId)
    );
    xhr.onload = function () {
      if (xhr.status === 200) {
        var supplier = JSON.parse(xhr.responseText);
        // Fill the update form fields with supplier data
        document.getElementById("updateSupplierId").value = supplier.id;
        document.getElementById("updateSupplierName").value = supplier.name;
        document.getElementById("updateContactPerson").value =
          supplier.contactPerson;
        document.getElementById("updateEmail").value = supplier.email;
        document.getElementById("updatePhone").value = supplier.phone;
        document.getElementById("updateAddress").value = supplier.address;
        document.getElementById("updatePassword").value = supplier.password;

        // Show the update modal
        $("#updateSupplierModal").modal("show");
      } else {
        console.error(
          "Error fetching supplier for update. Status code: " + xhr.status
        );
      }
    };
    xhr.onerror = function () {
      console.error("Error fetching supplier for update. Network error.");
    };
    xhr.send();
  }

  // Function to add a new supplier via API
  function addSupplier() {
    var formData = {
      name: document.getElementById("supplierName").value,
      contactPerson: document.getElementById("contactPerson").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      password: document.getElementById("password").value,
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/addSupplier");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status === 201) {
        // Clear form fields
        document.getElementById("supplierName").value = "";
        document.getElementById("contactPerson").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("address").value = "";
        document.getElementById("password").value = "";

        // Fetch suppliers and insert the new one
        fetchSuppliers(); // This will call calculateTotalPages and gotoPage, so no need to call them again here

        // Check if current page is beyond the newly calculated total pages
        if (currentPage > totalPages) {
          currentPage = totalPages; // Adjust current page
          renderTableRows(currentPage); // Render table rows for the current page
          updatePagination(); // Update pagination links
        } else {
          // Only update pagination if necessary (e.g., new page is added)
          if (suppliers.length % pageSize === 1) {
            calculateTotalPages(); // Recalculate total pages
            updatePagination(); // Update pagination links
          }
        }

        // Show success message
        alert("Supplier added successfully!");
        showManageSuppliers(); // Show manage suppliers after adding
      } else {
        console.error("Error adding supplier. Status code: " + xhr.status);
      }
    };
    xhr.onerror = function () {
      console.error("Error adding supplier. Network error.");
    };
    xhr.send(JSON.stringify(formData));
  }

  // Function to delete a supplier via API
  function deleteSupplier(supplierId) {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "DELETE",
      "http://localhost:8080/deleteSupplierById/" + supplierId,
      true
    );

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 400) {
        alert("Supplier deleted successfully.");
        fetchSuppliers(); // Refresh the supplier table
        updatePagination();
      } else {
        console.error("Error deleting supplier.");
      }
    };

    xhr.onerror = function () {
      console.error("Error deleting supplier.");
    };

    xhr.send();
  }

  // Function to update a supplier via API
  document
    .getElementById("updateSupplierForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      var formData = {
        id: document.getElementById("updateSupplierId").value,
        name: document.getElementById("updateSupplierName").value,
        contactPerson: document.getElementById("updateContactPerson").value,
        email: document.getElementById("updateEmail").value,
        phone: document.getElementById("updatePhone").value,
        address: document.getElementById("updateAddress").value,
        password: document.getElementById("updatePassword").value,
      };

      var xhr = new XMLHttpRequest();
      xhr.open(
        "PUT",
        "http://localhost:8080/updateSupplierById/" + formData.id
      );
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function () {
        if (xhr.status === 200) {
          alert("Supplier Successfully updated!!");
          // Close the update modal
          $("#updateSupplierModal").modal("hide");
          // Refresh supplier table
          fetchSuppliers();
        } else {
          console.error("Error updating supplier. Status code: " + xhr.status);
        }
      };
      xhr.onerror = function () {
        console.error("Error updating supplier. Network error.");
      };
      xhr.send(JSON.stringify(formData));
    });

  // Function to open navigation sidebar
  window.openNav = function () {
    document.getElementById("mySidenav").style.width = "16em";
  };

  // Function to close navigation sidebar
  window.closeNav = function () {
    document.getElementById("mySidenav").style.width = "0";
  };
});
