const products = [
    { id: 1, name: "Product 1", price: 10.99, image: "https://picsum.photos/id/1018/200/200", description: "This is a description of Product 1.", type: "Clothing" },
    { id: 2, name: "Product 2", price: 12.99, image: "https://picsum.photos/id/1015/200/200", description: "This is a description of Product 2.", type: "Mobile" },
    { id: 3, name: "Product 3", price: 9.99, image: "https://picsum.photos/id/1016/200/200", description: "This is a description of Product 3.", type: "Furniture" },
    { id: 4, name: "Product 4", price: 15.99, image: "https://picsum.photos/id/1019/200/200", description: "This is a description of Product 4.", type: "Sports" },
    { id: 5, name: "Product 5", price: 8.99, image: "https://picsum.photos/id/1020/200/200", description: "This is a description of Product 5.", type: "Electronics" }
];
let total=0;

// Display product cards
document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("product-grid");
    if (productGrid) {
        let productHTML = "";
        products.forEach(product => {
            productHTML += `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3 id="name">${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <a href="product-details.html?id=${product.id}" class="btn">View Details</a>
                </div>
            `  ;
        });
        productGrid.innerHTML = productHTML;
    }

    loadProductDetails();
    updateCartCount();
});

// Load product details on product-details.html
function loadProductDetails() {
    const productDetailsDiv = document.getElementById("product-details");
    if (productDetailsDiv) {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        const product = products.find(p => p.id === parseInt(productId));

        if (product) {
            window.onload=()=>{
                window.dataLayer=window.dataLayer || [];
                window.dataLayer.push({
                    "event":"view_item",
                    "ecommerce":{
                        "currency":"USD",
                        items:[{
                            item_id:product.id.toString(),
                            item_name:product.name,
                            item_category:product.type,
                            item_price:product.price,
                            
                        }]
                    }
                })
            }
            productDetailsDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-detail-img">
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <p>${product.description}</p>
                    <h3>$${product.price.toFixed(2)}</h3>
                    <button onclick="addToCart(${product.id}); add_to_cart(${product.id})" class="btn"  id="add_to_cart">Add to Cart</button>
                    
                </div>
            `;
        } else {
            productDetailsDiv.innerHTML = "<p>Product not found.</p>";
        }
    }
}

// Update cart count in navbar
 function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Add product to cart and push to dataLayer
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = products.find(p => p.id === productId);
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Item added to cart!");
  



    
}

// Load checkout summary
function loadCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const checkoutSummary = document.getElementById("checkout-summary");

    if (!checkoutSummary) return;

    if (cart.length === 0) {
        checkoutSummary.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    let summaryHTML = "<h2>Order Summary</h2>";
    cart.forEach((item, index) => {
        summaryHTML += `
            <div class="checkout-item">
                <h3>${item.name}</h3>
                <p>Price: $${Number(item.price).toFixed(2)}</p>

                <button class="btn remove-btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });

    total = cart.reduce((sum, item) => sum + item.price, 0);
    summaryHTML += `<h3>Total: $${Number(total).toFixed(2)}</h3>`;

    checkoutSummary.innerHTML = summaryHTML;

    setTimeout(() => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            "event": "begin_checkout",
            "ecommerce": {
               "value": Number(total).toFixed(2),
                "currency": "USD",
                "items": cart
            }
        });
    }, 2000);
}

// Place the order
function placeOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty. Add items before placing an order.");
        return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        "event": "purchase",
        "ecommerce": {
            "transaction_id": "T_12345",
            "value": total.toFixed(2),
            "tax": 3.60,
            "shipping": 5.99,
            "discount": 2.22,
            "currency": "USD",
            "coupon": "SUMMER_SALE",
            "items": cart
        }
    });

    alert("Order placed successfully!");
    localStorage.removeItem("cart");
    updateCartCount();
}


// Call on page load
document.addEventListener("DOMContentLoaded", () => {
    loadCheckoutSummary();
    updateCartCount();
});
function add_to_cart(productId){
    window.dataLayer=window.dataLayer || [];
    const product = products.find(p => p.id === productId);
     window.dataLayer.push({
    "event": "add_to_cart",
    "ecommerce": {
        "currency": "USD",
        "items": [{
            item_id: product.id.toString(),
            item_name: product.name,
            item_price: product.price,
            item_category: product.type,  // More standard than "type"
            quantity: 1
        }]
    }
});

    
}
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const removedItem = cart.splice(index, 1)[0]; // Remove the item from array
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    loadCheckoutSummary();
  //   gtag('event', 'remove_from_cart', {
  // currency: "USD",
  // items: [{
  //   item_id: removedItem.id.toString(),
  //   item_name: removedItem.name,
  //   item_category: removedItem.type,
  //   price: removedItem.price,
  //   quantity: 1
  // }]
  //  });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        "event": "remove_from_cart",
        "ecommerce": {
            "currency": "USD",
            "items": [{
                item_id: removedItem.id.toString(),
                item_name: removedItem.name,
                item_category: removedItem.type,
                item_price: removedItem.price,
                quantity: 1
            }]
        }
    });
}
//ShopNow Click
 document.addEventListener('DOMContentLoaded', () => {
      const shopNowLink = document.querySelector('.shop-now-btn');
      if (shopNowLink) {
        shopNowLink.addEventListener('click', (e) => {
          // Optional: delay navigation to ensure dataLayer is pushed
          e.preventDefault(); // prevent immediate navigation

          // Push event into dataLayer
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "shop_Now"
          });

          // Wait briefly, then navigate
          setTimeout(() => {
            window.location.href = shopNowLink.href;
          }, 2000); // adjust timing as needed
        });
      }
    });
