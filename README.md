# BlogSpace — Full Stack Blog Application 📝🚀

[![Node.js](https://img.shields.io/badge/Node.js-18.x+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](LICENSE)

A production-grade, full-stack **Blog Application** built with **HTML5, CSS3, Vanilla JavaScript (ES6+)**, **Node.js, Express.js REST APIs**, and **MongoDB with Mongoose**.

Built as part of the **Codomax Web Development Internship (Modules 1 through 6)**.

---

## 📑 Curriculum & Module Overview

- **Module 1**: Responsive Frontend UI (Home Feed, Login, Register, Dashboard, and Create Blog interfaces)
- **Module 2**: Backend REST APIs (Express server, User Auth, Post CRUD APIs, and data persistence)
- **Module 3**: Database Integration (MongoDB, Mongoose schemas, secure credential hashing, and individual article details page)
- **Module 4**: Full CRUD Operations & Search/Filters (Update API, interactive Edit mode, Real-time debounced Search, and Category tabs)
- **Module 5**: Authentication & Author Dashboard (JWT Auth middleware, Route protection guards, user-specific dashboard articles, profile sync, and session management)
- **Module 6**: Final Project & Deployment (UI polish, mobile responsiveness, Vercel/Render deployment configuration, and production documentation)

---

## 🌟 Key Features & Live Pages

### 1. 🏠 Home Feed (`index.html`)
- Dynamic article cards fetched in real-time from the database.
- **Live Search Bar**: Instant debounced search matching titles, content, tags, and authors.
- **Category Filter Tabs**: One-click filtering across Technology, Design, Lifestyle, Travel, and Business.
- Smooth CSS animations, card hover effects, and responsive navigation bar.

### 2. 📖 Individual Article Details (`blog-details.html`)
- Dedicated single blog reading page with category banner gradient and icons.
- Real-time **Views Counter** and **Estimated Reading Time** calculation.
- Author profile meta bar, publication date, and tag pills.
- Social sharing triggers (Twitter, LinkedIn, Facebook).

### 3. ✍️ Create & Edit Blog Post (`create-blog.html`)
- Protected route accessible only to authenticated users.
- **Dual-mode form**: Supports both publishing new articles and pre-filling existing content in **Edit Mode** (`?edit=<id>`).
- Live character and word counters.

### 4. 📊 Author Dashboard (`dashboard.html`)
- Protected private route showcasing **only the logged-in user's own articles**.
- Dynamic personal statistics cards: Total Posts, Published Count, Drafts, and Cumulative Views.
- Actions: **View Article**, **Edit Post**, and **Delete Post** with real-time DOM update.
- Intuitive empty-state screen for new authors with a call-to-action to write their first post.

### 5. 🔐 Authentication (`login.html` & `register.html`)
- Secure password hashing with `bcryptjs` (salt rounds = 10).
- Session token generation with `jsonwebtoken` (JWT).
- Client-side and server-side input validation with interactive password strength indicators.

---

## 🛠️ Technology Stack

| Domain | Technologies Used |
|---|---|
| **Frontend** | HTML5 Semantic Markup, CSS3 (Flexbox, CSS Grid, Custom Variables), Vanilla JavaScript (ES6+ Fetch API, DOM manipulation) |
| **Backend** | Node.js Runtime, Express.js Web Framework, CORS, Body Parsers |
| **Database** | MongoDB, Mongoose ODM (Schemas & Validation) |
| **Security** | `bcryptjs` (Password Encryption), `jsonwebtoken` (JWT Authentication & Middleware) |
| **Deployment** | Vercel Serverless / Render Cloud Hosting, `dotenv` configuration |
| **Tools** | Git, GitHub, VS Code, Postman, Font Awesome 6, Google Fonts |

---

## 📡 REST API Documentation

| HTTP Method | API Endpoint | Description | Auth Protected |
|---|---|---|:---:|
| `POST` | `/api/register` | Register a new user with hashed password in MongoDB | No |
| `POST` | `/api/login` | Authenticate user credentials and return JWT token | No |
| `GET` | `/api/me` | Fetch authenticated user profile details | **Yes (JWT)** |
| `GET` | `/api/blogs` | Retrieve all blogs (Supports `?search=` and `?category=`) | No |
| `GET` | `/api/blogs/:id` | Retrieve single blog post details and increment view count | No |
| `POST` | `/api/blogs` | **Create**: Publish a new blog post | **Yes (JWT)** |
| `PUT` | `/api/blogs/:id` | **Update**: Edit/Update an existing blog post | **Yes (JWT)** |
| `DELETE` | `/api/blogs/:id` | **Delete**: Delete a blog post by ID | **Yes (JWT)** |
| `GET` | `/api/blogs/user/:userId` | Retrieve user-specific blog posts for author dashboard | **Yes (JWT)** |
| `GET` | `/api/health` | Backend server health check | No |

---

## 🏃 How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/anupambhatt1317/Blog-application.git
cd Blog-application
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/blogapp
JWT_SECRET=your_jwt_secret_key_2025
NODE_ENV=development
```
*(You can also use your free MongoDB Atlas cloud URI)*

### 4. Start the Application
```bash
npm start
```
The server will be running at: `http://localhost:5000`

---

## 🌐 Live Deployment Guide (Render & Vercel)

### Option A: Deploy on Render (Recommended for Full-Stack Node.js)
1. Go to [Render.com](https://render.com) and create a free account.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `anupambhatt1317/Blog-application`.
4. Fill in settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your secret key
6. Click **Deploy Web Service**. You will get your live website URL (e.g., `https://blog-application-xxxx.onrender.com`).

### Option B: Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com) and import this repository.
2. Vercel will automatically detect `vercel.json`.
3. Add environment variables in project settings and click **Deploy**.

---

## 👤 Author

**Anupam Bhatt**
- **GitHub**: [@anupambhatt1317](https://github.com/anupambhatt1317)
- **LinkedIn**: [Anupam Bhatt](https://linkedin.com)

---

⭐ **Star this repository** if you found it helpful!
