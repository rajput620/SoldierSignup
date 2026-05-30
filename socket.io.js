const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

let users = {}; // Store connected users

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    users[userId] = socket.id; // Store user's socket ID
    console.log(`${userId} joined the chat`);
  });

  socket.on("sendMessage", ({ sender, receiver, message }) => {
    const receiverSocketId = users[receiver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", { sender, message });
    }
  });

  socket.on("typing", ({ sender, receiver }) => {
    const receiverSocketId = users[receiver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("showTyping", { sender });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove user from list using their socket ID
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId]; // Remove user from list
        break;
      }
    }
  });
});

// Start the server
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
