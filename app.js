if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// console.log(process.env.CLOUDINARY_KEY);
const express = require("express");
const router = express.Router();
const path = require("path");
const Joi = require("joi");
const catchAsync = require("./utils/catchAsync");
const engine = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Review = require("./models/review");
const campgroundRoutes = require("./routes/campgrounds");
const ExpressError = require("./utils/ExpreeError.js");
// const { campgroundSchema, reviewSchema } = require("./schemas.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/users.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const Mongostore = require("connect-mongo")(session);
const dburl = process.env.DB_URL;
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
// const campground = require("./models/campground");
mongoose
  .connect(dburl) // dburl ||"mongodb://127.0.0.1:27017/yelp-camp"//mongo.exe is not present in mongodb bin folder and mongo -v is also not running in cmd
  .then(() => {
    console.log("Mongo Connection Open");
  })
  .catch((err) => {
    console.log("Mongo connection error");
  });

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", engine);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(mongoSanitize());

// const store = new Mongostore({
//   //.create
//   url: dburl,
//   secret: "thisshouldbeabettersecret!",
//   touchAfter: 24 * 3600,
// });

// store.on("error", function (e) {
//   console.log("SESSION TIMEOUT", e);
// });
const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const sessionConfig = {
  // store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  //console.log(req.session);
  //console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);
app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`serving on port ${port} `);
});
