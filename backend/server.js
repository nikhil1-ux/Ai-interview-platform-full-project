import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

import { initSocket } from "./socket/socket.js";
import { registerInterviewSocket } from "./socket/interview.socket.js";

const app = express();
const server = http.createServer(app);

// Socket.IO
const io = initSocket(server);
registerInterviewSocket(io);

// Middlewares
app.use(
  cors({
    origin: "https://ai-interview-platform-full-project.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database
connectDB();

// Routes
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("AI Interview Backend Running");
});

// Error middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});