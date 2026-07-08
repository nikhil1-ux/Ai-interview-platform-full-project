import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://ai-interview-platform-full-project.vercel.app",
      credentials: true,
    },
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};