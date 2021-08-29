const users = [];

//Join user to chat
function userJoin(id, username, room) {
  const user = { username, room, id };

  console.log(user);

  users.push(user);
  return user;
}

console.log(users);

//get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

module.exports = {
  userJoin,
  getCurrentUser,
};
