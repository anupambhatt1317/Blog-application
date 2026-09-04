const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const { isDbConnected } = require('../config/db');
const { readData, writeData } = require('../dataStore');

// Helper to get initials
const getInitials = (name) => {
    if (!name) return "AU";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
};

// GET /api/blogs - Get all blogs with optional search and category filter
router.get('/', async (req, res) => {
    try {
        const { search, category } = req.query;

        if (isDbConnected()) {
            let filter = {};
            if (category && category.toLowerCase() !== 'all') {
                filter.category = new RegExp(`^${category}$`, 'i');
            }
            if (search && search.trim()) {
                const searchRegex = new RegExp(search.trim(), 'i');
                filter.$or = [
                    { title: searchRegex },
                    { content: searchRegex },
                    { tags: searchRegex },
                    { author: searchRegex }
                ];
            }

            const blogs = await Blog.find(filter).sort({ createdAt: -1 });
            const formattedBlogs = blogs.map(b => ({
                id: b._id.toString(),
                _id: b._id.toString(),
                title: b.title,
                category: b.category,
                tags: b.tags,
                content: b.content,
                author: b.author,
                authorInitials: b.authorInitials,
                date: b.date,
                views: b.views,
                status: b.status,
                userId: b.userId,
                createdAt: b.createdAt
            }));

            return res.json({
                success: true,
                source: 'MongoDB',
                count: formattedBlogs.length,
                blogs: formattedBlogs
            });
        } else {
            const db = readData();
            let blogs = db.blogs;

            if (category && category.toLowerCase() !== 'all') {
                blogs = blogs.filter(b => (b.category || '').toLowerCase() === category.toLowerCase());
            }

            if (search && search.trim()) {
                const q = search.toLowerCase().trim();
                blogs = blogs.filter(b => 
                    (b.title || '').toLowerCase().includes(q) ||
                    (b.content || '').toLowerCase().includes(q) ||
                    (b.tags || '').toLowerCase().includes(q) ||
                    (b.author || '').toLowerCase().includes(q)
                );
            }

            return res.json({
                success: true,
                source: 'DataStore',
                count: blogs.length,
                blogs: blogs
            });
        }
    } catch (err) {
        console.error('Fetch Blogs Error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch blogs', error: err.message });
    }
});

// GET /api/blogs/:id - Get individual blog details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
            const blog = await Blog.findByIdAndUpdate(
                id,
                { $inc: { views: 1 } },
                { new: true }
            );

            if (!blog) {
                return res.status(404).json({ success: false, message: 'Blog post not found' });
            }

            return res.json({
                success: true,
                blog: {
                    id: blog._id.toString(),
                    _id: blog._id.toString(),
                    title: blog.title,
                    category: blog.category,
                    tags: blog.tags,
                    content: blog.content,
                    author: blog.author,
                    authorInitials: blog.authorInitials,
                    date: blog.date,
                    views: blog.views,
                    status: blog.status,
                    userId: blog.userId,
                    createdAt: blog.createdAt
                }
            });
        } else {
            const db = readData();
            const blog = db.blogs.find(b => b.id === id || b._id === id);

            if (!blog) {
                return res.status(404).json({ success: false, message: 'Blog post not found' });
            }

            // Increment views
            blog.views = (blog.views || 0) + 1;
            writeData(db);

            return res.json({
                success: true,
                blog
            });
        }
    } catch (err) {
        console.error('Get Single Blog Error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch blog post', error: err.message });
    }
});

// POST /api/blogs - Create a new blog post
router.post('/', async (req, res) => {
    try {
        const { title, category, tags, content, status, author, userId } = req.body;

        if (!title || !category || !content) {
            return res.status(400).json({ success: false, message: 'Title, category, and content are required' });
        }

        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const authorName = author || 'Anonymous User';
        const initials = getInitials(authorName);

        if (isDbConnected()) {
            const newBlog = await Blog.create({
                title: title.trim(),
                category,
                tags: tags || '',
                content: content.trim(),
                author: authorName,
                authorInitials: initials,
                date: dateStr,
                views: 0,
                status: status || 'published',
                userId: userId || 'user_default'
            });

            return res.status(201).json({
                success: true,
                message: 'Blog post created successfully in MongoDB!',
                blog: {
                    id: newBlog._id.toString(),
                    _id: newBlog._id.toString(),
                    title: newBlog.title,
                    category: newBlog.category,
                    tags: newBlog.tags,
                    content: newBlog.content,
                    author: newBlog.author,
                    authorInitials: newBlog.authorInitials,
                    date: newBlog.date,
                    views: newBlog.views,
                    status: newBlog.status,
                    userId: newBlog.userId
                }
            });
        } else {
            const db = readData();
            const newBlog = {
                id: 'blog_' + Date.now(),
                title: title.trim(),
                category,
                tags: tags || '',
                content: content.trim(),
                author: authorName,
                authorInitials: initials,
                date: dateStr,
                views: 0,
                status: status || 'published',
                userId: userId || 'user_default',
                createdAt: new Date().toISOString()
            };

            db.blogs.unshift(newBlog);
            writeData(db);

            return res.status(201).json({
                success: true,
                message: 'Blog post created successfully!',
                blog: newBlog
            });
        }
    } catch (err) {
        console.error('Create Blog Error:', err);
        res.status(500).json({ success: false, message: 'Server error while creating blog post', error: err.message });
    }
});

// PUT /api/blogs/:id - Update an existing blog post (Module 4 CRUD)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, tags, content, status } = req.body;

        if (!title || !category || !content) {
            return res.status(400).json({ success: false, message: 'Title, category, and content are required' });
        }

        if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
            const updatedBlog = await Blog.findByIdAndUpdate(
                id,
                {
                    title: title.trim(),
                    category,
                    tags: tags || '',
                    content: content.trim(),
                    status: status || 'published'
                },
                { new: true }
            );

            if (!updatedBlog) {
                return res.status(404).json({ success: false, message: 'Blog post not found' });
            }

            return res.json({
                success: true,
                message: 'Blog post updated successfully in MongoDB!',
                blog: {
                    id: updatedBlog._id.toString(),
                    _id: updatedBlog._id.toString(),
                    title: updatedBlog.title,
                    category: updatedBlog.category,
                    tags: updatedBlog.tags,
                    content: updatedBlog.content,
                    author: updatedBlog.author,
                    authorInitials: updatedBlog.authorInitials,
                    date: updatedBlog.date,
                    views: updatedBlog.views,
                    status: updatedBlog.status,
                    userId: updatedBlog.userId
                }
            });
        } else {
            const db = readData();
            const index = db.blogs.findIndex(b => b.id === id || b._id === id);

            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Blog post not found' });
            }

            db.blogs[index].title = title.trim();
            db.blogs[index].category = category;
            db.blogs[index].tags = tags || '';
            db.blogs[index].content = content.trim();
            db.blogs[index].status = status || db.blogs[index].status || 'published';
            db.blogs[index].updatedAt = new Date().toISOString();

            writeData(db);

            return res.json({
                success: true,
                message: 'Blog post updated successfully!',
                blog: db.blogs[index]
            });
        }
    } catch (err) {
        console.error('Update Blog Error:', err);
        res.status(500).json({ success: false, message: 'Failed to update blog post', error: err.message });
    }
});

// GET /api/blogs/user/:userId - Get blogs by user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (isDbConnected()) {
            const query = (userId === 'all') ? {} : { userId };
            const userBlogs = await Blog.find(query).sort({ createdAt: -1 });

            return res.json({
                success: true,
                blogs: userBlogs.map(b => ({
                    id: b._id.toString(),
                    _id: b._id.toString(),
                    title: b.title,
                    category: b.category,
                    tags: b.tags,
                    content: b.content,
                    author: b.author,
                    authorInitials: b.authorInitials,
                    date: b.date,
                    views: b.views,
                    status: b.status,
                    userId: b.userId
                }))
            });
        } else {
            const db = readData();
            const userBlogs = db.blogs.filter(b => b.userId === userId || userId === 'all');
            return res.json({
                success: true,
                blogs: userBlogs.length > 0 ? userBlogs : db.blogs
            });
        }
    } catch (err) {
        console.error('Fetch User Blogs Error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch user blogs', error: err.message });
    }
});

// DELETE /api/blogs/:id - Delete a blog post
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
            const deleted = await Blog.findByIdAndDelete(id);
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Blog post not found' });
            }
            return res.json({ success: true, message: 'Blog post deleted successfully from MongoDB' });
        } else {
            const db = readData();
            const initialLength = db.blogs.length;
            db.blogs = db.blogs.filter(b => b.id !== id && b._id !== id);

            if (db.blogs.length === initialLength) {
                return res.status(404).json({ success: false, message: 'Blog post not found' });
            }

            writeData(db);
            return res.json({ success: true, message: 'Blog post deleted successfully' });
        }
    } catch (err) {
        console.error('Delete Blog Error:', err);
        res.status(500).json({ success: false, message: 'Failed to delete blog post', error: err.message });
    }
});

module.exports = router;
