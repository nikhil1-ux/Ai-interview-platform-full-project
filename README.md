<div align="center">

# 🎯 AI Interview Platform

**AI-powered recruitment platform that automates technical interviews — from resume to hiring decision.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![Groq](https://img.shields.io/badge/AI-Groq%20%2F%20Llama%203.3-orange)](https://groq.com/)

[Live Demo](https://ai-interview-platform-full-project.vercel.app/) · [Report Bug](https://github.com/nikhil1-ux/Ai-interview-platform-full-project/issues) · [Repo](https://github.com/nikhil1-ux/Ai-interview-platform-full-project)

</div>

---

## 📌 About The Project

Manual technical screening doesn't scale — recruiters spend hours conducting or reviewing interviews, and feedback quality varies by interviewer.

**AI Interview Platform** solves this by letting recruiters create job-description-based interviews and automatically generating **resume-tailored, AI-driven interview questions** for candidates. Interviews run **live and one-shot** over Socket.IO with a per-question timer, and every answer is scored by AI across multiple criteria — giving recruiters a ranked, data-backed shortlist without lifting a finger.

---

## ✨ Features

### 🧑‍💼 Recruiters
- Create and manage interviews tied to a specific job description
- Assign interviews to candidates and track pipeline status (assigned → accepted → in-progress → completed/rejected)
- View per-interview and aggregate candidate analytics on a dashboard
- Edit/delete interviews and cancel assignments

### 🎓 Candidates
- Upload resume (PDF/DOCX) — parsed automatically to ground interview questions
- Take AI-generated technical questions tailored to their resume and the job description
- Real-time interview session with countdown timer + auto-submit per question
- View performance history and see ranking against other candidates

### ⚙️ Platform
- JWT authentication with role-based access (recruiter / candidate)
- Real-time interview flow via Socket.IO (join, submit-answer, reconnect, disconnect handling)
- AI question generation & answer scoring via **Groq (Llama 3.3 70B)**, accessed through the OpenAI SDK
- Automated scoring across **technical accuracy, communication, completeness, and problem-solving**
- AI-generated final report with **5 score dimensions** (technical, communication, confidence, problem-solving, overall) + hire/no-hire recommendation
- MongoDB aggregation-based leaderboard ranking candidates by average score
- Resume text extraction (`pdf-parse`, `mammoth`) with file storage on Cloudinary

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, React Router, Redux Toolkit,CSS, Socket.IO client |
| **Backend** | Node.js, Express.js, Socket.IO, JWT |
| **Database** | MongoDB, Mongoose |
| **AI** | Groq API (Llama 3.3 70B, via OpenAI SDK) |
| **File Handling** | Multer, Cloudinary, pdf-parse, mammoth |
| **Deployment** | Vercel (CI/CD via GitHub) |

---

## 🏗️ Architecture

```
Client (React)
   │
   ├── REST API ──────► Express Server ──► MongoDB (Mongoose)
   │                         │
   └── Socket.IO ────────────┤
                              ├── AI Service (Groq) — question generation & scoring
                              └── Cloudinary — resume storage
```

**Flow:**
```
Recruiter creates interview (JD)
   → Candidate uploads resume
   → Resume parsed (pdf-parse / mammoth)
   → AI generates tailored questions
   → Candidate completes timed, one-shot interview (Socket.IO)
   → AI scores each answer
   → Recruiter views ranked results & hiring recommendation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account
- Groq API key

### Installation

```bash
# Clone the repo
git clone https://github.com/nikhil1-ux/Ai-interview-platform-full-project.git
cd Ai-interview-platform-full-project

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Environment Variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Run Locally

```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm run dev
```

- Frontend → `http://localhost:5173`
- Backend API → `http://localhost:5000`

---

## 📁 Project Structure

```
Ai-interview-platform-full-project/
├── backend/
│   ├── controllers/   # auth, dashboard, interview, resume, startInterview
│   ├── models/         # User, Interview, Assignment, InterviewSession
│   ├── routes/
│   ├── socket/         # interview.socket.js — real-time interview handler
│   ├── service/         # ai.service.js, resume.service.js, cloudinary.service.js
│   ├── middleware/     # JWT auth, error handling
│   └── server.js
├── frontend/
│   └── src/
│       ├── pages/       # CandidateHome, RecruiterHome, Performance, Ranking
│       ├── components/
│       ├── socket/      # Socket.IO client
│       └── App.jsx
└── README.md
```

---

## 🗺️ Roadmap

- [ ] Video/audio response scoring (confidence, clarity, engagement)
- [ ] TypeScript migration
- [ ] Redis-based session caching
- [ ] WebRTC for live video interviews

---

## 👤 Author

**Nikhil Yadav**
B.Tech CSE, University of Lucknow (Expected 2027)
[GitHub](https://github.com/nikhil1-ux) · [LinkedIn](https://www.linkedin.com/in/nikhilyadav-dev/) · nikhilyadav9044@gmail.com

---

<div align="center">
If this project helped you, consider giving it a ⭐
</div>
