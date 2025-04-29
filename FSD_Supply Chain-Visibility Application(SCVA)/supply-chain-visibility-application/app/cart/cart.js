import { includeHeader } from "../header/header.js";
includeHeader("../header/header.html");

document.addEventListener("DOMContentLoaded", function () {
  function renderCartItems() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartItemsContainer = document.getElementById("product-details");
    if (!cartItemsContainer) {
      console.error("Product details container not found");
      return;
    }
    cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = "<p>Cart is empty.</p>";
      hidePlaceOrderButton();
      return;
    } else {
      checkLoginStatus();
    }

    let totalPrice = 0;

    cartItems.forEach((item) => {
      const itemName = item.title || "Unnamed Product";
      const itemDescription = item.description || "No description available";
      const itemPrice = item.price !== undefined ? item.price : 0;
      totalPrice += itemPrice; // Calculate total price
      const itemRating =
        item.rating !== undefined
          ? `Rating: ${item.rating}`
          : "Rating not available";
      const itemImage = item.image || "placeholder.jpg";
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
                <p class="card-text1">Price: ${itemPrice}</p>
                <button class="btn btn-danger remove-from-cart" data-product-id="${item.id}">Remove from Cart</button>
              </div>
            </div>
          </div>
        </div>
      `;
      cartItemsContainer.innerHTML += cartItemHTML;
    });

    addInstantRemoveListeners();
    showPlaceOrderButtonIfItemsPresent(cartItems.length);
    localStorage.setItem("totalPrice", totalPrice);
  }

  function hidePlaceOrderButton() {
    const placeOrderBtn = document.getElementById("place-order");
    if (placeOrderBtn) {
      placeOrderBtn.style.display = "none";
    }
  }

  function showPlaceOrderButton() {
    const placeOrderBtn = document.getElementById("place-order");
    if (placeOrderBtn) {
      placeOrderBtn.style.display = "block";
    }
  }

  function showPlaceOrderButtonIfItemsPresent(cartLength) {
    if (cartLength > 0) {
      showPlaceOrderButton();
    } else {
      hidePlaceOrderButton();
    }
  }

  function checkLoginStatus() {
    const loginMessage = localStorage.getItem("loginMessage");
    if (loginMessage === "login successful!!") {
      showPlaceOrderButtonIfItemsPresent(
        JSON.parse(localStorage.getItem("cartItems")).length
      );
    } else {
      hidePlaceOrderButton();
    }
  }

  function addInstantRemoveListeners() {
    const removeFromCartButtons =
      document.querySelectorAll(".remove-from-cart");
    removeFromCartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-product-id");
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const indexToRemove = cartItems.findIndex(
          (item) => item.id.toString() === productId.toString()
        );
        if (indexToRemove !== -1) {
          cartItems.splice(indexToRemove, 1);
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          renderCartItems();
        }
      });
    });
  }

  async function placeOrder() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const customerName = localStorage.getItem("username");
    let orderPlaced = true;

    for (const item of cartItems) {
      try {
        const response = await fetch("http://localhost:8080/addCustomerOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName: item.title,
            customerName: customerName,
            status: "Pending",
          }),
        });

        if (!response.ok) {
          orderPlaced = false;
        }
      } catch (error) {
        orderPlaced = false;
      }
    }

    if (orderPlaced) {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("loginMessage");
      renderCartItems();
      showOrderToast();
    } else {
      alert("Failed to place some orders. Please try again.");
    }
  }

  function showOrderToast() {
    const toastEl = document.getElementById("order-toast");
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  const placeOrderBtn = document.getElementById("place-order");
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", function () {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const totalPrice = localStorage.getItem("totalPrice") || 0;

      const cartItemsContainer = document.getElementById(
        "cart-items-container"
      );
      cartItemsContainer.innerHTML = "";
      cartItems.forEach((item) => {
        cartItemsContainer.innerHTML += `<p id="product-title">${item.title} <span class="price">${item.price}</span></p>`;
      });

      const totalPriceElement = document.getElementById("total-price");
      if (totalPriceElement) {
        totalPriceElement.innerText = `${totalPrice}`;
      }

      const paymentModal = new bootstrap.Modal(
        document.getElementById("paymentModal")
      );
      paymentModal.show();
    });
  }

  function validatePaymentForm() {
    const fullName = document.getElementById("fname").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("adr").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const zip = document.getElementById("zip").value.trim();
    const cardName = document.getElementById("cname").value.trim();
    const cardNumber = document.getElementById("ccnum").value.trim();
    const expMonth = document.getElementById("expmonth").value.trim();
    const expYear = document.getElementById("expyear").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cardNumberPattern = /^\d{16}$/; // Example: 16-digit card number
    const cvvPattern = /^\d{3,4}$/; // CVV can be 3 or 4 digits

    let errorMessages = [];

    if (!fullName) {
      errorMessages.push("Full name is required.");
    }
    if (!emailPattern.test(email)) {
      errorMessages.push("Please enter a valid email address.");
    }
    if (!address) {
      errorMessages.push("Address is required.");
    }
    if (!city) {
      errorMessages.push("City is required.");
    }
    if (!state) {
      errorMessages.push("State is required.");
    }
    if (!zip) {
      errorMessages.push("ZIP code is required.");
    }
    if (!cardName) {
      errorMessages.push("Card name is required.");
    }
    if (!cardNumberPattern.test(cardNumber)) {
      errorMessages.push("Card number must be 16 digits.");
    }
    if (!expMonth) {
      errorMessages.push("Expiration month is required.");
    }
    if (!expYear) {
      errorMessages.push("Expiration year is required.");
    }
    if (!cvvPattern.test(cvv)) {
      errorMessages.push("CVV must be 3 or 4 digits.");
    }

    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));
      return false;
    }
    return true;
  }

  const paymentForm = document.getElementById("payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission

      if (!validatePaymentForm()) {
        return; // Stop if validation fails
      }

      const paymentData = {
        fullName: document.getElementById("fname").value,
        email: document.getElementById("email").value,
        address: document.getElementById("adr").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        zip: document.getElementById("zip").value,
        cardName: document.getElementById("cname").value,
        cardNumber: document.getElementById("ccnum").value,
        expMonth: document.getElementById("expmonth").value,
        expYear: document.getElementById("expyear").value,
        cvv: document.getElementById("cvv").value,
      };

      try {
        const response = await fetch("http://localhost:8080/payments/process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
          throw new Error("Payment processing failed");
        }

        await placeOrder();
        bootstrap.Modal.getInstance(
          document.getElementById("paymentModal")
        ).hide();
      } catch (error) {
        alert("Payment failed: " + error.message);
      }
    });
  }

  renderCartItems();
});
