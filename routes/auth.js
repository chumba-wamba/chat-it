const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
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
  res.render("register", { layout: "auth", scriptType: "register" });
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    newUser = {
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
    };
    await User.create(newUser);
    console.log("user successfully created!");
    res.redirect("/auth/login");
  } catch {
    res.redirect("/auth/register");
  }
});

router.get("/login", checkNotAuthenticated, (req, res, next) => {
  res.render("login", { layout: "auth", scriptType: "login" });
});

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
