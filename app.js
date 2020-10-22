const path = require("path");
const fs = require("fs");
const https = require("https");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const morgan = require("morgan");
const MongoStore = require("connect-mongo")(session);

const connectDB = require("./config/database");
const User = require("./models/User");

// loading configuration file from path
// "./config/config.env" to access environment
// variables such as PORT, NODE_ENV, etc. that
// can be used globally for various reasons
// including but not limited to segregating between
// production and development environments
dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

// adding oauth strategies
initializePassport = require("./config/local_passport");
initializePassport(passport);

// connection to the database using config
connectDB();

// initialising an express app
app = express();

// adding body parser middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// adding morgan middleware for logging
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("using morgan middleware (dev) for logging");
}

// initialising express-handlebars for templating
app.engine(
  ".hbs",
  exphbs({
    helpers: {},
    defaultLayout: "main.hbs",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// adding middleware for session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// adding middleware for passport
app.use(passport.initialize());
app.use(passport.session());

// adding public directory for assets
app.use(express.static(path.join(__dirname, "public")));

// adding routes for "/..." endpoints
app.use("/", require("./routes/index.js"));

// adding routes for "/auth/..." endpoints
app.use("/auth", require("./routes/auth.js"));

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);

// initialising express app to listen to
// any incoming requests
app.listen(PORT, (req, res) => {
  console.log(`server running in ${NODE_ENV} at port: ${PORT}`);
});
