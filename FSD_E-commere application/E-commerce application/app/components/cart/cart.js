import { includeHeader } from "../header/header.js";
includeHeader('../header/header.html');

document.addEventListener('DOMContentLoaded', function () {
    function renderCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        console.log(cartItems);

        const cartItemsContainer = document.getElementById('product-details');
        if (!cartItemsContainer) {
            console.error('Product details container not found');
            return;
        }
        cartItemsContainer.innerHTML = '';

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Cart is empty.</p>';
            disableCheckoutButton();
            hidePlaceOrderButton();
            return;
        } else {
            enableCheckoutButton();
            checkLoginStatus();
        }

        cartItems.forEach(item => {
            const itemName = item.title || 'Unnamed Product';
            const itemDescription = item.description || 'No description available';
            const itemPrice = item.price !== undefined ? `Price: ${item.price}` : 'Price not available';
            const itemRating = item.rating !== undefined ? `Rating: ${item.rating}` : 'Rating not available';
            const itemImage = item.image || 'placeholder.jpg';
            const cartItemHTML = `
                <div class="card mb-3">
                    <div class="row no-gutters">
                        <div class="col-md-4">
                            <img src="${itemImage}" class="card-img" alt="${itemName}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${itemName}</h5>
                                <p class="card-text">${itemDescription}</p>
                                <p class="card-text1">${itemPrice}</p>
                                <p class="card-text1">${itemRating}/5</p>
                                <button class="btn btn-danger remove-from-cart" data-product-id="${item.id}">Remove from Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
        });

        addInstantRemoveListeners();
    }

    function disableCheckoutButton() {
        const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout');
        if (proceedToCheckoutBtn) {
            proceedToCheckoutBtn.setAttribute('disabled', 'disabled');
            proceedToCheckoutBtn.classList.add('disabled');
        } else {
            console.error('Proceed to Checkout button not found');
        }
    }

    function enableCheckoutButton() {
        const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout');
        if (proceedToCheckoutBtn) {
            proceedToCheckoutBtn.removeAttribute('disabled');
            proceedToCheckoutBtn.classList.remove('disabled');
        } else {
            console.error('Proceed to Checkout button not found');
        }
    }

    function showCheckoutButton() {
        const CheckoutBtn = document.getElementById('proceed-to-checkout');
        if (CheckoutBtn) {
            CheckoutBtn.style.display = 'inline';
        } else {
            console.error('Proceed to Checkout button not found');
        }
    }

    function hideProceedToCheckoutButton() {
        const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout');
        if (proceedToCheckoutBtn) {
            proceedToCheckoutBtn.style.display = 'none';
        } else {
            console.error('Proceed to Checkout button not found');
        }
    }

    function hidePlaceOrderButton() {
        const placeOrderBtn = document.getElementById('place-order');
        if (placeOrderBtn) {
            placeOrderBtn.style.display = 'none';
        } else {
            console.error('Place Order button not found');
        }
    }

    function showPlaceOrderButton() {
        const placeOrderBtn = document.getElementById('place-order');
        if (placeOrderBtn) {
            placeOrderBtn.style.display = 'block';
        } else {
            console.error('Place Order button not found');
        }
    }

    function checkLoginStatus() {
        const loginMessage = localStorage.getItem('loginMessage');
        if (loginMessage === 'login successfull!!') { 
            showPlaceOrderButton();
            hideProceedToCheckoutButton();
        } else {
            hidePlaceOrderButton();
        }
    }

    function addInstantRemoveListeners() {
        const removeFromCartButtons = document.querySelectorAll('.remove-from-cart');
        removeFromCartButtons.forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.getAttribute('data-product-id');
                console.log('Attempting to remove product with ID:', productId);

                let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                console.log('Current cart items:', cartItems);

                const indexToRemove = cartItems.findIndex(item => item.id.toString() === productId.toString());
                if (indexToRemove !== -1) {
                    const productTitle = cartItems[indexToRemove].title;
                    cartItems.splice(indexToRemove, 1);
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));
                    renderCartItems();
                    if (cartItems.length === 0) {
                        disableCheckoutButton();
                    }
                    alert(`${productTitle} removed from cart.`);
                } else {
                    console.error('Product not found in cart.');
                }
            });
        });
    }

    function placeOrder() {
        localStorage.removeItem('cartItems'); // Clear the cart
        localStorage.removeItem('loginMessage'); // Remove login message
        renderCartItems(); // Re-render cart items to reflect changes

        const toastEl = document.getElementById('order-toast');
        if (toastEl) {
            const toast = new bootstrap.Toast(toastEl);
            toast.show(); 
            showCheckoutButton();
            disableCheckoutButton();
        } else {
            console.error('Toast element not found');
        }
    }

    renderCartItems();

    const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout');
    if (proceedToCheckoutBtn) {
        proceedToCheckoutBtn.addEventListener('click', function (event) {
            if (proceedToCheckoutBtn.classList.contains('disabled')) {
                event.preventDefault();
                alert('Your cart is empty. Please add items to proceed to checkout.');
            } else {
                console.log('Proceeding to checkout...');
            }
        });
    }

    const placeOrderBtn = document.getElementById('place-order');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function () {
            placeOrder();
        });
    } else {
        console.error('Place Order button not found');
    }
});
