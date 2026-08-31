const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'data.json');

// Default initial data
const initialData = {
    users: [],
    blogs: [
        {
            id: "1",
            title: "Getting Started with Web Development in 2025",
            category: "technology",
            tags: "webdev, html, css",
            content: "Learn the essential tools and technologies you need to start your journey as a web developer. From HTML basics to modern frameworks.",
            author: "Aman Sharma",
            authorInitials: "AS",
            date: "Aug 25, 2025",
            views: 842,
            status: "published",
            userId: "user_default"
        },
        {
            id: "2",
            title: "UI/UX Design Principles Every Developer Should Know",
            category: "design",
            tags: "ui, ux, design",
            content: "Understanding design principles can make you a better developer. Explore the key concepts that drive great user experiences.",
            author: "Priya Kapoor",
            authorInitials: "PK",
            date: "Aug 22, 2025",
            views: 654,
            status: "published",
            userId: "user_default"
        },
        {
            id: "3",
            title: "Balancing Code and Life: A Developer's Guide",
            category: "lifestyle",
            tags: "life, coding, balance",
            content: "Tips and strategies for maintaining a healthy work-life balance while pursuing your passion in software development.",
            author: "Rohit Verma",
            authorInitials: "RV",
            date: "Aug 20, 2025",
            views: 521,
            status: "published",
            userId: "user_default"
        }
    ]
};

// Initialize file if not exists
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
}

function readData() {
    try {
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (err) {
        return initialData;
    }
}

function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
    readData,
    writeData
};
