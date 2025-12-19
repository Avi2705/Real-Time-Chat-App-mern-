import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectdb } from "./lib/Db.js";
import userRouter from "./Routes/UserRoutes.js";
import messagerouter from "./Routes/MessageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Initialize socket.io
export const io = new Server(server, {
  cors: { origin: "*" },
});

// Store online users
// { userId: [socketId, socketId] }
export const userSocketMap = {};

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = [];
    }
    userSocketMap[userId].push(socket.id);
  }

  // Emit online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap).map((id) => id.toString()));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);

    if (userId && userSocketMap[userId]) {
      userSocketMap[userId] = userSocketMap[userId].filter((id) => id !== socket.id);

      if (userSocketMap[userId].length === 0) {
        delete userSocketMap[userId];
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap).map((id) => id.toString()));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => {
  res.send("Server is live");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messagerouter);

// Start server
await connectdb();

const PORT = process.env.PORT || 5500;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
