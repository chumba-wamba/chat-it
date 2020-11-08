const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middleware/auth_middleware");
router = express.Router();

router.get("/", checkAuthenticated, (req, res, next) => {
  res.send("welcome to the /auth route!");
});

router.get("/register", (req, res, next) => {
  res.render("register", { layout: "auth", fileName: "register" });
});

router.post(
  "/register",
  [
    body("userName")
      .isLength({ min: 6, max: 20 })
      .custom((value) => {
        return User.findOne({ userName: value }).then((user) => {
          if (user) {
            return Promise.reject("Username already in use 😭.");
          }
        });
      }),
    body("firstName").isLength({ max: 20 }),
    body("lastName").isLength({ max: 20 }),
    body("password").isLength({ min: 6, max: 20 }),
  ],
  checkNotAuthenticated,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("register", {
        layout: "auth",
        errors: errors.mapped(),
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      newUser = {
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
      };
      await User.create(newUser);
      console.log(`Registration successful for ${req.body.userName}! 🙂`);
      console.log("user successfully created!");
      res.redirect("/auth/login");
    } catch {
      res.redirect("/auth/register");
    }
  }
);

router.get(
  "/login",
  [
    body("userName").isLength({ min: 6, max: 20 }),
    body("password").isLength({ min: 6, max: 20 }),
  ],
  checkNotAuthenticated,
  (req, res, next) => {
    res.render("login", { layout: "auth", fileName: "login" });
  }
);

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", checkAuthenticated, (req, res, next) => {
  req.logOut();
  res.redirect("/auth/login");
});

module.exports = router;
