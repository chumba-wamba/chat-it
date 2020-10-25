const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

function initialize(passport) {
  const authenticateUser = async (userName, password, done) => {
    const user = await User.findOne({ userName: userName });
    if (user == null) {
      return done(null, false, { message: "no user with that username" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "userName" }, authenticateUser)
  );
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    return done(null, await User.findOne({ _id: id }));
  });
}

module.exports = initialize;
