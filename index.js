const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

//utils
const message = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

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
  console.log("New ws connection");

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.broadcast
      .to(user.room)
      .emit("message", message(bot, `${username}: has joined!`));

    //welcoming msg
    socket.emit("message", message(bot, "Welcome to the chat!"));
  });

  //message
  socket.on("chat message", (msg) => {
    const user = getCurrentUser(socket.id);
    console.log(user);

    io.to(user.room).emit("chat message", message(user.username, msg));
  });
  //dc message
  socket.on("disconnect", () => {
    io.emit("message", message(bot, "A user has left"));
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is up on  port: ${PORT}`));
