const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Room = require("../models/Room");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middleware/auth_middleware");
const { generateId } = require("../helpers/utils");
router = express.Router();

router.get("/", checkAuthenticated, async (req, res, next) => {
  res.render("add_friends.hbs", { fileName: "addFriends" });
});

router.post(
  "/add",
  [
    body("userName")
      .isLength({ min: 6, max: 20 })
      .custom((value) => {
        return User.findOne({ userName: value }).then((user) => {
          if (!user) {
            return Promise.reject("Username does not exist.");
          }
        });
      }),
  ],
  checkAuthenticated,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (req.body.userName === req.user.userName) {
      errors.errors.push({
        value: req.body.userName,
        msg: "Damn son, you must be lonely!",
        param: "userName",
        location: "body",
      });
    }

    if (
      (await Room.findOne({
        userOne: req.body.userName,
        userTwo: req.user.userName,
      })) ||
      (await Room.findOne({
        userTwo: req.body.userName,
        userOne: req.user.userName,
      }))
    ) {
      errors.errors.push({
        value: req.body.userName,
        msg: "Y'all already friends, buddy!",
        param: "userName",
        location: "body",
      });
    }

    if (!errors.isEmpty()) {
      return res.render("add_friends", {
        errors: errors.mapped(),
      });
    }

    roomId = generateId();
    while (await Room.findOne({ room: roomId })) {
      roomId = generateId();
    }
    newRoom = {
      userOne: req.user.userName,
      userTwo: req.body.userName,
      room: roomId,
    };
    await Room.create(newRoom);
    console.log(
      `new friendship - ${req.user.userName} 🤝 ${req.body.userName}`
    );

    res.redirect("/dashboard");
  }
);

module.exports = router;
