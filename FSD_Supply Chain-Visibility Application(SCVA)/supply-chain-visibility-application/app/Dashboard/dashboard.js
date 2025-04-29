$('#mySidenav').load('../common/sidenav.html');

document.addEventListener('DOMContentLoaded', function () {
    // Define API endpoints
    const apiEndpoints = {
        getCustomers: 'http://localhost:8080/getAllCustomerOrders',
        getInventorylevel: 'http://localhost:8080/getAllStocks'
    };

    // Variables to store response data
    let processedCount = 0;
    let shippedCount = 0;
    let pendingCount = 0;
    let deliveredCount = 0;
    let totalOrdersCount = 0;
    let inventoryLevels = [];
    let customers = [];
    let statusCycle = ['Processing', 'Shipped', 'Pending', 'Delivered'];
    let currentStatusIndex = 0;
    let currentInventoryIndex = 0; // Index to track the current inventory item

    // Function to fetch all customers from the API
    function fetchCustomers() {
        fetch(apiEndpoints.getCustomers)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                customers = data || [];
                updateCounts();
                updateDashboard();
            })
            .catch(error => {
                console.error('Error fetching customers:', error);
            });
    }

    // Function to fetch all inventory levels from the API
    function fetchInventoryLevels() {
        fetch(apiEndpoints.getInventorylevel)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                inventoryLevels = data || [];
                renderInventoryLevels();
            })
            .catch(error => {
                console.error('Error fetching inventory levels:', error);
            });
    }

    // Function to update counts based on customer statuses
    function updateCounts() {
        totalOrdersCount = customers.length;
        processedCount = customers.filter(c => c.status === 'Processing').length;
        shippedCount = customers.filter(c => c.status === 'Shipped').length;
        pendingCount = customers.filter(c => c.status === 'Pending').length;
        deliveredCount = customers.filter(c => c.status === 'Delivered').length;
    }

    // Update dashboard display with stored data
    function updateDashboard() {
        const TotalOrdersElement = document.getElementById('Totalorders');
        const shipmentStatusTitleElement = document.getElementById('shipmentStatusTitle');
        const shipmentCountElement = document.getElementById('shipmentCount');

        if (TotalOrdersElement) {
            TotalOrdersElement.textContent = totalOrdersCount;
        } else {
            console.error('Element with ID "Totalorders" not found');
        }

        if (shipmentStatusTitleElement) {
            const currentStatus = statusCycle[currentStatusIndex];
            shipmentStatusTitleElement.textContent = currentStatus;
            shipmentCountElement.textContent = getCountForStatus(currentStatus);
        } else {
            console.error('Element with ID "shipmentStatusTitle" not found');
        }

        if (shipmentCountElement) {
            shipmentCountElement.textContent = getCountForStatus(statusCycle[currentStatusIndex]);
        } else {
            console.error('Element with ID "shipmentCount" not found');
        }
    }

    // Get count for the given status
    function getCountForStatus(status) {
        switch (status) {
            case 'Processing':
                return processedCount;
            case 'Shipped':
                return shippedCount;
            case 'Pending':
                return pendingCount;
            case 'Delivered':
                return deliveredCount;
            default:
                return 0;
        }
    }

    // Function to render the current inventory level in the UI
    function renderInventoryLevels() {
        const inventoryLevelsElement = document.getElementById('inventoryLevels');
        const inventoryLevelsCount = document.getElementById('inventoryCount');
        if (inventoryLevelsElement) {
            if (inventoryLevels.length === 0) {
                inventoryLevelsElement.textContent = 'No inventory data available';
                inventoryLevelsCount.textContent = '0';
            } else {
                const currentItem = inventoryLevels[currentInventoryIndex];
                if (currentItem) {
                    inventoryLevelsElement.textContent = `${currentItem.stockName}`;
                    inventoryLevelsCount.textContent = `${currentItem.stockQuantity}`;
                }
            }
        } else {
            console.error('Element with ID "inventoryLevels" not found');
        }
    }

    // Fetch customer data and inventory data initially when the page loads
    fetchCustomers();
    fetchInventoryLevels();

    // Event listener for refresh button
    document.getElementById('refreshData').addEventListener('click', function () {
        currentStatusIndex = (currentStatusIndex + 1) % statusCycle.length;
        fetchCustomers(); // Reuse the same function for refreshing data

        // Cycle through inventory levels
        if (inventoryLevels.length > 0) {
            currentInventoryIndex = (currentInventoryIndex + 1) % inventoryLevels.length;
            renderInventoryLevels(); // Refresh inventory data display
        }
    });

    // JavaScript for handling logout button click
    document.getElementById('logoutBtn').addEventListener('click', function () {
        window.location.href = '/app/login/login.html';
    });
});

function openNav() {
    document.getElementById("mySidenav").style.width = "16em";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
