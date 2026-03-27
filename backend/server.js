// backend/server.js
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";


// --- SOCKET.IO Setup ---
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server from express app
const httpServer = createServer(app);

// --- SOCKET.IO WITH CORS (same as your frontend) ---
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// Store connected sockets if needed (optional)
const connectedClients = new Set();
io.on("connection", (socket) => {
  connectedClients.add(socket);
  // RECOMMENDED: use 'auth' event for max frontend compatibility
  socket.on("auth", (userId) => {
    if (userId) {
      socket.join(String(userId));
      // console.log(`Socket ${socket.id} joined room ${userId}`);
    }
  });
  socket.on("disconnect", () => connectedClients.delete(socket));
});

// --- Broadcast utility for controllers ---
export function emitLeaderboardUpdate(data) {
  io.emit("leaderboard:update", data);
}
export function emitSubmissionStatus(userId, statusData) {
  if (userId) {
    io.to(userId).emit("submission:status", { userId, ...statusData }); // Secure: only to that user's room
  }
}

// Start both HTTP + WS server
httpServer.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} (Socket.io enabled)`);
});