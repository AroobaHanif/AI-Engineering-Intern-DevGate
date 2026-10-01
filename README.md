````
# AI Engineering Intern @ DevGate

This repository contains all weekly tasks and projects completed during the AI Engineering internship at DevGate.

## Repository Structure

```
AI-Engineering-Intern-DevGate/
├── Week1/
│   └── Lumina Project
├── Week2/
│   ├── Momentumate
│   └── Pageturn-Ecommerce
├── Week3/
│   └── MailMind
├── Week4+5+6/
│   ├── AI-Chat-App/
│   └── AI-Chat-Frontend/
└── README.md
````

---

## Week 1 — HTML, CSS & JavaScript Fundamentals

**Project:** Lumina — Responsive Landing Page + Weather App

### Features

* Responsive landing page
* Live weather lookup using Open-Meteo API
* Plain CSS and Bootstrap versions
* Interactive DOM manipulation

### Tech Stack

* HTML5
* CSS3
* JavaScript ES6+
* Bootstrap 5
* Open-Meteo Weather API

### Topics Covered

* Semantic HTML & Forms
* CSS Box Model, Flexbox, Grid
* Responsive Web Design
* JavaScript Fundamentals
* DOM Manipulation & Events
* ES6+ Features
* Async/Await & Fetch API
* API Integration

---

## Week 2 — React + Node.js Full-Stack Development

### 1. Momentumate — Task & Course Progress Tracker

### Features

* Multi-page application
* JWT authentication
* Signup and Login
* Password hashing with bcrypt
* CRUD operations for tasks and courses
* Per-user progress tracking
* Progress charts using Recharts
* File uploads using Multer
* Protected routes

### Tech Stack

* **Frontend:** React, React Router, Axios, Recharts
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT, bcrypt
* **File Upload:** Multer

---

### 2. Pageturn — Role-Based Book E-Commerce Platform

### Features

* Book browsing by genre
* Favorites
* Shopping cart
* Checkout
* Order history
* Product CRUD for admins
* Admin dashboard
* Role-based access control
* JWT authentication
* Real book cover images

### Tech Stack

* **Frontend:** React, Redux Toolkit, React Router, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT, bcrypt
* **API:** Open Library Covers API
* **State Management:** Redux Toolkit

### Topics Covered

* React Components, Props & Hooks
* React Router
* Axios
* REST APIs
* Node.js & Express
* MongoDB & Mongoose
* JWT Authentication
* Role-Based Access Control
* Redux Toolkit
* Environment Variables
* File Uploads
* Git & GitHub

---

## Week 3 — MailMind

**Project:** AI-Powered Email Template Generator

### Features

* AI-powered email generation
* Personalized email templates
* Real-time preview
* Responsive UI
* Copy and save templates

### Tech Stack

* **Frontend:** React + Vite, Redux Toolkit, Axios
* **Backend:** Node.js + Express

### Topics Covered

* React with Vite
* Redux Toolkit
* Async Thunks
* Node.js/Express REST APIs
* CORS Configuration
* Environment Variables
* Full-Stack Application Architecture
* Git Workflows

---

# Week 4 + 5 + 6 — AI Chat Application

**Project:** AI Chat App with Streaming, Tool Calling & Persistent Memory

This project is a full-stack AI chatbot application built with a Node.js/Express backend and React frontend.

### Features

* AI-powered chat
* Real-time streaming responses
* Conversation history
* Persistent conversations
* MongoDB-based memory
* Tool/function calling
* Calculator tool integration
* User preferences
* Server-Sent Events (SSE)
* Error handling
* Retry logic
* Rate limiting
* Responsive chat interface
* Conversation sidebar
* Rename conversations
* New conversation creation
* Persistent chat history

### Tech Stack

**Frontend:**

* React
* Vite
* JavaScript
* CSS

**Backend:**

* Node.js
* Express.js

**Database:**

* MongoDB
* Mongoose

**AI Integration:**

* Chat Completion API
* Streaming Responses
* Tool Calling
* JSON Schema

### Project Structure

```text
Week4+5+6/
├── AI-Chat-App/
│   ├── models/
│   │   ├── Conversation.js
│   │   └── UserPreferences.js
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
└── AI-Chat-Frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    ├── eslint.config.js
    ├── vite.config.js
    ├── index.html
    └── README.md
```

### AI Chat Features

#### Streaming Responses

The backend sends AI-generated text progressively using Server-Sent Events (SSE), allowing the frontend to display the response as it is generated instead of waiting for the complete response.

#### Conversation History

Conversations are stored in MongoDB so previous chats can be loaded and continued later.

#### Tool Calling

The AI can select an available tool when required. For example, a calculation request can be handled through the calculator tool.

#### Persistent Memory

User preferences and relevant conversation information can be stored and re-used in future conversations.

#### Error Handling & Retry Logic

The backend handles API errors and can retry requests when appropriate.

#### Rate Limiting

Requests are limited to help prevent excessive API usage and protect the backend.

### Topics Covered

* API Keys & Environment Variables
* Chat Completion APIs
* SDK Integration
* Streaming Responses
* Server-Sent Events (SSE)
* Conversation History
* MongoDB & Mongoose
* Persistent Memory
* Tool Calling
* JSON Schema
* Function Calling
* Error Handling
* Retry Logic
* Rate Limiting
* React State Management
* Frontend SSE Parsing
* Full-Stack AI Application Architecture
* Git & GitHub Workflows

---


## Author

**Arooba Hanif**
AI Engineering Intern @ DevGate

[GitHub](https://github.com/AroobaHanif)

---

**Last Updated:** October 2026

```
```
