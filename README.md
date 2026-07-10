# AI Interview Platform

A full-stack, AI-powered interview platform that lets recruiters create job-description-based interviews and candidates complete AI-generated, one-shot interviews — scored and ranked automatically.

**Live App:** [Add your deployed link here]
**Repo:** https://github.com/nikhil1-ux/Ai-interview-platform-full-project

---

## Overview

Recruiters create an interview tied to a job description. Candidates upload their resume, and the platform parses it to generate tailored technical questions using AI. Candidates complete a real-time, one-shot interview session, and their answers are automatically evaluated and scored — giving recruiters a ranked view of candidates without manual screening.

---

## Features

**For Recruiters**
- Create and manage job-description-based interviews
- Assign interviews to candidates and track completion status
- View candidate performance, scores, and rankings on a dashboard
- Edit/delete interviews and cancel assignments

**For Candidates**
- Upload resume (PDF/DOCX) for automated parsing
- Take AI-generated, resume-tailored technical interview questions
- Real-time interview session with per-question countdown timer and auto-submit
- View performance history and ranking after completion

**Platform**
- JWT-based authentication with role-based access (recruiter / candidate)
- Real-time interview flow via Socket.IO (join, submit-answer, reconnect, disconnect handling)
- AI question generation and answer scoring (Groq via OpenAI SDK, migrated from Gemini)
- Resume text extraction (`pdf-parse`, `mammoth`) and file storage via Cloudinary
- Automated performance reports and recruiter analytics

---

## Tech Stack

**Frontend:** React.js, React Router, Redux Toolkit, Tailwind CSS, Socket.IO client
**Backend:** Node.js, Express.js, Socket.IO, JWT Authentication
**Database:** MongoDB, Mongoose
**AI:** Groq API (via OpenAI SDK), Google Gemini API
**File Handling:** Multer, Cloudinary, pdf-parse, mammoth
**Deployment:** Vercel (CI/CD via GitHub)

---

## Architecture

```
Client (React)
   │
   ├── REST API ──────► Express Server ──► MongoDB (Mongoose)
   │                         │
   └── Socket.IO ────────────┤
                              ├── AI Service (Groq / Gemini) — question generation & scoring
                              └── Cloudinary — resume storage

Flow:
Recruiter creates interview (JD) → Candidate uploads resume → Resume parsed (pdf-parse/mammoth)
   → AI generates tailored questions → Candidate completes one-shot interview (Socket.IO, timed)
   → AI scores answers → Recruiter views ranked results
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account
- Groq / Gemini API key

### Installation

```bash
# Clone the repo
git clone https://github.com/nikhil1-ux/Ai-interview-platform-full-project.git
cd Ai-interview-platform-full-project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Running Locally

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm run dev
```

The app will be available at `http://localhost:5173` (frontend) with the API running on `http://localhost:5000`.

---

## Project Structure

```
Ai-interview-platform-full-project/
├── backend/
│   ├── controllers/       # Route logic (auth, dashboard, interview, assignment)
│   ├── models/             # Mongoose schemas (User, Interview, Assignment, InterviewSession)
│   ├── routes/
│   ├── sockets/            # interview.socket.js — real-time interview handler
│   ├── services/           # AI question generation & scoring
│   ├── middleware/         # JWT auth, error handling
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/           # CandidateHome, RecruiterHome, Performance, Ranking, etc.
│   │   ├── components/
│   │   ├── socket/          # Singleton socket client
│   │   └── App.jsx
└── README.md
```

---

## Roadmap

- [ ] Video/audio response scoring (confidence, clarity, engagement)
- [ ] TypeScript migration
- [ ] Redis-based session caching
- [ ] WebRTC for live video interviews

---

## Author

**Nikhil Yadav**
B.Tech CSE, University of Lucknow (Expected 2027)
[GitHub](https://github.com/nikhil1-ux) · [LinkedIn](#) · nikhilyadav9044@gmail.com
