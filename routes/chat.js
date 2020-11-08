const express = require("express");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middleware/auth_middleware");
router = express.Router();

router.get("/", checkAuthenticated, (req, res) => {
  res.render("chat.hbs");
});

module.exports = router;
