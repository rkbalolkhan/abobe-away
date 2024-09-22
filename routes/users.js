const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { userSchema } = require("../schema.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.userSignup));

router
  .route("/signin")
  .get(userController.renderSigninForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true,
    }),
    wrapAsync(userController.userSignin)
  );

router.get("/signout", userController.userSignout);

module.exports = router;
