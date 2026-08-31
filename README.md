# BlogSpace — Full Stack Blog Application 📝

A full-stack Blog Application built with **HTML, CSS, JavaScript (Frontend)** and **Node.js, Express.js (Backend)**.

- **Module 1**: Responsive Frontend UI (Home, Login, Register, Dashboard, Create Blog)
- **Module 2**: Backend REST APIs (Express.js, User Registration, Login, Create Blog, Fetch & Delete APIs)

---

## 🚀 Live Pages & Features

- **Home (`index.html`)** — Dynamic blog cards fetched from Node.js Express REST API
- **Login (`login.html`)** — User authentication via `POST /api/login` with JWT tokens
- **Register (`register.html`)** — Account creation via `POST /api/register` with `bcryptjs` password hashing
- **Dashboard (`dashboard.html`)** — User stats, live user posts, and RESTful post deletion
- **Create Blog (`create-blog.html`)** — Post creation connected to `POST /api/blogs`

---

## 🛠️ Tech Stack

### Frontend
- HTML5 (Semantic Markup)
- CSS3 (Flexbox, Grid, CSS Variables, Animations)
- JavaScript (Vanilla Fetch API)
- Font Awesome 6 Icons

### Backend (Module 2)
- **Runtime**: Node.js
- **Framework**: Express.js
- **REST APIs**: User Reg, Login, Get/Create/Delete Blogs
- **Security**: `bcryptjs` (Password Hashing), `jsonwebtoken` (JWT Authentication)
- **Middleware**: `cors`, `express.json()`

---

## 🏃 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend Server
```bash
npm start
```
The backend server will run at: `http://localhost:5000`

### 3. Open Frontend
Open `index.html` in your web browser or visit `http://localhost:5000/`.

---

## 👤 Author

**Anupam Bhatt**

---

⭐ Star this repository if you found it helpful!
