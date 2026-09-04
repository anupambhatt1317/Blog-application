const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blogapp';
    try {
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000
        });
        isConnected = true;
        console.log(`===================================================`);
        console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);
        console.log(`===================================================`);
        return true;
    } catch (err) {
        isConnected = false;
        console.warn(`===================================================`);
        console.warn(`⚠️  MongoDB Connection Notice: ${err.message}`);
        console.warn(`💡 Tip: To connect to MongoDB Atlas, add your connection string in .env`);
        console.warn(`🚀 Server running with resilient fallback store`);
        console.warn(`===================================================`);
        return false;
    }
};

const isDbConnected = () => isConnected;

module.exports = { connectDB, isDbConnected };
