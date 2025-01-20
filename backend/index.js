const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3500;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const DBConnection = require("./config/DbConnection");
const router = require("./routes");
const Message = require("./models/messageModal");

const http = require("http").createServer(app);
const { Server } = require("socket.io");

DBConnection();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true                 
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api/v1", router);

let onlineUsers = []

const io = new Server(http, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join-chat", async (userId, receiverId) => {
    const room = [userId, receiverId].sort().join("_");
    socket.join(room);
  
    const messages = await Message.find({
      $or: [
        { userid: userId, receiverid: receiverId },
        { userid: receiverId, receiverid: userId },
      ],
    }).sort({ timestamp: 1 });

     onlineUsers.push({userId:userId,receiverId:receiverId})
    
    socket.emit("previousMessages", messages);
    socket.emit("onlineUsers",onlineUsers)
    // console.log(`User ${userId} joined room: ${room}`);
  });

 
  socket.on("message", async ({ userid, receiverid, message }, callback) => {
    try {
      if (!message) throw new Error("Message content is missing");

      
      const newMessage = await Message.create({
        userid,
        receiverid,
        message,
        timestamp: Date.now(), 
      });

      const room = [userid, receiverid].sort().join("_");
      io.to(room).emit("message", {
        message,
        userid,
        receiverid,
        timestamp: newMessage.timestamp,
      });

      if (typeof callback === "function") callback();
    } catch (error) {
      console.error("Error sending message:", error);
      if (typeof callback === "function") callback("Failed to send message");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


http.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
