const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../dataStore');

// GET /api/blogs - Get all blogs (for Home page)
router.get('/', (req, res) => {
    try {
        const db = readData();
        res.json({
            success: true,
            blogs: db.blogs
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
    }
});

// POST /api/blogs - Create a new blog post
router.post('/', (req, res) => {
    try {
        const { title, category, tags, content, status, author, userId } = req.body;

        if (!title || !category || !content) {
            return res.status(400).json({ success: false, message: 'Title, category, and content are required' });
        }

        const db = readData();

        const getInitials = (name) => {
            if (!name) return "U";
            const parts = name.trim().split(" ");
            if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
            return parts[0].substring(0, 2).toUpperCase();
        };

        const newBlog = {
            id: 'blog_' + Date.now(),
            title,
            category,
            tags: tags || '',
            content,
            author: author || 'Anonymous User',
            authorInitials: getInitials(author || 'Anonymous User'),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            views: 0,
            status: status || 'published',
            userId: userId || 'user_default',
            createdAt: new Date().toISOString()
        };

        db.blogs.unshift(newBlog);
        writeData(db);

        res.status(201).json({
            success: true,
            message: 'Blog post created successfully!',
            blog: newBlog
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error while creating blog post', error: err.message });
    }
});

// GET /api/blogs/user/:userId - Get blogs by user (for Dashboard)
router.get('/user/:userId', (req, res) => {
    try {
        const db = readData();
        const userBlogs = db.blogs.filter(b => b.userId === req.params.userId || req.params.userId === 'all');
        res.json({
            success: true,
            blogs: userBlogs.length > 0 ? userBlogs : db.blogs
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch user blogs' });
    }
});

// DELETE /api/blogs/:id - Delete a blog post
router.delete('/:id', (req, res) => {
    try {
        const db = readData();
        const initialLength = db.blogs.length;
        db.blogs = db.blogs.filter(b => b.id !== req.params.id);

        if (db.blogs.length === initialLength) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        writeData(db);
        res.json({ success: true, message: 'Blog post deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete blog post' });
    }
});

module.exports = router;
