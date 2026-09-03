# AI Engineering Intern @ DevGate

This repository contains all weekly tasks and projects completed during the AI Engineering internship at DevGate.

## Repository Structure

```
AI-Engineering-Intern-DevGate/
├── Week1/
│   └── Lumina Project (Landing page + Weather app)
├── Week2/
│   ├── Momentumate (Task & Course Progress Tracker)
│   └── Pageturn-Ecommerce (Role-Based Book E-Commerce)
├── Week3/
│   └── MailMind (AI-Powered Email Template Generator)
└── README.md
```

---

## Week 1 — HTML, CSS & JavaScript Fundamentals

**Project:** Lumina — Responsive Landing Page + Weather App

### Features
- Responsive landing page with modern UI design
- Live weather lookup using Open-Meteo API
- Plain CSS and Bootstrap versions
- Interactive DOM manipulation

### Tech Stack
- HTML5 (Semantic HTML, Forms)
- CSS3 (Flexbox, CSS Grid, Responsive Design)
- JavaScript (ES6+, DOM Manipulation, Events)
- Bootstrap 5
- Open-Meteo Weather API

### Project Structure
```
Week1/
├── index.html              # Landing page (plain CSS)
├── lumina.html             # Landing page (Bootstrap version)
├── weather.html            # Weather app
├── style.css               # Custom styles
└── script.js               # JavaScript functionality
```

### Topics Covered
- Semantic HTML & Forms
- CSS Box Model, Flexbox, Grid
- Responsive Web Design
- JavaScript Fundamentals (Variables, Functions, Loops)
- DOM Manipulation & Events
- ES6+ Features (Destructuring, Arrow Functions)
- Async/Await & Fetch API
- API Integration

---

## Week 2 — React + Node.js Full-Stack Development

### 1️⃣ Momentumate — Task & Course Progress Tracker

### Features
- Multi-page app (Login, Signup, Dashboard, Task Detail)
- JWT-authenticated signup/login with bcrypt password hashing
- Full CRUD for tasks/courses
- Per-user progress tracking on shared items
- Live progress chart using Recharts
- File uploads via Multer
- Protected routes with custom auth middleware

### Tech Stack
- **Frontend:** React, React Router, Axios, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT, bcrypt
- **File Upload:** Multer

### Project Structure
```
Week2/Momentumate/
├── server.js               # Backend server
├── seed.js                 # Database seeder
├── .env                    # Environment variables
├── .gitignore
├── package.json
├── models/                 # Mongoose models
├── middleware/             # Auth middleware
├── uploads/                # Uploaded files
└── Week2-frontend/         # Frontend
    ├── src/
    │   ├── App.jsx
    │   ├── pages/
    │   └── components/
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

### 2️⃣ Pageturn — Role-Based Book E-Commerce Platform

### Features

**Admin Features:**
- Full product (book) CRUD operations
- Live dashboard with stats (total users, completed orders)
- Admin-only route protection

**User Features:**
- Browse books by genre
- Add/remove favorites
- Shopping cart (add/remove/adjust quantity)
- Checkout functionality
- View order history

**Common Features:**
- Role-based access control (JWT token carries user role)
- Real book cover images via Open Library Covers API
- Global state management with Redux Toolkit
- Auto-incrementing order numbers

### Tech Stack
- **Frontend:** React, Redux Toolkit, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcrypt (role-based)
- **API Integration:** Open Library Covers API
- **State Management:** Redux Toolkit (async thunks)

### Project Structure
```
Week2/Pageturn-Ecommerce/
├── Week2-Ecommerce/        # Backend
│   ├── server.js
│   ├── seed.js
│   ├── makeAdmin.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   └── middleware/
│       └── auth.js
└── week2-ecommerce-fr/     # Frontend
    ├── src/
    │   ├── App.jsx
    │   ├── features/
    │   │   ├── authSlice.js
    │   │   ├── cartSlice.js
    │   │   └── productSlice.js
    │   └── pages/
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── index.html
```

### Topics Covered
- React Components, Props, Hooks
- React Router for Multi-page Apps
- Axios for API Communication
- Node.js/Express Routing & Middleware
- REST API Development
- MongoDB & Mongoose (Schemas, Models, Queries)
- JWT Authentication & Authorization
- Role-Based Access Control
- Redux Toolkit (Slices, Store, Async Thunks)
- Environment Variables
- File Uploads with Multer
- Git & GitHub Workflows

---

## Week 3 — MailMind: AI-Powered Email Template Generator 

**AI-driven personalized email template generator**

### Features
- AI-powered email generation
- Personalized templates based on user prompts
- Real-time preview
- Modern, responsive UI
- Copy & save templates

### Tech Stack
**Frontend:** React + Vite, Redux Toolkit, Axios  
**Backend:** Node.js + Express

### Project Structure
```
Week3/
├── AI-Email-Generator/              # Backend
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
└── AI-Email-Generator-Frontend/     # Frontend
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── features/
    │   │   └── emailSlice.js
    │   ├── app/
    │   │   └── store.js
    │   └── assets/
    ├── public/
    ├── package.json
    ├── vite.config.js
    └── index.html
```

### Topics Covered
- React with Vite
- Redux Toolkit (Slices, Store, Async Thunks)
- Node.js/Express REST APIs
- CORS Configuration
- Environment Variables
- Full-Stack Application Architecture
- Git Workflows & Version Control

---

## Weekly Summary

| Week | Project | Technologies |
|------|---------|--------------|
| 1 | Lumina | HTML, CSS, JavaScript, Bootstrap |
| 2 | Momentumate | React, Node.js, Express, MongoDB, JWT, Redux |
| 2 | Pageturn | React, Node.js, Express, MongoDB, JWT, Redux |
| 3 | MailMind | React (Vite), Redux Toolkit, Node.js, Express |

---

## Author

**Arooba Hanif**  
AI Engineering Intern @ DevGate

[GitHub](https://github.com/AroobaHanif)

---

**Last Updated:** September 2026
```
