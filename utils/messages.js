const moment = require("moment");

const message = (name, text) => {
  return {
    name,
    text,
    time: moment().format("h:mm a"),
  };
};

module.exports = message;
