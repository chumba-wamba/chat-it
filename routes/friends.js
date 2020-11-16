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
    try {
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
      while (await Room.findOne({ roomId: roomId })) {
        roomId = generateId();
      }
      newRoom = {
        userOne: req.user.userName,
        userTwo: req.body.userName,
        roomId: roomId,
      };
      await Room.create(newRoom);
      console.log(
        `new friendship - ${req.user.userName} 🤝 ${req.body.userName}`
      );

      req.flash("info", `Added friend: ${req.body.userName}`);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
      res.render("error/500.hbs");
    }
  }
);

router.get("/delete/:roomId", checkAuthenticated, async (req, res) => {
  try {
    roomId = req.params.roomId;
    room = await Room.findOne({ roomId: roomId });
    console.log(roomId);

    if (!room) {
      console.log("here");
      res.render("error/404.hbs");
    }

    if (
      room.userOne === req.user.userName ||
      room.userTwo === req.user.userName
    ) {
      await Room.deleteOne({ roomId: roomId });
      console.log(`friendship cancel - ${room.userOne} 💔 ${room.userTwo}`);
      res.redirect("/dashboard");
    } else {
      res.render("error/404.hbs");
    }
  } catch (error) {
    res.render("error/500.hbs");
  }
});

module.exports = router;
