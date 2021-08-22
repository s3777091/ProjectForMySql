module.exports = function (app, passport) {
    app.get("/sign-in", function (req, res) {
      // render the page and pass in any flash data if it exists
      if (req.session.inCheckOut) {
        var checkOutNoti =
          "You need to sign in to check out!\
                    Please sign up if you do not have one!";
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
        successRedirect: "/usr",
        failureRedirect: "/sign-in", // redirect back to the signup page if there is an error
        failureFlash: true, // allow flash messages
      }),
      function (req, res, info) {
        res.render("shop/userlogin/login", { message: req.flash("message") });
      }
    );
  
    app.get("/sign-up", function (req, res) {
      // render the page and pass in any flash data if it exists
  
      if (req.session.inCheckOut) {
        var checkOutNoti =
          "You need to sign Up to check out!\
              Please sign in if you have yet!";
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
        successRedirect: "/sign-in", // redirect to the secure profile section
        failureRedirect: "/sign-up", // redirect back to the signup page if there is an error
        failureFlash: true, // allow flash messages
      })
    );
  
    app.get("/sign-out", function (req, res) {
      req.logout();
      res.redirect("/sign-in");
    });
  };
  