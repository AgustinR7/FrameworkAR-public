# Frontend - React Application

User Interface built with **React 18**, **TypeScript**, and **Material UI**. This project focuses on a modern, responsive design with custom animations and robust state management.

## Tech Stack

- **Core:** React 18, TypeScript, Vite
- **Styling:** Material UI (MUI), Styled Components
- **Animations:** Anime.js
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **State Management:** React Context API (AuthProvider)

## Project Structure
src/
├── api/            # Axios instances and API calls
├── components/     # Reusable UI components (WaveInput, Sidebar, etc.)
├── context/        # Global state (AuthProvider)
├── pages/          # Full page views (Login, Home, Profile)
├── types/          # TypeScript interfaces
└── ui/             # Generic UI elements (Buttons, Loaders)

## Development Scripts
- Inside the Frontend directory, you can run:

 - npm run dev
- Runs the app in development mode at http://localhost:5173.
- It connects to the Backend API (make sure the backend is running).

- npm run build
- Builds the app for production to the dist folder.
- It correctly bundles React in production mode and optimizes the build for the best performance.

- npm run lint
- Runs ESLint to check for code quality and TypeScript errors.

- Key Components
- AuthProvider: Handles user session, login/logout logic, and route protection.

- WaveInput: A custom animated input field using styled-components.

- Sidebar: Dynamic navigation drawer with active state highlighting.

- WelcomeIntro: Intro animation sequence using Anime.js.

## Environment Variables
- Create a .env file in this folder if you need to override defaults