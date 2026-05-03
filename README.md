# FrameworkAR

A production-ready Full Stack web application template with real-time communication, role-based access control, and a fully automated CI/CD pipeline.

[![Backend CI/CD](https://github.com/AgustinR7/FrameworkAR/actions/workflows/backend.yml/badge.svg)](https://github.com/AgustinR7/FrameworkAR/actions/workflows/backend.yml)
[![Frontend CI/CD](https://github.com/AgustinR7/FrameworkAR/actions/workflows/frontend.yml/badge.svg)](https://github.com/AgustinR7/FrameworkAR/actions/workflows/frontend.yml)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

- 🔐 **Authentication** — Secure login and registration with session persistence
- 💬 **Real-time Chat** — P2P messaging with online presence indicators and unread notifications
- 👥 **Role-based Access** — Admin and user roles with protected routes
- 🛠️ **Admin Panel** — Full user management (create, block, reset password, delete)
- 🌍 **Internationalization** — English and Spanish support, switchable at runtime
- 🎨 **Theming** — Dark and light mode with smooth transitions
- 🐳 **Dockerized** — One-command setup for the entire stack
- ⚙️ **CI/CD** — Automated testing and deployment via GitHub Actions

---

## Tech Stack

**Frontend:** React · TypeScript · Vite · Material UI · Socket.io · i18next

**Backend:** Node.js · Express · MySQL · Sequelize · Socket.io · JWT

**Infrastructure:** Docker · Docker Compose · GitHub Actions · Docker Hub

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop) installed and running
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/AgustinR7/FrameworkAR.git
cd FrameworkAR

# Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start the full stack
docker-compose up --build
```

### Access

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:4000 |

---

## Configuration

Environment templates are provided in each service directory. Copy them and fill in your own values before running.

See `backend/.env.example` and `frontend/.env.example` for the required variables.

---

Developed by **Agustín Ramírez** — 2026