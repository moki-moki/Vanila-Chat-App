const socket = io("http://localhost:5000");

const messageInput = document.querySelector(".messageInput");
const form = document.getElementById("form");
const chatBox = document.getElementById("textContainer");
const title = document.querySelector(".title");

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

console.log(username);

//get name of a room
title.innerHTML = `Welcome to ${room} room!`;

//seding msg on submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;

  if (message) {
    socket.emit("chat message", message);
    messageInput.value = "";
    messageInput.focus();
  }
});

//Join chat
socket.emit("joinRoom", { username, room });

socket.emit("message");

//creating message when submit
socket.on("chat message", (msg) => {
  const div = document.createElement("div");
  div.className = "m-2";
  div.innerHTML = `
    <p class="text p-1 rounded-top"><span class='name text'>${msg.name}</span><span class='text'>${msg.time}</span></p>
    <p class="text p-1 rounded-bottom">${msg.text}</p> 
`;
  document.getElementById("textContainer").append(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});

console.log(socket);
