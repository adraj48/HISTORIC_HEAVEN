const User = require("../models/user");

module.exports.register = (req, res) => {
  res.render("users/register");
};

module.exports.newuser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registered = await User.register(user, password);
    req.login(registered, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome back!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    // console.log(registered);
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.loginform = (req, res) => {
  res.render("users/login");
};

module.exports.loginchk = (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect("/campgrounds");
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "jai shree ram!");
    res.redirect("/campgrounds");
  });
};
