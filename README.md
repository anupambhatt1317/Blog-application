# BlogSpace — Full Stack Blog Application 📝

A complete full-stack Blog Application built with **HTML5, CSS3, JavaScript (Frontend)**, **Node.js, Express.js (Backend)**, and **MongoDB (Database)**.

- **Module 1**: Responsive Frontend UI (Home, Login, Register, Dashboard, Create Blog)
- **Module 2**: Backend REST APIs (Express.js, User Authentication, Post CRUD APIs)
- **Module 3**: Database Integration (MongoDB, Mongoose Models, Secure Credentials, Dynamic Single Blog Details Page)
- **Module 4**: Complete CRUD Operations & Search Filters (Create, Read, Update, Delete, Real-time Search, and Category Filtering)

---

## 🚀 Live Pages & Features

- **Home (`index.html`)** — Dynamic blog cards fetched from Database with **Real-time Live Search Bar** and **Instant Category Filter Tabs** (Technology, Design, Lifestyle, Travel, Business).
- **Article Details (`blog-details.html`)** — Dynamic single blog view with category banner, reading time, view count, tags, author bio, and share actions.
- **Create & Edit Blog (`create-blog.html`)** — Dual-mode blog form supporting both **Post Publishing** (`POST /api/blogs`) and **Post Editing/Updating** (`PUT /api/blogs/:id`).
- **Dashboard (`dashboard.html`)** — User statistics, live user posts, single-click edit navigation, and RESTful post deletion (`DELETE /api/blogs/:id`).
- **Authentication (`login.html` & `register.html`)** — Secure account registration with `bcryptjs` password hashing and JWT token authorization.

---

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic Markup & Structure
- **CSS3**: Flexbox, CSS Grid, Custom CSS Variables, Responsive Animations, Glassmorphism Cards
- **JavaScript (ES6+)**: Vanilla Fetch API, Dynamic DOM Manipulation, Live Search Debouncing
- **Icons**: Font Awesome 6

### Backend & Database (Module 2, 3 & 4)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: `bcryptjs` (Password Hashing), `jsonwebtoken` (JWT Authentication)
- **Configuration**: `dotenv` (.env management)
- **Middleware**: `cors`, `express.json()`, `express.urlencoded()`

---

## 📡 REST API Endpoints (CRUD)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register` | Register new user with encrypted password in MongoDB |
| `POST` | `/api/login` | Authenticate user & return JWT token |
| `GET` | `/api/blogs` | Retrieve all blogs (Supports `?search=` and `?category=`) |
| `GET` | `/api/blogs/:id` | Retrieve single blog post details & increment view count |
| `POST` | `/api/blogs` | **Create (C)**: Create and publish a new blog post |
| `PUT` | `/api/blogs/:id` | **Update (U)**: Edit/Update an existing blog post |
| `DELETE` | `/api/blogs/:id` | **Delete (D)**: Delete blog post from database by ID |
| `GET` | `/api/blogs/user/:userId` | Retrieve user-specific blog posts for dashboard |
| `GET` | `/api/health` | Backend server health check |

---

## 🏃 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (.env)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/blogapp
JWT_SECRET=your_jwt_secret_key_2025
```

### 3. Start the Server
```bash
npm start
```
The server will run at: `http://localhost:5000`

### 4. Open in Browser
Visit `http://localhost:5000/` or open `index.html` in your browser.

---

## 👤 Author

**Anupam Bhatt**

---

⭐ Star this repository if you found it helpful!
