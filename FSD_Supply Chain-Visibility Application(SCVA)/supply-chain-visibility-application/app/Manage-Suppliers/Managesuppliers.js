document.addEventListener("DOMContentLoaded", function () {
  const pageSize = 10;
  let currentPage = 1;
  let totalPages = 0;
  let filteredOrders = [];
  let allOrders = [];

  // Function to calculate total pages based on filtered data
  function calculateTotalPages() {
    totalPages = Math.ceil(filteredOrders.length / pageSize);
  }

  // Function to render table rows for a given page number
  function renderTableRows(pageNumber) {
    const tableBody = document.getElementById("ordersTableBody");
    tableBody.innerHTML = "";

    // Check if there are any orders to display
    if (filteredOrders.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" class="text-center">No orders found.</td></tr>`;
      return;
    }

    // Calculate start and end index for current page
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageOrders = filteredOrders.slice(startIndex, endIndex);

    // Render rows for the current page
    pageOrders.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${order.item}</td>
                <td>${order.quantity}</td>
                <td>${order.price}</td>
            `;
      tableBody.appendChild(row);
    });
  }

  // Function to display pagination links
  function updatePagination() {
    const pagination = document.getElementById("pagination");
    let paginationHtml = "";

    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `<li class="page-item ${
        currentPage === i ? "active" : ""
      }">
                          <a class="page-link" href="#" onclick="gotoPage(${i})">${i}</a>
                         </li>`;
    }

    pagination.innerHTML = paginationHtml;
  }

  // Function to navigate to a specific page
  window.gotoPage = function (pageNumber) {
    currentPage = pageNumber;
    renderTableRows(pageNumber);
    updatePagination();
  };

  // Function to fetch purchase orders based on supplier name
  function fetchPurchaseOrders() {
    const supplierData = JSON.parse(localStorage.getItem("supplier"));
    if (supplierData) {
      const supplierName = supplierData.name;
      const xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        `http://localhost:8080/getPurchaseOrdersBySupplier/${supplierName}`
      );
      xhr.onload = function () {
        if (xhr.status === 200) {
          allOrders = JSON.parse(xhr.responseText); // Store all fetched orders
          filteredOrders = allOrders; // Initialize filtered orders
          calculateTotalPages(); // Calculate total pages
          gotoPage(1); // Display the first page of orders
        } else {
          console.error(
            "Error fetching purchase orders. Status code: " + xhr.status
          );
        }
      };
      xhr.onerror = function () {
        console.error("Error fetching purchase orders. Network error.");
      };
      xhr.send();
    } else {
      console.error("No supplier data found in local storage.");
    }
  }

  // Function to filter orders based on search input
  function filterOrders(searchText) {
    const searchLower = searchText.toLowerCase();
    filteredOrders = allOrders.filter((order) => {
      return (
        order.id.toString().includes(searchLower) ||
        order.item.toLowerCase().includes(searchLower)
      );
    });
    calculateTotalPages(); // Recalculate total pages for filtered data
    gotoPage(1); // Display first page of filtered orders
  }

  // Event listener for search input
  document.getElementById("searchInput").addEventListener("input", function () {
    const searchText = this.value.trim();
    filterOrders(searchText);
  });

  // Fetch and display purchase orders
  fetchPurchaseOrders();

  // JavaScript for handling logout button click
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("supplier");
      window.location.href = "../../app/Supplier Login/supplierlogin.html";
    });
  } else {
    console.error("logoutBtn not found.");
  }
});
