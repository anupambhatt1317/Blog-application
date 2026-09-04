const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        default: 'technology'
    },
    tags: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        required: [true, 'Blog content is required']
    },
    author: {
        type: String,
        default: 'Anonymous Writer'
    },
    authorInitials: {
        type: String,
        default: 'AW'
    },
    date: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['published', 'draft'],
        default: 'published'
    },
    userId: {
        type: String,
        default: 'user_default'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

module.exports = Blog;
