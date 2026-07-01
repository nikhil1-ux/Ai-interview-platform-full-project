import { io } from "socket.io-client";
 
// Same host your axios instance points to (see src/api/axios.js),
// just without the /api/v1 prefix since Socket.IO connects at the
// server root, not a REST path.
const SOCKET_URL = "http://localhost:5000";
 
let socket = null;
 
/**
 * Opens (or reuses) a single authenticated socket connection.
 * The access token is sent via `auth`, which is read by the
 * `authenticateSocket` middleware on the backend.
 */
export const connectSocket = () => {
  if (socket?.connected) {
    return socket;
  }
 
  const token = localStorage.getItem("accessToken");
 
  socket = io(SOCKET_URL, {
    auth: { token },
    withCredentials: true,
    autoConnect: true,
  });
 
  return socket;
};
 
/**
 * Returns the active socket instance. Throws if connectSocket()
 * hasn't been called yet, so bugs surface immediately instead of
 * silently no-oping.
 */
export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call connectSocket() first.");
  }
  return socket;
};
 
/**
 * Cleanly closes the connection, e.g. when leaving the interview room.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
