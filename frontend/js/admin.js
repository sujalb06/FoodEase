const role = localStorage.getItem("userRole");

if (role !== "admin") {
    window.location.href = "index.html";
}

const adminName = localStorage.getItem("adminName") || "Admin";

document.getElementById("admin-name").textContent = adminName;


// ==================== DISPLAY ORDERS ====================

async function displayOrders() {

    const container =
        document.getElementById("admin-orders-container");

    container.innerHTML = "<p>Loading orders...</p>";


    try {

        const response = await fetch(
            "https://foodease-backend-x6y6.onrender.com/api/orders"
        );


        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }


        const orders = await response.json();


        container.innerHTML = "";


        if (orders.length === 0) {

            container.innerHTML = `
                <div class="no-orders">
                    <p>No orders available.</p>
                </div>
            `;

            return;
        }


        orders.forEach(order => {

            const orderCard =
                document.createElement("div");

            orderCard.className =
                "admin-order-card";


            let itemsHTML = "";


            order.items.forEach(item => {

                itemsHTML += `
                    <div class="admin-order-item">

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

                <div class="admin-order-top">

                    <div>

                        <h3>
                            Order #${order.id}
                        </h3>

                        <p>
                            Customer: ${order.userName}
                        </p>

                        <p>
                            ${order.date}
                        </p>

                    </div>


                    <span class="admin-order-status ${order.status.toLowerCase()}">

                        ${order.status}

                    </span>

                </div>


                <div class="admin-order-items">

                    ${itemsHTML}

                </div>


                <div class="admin-order-bottom">

                    <strong>
                        Total: ₹${order.total}
                    </strong>


                    ${
                        order.status === "Pending"

                        ?

                        `<button onclick="completeOrder(${order.id})">
                            Mark Completed
                        </button>`

                        :

                        `<button disabled>
                            Completed
                        </button>`
                    }

                </div>

            `;


            container.appendChild(orderCard);

        });


    } catch (error) {

        console.error(
            "Error loading orders:",
            error
        );


        container.innerHTML = `
            <div class="no-orders">

                <p>
                    Unable to load orders.
                    Please check the backend server.
                </p>

            </div>
        `;
    }
}


// ==================== COMPLETE ORDER ====================

async function completeOrder(orderId) {

    try {

        const response = await fetch(
            `https://foodease-backend-x6y6.onrender.com/api/orders/${orderId}`,
            {
                method: "PUT"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to complete order");
        }

        await response.json();

        displayOrders();

    } catch (error) {

        console.error(
            "Complete Order Error:",
            error
        );

        alert("Unable to complete order.");
    }
}


// ==================== CLEAR ALL ORDERS ====================

async function clearAllOrders() {

    const confirmClear =
        confirm("Are you sure you want to clear all orders?");

    if (!confirmClear) {
        return;
    }


    try {

        const response = await fetch(
            "https://foodease-backend-x6y6.onrender.com/api/orders",
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {
            throw new Error("Failed to clear orders");
        }


        await response.json();

        displayOrders();


    } catch (error) {

        console.error(
            "Clear Orders Error:",
            error
        );

        alert("Unable to clear orders.");
    }
}


// ==================== LOGOUT ====================

function logout() {

    localStorage.removeItem("adminName");

    localStorage.removeItem("userRole");

    window.location.href = "index.html";
}


// ==================== INITIAL LOAD ====================

displayOrders();