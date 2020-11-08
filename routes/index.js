const express = require("express");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middleware/auth_middleware");
router = express.Router();

router.get("/", checkNotAuthenticated, (req, res, next) => {
  res.redirect("/auth/login");
});

router.get("/dashboard", checkAuthenticated, (req, res, next) => {
  res.render("dashboard.hbs", {
    firstName: req.user.firstName,
    fileName: "dashboard",
  });
});

module.exports = router;
