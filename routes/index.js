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
  try {
    user = await User.findOne({ userName: req.user.userName }).lean();

    rooms = await Room.find({
      $or: [{ userOne: req.user.userName }, { userTwo: req.user.userName }],
    }).lean();

    friends = [];
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i].userOne === user.userName) {
        friend = {
          userName: rooms[i].userTwo,
          roomId: rooms[i].roomId,
        };
      } else {
        friend = {
          userName: rooms[i].userOne,
          roomId: rooms[i].roomId,
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
  } catch (error) {
    console.log(error);
    res.render("error/500.hbs");
  }
});

module.exports = router;
