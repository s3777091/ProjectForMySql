module.exports = function (app, passport) {
    app.get("/sign-in", function (req, res) {
      // render the page and pass in any flash data if it exists
      if (req.session.inCheckOut) {
        var checkOutNoti =
          "You Need sign in If you don't have acount Please sign up";
        req.session.inCheckOut = false;
      }
      var contextDict = {
        title: "Sign In",
        signInError: req.flash("signInError"),
        checkOutNoti: checkOutNoti,
      };
      res.render("shop/userlogin/login", contextDict);
    });
  
    app.post(
      "/sign-in",
      passport.authenticate("sign-in", {
        successRedirect: "/usr/",
        failureRedirect: "/sign-in",
        failureFlash: true,
      }),
      function (req, res, info) {
        res.render("shop/userlogin/login", { message: req.flash("message") });
      }
    );
  
    app.get("/sign-up", function (req, res) {
  
      if (req.session.inCheckOut) {
        var checkOutNoti =
          "You need to sign Up to buy product\
            Loign if you have one";
        req.session.inCheckOut = false;
      }
  
      var contextDict = {
        title: "Sign Up",
        signUpError: req.flash("signUpError"),
        checkOutNoti: checkOutNoti,
      };
      res.render("shop/userlogin/register", contextDict);
    });
  
    // process the signup form
    app.post(
      "/sign-up",
      passport.authenticate("sign-up", {
        successRedirect: "/sign-in",
        failureRedirect: "/sign-up",
        failureFlash: true,
      })
    );
  
    app.get("/sign-out", function (req, res) {
      req.logout();
      res.redirect("/sign-in");
    });
  };
  