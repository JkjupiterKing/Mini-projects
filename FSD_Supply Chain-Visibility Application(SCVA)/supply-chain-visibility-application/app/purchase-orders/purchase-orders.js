//Load navBar
$('#mySidenav').load('../common/sidenav.html');

let purchaseOrders = []; // Global variable to hold purchase orders

// Fetch and populate suppliers in the form
fetchSuppliersAndPopulateSelect();

async function fetchPurchaseOrders() {
  try {
      const response = await fetch('http://localhost:8080/getAllPurchaseOrders'); 
      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      purchaseOrders = Array.isArray(data) ? data : []; // Assign fetched data as an array
      displayPurchaseOrders(); // Display initial set of purchase orders
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// Function to display existing purchase orders in a table with pagination
function displayPurchaseOrders(pageNumber = 1, pageSize = 10) {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOrders = purchaseOrders.slice(startIndex, endIndex);

let tableBodyHtml = '';
paginatedOrders.forEach(order => {
    tableBodyHtml += `<tr>
                        <td>${order.item}</td>
                        <td>${order.quantity}</td>
                        <td>${order.supplier}</td>
                        <td>${order.price}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-sm btn-update" data-order-id="${order.id}">Update</button>
                            <button type="button" class="btn btn-danger btn-sm btn-delete" data-order-id="${order.id}">Delete</button>
                        </td>
                    </tr>`;
});

    document.getElementById('orders-table-body').innerHTML = tableBodyHtml;
    
// Add event listeners for update and delete buttons
document.querySelectorAll('.btn-update').forEach(button => {
    button.addEventListener('click', function() {
        const orderId = parseInt(button.dataset.orderId, 10);
        openUpdateForm(orderId); 
    });
});

document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function() {
        const orderId = parseInt(button.dataset.orderId, 10);
        deletePurchaseOrder(orderId);
    });
});

    // Pagination (assuming purchaseOrders is already populated)
    const totalPages = Math.ceil(purchaseOrders.length / pageSize);
    let paginationHtml = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<li class="page-item ${pageNumber === i ? 'active' : ''}"><a class="page-link" href="#" onclick="displayPurchaseOrders(${i}, ${pageSize})">${i}</a></li>`;
    }
    document.getElementById('pagination').innerHTML = paginationHtml;

    // Show table container and hide form container
    document.getElementById('table-container').style.display = 'block';
    document.getElementById('form-container').style.display = 'none';
}
// Function to handle showing the create order form
document.getElementById('createOrderBtn').addEventListener('click', function() {
    // Hide manage purchase orders title, search bar, and table container
    document.getElementById('pagetitle').style.display = 'none';
    document.getElementById('searchInput').style.display = 'none';
    document.getElementById('table-container').style.display = 'none';
    document.getElementById('createOrderBtn').style.display = 'none';
    // Display the form container for creating a new purchase order
    document.getElementById('form-container').style.display = 'block';
});

function performSearch() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();

    // Filter purchaseOrders based on search input
    const filteredOrders = purchaseOrders.filter(order => {
        const itemName = order.item.trim().toLowerCase();
        const supplierName = order.supplier.trim().toLowerCase();

        return itemName.includes(searchInput) || supplierName.includes(searchInput);
    });

    // Update table display based on filtered results
    let tableBodyHtml = '';
    filteredOrders.forEach(order => {
        tableBodyHtml += `<tr>
                            <td>${order.item}</td>
                            <td>${order.quantity}</td>
                            <td>${order.supplier}</td>
                            <td>${order.price}</td>
                            <td>
                                <button type="button" class="btn btn-primary btn-sm btn-update" data-order-id="${order.id}">Update</button>
                                <button type="button" class="btn btn-danger btn-sm btn-delete" data-order-id="${order.id}">Delete</button>
                            </td>
                        </tr>`;
    });

    document.getElementById('orders-table-body').innerHTML = tableBodyHtml;

    // Add event listeners for update and delete buttons
    document.querySelectorAll('.btn-update').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = parseInt(button.dataset.orderId, 10);
            openUpdateForm(orderId); 
        });
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = parseInt(button.dataset.orderId, 10);
            deletePurchaseOrder(orderId);
        });
    });
}

// Function to handle showing the create order form
document.getElementById('createOrderBtn').addEventListener('click', function() {
    document.getElementById('table-container').style.display = 'none';
    document.getElementById('form-container').style.display = 'block';
});

// Function to handle form submission for creating a new purchase order
document.getElementById('create-order-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    let newItem = document.getElementById('item').value.trim();
    let newQuantity = parseInt(document.getElementById('quantity').value.trim(), 10);
    let newSupplier = document.getElementById('supplier').value.trim();
    let newPrice = parseFloat(document.getElementById('price').value.trim());

    // Validate form data (basic validation for demo purposes)
    if (!newItem || !newQuantity || !newSupplier || !newPrice) {
        alert('Please fill in all fields.');
        return;
    }

    // Create new order object
    const newOrder = {
        item: newItem,
        quantity: newQuantity,
        supplier: newSupplier,
        price: newPrice
    };

    // POST new order data to server API
    postNewOrder(newOrder);
});

// Function to handle cancellation of creating a new purchase order
document.getElementById('cancelOrderBtn').addEventListener('click', function() {
    // Clear form fields
    document.getElementById('create-order-form').reset();
    document.getElementById('pagetitle').style.display = 'block';
    document.getElementById('searchInput').style.display = 'block';
    document.getElementById('table-container').style.display = 'block';
    document.getElementById('createOrderBtn').style.display = 'block';
    document.getElementById('form-container').style.display = 'none';
});

async function postNewOrder(newOrder) {
  try {
      const response = await fetch('http://localhost:8080/addPurchaseOrder', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(newOrder),
      });
      
      if (!response.ok) {
          throw new Error('Failed to create new order');
      }

      // Assuming server responds with updated purchase orders
      const updatedOrders = await response.json();
      purchaseOrders = Array.isArray(updatedOrders) ? updatedOrders : []; // Update global variable with updated orders as an array

      // Update table display
      displayPurchaseOrders();

      // Clear form fields
      document.getElementById('create-order-form').reset();

      // Hide the form container and show table container
      document.getElementById('form-container').style.display = 'none';
      document.getElementById('table-container').style.display = 'block';

      // Show success message using Bootstrap modal or toast
      alert("purchase order created successfully");
      fetchPurchaseOrders();
      document.getElementById('pagetitle').style.display = 'block';
      document.getElementById('searchInput').style.display = 'block';
      document.getElementById('createOrderBtn').style.display = 'block';

  } catch (error) {
      console.error('Error creating new order:', error);
      // Optionally show an error message to the user
  }
}

// Function to fetch suppliers from API and populate the select element
function fetchSuppliersAndPopulateSelect() {
    fetch('http://localhost:8080/getAllSuppliers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch suppliers');
            }
            return response.json();
        })
        .then(suppliers => {
            // Populate the select element with fetched suppliers
            const selectElement = document.getElementById('supplier');
            selectElement.innerHTML = ''; // Clear existing options

            suppliers.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier.name; // Assuming supplier name is used as value
                option.textContent = supplier.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching suppliers:', error);
            // Optionally handle or display the error
        });
}

// Function to fetch suppliers from API and populate the select element
function fetchUpdateSuppliersAndPopulateSelect() {
    return fetch('http://localhost:8080/getAllSuppliers')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch suppliers');
            }
            return response.json();
        })
        .then(suppliers => {
            // Populate the select element with fetched suppliers
            const selectElement = document.getElementById('updateSupplier');
            selectElement.innerHTML = ''; // Clear existing options

            suppliers.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier.name; // Assuming supplier name is used as value
                option.textContent = supplier.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching suppliers:', error);
            // Optionally handle or display the error
        });
}

// Initial fetch and populate table
document.addEventListener('DOMContentLoaded', function () {
    fetchPurchaseOrders();
});

// Function to open the update order modal and populate fields with order data
function openUpdateForm(orderId) {
    fetch(`http://localhost:8080/getPurchaseOrderById/${orderId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }
            return response.json();
        })
        .then(order => {
            // Fill the update form fields with order data
            document.getElementById('updateOrderId').value = order.id;
            document.getElementById('updateItem').value = order.item;
            document.getElementById('updateQuantity').value = order.quantity;
            document.getElementById('updatePrice').value = order.price;

            // Populate and preselect the supplier dropdown
            fetchUpdateSuppliersAndPopulateSelect()
                .then(() => {
                    document.getElementById('updateSupplier').value = order.supplier;
                    // Show the update modal
                    $('#updateOrderModal').modal('show');
                })
                .catch(error => {
                    console.error('Error populating update supplier dropdown:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching order details:', error);
        });
}

// Function to handle form submission for updating a purchase order
document.getElementById('update-order-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    let orderId = document.getElementById('updateOrderId').value.trim();
    let updatedItem = document.getElementById('updateItem').value.trim();
    let updatedQuantity = parseInt(document.getElementById('updateQuantity').value.trim());
    let updatedSupplier = document.getElementById('updateSupplier').value.trim();
    let updatedPrice = parseFloat(document.getElementById('updatePrice').value.trim());

    // Validate form data (basic validation for demo purposes)
    if (!orderId || !updatedItem || !updatedQuantity || !updatedSupplier || !updatedPrice) {
        alert('Please fill in all fields.');
        return;
    }

    // Create updated order object
    const updatedOrder = {
        id: orderId,
        item: updatedItem,
        quantity: updatedQuantity,
        supplier: updatedSupplier,
        price: updatedPrice
    };

    // Call updatePurchaseOrder function with updatedOrder
    updatePurchaseOrder(orderId, updatedOrder);
});

// Function to update a purchase order by id
async function updatePurchaseOrder(orderId, updatedOrder) {
    try {
        const response = await fetch(`http://localhost:8080/updatePurchaseOrderById/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedOrder), // Convert updatedOrder to JSON string
        });

        if (!response.ok) {
            throw new Error('Failed to update purchase order');
        }

        // Assuming server responds with the updated order
        const updatedOrderFromServer = await response.json();

        // Find the index of the updated order in the purchaseOrders array
        const index = purchaseOrders.findIndex(order => order.id === orderId);

        // If index is found, replace the old order with the updated one
        if (index !== -1) {
            purchaseOrders[index] = updatedOrderFromServer;
        } else {
            console.error('Updated order not found in the local data.');
        }

        // Close update modal (if using a modal)
        $('#updateOrderModal').modal('hide');
        // Show success message using Bootstrap modal or toast
        alert('Purchase order updated successfully');
        // Update table display
        fetchPurchaseOrders();

    } catch (error) {
        console.error('Error updating purchase order:', error);
        alert('Error updating purchase order. Please try again.');
    }
}

// Function to delete a purchase order by id
async function deletePurchaseOrder(orderId) {
    // Ask for confirmation before deleting
    if (!confirm('Are you sure you want to delete this purchase order?')) {
        return; // 
    }
    try {
        const response = await fetch(`http://localhost:8080/deletePurchaseOrderById/${orderId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete purchase order');
        }
        
        // Remove the deleted order from the global purchaseOrders array
        purchaseOrders = purchaseOrders.filter(order => order.id !== orderId);
        
        // Update table display
        displayPurchaseOrders();
        
        // Show success message using Bootstrap modal or toast
        alert('Purchase order deleted successfully');

    } catch (error) {
        console.error('Error deleting purchase order:', error);
        // Optionally show an error message to the user
        alert('Error deleting purchase order. Please try again.');
    }
}

function openNav() {
  document.getElementById("mySidenav").style.width = "16em";
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// JavaScript for handling logout button click
document.getElementById('logoutBtn').addEventListener('click', function() {
  // Redirect to login page
  window.location.href = '/app/login/login.html'; // Replace with your actual login page URL
});