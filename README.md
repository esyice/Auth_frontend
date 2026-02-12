# 🔐 Auth Frontend

A **reusable, production-oriented authentication frontend** built with React and Vite.  
Designed to work with a centralized authentication backend and power multiple applications.

This is not a tutorial project. This is meant to be reused.

---

## 📌 Purpose

Most projects rebuild login and signup screens again and again.  
This frontend exists to **standardize authentication UI** across all future projects while keeping backend logic decoupled.

If your backend changes, this frontend doesn’t need a rewrite.

---

## 🚀 Features

- User Registration
- User Login
- Token-based authentication ready
- Backend-agnostic API integration
- Fast dev & build using Vite
- Clean, minimal structure (no UI framework bloat)

---

## 🧠 Tech Stack

### Frontend
- React
- JavaScript (ES6+)

### Tooling
- Vite
- ESLint
- npm

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:8000/api/v1
```

This must point to a **working authentication backend**.

---

## 🏁 Getting Started

### Clone the repository

```bash
git clone https://github.com/esyice/Auth_frontend.git
cd Auth_frontend
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open:
```
http://localhost:5173
```

---

## 📁 Project Structure

```
src/
├── components/
├── pages/
├── services/
├── context/
├── App.jsx
└── main.jsx
```

---

## 🔐 Authentication Flow

1. User submits login or registration form  
2. Frontend sends request to backend API  
3. Backend responds with token / session  
4. Auth state stored globally  
5. Protected routes depend on auth state  

---

## 🏗️ Production Build

```bash
npm run build
```

Output:
```
dist/
```

---

## ❌ What This Project Is NOT

- Not a backend auth system
- Not OAuth-ready (yet)
- Not a UI library

---

## 📄 License

MIT License

---

## ⭐ Final Note

This project is meant to power real applications.
