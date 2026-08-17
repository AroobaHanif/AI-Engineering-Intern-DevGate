# AI Engineering Intern @ DevGate

This repository contains all weekly tasks and projects completed during the AI Engineering internship at DevGate.

## Structure

Each week's work lives in its own folder:

├── Week1/ → Landing page + Weather app (HTML, CSS, JS fundamentals)
├── Week2/ → React + Node.js/Express full-stack apps (task manager + e-commerce)
├── Week3/ → ...


## Week 1 — HTML, CSS & JavaScript Fundamentals

**Project:** Lumina — a responsive landing page + weather app

- `index.html` / `lumina.html` — landing page (plain CSS version + Bootstrap version)
- `weather.html` — live weather lookup using the Open-Meteo API
- `style.css` — Flexbox, CSS Grid, responsive design
- `script.js` — DOM manipulation, events, async/await, Fetch API

**Topics covered:** semantic HTML, forms, CSS box model, Flexbox, Grid, responsive design, Tailwind/Bootstrap basics, JS fundamentals (variables, functions, loops), DOM & events, ES6+, destructuring, async/await, Fetch API.

## Week 2 — React + Node.js Full-Stack Development

Two full-stack applications built with React, Node.js, Express, MongoDB, and JWT authentication.

### Momentumate — Task & Course Progress Tracker

- Multi-page app (Login, Signup, Dashboard, Task Detail) built with React Router
- JWT-authenticated signup/login with bcrypt password hashing
- Full CRUD for tasks/courses, with per-user progress tracking on shared items
- Live progress chart (Recharts) showing completion by item
- Node.js + Express REST API, protected routes via custom auth middleware
- MongoDB (Mongoose) for data persistence, file uploads via Multer

### Pageturn — Role-Based Book E-Commerce Platform

- Role-based access control: separate Admin and User experiences from one auth system
- Admin: full product (book) CRUD, live dashboard stats (total users, completed orders)
- User: browse books by genre, favorites, cart (add/remove/adjust quantity), checkout
- JWT tokens carry user role; a custom `adminOnly` middleware protects admin routes at the API level
- State managed globally with Redux Toolkit (auth, cart, products) using async thunks
- Real book cover images via the Open Library Covers API
- MongoDB (Mongoose) schemas for Users, Products, and Orders with auto-incrementing order numbers

**Topics covered:** React (components, props, hooks, React Router, Axios), Node.js/Express (routing, middleware, REST APIs), MongoDB/Mongoose, JWT authentication, role-based authorization, Redux Toolkit, environment variables, file uploads, Git/GitHub, Postman.

## Author

Arooba Hanif
