import { includeHeader } from "../header/header.js";
includeHeader('../header/header.html');

const customerName = localStorage.getItem('username');

const apiUrl = `http://localhost:8080/getCustomerOrderByCustomerName/${customerName}`; 

async function fetchOrderDetails() {
    try {
        const response = await fetch(apiUrl);
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error fetching order details:', error);
    }
}

function displayOrders(orders) {
    const container = document.getElementById('product-details');
    container.innerHTML = '';

    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'card';
        orderElement.style.width = '18rem'; 

        orderElement.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Order ID: ${order.orderId}</h5>
                <br>
                <h4 class="card-subtitle">${order.productName}</h6>
                <br>
                <p class="card-text">
                    <span class="status ${order.status.toLowerCase()}">${order.status}</span>
                </p>
            </div>
        `;

        cardContainer.appendChild(orderElement);
    });

    container.appendChild(cardContainer);
}

document.addEventListener('DOMContentLoaded', fetchOrderDetails);
