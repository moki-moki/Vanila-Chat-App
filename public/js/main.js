const socket = io("http://localhost:5000");

const messageInput = document.querySelector(".messageInput");
const form = document.getElementById("form");
const chatBox = document.getElementById("textContainer");
const title = document.querySelector(".title");
const usersList = document.getElementById("userList");

//getting query params from url as obj
const params = new URLSearchParams(window.location.search);
const entries = params.entries();

const paramsToObj = (entries) => {
  const result = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
};

const paramObj = paramsToObj(entries);
const { username, room } = paramObj;

//Join chat
socket.emit("joinRoom", { username, room });

//bot welcoming message
socket.on("message", (message) => {
  getMessage(message);
});

socket.on("usersRoom", ({ room, users }) => {
  outputRoomInfo(room);
  outputUserInfo(users);
});

//outputing msg on submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;

  if (message) {
    socket.emit("chat message", message);
    messageInput.value = "";
    messageInput.focus();
  }
});

//getting message
socket.on("chat message", (msg) => {
  getMessage(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
});

//generating msg
const getMessage = (msg) => {
  const div = document.createElement("div");
  div.className = "m-2";
  div.innerHTML = `
    <p class="text p-1 rounded-top"><span class='name text'>${msg.name}</span><span class='text'>${msg.time}</span></p>
    <p class="text p-1 rounded-bottom">${msg.text}</p> 
`;
  document.getElementById("textContainer").append(div);
};

//getting room name
const outputRoomInfo = (room) => {
  title.innerText = `Welcome to ${room} room!`;
};

//getting user to dom
const outputUserInfo = (users) => {
  usersList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    usersList.appendChild(li);
  });
};
