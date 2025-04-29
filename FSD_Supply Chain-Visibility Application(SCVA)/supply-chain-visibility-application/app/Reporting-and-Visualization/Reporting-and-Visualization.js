// Load navBar
$('#mySidenav').load('../common/sidenav.html');

document.addEventListener('DOMContentLoaded', function () {
  // Set up canvas contexts for multiple charts
  const customerOrdersCtx = document.getElementById('customerOrdersChart').getContext('2d');
  const purchaseOrdersCtx = document.getElementById('purchaseOrdersChart').getContext('2d');
  const stocksCtx = document.getElementById('stocksChart').getContext('2d');

  let customerOrdersChart = null;
  let purchaseOrdersChart = null;
  let stocksChart = null;

// Function to fetch and display Customer Orders Chart
function fetchCustomerOrdersChart() {
  fetch('http://localhost:8080/getAllCustomerOrders')
    .then(response => response.json())
    .then(data => {
      // Count occurrences of each status
      const statusCounts = data.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      // Extract labels and values from the statusCounts
      const labels = Object.keys(statusCounts);
      const values = Object.values(statusCounts);

      updateChart({
        labels: labels,
        datasets: [{
          label: 'Order Status',
          data: values,
          backgroundColor: 'rgba(0, 127, 162, 0.2)',
          borderColor: 'rgba(0, 127, 162, 1)',
          borderWidth: 1
        }]
      }, customerOrdersChart, customerOrdersCtx, 'Order Status', 'Number of Orders');
    })
    .catch(error => console.error('Error fetching customer orders data:', error));
}
    
  // Function to fetch and display Purchase Orders Chart
  function fetchPurchaseOrdersChart() {
    fetch('http://localhost:8080/getAllPurchaseOrders')
      .then(response => response.json())
      .then(data => {
        const labels = data.map(order => order.item);
        const values = data.map(order => order.quantity);
        updateChart({
          labels: labels,
          datasets: [{
            label: 'Quantity',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        }, purchaseOrdersChart, purchaseOrdersCtx, 'Item Name', 'Quantity');
      })
      .catch(error => console.error('Error fetching purchase orders data:', error));
  }
  
  // Function to fetch and display Stocks Chart
  function fetchStocksChart() {
    fetch('http://localhost:8080/getAllStocks')
      .then(response => response.json())
      .then(data => {
        const labels = data.map(stock => stock.stockName);
        const values = data.map(stock => stock.stockQuantity);
        updateChart({
          labels: labels,
          datasets: [{
            label: 'Quantity',
            data: values,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }]
        }, stocksChart, stocksCtx, 'Stock Name', 'Stock Quantity');
      })
      .catch(error => console.error('Error fetching stocks data:', error));
  }
  
// Function to update a chart
function updateChart(data, chart, ctx, xAxisLabel, yAxisLabel) {
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'bar', // You can change this to 'line', 'pie', etc. depending on your need
    data: {
      labels: data.labels,
      datasets: data.datasets
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: yAxisLabel, // Custom y-axis label
            color: '#191c1f',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            stepSize: 1 // Ensure integer values
          }
        },
        x: {
          title: {
            display: true,
            text: xAxisLabel, // Custom x-axis label
            color: '#191c1f',
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      }
    }
  });
}

  // Fetch data and display charts on page load
  fetchCustomerOrdersChart();
  fetchPurchaseOrdersChart();
  fetchStocksChart();

  // Export functions
  function fetchDataAndExport(url, filename) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, filename);
      })
      .catch(error => console.error('Error fetching data for export:', error));
  }

  document.getElementById('export-customer-orders').addEventListener('click', function () {
    fetchDataAndExport('http://localhost:8080/getAllCustomerOrders', 'CustomerOrders.xlsx');
  });

  document.getElementById('export-purchase-orders').addEventListener('click', function () {
    fetchDataAndExport('http://localhost:8080/getAllPurchaseOrders', 'PurchaseOrders.xlsx');
  });

  document.getElementById('export-stocks').addEventListener('click', function () {
    fetchDataAndExport('http://localhost:8080/getAllStocks', 'Stocks.xlsx');
  });

  document.getElementById('logoutBtn').addEventListener('click', function() {
    window.location.href = '/app/login/login.html'; // Replace with your actual login page URL
  });
});

function openNav() {
    document.getElementById("mySidenav").style.width = "16em";
  }

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }