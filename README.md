# 🧠 MindMitr — Your Personal Habit Companion

<div align="center">

![MindMitr Banner](https://img.shields.io/badge/MindMitr-Habit%20Tracker-6C63FF?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4eiIvPjwvc3ZnPg==&logoColor=white)

**Build better habits. Track your streaks. Transform your mind.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## 📌 About

**MindMitr** *(Mind + Mitr — "Mind Friend" in Hindi)* is a full-stack habit tracking web application designed to help you build consistent routines and achieve your personal goals. Set habits, track daily completions, maintain streaks, and stay motivated with daily quotes — all in one clean and intuitive interface.

---

## ✨ Features

- 🔐 **User Authentication** — Secure Register & Login with JWT & bcrypt password hashing
- ✅ **Habit Management** — Create, edit, and delete habits with custom frequency & goal duration
- 📅 **Daily Tracking** — Mark habits as complete each day and track your consistency
- 🔥 **Streaks & Progress** — Visualize your habit completion history and maintain streaks
- 💬 **Motivational Quotes** — Daily inspirational quotes to keep you going
- 🛡️ **Protected Routes** — Authenticated-only access to the dashboard
- 🛠️ **Admin Dashboard** — Manage all users and habits from an admin panel

---

## 🛠️ Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | React 19, React Router v7, Lucide React             |
| Backend    | Node.js, Express.js                                 |
| Database   | MySQL (via `mysql2`)                                |
| Auth       | JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`       |
| Env Config | `dotenv`                                            |

---

## 📁 Project Structure

```
MindMitr/
├── backend/
│   ├── config/           # Database connection pool
│   ├── middleware/        # JWT auth middleware
│   ├── models/           # DB query functions (User, Habit, Completion)
│   ├── routes/           # API route handlers (auth, habits, admin, quotes)
│   ├── server.js         # Express server entry point
│   └── .env              # Environment variables (not committed)
│
└── frontend/
    ├── public/
    └── src/
        ├── api/          # API call helpers
        ├── components/   # Reusable components (Navbar, ProtectedRoute)
        ├── pages/        # Page components (Landing, Login, Register, Dashboard, Admin)
        ├── App.js        # App routes
        └── index.js      # React entry point
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MySQL](https://www.mysql.com/) (v8+)
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/Rahul-Naik27/MindMitr.git
cd MindMitr
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=mindmitr
JWT_SECRET=your_super_secret_key
PORT=5000
```

> ⚠️ **Never commit your `.env` file to GitHub!** Make sure it's listed in `.gitignore`.

Set up the MySQL database:

```sql
CREATE DATABASE mindmitr;
```

Then start the backend server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The backend will be live at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

The frontend will be live at: `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint              | Description                  | Auth Required |
|--------|-----------------------|------------------------------|:-------------:|
| POST   | `/api/auth/register`  | Register a new user          | ❌            |
| POST   | `/api/auth/login`     | Login and receive JWT token  | ❌            |
| GET    | `/api/habits`         | Get all habits for user      | ✅            |
| POST   | `/api/habits`         | Create a new habit           | ✅            |
| PUT    | `/api/habits/:id`     | Update a habit               | ✅            |
| DELETE | `/api/habits/:id`     | Delete a habit               | ✅            |
| GET    | `/api/quotes`         | Get a motivational quote     | ✅            |
| GET    | `/api/admin/users`    | Get all users (admin only)   | ✅            |

---

## 🖥️ Pages Overview

| Route        | Page             | Access         |
|--------------|------------------|----------------|
| `/`          | Landing Page     | Public         |
| `/login`     | Login            | Public         |
| `/register`  | Register         | Public         |
| `/dashboard` | User Dashboard   | 🔐 Protected   |
| `/admin`     | Admin Dashboard  | 🔐 Protected   |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Rahul Naik**  
[![GitHub](https://img.shields.io/badge/GitHub-Rahul--Naik27-181717?style=flat-square&logo=github)](https://github.com/Rahul-Naik27)

---

<div align="center">
  <i>Made with ❤️ to build better habits, one day at a time.</i>
</div>
