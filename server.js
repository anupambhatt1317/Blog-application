require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api', authRoutes);
app.use('/api/blogs', blogRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Blog Application Backend with Database Integration is running smoothly!' });
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Blog Application Server Running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`===================================================`);
});
