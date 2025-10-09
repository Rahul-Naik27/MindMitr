// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'daily_dost_secret';

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    try {
        const existing = await getUserByEmail(email);
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const userId = await createUser(name, email, hashed, role === 'admin' ? 'admin' : 'user');

        // return token (optional)
        const token = jwt.sign({ id: userId, email, role: role === 'admin' ? 'admin' : 'user' }, SECRET, { expiresIn: '7d' });
        res.status(201).json({ message: 'User created', userId, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Provide email and password' });

    try {
        const user = await getUserByEmail(email);
        if (!user) return res.status(400).json({ message: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '7d' });
        res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;