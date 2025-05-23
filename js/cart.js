document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.getElementById("cart-items");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartHTML = "";
    let total = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            cartHTML += `
                <div class="cart-item">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
            `;
            total += item.price;
        });
    } else {
        cartHTML = "<p>Your cart is empty.</p>";
    }

    cartItems.innerHTML = cartHTML;
    document.getElementById("cart-total").textContent = total.toFixed(2);
    updateCartCount();
  )
