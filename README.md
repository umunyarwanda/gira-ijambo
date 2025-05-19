# Gira Ijambo

**Gira Ijambo** is a citizen–government engagement platform that enables Rwandan residents to submit ideas or complaints, track responses end-to-end using a unique tracking code, allow institutions to manage complaints, and notifying the complainant when their complaints are resolved. This project was developed during the Tech Associates Program Hackathon (2025).

---

## 🚀 Live Demo

👉 [Access the Live Demo](https://giraijambo.rw)

---

## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

---

## 📝 Overview

**Gira Ijambo** serves as a bridge between citizens and government agencies, facilitating transparent communication and efficient issue resolution. Users can submit feedback, monitor the status of their submissions, and receive timely responses from relevant authorities.

---

## ✨ Features

- **Submit Feedback:** Easily submit ideas or complaints to government agencies.
- **Track Responses:** Monitor the status of submissions in real-time using unique ticket IDs.
- **Receive Notifications:** Stay informed with email and SMS updates at each stage.
- **Agency Dashboard:** Government teams can manage, respond, and report on submissions.
- **Localization:** Fully available in Kinyarwanda, with optional English support.
- **Responsive Design:** Accessible on both web and mobile devices.

---

## 📸 Screenshots

### Home Page

![Home Page](images/home.png)

### Submission Form

![Submission Form](images/submission_form.png)

### Tracking Dashboard

![Tracking Dashboard](images/tracking_dashboard.png)

---

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

### Notifications

- **Email:** SendGrid

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
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Frontend (.env)
   VITE_API_URL=http://localhost:3000
   VITE_APP_NAME=Gira Ijambo

   # Backend (.env)
   DATABASE_URL=mysql://user:password@localhost:3306/gira_ijambo
   JWT_SECRET=your_jwt_secret
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```

4. **Start the development servers:**
   ```bash
   # Start backend server
   cd backend
   npm run start:dev

   # Start frontend server (in a new terminal)
   cd frontend
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api

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

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- Tech Associates Program for organizing the hackathon
- All contributors and mentors who provided guidance
- The open-source community for their invaluable tools and resources
   