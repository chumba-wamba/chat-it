const express = require("express");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middleware/auth_middleware");
const Room = require("../models/Room");
router = express.Router();

router.get("/:roomId", checkAuthenticated, async (req, res) => {
  roomId = req.params.roomId;
  room = await Room.findOne({ roomId: roomId });
  if (!room) {
    res.render("error/404.hbs");
  }

  if (room.userOne == req.user.userName) {
    friendName = room.userTwo;
  } else {
    friendName = room.userOne;
  }

  res.render("chat.hbs", {
    layout: "chat.hbs",
    fileName: "chat",
    roomId: roomId,
    userName: req.user.userName,
    friendName: friendName,
  });
});

module.exports = router;
