const express = require("express");
const User = require("../models/User");
const Room = require("../models/Room");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middleware/auth_middleware");
const { json } = require("body-parser");
router = express.Router();

router.get("/", checkNotAuthenticated, (req, res, next) => {
  res.redirect("/auth/login");
});

router.get("/dashboard", checkAuthenticated, async (req, res, next) => {
  user = await User.findOne({ userName: req.user.userName }).lean();

  rooms = await Room.find({
    $or: [{ userOne: req.user.userName }, { userTwo: req.user.userName }],
  }).lean();

  friends = [];
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].userOne === user.userName) {
      friend = {
        userName: rooms[i].userTwo,
        room: rooms[i].room,
      };
    } else {
      friend = {
        userName: rooms[i].userOne,
        room: rooms[i].room,
      };
    }
    friends.push(friend);
  }
  friends.sort((a, b) =>
    a.userName > b.userName ? 1 : b.userName > a.userName ? -1 : 0
  );

  res.render("dashboard.hbs", {
    user,
    friends: friends,
    fileName: "dashboard",
  });
});

module.exports = router;
