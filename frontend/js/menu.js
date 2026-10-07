const foods = [
    {
        id: 1,
        name: "Classic Burger",
        description: "Cheesy vegetable burger",
        price: 80,
        category: "Burger",
        emoji: "🍔"
    },
    {
        id: 2,
        name: "Veg Pizza",
        description: "Pizza loaded with fresh vegetables",
        price: 120,
        category: "Pizza",
        emoji: "🍕"
    },
    {
        id: 3,
        name: "Veg Sandwich",
        description: "Fresh and crispy sandwich",
        price: 60,
        category: "Snacks",
        emoji: "🥪"
    },
    {
        id: 4,
        name: "French Fries",
        description: "Crispy golden french fries",
        price: 50,
        category: "Snacks",
        emoji: "🍟"
    },
    {
        id: 5,
        name: "Cold Coffee",
        description: "Chilled creamy coffee",
        price: 50,
        category: "Beverage",
        emoji: "☕"
    },
    {
        id: 6,
        name: "Masala Maggi",
        description: "Hot and spicy masala noodles",
        price: 50,
        category: "Snacks",
        emoji: "🍜"
    }
];


const foodContainer = document.getElementById("food-container");
const searchInput = document.getElementById("search-input");
const categoryButtons = document.querySelectorAll(".category-btn");


// Display food items
function displayFoods(foodList) {

    foodContainer.innerHTML = "";

    if (foodList.length === 0) {
        foodContainer.innerHTML = `
            <p class="no-food">
                No food items found.
            </p>
        `;
        return;
    }

    foodList.forEach(food => {

        const card = document.createElement("div");

        card.className = "food-card";

        card.innerHTML = `
            <div class="food-image">
                ${food.emoji}
            </div>

            <div class="food-info">

                <h3>${food.name}</h3>

                <p>${food.description}</p>

                <div class="food-bottom">

                    <span>₹${food.price}</span>

                    <button onclick="addToCart(${food.id})">
                        Add +
                    </button>

                </div>

            </div>
        `;

        foodContainer.appendChild(card);
    });
}


// Add item to cart
function addToCart(foodId) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const food = foods.find(item => item.id === foodId);

    const existingItem = cart.find(item => item.id === foodId);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...food,
            quantity: 1
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(`${food.name} added to cart!`);
}


// Update cart count
function updateCartCount() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}


// Search functionality
searchInput.addEventListener("input", function () {

    const searchValue = searchInput.value.toLowerCase();

    const filteredFoods = foods.filter(food =>
        food.name.toLowerCase().includes(searchValue)
    );

    displayFoods(filteredFoods);
});


// Category filtering
categoryButtons.forEach(button => {

    button.addEventListener("click", function () {

        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const selectedCategory = button.dataset.category;

        if (selectedCategory === "All") {

            displayFoods(foods);

        } else {

            const filteredFoods = foods.filter(
                food => food.category === selectedCategory
            );

            displayFoods(filteredFoods);
        }
    });
});


// Initial display
displayFoods(foods);

updateCartCount();