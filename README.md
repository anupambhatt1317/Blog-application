# BlogSpace — Full Stack Blog Application 📝

A complete full-stack Blog Application built with **HTML5, CSS3, JavaScript (Frontend)**, **Node.js, Express.js (Backend)**, and **MongoDB (Database)**.

- **Module 1**: Responsive Frontend UI (Home, Login, Register, Dashboard, Create Blog)
- **Module 2**: Backend REST APIs (Express.js, User Authentication, Post CRUD APIs)
- **Module 3**: Database Integration (MongoDB, Mongoose Models, Secure Credentials, Dynamic Single Blog Details Page)

---

## 🚀 Live Pages & Features

- **Home (`index.html`)** — Dynamic blog cards fetched from MongoDB / REST API with direct link to individual articles.
- **Article Details (`blog-details.html`)** — Dynamic single blog view with category banner, reading time, view count, tags, author bio, and share actions.
- **Login (`login.html`)** — User authentication via `POST /api/login` with JWT tokens.
- **Register (`register.html`)** — Account creation via `POST /api/register` with `bcryptjs` password hashing into MongoDB.
- **Dashboard (`dashboard.html`)** — User stats, live user posts, quick view, and RESTful post deletion.
- **Create Blog (`create-blog.html`)** — Post creation connected to `POST /api/blogs` stored in MongoDB.

---

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic Markup & Accessibility
- **CSS3**: Flexbox, CSS Grid, Custom CSS Variables, Responsive Animations
- **JavaScript (ES6+)**: Vanilla Fetch API, Dynamic DOM Manipulation
- **Icons**: Font Awesome 6

### Backend & Database (Module 2 & 3)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: `bcryptjs` (Password Hashing), `jsonwebtoken` (JWT Authentication)
- **Configuration**: `dotenv` (.env management)
- **Middleware**: `cors`, `express.json()`, `express.urlencoded()`

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register` | Register new user with encrypted password in MongoDB |
| `POST` | `/api/login` | Authenticate user & return JWT token |
| `GET` | `/api/blogs` | Retrieve all blog posts for the home feed |
| `GET` | `/api/blogs/:id` | Retrieve single blog post details & increment view count |
| `POST` | `/api/blogs` | Create a new blog post in database |
| `GET` | `/api/blogs/user/:userId` | Retrieve user-specific blog posts for dashboard |
| `DELETE` | `/api/blogs/:id` | Delete blog post from database by ID |
| `GET` | `/api/health` | Backend server health check |

---

## 🏃 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (.env)
Create a `.env` file in the root directory (or use default):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/blogapp
JWT_SECRET=your_jwt_secret_key_2025
```
*(You can also use your MongoDB Atlas connection string)*

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
