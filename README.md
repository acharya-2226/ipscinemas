# 🎬 Online Movie Booking System (PIX Cinema)

> A full-stack movie booking platform built with Django REST Framework + React (Vite)

## ✨ This project includes

- 🔐 JWT-based authentication & role-aware access control
- 🎥 Movie and show management
- 💺 Seat-level booking with concurrency protection
- 🎨 Custom-themed Django Admin matching frontend UI

---

## 📚 Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Project Structure](#2-project-structure)
3. [Core Features](#3-core-features)
4. [Architecture Overview](#4-architecture-overview)
5. [Data Model](#5-data-model)
6. [Roles and Permissions](#6-roles-and-permissions)
7. [API Reference](#7-api-reference)
8. [Local Setup](#8-local-setup)
9. [Run Commands](#9-run-commands)
10. [Testing and Quality Checks](#10-testing-and-quality-checks)
11. [Admin Panel](#11-admin-panel)
12. [Frontend Pages and Flow](#12-frontend-pages-and-flow)
13. [Configuration Notes](#13-configuration-notes)
14. [Troubleshooting](#14-troubleshooting)
15. [Known Limitations](#15-known-limitations)
16. [Suggested Improvements](#16-suggested-improvements)

---

## 🔧 1. Tech Stack

### 🖥️ Backend

| Tool | Version |
|------|---------|
| 🐍 Python | 3.12+ |
| 🌐 Django | 6.0.2 |
| 🔗 Django REST Framework | 3.16.1 |
| 🔐 Simple JWT | — |
| 🗄️ SQLite | default |
| 🖼️ Pillow | — |

### 🌐 Frontend

| Tool | Version |
|------|---------|
| ⚛️ React | 19 |
| ⚡ Vite | 7 |
| 🔀 React Router | — |
| 🎨 Bootstrap | 5 |

---

## 🗂️ 2. Project Structure

```
online-movie-booking-system/
├── backend/
│   ├── api/                  # 🎥 Movie, show, seat, booking APIs
│   ├── User/                 # 👤 Custom user model + auth/profile APIs
│   ├── core/                 # 🌐 Root endpoint
│   ├── pix_cinema/           # ⚙️ Django config
│   ├── templates/admin/      # 🎨 Custom admin templates
│   ├── static/admin/         # 🎨 Admin CSS theme
│   ├── media/                # 🖼️ Uploaded posters
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # 🧩 UI components
│   │   ├── pages/            # 📄 Pages
│   │   ├── context/          # 🔐 Auth state
│   │   └── api.js            # 🌐 API layer
│   ├── public/media/
│   └── package.json
├── start_backend.bat
└── start_frontend.bat
```

---

## ⚙️ 3. Core Features

- 🔐 JWT authentication (access + refresh tokens)
- 🎬 Public movie & show browsing
- 💺 Seat map visualization
- 🧾 Authenticated booking flow
- 🛡️ Role-based admin control
- ⚡ Concurrency-safe booking (`select_for_update`)
- 🎨 Customized Django Admin UI

---

## 🏗️ 4. Architecture Overview

### 🖥️ Backend

- `api` app → Movies, Shows, Seats, Bookings
- `User` app → Custom user + authentication

### 🌐 Frontend

- 📡 Central API layer (`api.js`)
- 🔐 Auth via Context (`AuthProvider`)
- 🚧 Protected routes (`ProtectedRoute`)

### 🛡️ Booking Safety

- 🔒 DB-level locking prevents double booking
- ⛔ Rejects past shows

---

## 🧩 5. Data Model

### 👤 User

- Roles: `owner` 👑 | `staff` 🛠️ | `user` 🙋
- `is_admin` flag

### 🎬 Movie

- Title, duration, price 💰
- Genre, release date 📅
- Poster 🖼️
- Relations: Director 🎬, Cast 🎭

### 🕒 Show

- Linked to movie
- Date + time
- Unique constraint

### 💺 Seat

- Seat number (A1, B2…)
- Booking status

### 🧾 Booking

- User + Show
- Seats (M2M)
- Timestamp ⏱️

---

## 👥 6. Roles and Permissions

| Role | Permissions |
|------|-------------|
| 👑 Owner / Admin | Full CRUD on movies & shows, manage seats |
| 🛠️ Staff | Elevated privileges |
| 🙋 User | Book tickets, view own bookings |
| 🌍 Public | View movies & shows |

---

## 🌐 7. API Reference

**📍 Base URL:** `http://localhost:8000/api/`

### 🔐 Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/token/` | Get tokens |
| POST | `/api/token/refresh/` | Refresh token |

### 👤 Users

- Register 📝
- Login 🔑
- Profile 👤

### 🎬 Movies

- CRUD (admin only for write)

### 🕒 Shows

- Filter by movie/date

### 💺 Seats

- View + update (restricted)

### 🧾 Bookings

- Create booking
- Role-based visibility

---

## 💻 8. Local Setup

### ⚙️ Prerequisites

- 🐍 Python 3.12+
- 🟢 Node.js 18+

### 🖥️ Backend

```bash
cd backend
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
```

### 🌐 Frontend

```bash
cd frontend
npm install
```

---

## ▶️ 9. Run Commands

### ⚡ Option A — Quick Start

```bat
start_backend.bat
start_frontend.bat
```

### 🛠️ Option B — Manual

**Backend:**

```bash
python manage.py runserver
```

**Frontend:**

```bash
npm run dev
```

### 🔗 URLs

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:5173 |
| 🔌 Backend | http://localhost:8000/ |
| 🛠️ Admin | http://127.0.0.1:8000/admin/ |

---

## 🧪 10. Testing & Quality Checks

### 🖥️ Backend

```bash
python manage.py check
python manage.py test
```

### 🌐 Frontend

```bash
npm run lint
npm run build
```

---

## 🛠️ 11. Admin Panel

### ✨ Features

- 🎨 Branded login page
- 📊 Styled dashboard
- 🔍 Advanced filters/search
- ⚡ Quick actions

### 📂 Location

```
templates/admin/
static/admin/custom.css
```

---

## 📱 12. Frontend Pages

| Route | Page |
|-------|------|
| `/` | 🏠 Home |
| `/login` | 🔐 Login |
| `/register` | 📝 Register |
| `/movies` | 🎬 Movies |
| `/shows/:movieId` | 🕒 Shows |
| `/book/:showId` | 💺 Booking |
| `/bookings` | 🧾 My Bookings |
| `/admin` | ⚙️ Admin |

---

## ⚠️ 13. Configuration Notes

### 🔧 Current (Development)

- `DEBUG = True`
- Open CORS
- SQLite

### 🚀 Before Production

- 🔑 Secure `SECRET_KEY`
- ❌ Disable `DEBUG`
- 🌍 Configure `ALLOWED_HOSTS`
- 🔒 Enable HTTPS

---

## 🧯 14. Troubleshooting

### ❌ Frontend not starting

- Run `npm install`
- Fix EPERM/EBUSY issues

### ❌ Backend errors

```bash
python manage.py migrate
```

### 🔐 401 Errors

- Token expired → refresh
- Re-login if needed

---

## 🚧 15. Known Limitations

- 💰 Price not validated server-side
- 🎭 Cast/director write restrictions
- 📊 Booking totals computed in UI
- 🧪 No full E2E tests

---

## 💡 16. Suggested Improvements

- 💰 Add backend price validation
- ❌ Booking cancellation + seat release
- 🧪 Add frontend tests
- 🔄 CI/CD pipeline
- ⚙️ Prod settings split
- 🐳 Docker support

---

