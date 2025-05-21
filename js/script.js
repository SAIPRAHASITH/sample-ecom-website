const products = [
    { id: 1, name: "Product 1", price: 10.99, image: "https://picsum.photos/id/1018/200/200", description: "This is a description of Product 1." , type:"Clothing"},
    { id: 2, name: "Product 2", price: 12.99, image: "https://picsum.photos/id/1015/200/200", description: "This is a description of Product 2.", type:"Mobile" },
    { id: 3, name: "Product 3", price: 9.99, image: "https://picsum.photos/id/1016/200/200", description: "This is a description of Product 3.", type:"Furniture" },
    { id: 4, name: "Product 4", price: 15.99, image: "https://picsum.photos/id/1019/200/200", description: "This is a description of Product 4." , type:"Sports"},
    { id: 5, name: "Product 5", price: 8.99, image: "https://picsum.photos/id/1020/200/200", description: "This is a description of Product 5." , type:"Electronics"}
];



// Function to dynamically generate product cards on the products page
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
            `;
        });
        productGrid.innerHTML = productHTML;
    }

    loadProductDetails();
    updateCartCount();
});

// Function to load product details from URL params on product-details.html
function loadProductDetails() {
    const productDetailsDiv = document.getElementById("product-details");
    if (productDetailsDiv) {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        const product = products.find(p => p.id === parseInt(productId));

        if (product) {
            productDetailsDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-detail-img">
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <p>${product.description}</p>
                    <h3>$${product.price.toFixed(2)}</h3>
                    <button onclick="addToCart(${product.id})" class="btn">Add to Cart</button>
                </div>
            `;
        } else {
            productDetailsDiv.innerHTML = "<p>Product not found.</p>";
        }
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (document.getElementById("cart-count")?.textContent){
        document.getElementById("cart-count").textContent = cart.length;
    }
}

// Function to add products to the cart
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = products.find(p => p.id === productId);
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Item added to cart!");
    window.dataLayer=window.dataLayer || [];
    window.dataLayer.push({
        "event":"add_to cart",
        "ecommerce":{
            "currency":"USD",
            "items":[{
                item_id: product.id.toString(),
                item_name: product.name,
                price: product.price,
                type:product.type,
                quantity: 1
                
            }]
            
        }
    })
    window.location.href = "cart.html";

}


// Function to load and display checkout summary
function loadCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const checkoutSummary = document.getElementById("checkout-summary");

    if (cart.length === 0) {
        if(checkoutSummary?.innerHTML){
        checkoutSummary.innerHTML = "<p>Your cart is empty.</p>";
        return;
        }
    }

    let summaryHTML = "<h2>Order Summary</h2>";
    cart.forEach(item => {
        summaryHTML += `
            <div class="checkout-item">
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
            </div>
        `;
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    summaryHTML += `<h3>Total: $${total.toFixed(2)}</h3>`;
    if(checkoutSummary?.innerHTML){
    checkoutSummary.innerHTML = summaryHTML;}
}

// Call this function when the checkout page loads
document.addEventListener("DOMContentLoaded", () => {
    loadCheckoutSummary();
    updateCartCount(); // Ensure the cart count is updated
});

// Function to place the order
function placeOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart?.length === 0) {
        alert("Your cart is empty. Add items before placing an order.");
        return;
    }

    // Show success alert
    alert("Order placed successfully!");

    // Clear the cart after placing the order
    localStorage.removeItem("cart");

    // Update cart count and total
    updateCartCount();

    // Redirect to home page after order
    window.location.href = "index.html";
}

