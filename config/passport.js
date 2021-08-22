// config/passport.js
var LocalStrategy = require("passport-local").Strategy;

// Generate Hash
var bcrypt = require("bcrypt-nodejs");

// database module
var database = require("../config/database");
var RunQuery = database.RunQuery;

// expose this function to our app using module.exports
module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.UserID);
  });

  // used to deserialize the user
  passport.deserializeUser(function (userId, done) {
    var sqlStr =
      "\
            SELECT *\
            FROM Users\
            where UserID = '" +
      userId +
      "'";
    RunQuery(sqlStr, function (rows) {
      done(null, rows[0]);
    });
  });

  passport.use(
    "sign-in",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true, // allows to pass back the entire request to the callback
      },
      function (req, username, password, done) {
        // callback with username and password from form
        // check to see if the user exists or not
        var sqlStr = "SELECT * FROM Users WHERE Username = '" + username + "'";
        RunQuery(sqlStr, function (rows) {
          // if no user is found, return the message
          if (rows.length < 1)
            return done(
              null,
              false,
              req.flash("signInError", "No user found.")
            ); // req.flash is the way to set flashdata using connect-flash

          // if the user is found but the password is wrong
          if (!bcrypt.compareSync(password, rows[0].Password))
            return done(
              null,
              false,
              req.flash("signInError", "Oops! Wrong password.")
            ); // create the loginMessage and save it to session as flashdata

          // all is well, return successful user
          return done(null, rows[0]);
        });
      }
    )
  );

  passport.use(
    "sign-up",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password
        usernameField: "Username",
        passwordField: "Password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function (req, Username, Password, done) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        var Email = req.body.Email;

        if (Password != req.body.rePassword) {
          return done(
            null,
            false,
            req.flash("signUpError", "Passwords do not match.")
          );
        } else {
          var selectQuery =
            "SELECT *\
                    FROM Users\
                    WHERE Email = '" +
            Email +
            "'";
          RunQuery(selectQuery, function (emailRows) {
            if (emailRows.length > 0) {
              return done(
                null,
                false,
                req.flash("signUpError", "Email address has already been used.")
              );
            } else {
              selectQuery =
                "\
                        SELECT *\
                        FROM Users\
                        WHERE Username = '" +
                Username +
                "'";
              RunQuery(selectQuery, function (usernameRows) {
                if (usernameRows.length > 0) {
                  return done(
                    null,
                    false,
                    req.flash("signUpError", "Username has already been used.")
                  );
                } else {
                  // if there is no user with that user and email
                  var FullName = req.body.FullName;
                  var Phone = "0123456789";
                  var Address = "123 Hoang Dieu";
                  var PostCode = "4541";
                  var City = "Da nang";
                  var Country = "Viet Nam";
                  var passwordHash = bcrypt.hashSync(Password, null, null);
                  var insertQuery =
                    "INSERT INTO Users\
                                    VALUES(null,\
                                    '" +
                    FullName +
                    "', \
                                    '" +
                    Address +
                    "', \
                                    '" +
                    PostCode +
                    "', \
                                    '" +
                    City +
                    "', \
                                    '" +
                    Country +
                    "', \
                                    '" +
                    Phone +
                    "', \
                                    '" +
                    Email +
                    "', \
                                    '" +
                    Username +
                    "', \
                                    '" +
                    passwordHash +
                    "', 0)";

                  RunQuery(insertQuery, function (insertResult) {
                    //user
                    var user = {
                      UserID: insertResult.insertId,
                    };
                    insertQuery =
                      "INSERT INTO Addresses\
                                        VALUES(null, " +
                      insertResult.insertId +
                      ", '" +
                      FullName +
                      "', '" +
                      Address +
                      "', '" +
                      PostCode +
                      "', '" +
                      City +
                      "', '" +
                      Country +
                      "', '" +
                      Phone +
                      "')";
                    RunQuery(insertQuery, function (addRow) {
                      return done(null, user);
                    });
                  });
                }
              });
            }
          });
        }
      }
    )
  );
};
