const express = require("express");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middleware/auth_middleware");
router = express.Router();

router.get("/dashboard", checkAuthenticated, (req, res, next) => {
  console.log(req.user);
  res.render("dashboard.hbs", { firstName: req.user.firstName });
});

module.exports = router;
