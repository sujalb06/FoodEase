const role = localStorage.getItem("userRole");

if (role !== "user") {
    window.location.href = "index.html";
}

const userName = localStorage.getItem("userName") || "User";

document.getElementById("user-name").textContent = userName;


// ==================== CART DATA ====================

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ==================== DISPLAY CART ====================

function displayCart() {

    const container = document.getElementById("cart-container");

    container.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some food items to place the order.</p>
            </div>
        `;

        updateSummary();
        return;
    }


    cart.forEach(item => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div class="cart-food-image">
                ${item.emoji}
            </div>

            <div class="cart-food-info">
                <h3>${item.name}</h3>
                <p>₹${item.price} × ${item.quantity}</p>
            </div>

            <div class="quantity-control">

                <button onclick="decreaseQuantity(${item.id})">
                    −
                </button>

                <span>${item.quantity}</span>

                <button onclick="increaseQuantity(${item.id})">
                    +
                </button>

            </div>

            <div class="cart-item-total">
                ₹${item.price * item.quantity}
            </div>

            <button
                class="remove-btn"
                onclick="removeItem(${item.id})">
                Remove
            </button>
        `;

        container.appendChild(cartItem);
    });


    updateSummary();
}


// ==================== INCREASE QUANTITY ====================

function increaseQuantity(foodId) {

    const item = cart.find(item => item.id === foodId);

    if (item) {
        item.quantity++;
    }

    saveCart();

    displayCart();
}


// ==================== DECREASE QUANTITY ====================

function decreaseQuantity(foodId) {

    const item = cart.find(item => item.id === foodId);

    if (!item) {
        return;
    }


    if (item.quantity > 1) {

        item.quantity--;

    } else {

        cart = cart.filter(item => item.id !== foodId);

    }

    saveCart();

    displayCart();
}


// ==================== REMOVE ITEM ====================

function removeItem(foodId) {

    cart = cart.filter(item => item.id !== foodId);

    saveCart();

    displayCart();
}


// ==================== SAVE CART ====================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


// ==================== UPDATE SUMMARY ====================

function updateSummary() {

    let itemCount = 0;
    let total = 0;


    cart.forEach(item => {

        itemCount += item.quantity;

        total += item.price * item.quantity;

    });


    document.getElementById("item-count").textContent =
        itemCount;

    document.getElementById("cart-total").textContent =
        `₹${total}`;


    const placeOrderButton =
        document.getElementById("place-order-btn");


    if (cart.length === 0) {

        placeOrderButton.disabled = true;

    } else {

        placeOrderButton.disabled = false;

    }
}


// ==================== PLACE ORDER ====================

async function placeOrder() {

    // Check empty cart
    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }

    // Check ordering time

        const now = new Date();

        const currentMinutes =
        now.getHours() * 60 + now.getMinutes();

        const startTime = 8 * 60;
        const endTime = 18 * 60;

        if (
        currentMinutes < startTime ||
        currentMinutes > endTime
        ) {
        alert("Ordering is available only from 8 AM to 6 PM.");
        return;
        }


    // Calculate total
    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

    });


    // Get Place Order button
    const placeOrderButton =
        document.getElementById("place-order-btn");


    // Disable button while request is processing
    placeOrderButton.disabled = true;

    placeOrderButton.textContent =
        "Placing Order...";


    try {

        // Send order to backend
        const response = await fetch(
            "http://localhost:5000/api/orders",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    userName: userName,
                    items: cart,
                    total: total
                })
            }
        );


        const data = await response.json();


        // Check backend response
        if (!response.ok) {

            throw new Error(
                "Failed to place order"
            );
        }


        // Order successfully created
        alert(
            `Order #${data.order.id} placed successfully!`
        );


        // Clear cart
        cart = [];

        localStorage.removeItem("cart");


        // Go back to user dashboard
        window.location.href = "user.html";


    } catch (error) {

        console.error(
            "Order Error:",
            error
        );


        alert(
            "Unable to place order. Please try again."
        );


        // Enable button again
        placeOrderButton.disabled = false;

        placeOrderButton.textContent =
            "Place Order";
    }
}


// ==================== BACK ====================

function goBack() {

    window.location.href = "user.html";
}


// ==================== LOGOUT ====================

function logout() {

    localStorage.removeItem("userName");

    localStorage.removeItem("userRole");

    window.location.href = "index.html";
}


// ==================== INITIAL LOAD ====================

displayCart();