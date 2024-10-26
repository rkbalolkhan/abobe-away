const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.userSignup = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", "Welcome to AbodeAway");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/listings");
  }
};

module.exports.renderSigninForm = (req, res) => {
  res.render("users/signin.ejs");
};

module.exports.userSignin = async (req, res) => {
  req.flash("success", "Welcome back to AbodeAway");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.userSignout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "You are Signed Out now");
      res.redirect("/listings");
    }
  });
};
