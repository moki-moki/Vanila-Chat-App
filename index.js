const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

//utils
const message = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  getLeftUser,
  getUsersRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: ["http://localhost:5000"],
  },
});

app.use(express.static(path.join(__dirname, "public")));

const bot = "Bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //welcoming msg
    socket.broadcast
      .to(user.room)
      .emit("message", message(bot, `${username}: has joined!`));

    socket.emit("message", message(bot, `Welcome to ${room} chat room `));

    //user and room info
    io.to(user.room).emit("usersRoom", {
      room: user.room,
      users: getUsersRoom(user.room),
    });
  });

  //message
  socket.on("chat message", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("chat message", message(user.username, msg));
  });

  //dc message
  socket.on("disconnect", () => {
    const user = getLeftUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        message(bot, `${user.username} has left the chat`)
      );

      //getting room and users
      io.to(user.room).emit("usersRoom", {
        room: user.room,
        users: getUsersRoom(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is up on  port: ${PORT}`));
