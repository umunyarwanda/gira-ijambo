# Gira Ijambo

**Gira Ijambo** is a citizen–government engagement platform that enables Rwandan residents to submit ideas or complaints, track responses end-to-end using a unique tracking code, allow institutions to manage complaints, and notifying the complainant when their complaints are resolved. This project was developed during the Tech Associates Program Hackathon (2025).

---

## 🚀 Live Demo

👉 [Access the Live Demo](https://gira-ijambo.vercel.app)

---

## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)

---

## 📝 Overview

**Gira Ijambo** serves as a bridge between citizens and government agencies, facilitating transparent communication and efficient issue resolution. Users can submit feedback, monitor the status of their submissions, and receive timely responses from relevant authorities.

---

## ✨ Features

- **Submit Feedback:** Easily submit ideas or complaints to government agencies.
- **Track Responses:** Monitor the status of submissions in real-time using unique ticket IDs.
- **Agency Dashboard:** Government teams can manage, respond, and report on submissions.
- **Responsive Design:** Accessible on both web and mobile devices.

## 🛠️ Tech Stack

### Frontend

- **Framework:** Vue 3 + TypeScript
- **UI Library:** PrimeVue
- **Routing:** Vue Router
- **State Management:** Pinia
- **Styling:** CSS/SCSS

### Backend

- **Framework:** NestJS (TypeScript)
- **Database:** MySQL
- **ORM:** TypeORM
- **Authentication:** JWT (JSON Web Tokens)
- **API Documentation:** Swagger
- **AI:** QROQ


---

## 📦 Installation

To set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/gira-ijambo.git
   cd gira-ijambo
   ```

2. **Install dependencies:**
   ```bash
   # Install frontend dependencies
   cd packages/frontend
   pnpm install

   # Install backend dependencies
   cd ../packages/backend
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   # Frontend (.env)
   Check the .env.example file for the frontend environment variables

   # Backend (.env)
   Check the .env.example file for the backend environment variables
   ```

4. **Start the development servers:**
   ```bash
   # Start backend server
   cd packages/backend
   pnpm run serve

   # Start frontend server (in a new terminal)
   cd packages/frontend
   pnpm run serve
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3091
   - API Documentation: http://localhost:3091/swagger

---

## 🚀 Deployment

The application is configured for deployment on Vercel (frontend) and Railway (backend).

1. **Frontend Deployment:**
   - Connect your GitHub repository to Vercel
   - Configure environment variables
   - Deploy

2. **Backend Deployment:**
   - Connect your GitHub repository to Railway
   - Configure environment variables
   - Deploy
