const express = require('express');
const app = express();
const PORT = 3000;

// JSON request body parse karne ke liye
app.use(express.json());

// Serve static frontend files
app.use(express.static(__dirname));

// Books Data
const books = [
    { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 499 },
    { id: 2, title: "Wings of Fire", author: "A.P.J. Abdul Kalam", price: 399 },
    { id: 3, title: "Atomic Habits", author: "James Clear", price: 599 },
    { id: 4, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", price: 450 }
];

// Orders list (In-memory storage)
const orders = [];

// 1. GET API: Books fetch karna
app.get('/api/books', (req, res) => {
    res.json(books);
});

// 2. POST API: Naya order receive aur save karna
app.post('/api/orders', (req, res) => {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const newOrder = {
        orderId: "ORD-" + Date.now(),
        items,
        totalAmount,
        orderDate: new Date().toLocaleString()
    };

    orders.push(newOrder);
    console.log("📦 New Order Received:", newOrder);

    res.status(201).json({
        success: true,
        message: "Order placed successfully!",
        orderId: newOrder.orderId,
        order: newOrder
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});