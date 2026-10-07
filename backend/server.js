require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());


// ==================== MONGODB CONNECTION ====================

const client = new MongoClient(process.env.MONGODB_URI);

let ordersCollection;
let foodsCollection;


// Connect to MongoDB
async function connectDatabase() {

    try {

        await client.connect();

        const database = client.db("FoodEaseDB");

        ordersCollection =
            database.collection("orders");

        foodsCollection =
            database.collection("foods");


        const foodCount =
            await foodsCollection.countDocuments();

        if (foodCount === 0) {

            await foodsCollection.insertMany(defaultFoods);

            console.log("Food data inserted into MongoDB.");

        }


        console.log("MongoDB connected successfully!");

    } catch (error) {

        console.error(
            "MongoDB connection failed:",
            error
        );

        process.exit(1);
    }
}


// ==================== FOOD DATA ====================

const defaultFoods = [
    {
        id: 1,
        name: "Veg Burger",
        price: 80,
        emoji: "🍔"
    },
    {
        id: 2,
        name: "Veg Pizza",
        price: 120,
        emoji: "🍕"
    },
    {
        id: 3,
        name: "Veg Sandwich",
        price: 60,
        emoji: "🥪"
    },
    {
        id: 4,
        name: "French Fries",
        price: 50,
        emoji: "🍟"
    },
    {
        id: 5,
        name: "Cold Coffee",
        price: 50,
        emoji: "☕"
    },
    {
        id: 6,
        name: "Masala Maggi",
        price: 50,
        emoji: "🍜"
    }
];


// ==================== HOME ROUTE ====================

app.get("/", (req, res) => {

    res.send("FoodEase Backend is running!");

});


// ==================== FOOD API ====================

app.get("/api/foods", async (req, res) => {

    try {

        const foods =
            await foodsCollection
                .find({})
                .sort({ id: 1 })
                .toArray();

        res.json(foods);

    } catch (error) {

        console.error(
            "Get Foods Error:",
            error
        );

        res.status(500).json({
            message: "Unable to fetch foods"
        });
    }

});


// ==================== ORDER APIs ====================


// Create new order
app.post("/api/orders", async (req, res) => {

    // ==================== CHECK ORDERING TIME ====================

    const now = new Date();

    const currentMinutes =
        now.getHours() * 60 + now.getMinutes();

    const startTime = 8 * 60;      // 8:00 AM
    const endTime = 18 * 60;       // 6:00 PM


    if (
        currentMinutes < startTime ||
        currentMinutes > endTime
    ) {

        return res.status(400).json({

            message:
                "Ordering is available only from 8 AM to 6 PM."

        });

    }


    // ==================== CREATE ORDER ====================

    try {

        const lastOrder =
            await ordersCollection
                .find({})
                .sort({ id: -1 })
                .limit(1)
                .toArray();


        const nextOrderId =
            lastOrder.length > 0
                ? lastOrder[0].id + 1
                : 1;


        const newOrder = {

            id: nextOrderId,

            userName: req.body.userName,

            items: req.body.items,

            total: req.body.total,

            status: "Pending",

            date: new Date().toLocaleString()

        };


        await ordersCollection.insertOne(newOrder);


        res.status(201).json({

            message:
                "Order placed successfully",

            order: newOrder

        });


    } catch (error) {

        console.error(
            "Create Order Error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to place order"

        });

    }

});


// ==================== GET ALL ORDERS ====================

app.get("/api/orders", async (req, res) => {

    try {

        const orders =
            await ordersCollection
                .find({})
                .sort({ id: 1 })
                .toArray();


        res.json(orders);


    } catch (error) {

        console.error(
            "Get Orders Error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to fetch orders"

        });

    }

});


// ==================== MARK ORDER COMPLETED ====================

app.put("/api/orders/:id", async (req, res) => {

    try {

        const orderId = Number(req.params.id);

        const result = await ordersCollection.deleteOne({
            id: orderId
        });

        if (result.deletedCount === 0) {

            return res.status(404).json({
                message: "Order not found"
            });

        }

        res.json({
            message: "Order completed and removed successfully"
        });

    } catch (error) {

        console.error(
            "Complete Order Error:",
            error
        );

        res.status(500).json({
            message: "Unable to complete order"
        });
    }
});


// ==================== CLEAR ALL ORDERS ====================

app.delete("/api/orders", async (req, res) => {

    try {

        await ordersCollection.deleteMany({});


        res.json({

            message:
                "All orders cleared"

        });


    } catch (error) {

        console.error(
            "Clear Orders Error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to clear orders"

        });

    }

});


// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;


async function startServer() {

    await connectDatabase();


    app.listen(PORT, () => {

        console.log(
            `FoodEase server running on http://localhost:${PORT}`
        );

    });

}


startServer();