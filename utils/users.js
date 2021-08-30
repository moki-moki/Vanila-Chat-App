const users = [];

//Join user to chat
const userJoin = (id, username, room) => {
  const user = { username, room, id };
  console.log(user);

  users.push(user);
  return user;
};

//get current user
const getCurrentUser = (id) => users.find((user) => user.id === id);

//User on leave
const getLeftUser = (id) => {
  const user = users.findIndex((u) => u.id === id);

  if (user !== -1) {
    return users.splice(user, 1)[0];
  }
};

//get users in room
const getUsersRoom = (room) => users.filter((u) => u.room === room);

module.exports = {
  userJoin,
  getCurrentUser,
  getLeftUser,
  getUsersRoom,
};
