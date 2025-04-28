import { includeHeader } from "../header/header.js";

var allProducts;
var cartItems = [];

//Add Header
includeHeader('../header/header.html');

//Add event listners for filter buttons
document.getElementById('btnShowAll').addEventListener('click', function () { filterSelection('all', allProducts) });
document.getElementById('btnJewelery').addEventListener('click', function () { filterSelection('jewelery', allProducts) });
document.getElementById('btnElectronics').addEventListener('click', function () { filterSelection('Electronics', allProducts) });
document.getElementById('btnFashion').addEventListener('click', function () { filterSelection('Fashion', allProducts) });

// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}


fetch('http://localhost:8080/products/all') // Replace with your API endpoint
  .then(res => res.json())
  .then(products => {
    allProducts = products;
    console.log(allProducts);
    if (products) {
      filterSelection("all", products);
      buildProductPage(products); // Uncommented to build the product page after fetching
    } else {
      console.log("No products fetched");
    }
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });

// FUNCTIONS
function buildProductPage(products) {
  console.log(products);
  let productList = document.getElementById('row');
  productList.innerHTML = "";
  products.forEach(product => {
    const cardHTML = `
      <div class="column">
        <div class="card">
          <img src="${product.imageURL}" class="card-img-top" id="Product_Image_${product.id}">
          <div class="card-body">
            <h4 class="card-title" id="Product_name_${product.id}">${product.title}</h4>
            <p class="card-text1" id="Product_description_${product.id}">${product.description}</p>
            <p class="card-text" id="Product_price_${product.id}">Price: ${product.price}</p>
            <p class="card-text" id="Product_rating_${product.id}">Rating: ${product.rating}/5</p>
            <button type="button" class="btn btn-primary addToCartButton" id="${product.id}">Add to cart</button>
          </div>
        </div>
      </div>`;
    productList.innerHTML += cardHTML;
  });
  // Add event listeners after all products are rendered
  addAddToCartListeners();
}

// Event listener to Add-to-cart
function addAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll('.addToCartButton');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.id;
      
      // Find the product in allProducts array
      const product = allProducts.find(p => p.id == productId);
      if (product) {
        // Retrieve existing cart items from localStorage or initialize an empty array
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Add the selected product details to cartItems array
        cartItems.push({
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          rating: product.rating, 
          image: product.imageURL 
        });
        
        // Store the updated cartItems back into localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Alert message with product title added to cart
        alert(`${product.title} added to cart!`);
        
        // Log product details including image URL to console
        console.log('Product added to cart:', {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          rating: product.rating.rate,
          image: product.image
        });
        
      } else {
        console.error('Product not found');
        // Optionally, inform the user that the product couldn't be added
        alert('Product not found. Please try again.');
      }
    });
  });
}



// Call the function to add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  addAddToCartListeners();
});


function filterSelection(filterText, products) {
  console.log(filterText);
  switch (filterText) {
    case "all":
      buildProductPage(products);
      break;
    default:
      buildProductPage(products.filter(product => product.category.toLowerCase() == filterText.toLowerCase()));
  }
}

function AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) { element.className += " " + arr2[i]; }
  }
}

function RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}










