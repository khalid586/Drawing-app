const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Frontend URL
      methods: ["GET", "POST"],
    },
  });
  

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Listen for connection events
io.on("connection", (socket) => {
  console.log("A user connected");

  // Relay drawing data to all connected clients
  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data); // Send data to all clients except the sender
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("changeColor", ({ color }) => {
    socket.broadcast.emit("changeColor", { color });
  });

  socket.on("clearCanvas", () => {
    socket.broadcast.emit("clearCanvas");
  });
  
  
});

server.listen(3000, () => {
  console.log("Server is running on 3000");
});
