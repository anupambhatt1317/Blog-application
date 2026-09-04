const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { isDbConnected } = require('../config/db');
const { readData, writeData } = require('../dataStore');

const JWT_SECRET = process.env.JWT_SECRET || 'blog_app_secret_key_2025';

// POST /api/register - User Registration (MongoDB / Store)
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (isDbConnected()) {
            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'User with this email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                fullName: fullName.trim(),
                email: normalizedEmail,
                password: hashedPassword
            });

            return res.status(201).json({
                success: true,
                message: 'User registered successfully in MongoDB!',
                userId: newUser._id
            });
        } else {
            // Resilient fallback
            const db = readData();
            const existingUser = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

            if (existingUser) {
                return res.status(400).json({ success: false, message: 'User with this email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                id: 'user_' + Date.now(),
                fullName: fullName.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            };

            db.users.push(newUser);
            writeData(db);

            return res.status(201).json({
                success: true,
                message: 'User registered successfully!'
            });
        }
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ success: false, message: 'Server error during registration', error: err.message });
    }
});

// POST /api/login - User Login (MongoDB / Store)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        let user = null;

        if (isDbConnected()) {
            user = await User.findOne({ email: normalizedEmail });
        } else {
            const db = readData();
            user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
        }

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const userId = user._id ? user._id.toString() : user.id;

        const token = jwt.sign(
            { id: userId, fullName: user.fullName, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: userId,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: 'Server error during login', error: err.message });
    }
});

// GET /api/me - Get Current Authenticated User Profile (Module 5)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        if (isDbConnected()) {
            const user = await User.findById(userId).select('-password');
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            return res.json({
                success: true,
                user: {
                    id: user._id.toString(),
                    fullName: user.fullName,
                    email: user.email,
                    createdAt: user.createdAt
                }
            });
        } else {
            const db = readData();
            const user = db.users.find(u => u.id === userId || u._id === userId);
            if (!user) {
                return res.json({
                    success: true,
                    user: {
                        id: req.user.id,
                        fullName: req.user.fullName,
                        email: req.user.email
                    }
                });
            }
            return res.json({
                success: true,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    createdAt: user.createdAt
                }
            });
        }
    } catch (err) {
        console.error('Get Profile Error:', err);
        res.status(500).json({ success: false, message: 'Error retrieving user profile' });
    }
});

module.exports = router;
