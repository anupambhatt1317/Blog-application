const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readData, writeData } = require('../dataStore');

const JWT_SECRET = 'blog_app_secret_key_2025';

// POST /api/register - User Registration
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const db = readData();
        const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: 'user_' + Date.now(),
            fullName,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        writeData(db);

        res.status(201).json({
            success: true,
            message: 'User registered successfully!'
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error during registration', error: err.message });
    }
});

// POST /api/login - User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const db = readData();
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, fullName: user.fullName, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error during login', error: err.message });
    }
});

module.exports = router;
