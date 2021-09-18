var express = require("express");
var router = express.Router();

var bcrypt = require("bcrypt-nodejs");

// database module
var database = require("../config/database");
var RunQuery = database.RunQuery;

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

router.route("/").get(function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user.Admin == 1) {
      res.redirect("/admin");
    } else {
      res.redirect("/usr/" + req.user.Username);
    }
  }
  res.redirect("/");
});

router.route("/:username").get(isLoggedIn, function (req, res) {
  res.render("shop/UserProfile/UserProfile", {
    title: req.user.FullName,
    customer: req.user,
  });
});

router.route("/:username/edit").get(isLoggedIn, function (req, res) {
  res.render("shop/UserProfile/editProfile", {
    title: req.user.FullName,
    customer: req.user,
  });
});

router.post("/:username/edit/post", isLoggedIn, function (req, res) {
  var form = req.body;
  var updateQuery =
    "\
              UPDATE Users\
              SET Fullname = '" +
    form.fullName +
    "', \
                  Email = '" +
    form.email +
    "', \
                  StreetAddress = '" +
    form.streetAddress +
    "', \
                  City = '" +
    form.city +
    "', \
                  Country = '" +
    form.country +
    "', \
    Avatar = '" +
    form.Avatar +
    "', \
                  Phone = '" +
    form.phone +
    "' \
              WHERE UserID = " +
    req.user.UserID;

  RunQuery(updateQuery, function (result) {
    res.redirect("/usr/" + req.user.Username);
  });
});

router
  .route("/:username/change-password")
  .get(isLoggedIn, function (req, res) {
    res.render("shop/UserProfile/changepassword", {
      title: req.user.FullName,
      customer: req.user,
    });
  })

  .post(isLoggedIn, function (req, res) {
    var form = req.body;
    if (form.newPassword == form.repeatPassword) {
      if (bcrypt.compareSync(form.currentPassword, req.user.Password)) {
        var passwordHash = bcrypt.hashSync(form.newPassword, null, null);
        var updateQuery =
          "\
                UPDATE Users\
                SET Password = '" +
          passwordHash +
          "' \
                WHERE UserID = " +
          req.user.UserID;

        RunQuery(updateQuery, function (result) {
          res.redirect("/usr/" + req.user.Username);
        });
      } 
    } 
  });

module.exports = router;
