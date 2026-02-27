# 🔐 Auth Frontend

A **reusable, production-oriented authentication & developer dashboard frontend** built with React and Vite.  
Designed to work with a centralized authentication backend and power multiple applications.

This is not a tutorial project. This is meant to be reused.

---

## 📌 Purpose

Most projects rebuild login, signup, and dashboard screens from scratch every time.  
This frontend exists to **standardize authentication UI and developer tooling** across all future projects while keeping backend logic fully decoupled.

If your backend changes, this frontend doesn't need a rewrite.

---

## 🚀 Features

### 🔑 Authentication
- User Registration with OTP verification
- User Login
- Password Reset via OTP flow
- JWT token stored in `localStorage`
- Auto-logout on `401 Unauthorized` responses

### 📊 Developer Dashboard
- **Overview** — Project summary and quick stats
- **API Keys** — Create, revoke, regenerate, and view usage per key
- **Users** — List, search, filter, sort, create, update, bulk-delete project users
- **Endpoints** — View backend API endpoint documentation
- **Usage** — Per-key API usage analytics
- **Settings** — Account settings, deactivate account

### 🛡️ Routing
- Public route: `/login`
- Protected routes behind a `ProtectedRoute` wrapper
- Catch-all redirect to `/`

---

## 🧠 Tech Stack

### Frontend
- **React 19** — UI library
- **React Router DOM v7** — Client-side routing
- **React Hook Form** — Form state management
- **Axios** — HTTP client with request/response interceptors

### UI
- **Mantine v8** — Component library
- **Mantine DataTable** — Server-side paginated data tables
- **Tabler Icons** — Icon set
- **Tailwind CSS v4** — Utility-first styling

### Tooling
- **Vite 7** — Dev server & bundler
- **ESLint** — Linting
- **npm** — Package manager

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
VITE_BASE_URL=http://localhost:8000/api/v1
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
├── assets/
├── components/
│   └── DashboardCard.jsx       # Reusable stat card
├── context/
│   ├── Context.js              # React context definition
│   └── ContextProvider.jsx     # Global auth state, API actions
├── hooks/
│   └── useAuthApi.js           # Auth API calls (login, register, OTP, reset)
├── pages/
│   └── Auth_page.jsx           # Public login/register/reset page
├── protectedPages/
│   ├── ProtectedRoute.jsx      # Route guard component
│   ├── layout/                 # Dashboard shell layout
│   └── pages/
│       ├── Dashboard.jsx       # Layout wrapper
│       ├── Overview.jsx        # Default dashboard view
│       ├── ApiKeys.jsx         # API key management
│       ├── Users.jsx           # User management table
│       ├── Endpoints.jsx       # API endpoint reference
│       ├── Usage.jsx           # Usage analytics
│       └── Settings.jsx        # Account settings
├── Routes/
│   └── GlobalRoutes.jsx        # Route definitions
├── App.jsx
└── main.jsx
```

---

## 🔐 Authentication Flow

1. User submits registration form → OTP sent to email
2. User verifies OTP → account confirmed
3. User logs in → JWT returned from backend
4. Token stored in `localStorage`, attached to all subsequent requests via Axios interceptor
5. `401` response → automatic logout and redirect to `/login`
6. Auth state (user, tokens, usage, meta) exposed globally via `AuthContext`

---

## 🛣️ Routes

| Path                    | Access    | Component      |
|-------------------------|-----------|----------------|
| `/login`                | Public    | Auth_page      |
| `/`                     | Protected | Overview       |
| `/dashboard/api-keys`   | Protected | ApiKeys        |
| `/dashboard/users`      | Protected | Users          |
| `/dashboard/endpoints`  | Protected | Endpoints      |
| `/dashboard/usage`      | Protected | Usage          |
| `/dashboard/settings`   | Protected | Settings       |

---

## 🌐 Context API

`AuthContext` exposes the following:

| Value / Method          | Description                              |
|-------------------------|------------------------------------------|
| `user`                  | Logged-in user object                    |
| `tokenInfo`             | Token metadata from dashboard            |
| `usage`                 | Usage stats                              |
| `meta`                  | Project meta info                        |
| `login(token)`          | Store token, set auth state              |
| `logout()`              | Clear token, redirect to `/login`        |
| `refreshDashboard()`    | Re-fetch dashboard data                  |
| `createApiKeys()`       | Create a new API key                     |
| `revokeAllKeys()`       | Revoke all API keys                      |
| `revokeSingleKey(id)`   | Revoke one API key                       |
| `regenerateSingleKey(id)` | Regenerate one API key               |
| `getApiKeyUsage(id)`    | Fetch usage for a specific key           |
| `deactivateAccount()`   | Deactivate the current account           |
| `getAllProjectUsers()`  | List users with pagination & filters     |
| `createProjectUser()`   | Add a user to a project                  |
| `updateProjectUser()`   | Update user role or status               |
| `deleteProjectUser()`   | Remove a user from a project             |
| `bulkDeleteProjectUsers()` | Bulk remove users                   |

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
