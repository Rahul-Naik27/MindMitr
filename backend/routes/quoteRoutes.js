// routes/quoteRoutes.js
const express = require('express');
const router = express.Router();

const quotes = [
    "Small steps every day lead to big results.",
    "Discipline beats motivation.",
    "Stay consistent, even on your bad days.",
    "Your habits define your future.",
    "Success is the sum of small efforts repeated daily."
];

router.get('/random', (req, res) => {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ quote: q });
});

module.exports = router;