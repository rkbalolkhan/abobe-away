if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const wrapAsync = require("./utils/wrapAsync.js");
const User = require("./models/user.js");

const app = express();

const sessionOptions = {
  secret: "enteryoursecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");

// const mongo_url = "mongodb://127.0.0.1:27017/AbodeAway";
const dbURL = process.env.ATLASDB_URL;

main()
  .then(() => console.log("Connection to DB Successful"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { statusCode, message });
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
