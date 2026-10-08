// Check whether user is logged in

const role = localStorage.getItem("userRole");

if (role !== "user") {

    window.location.href = "index.html";
}


// Get logged-in user's name

const userName =
    localStorage.getItem("userName") || "User";


document.getElementById("user-name").textContent =
    userName;

document.getElementById("welcome-name").textContent =
    userName;


// Food data

let foods = [];

async function loadFoods() {

    try {

        const response = await fetch("https://foodease-backend-x6y6.onrender.com/api/foods");

        foods = await response.json();

        displayFood();

    } catch (error) {

        console.error("Error loading foods:", error);

    }
}


// Display food

function displayFood() {

    const container =
        document.getElementById("food-container");

    container.innerHTML = "";


    // Check ordering time

    const now = new Date();

    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();

    const startTime = 8 * 60;
    const endTime = 18 * 60;


    const orderingOpen =
        currentMinutes >= startTime &&
        currentMinutes <= endTime;


    foods.forEach(food => {

        const card =
            document.createElement("div");

        card.className = "simple-food-card";


        if (!orderingOpen) {

            card.classList.add("food-disabled");

            card.innerHTML = `

                <div class="simple-food-image">
                    ${food.emoji}
                </div>

                <div class="simple-food-info">

                    <h3>${food.name}</h3>

                    <p>₹${food.price}</p>

                    <button disabled>
                        Ordering Closed
                    </button>

                </div>

            `;

        } else {

            card.innerHTML = `

                <div class="simple-food-image">
                    ${food.emoji}
                </div>

                <div class="simple-food-info">

                    <h3>${food.name}</h3>

                    <p>₹${food.price}</p>

                    <button
                        onclick="addToCart(${food.id})"
                    >
                        Add to Cart
                    </button>

                </div>

            `;
        }


        container.appendChild(card);

    });

}


// Add food to cart

function addToCart(foodId) {

    const food =
        foods.find(item => item.id === foodId);


    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    const existingItem =
        cart.find(item => item.id === foodId);


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            id: food.id,

            name: food.name,

            price: food.price,

            emoji: food.emoji,

            quantity: 1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert(`${food.name} added to cart!`);
}


// Ordering time

function checkOrderingTime() {

    const currentTime =
        new Date();


    const currentHour =
        currentTime.getHours();


    const currentMinutes =
        currentTime.getMinutes();


    const currentTotalMinutes =
        currentHour * 60 + currentMinutes;


    // Ordering time: 10 AM - 3 PM


    const startTime = 8 * 60;
    const endTime = 18 * 60;


    const status =
        document.getElementById("ordering-status");

    const badge =
        document.getElementById("time-badge");


    if (
        currentTotalMinutes >= startTime &&
        currentTotalMinutes <= endTime
    ) {

        status.textContent =
            "Orders are currently open. You can place your order.";

        badge.textContent =
            "🟢 Orders Open";

        badge.className =
            "time-badge open";

    } else {

        status.textContent =
            "Orders are currently closed. Ordering time is 10:00 AM - 3:00 PM.";

        badge.textContent =
            "🔴 Orders Closed";

        badge.className =
            "time-badge closed";
    }

}


// Open cart

function openCart() {

    window.location.href =
        "cart.html";

}


// Logout

function logout() {

    localStorage.removeItem("userName");

    localStorage.removeItem("userRole");

    window.location.href =
        "index.html";
}


// Load orders

async function displayOrders() {

    const container =
        document.getElementById("orders-container");

    container.innerHTML = "<p>Loading orders...</p>";


    try {

        // Get all orders from backend
        const response = await fetch(
            "https://foodease-backend-x6y6.onrender.com/api/orders"
        );


        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }


        const orders = await response.json();


        // Show only current user's orders
        const userOrders = orders.filter(
            order => order.userName === userName
        );


        container.innerHTML = "";


        if (userOrders.length === 0) {

            container.innerHTML = `
                <div class="no-orders">
                    <p>You have not placed any orders yet.</p>
                </div>
            `;

            return;
        }


        // Show latest order first
        userOrders.reverse();


        userOrders.forEach(order => {

            const orderCard =
                document.createElement("div");

            orderCard.className =
                "order-card";


            let itemsHTML = "";


            order.items.forEach(item => {

                itemsHTML += `
                    <div class="order-item">

                        <span>
                            ${item.name} × ${item.quantity}
                        </span>

                        <span>
                            ₹${item.price * item.quantity}
                        </span>

                    </div>
                `;
            });


            orderCard.innerHTML = `

                <div class="order-top">

                    <div>

                        <h3>
                            Order #${order.id}
                        </h3>

                        <p>
                            ${order.date}
                        </p>

                    </div>


                    <span class="order-status ${order.status.toLowerCase()}">

                        ${order.status}

                    </span>

                </div>


                <div class="order-items">

                    ${itemsHTML}

                </div>


                <div class="order-bottom">

                    <strong>
                        Total: ₹${order.total}
                    </strong>

                </div>

            `;


            container.appendChild(orderCard);

        });


    } catch (error) {

        console.error(
            "Order History Error:",
            error
        );


        container.innerHTML = `
            <div class="no-orders">
                <p>Unable to load your orders.</p>
            </div>
        `;
    }
}



async function displayQueue() {

    const ordersBeforeElement = document.getElementById("orders-before");
    const estimatedTimeElement = document.getElementById("estimated-time");
    const readyTimeElement = document.getElementById("ready-time");
    const messageElement = document.getElementById("queue-message");

    try {

        const response = await fetch(
            "https://foodease-backend-x6y6.onrender.com/api/orders"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }

        const orders = await response.json();

        const pendingOrders = orders.filter(
            order => order.status === "Pending"
        );

        // No pending orders
        if (pendingOrders.length === 0) {

            ordersBeforeElement.textContent = "0";
            estimatedTimeElement.textContent = "0 minutes";
            readyTimeElement.textContent = "--:--";

            messageElement.textContent =
                "No pending orders are currently in the canteen queue.";

            return;
        }

        const userOrders = pendingOrders.filter(
            order => order.userName === userName
        );

        let ordersBefore;

        if (userOrders.length > 0) {

            const myOrder = userOrders[userOrders.length - 1];

            const myOrderIndex = pendingOrders.findIndex(
                order => order.id === myOrder.id
            );

            ordersBefore = myOrderIndex;

        } else {

            ordersBefore = pendingOrders.length;
        }

        const preparationTimePerOrder = 6;

        const estimatedMinutes =
            (ordersBefore + 1) * preparationTimePerOrder;

        const now = new Date();

        const readyTime = new Date(
            now.getTime() +
            estimatedMinutes * 60 * 1000
        );

        const formattedTime =
            readyTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        ordersBeforeElement.textContent = ordersBefore;

        estimatedTimeElement.textContent =
            estimatedMinutes + " minutes";

        readyTimeElement.textContent =
            formattedTime;

        if (userOrders.length > 0) {

            messageElement.textContent =
                `Your order is currently #${ordersBefore + 1} in the preparation queue.`;

        } else {

            messageElement.textContent =
                "These orders are currently ahead in the canteen queue.";
        }

    } catch (error) {

        console.error("Queue Error:", error);

        ordersBeforeElement.textContent = "-";
        estimatedTimeElement.textContent = "Unable to load";
        readyTimeElement.textContent = "--:--";

        messageElement.textContent =
            "Unable to load queue information.";
    }
}


// Run functions

loadFoods();
checkOrderingTime();
displayOrders();
displayQueue();


setInterval(() => {
    displayQueue();
}, 5000);