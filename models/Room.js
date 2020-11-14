const mongoose = require("mongoose");

const RoomSchema = mongoose.Schema({
  userOne: {
    type: String,
    required: true,
  },
  userTwo: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Room", RoomSchema);
