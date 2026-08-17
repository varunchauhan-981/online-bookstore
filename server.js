const express = require('express');
const app = express();
const PORT = 3000;

// Static files serve karna
app.use(express.static(__dirname));

// Books Data
const books = [
    { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 499 },
    { id: 2, title: "Wings of Fire", author: "A.P.J. Abdul Kalam", price: 399 },
    { id: 3, title: "Atomic Habits", author: "James Clear", price: 599 },
    { id: 4, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", price: 450 }
];

// Backend API Endpoint
app.get('/api/books', (req, res) => {
    res.json(books);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});