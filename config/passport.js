
var LocalStrategy = require("passport-local").Strategy;

var bcrypt = require("bcrypt-nodejs");

var database = require("../config/database");
var RunQuery = database.RunQuery;

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.UserID);
  });
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
        passReqToCallback: true,
      },
      function (req, username, password, done) {
        var sqlStr = "SELECT * FROM Users WHERE Username = '" + username + "'";
        RunQuery(sqlStr, function (rows) {
          if (rows.length < 1)
            return done(
              null,
              false,
              req.flash("signInError", "No user found.")
            );
          if (!bcrypt.compareSync(password, rows[0].Password))
            return done(
              null,
              false,
              req.flash("signInError", "Oops! Wrong password.")
            );
          return done(null, rows[0]);
        });
      }
    )
  );

  passport.use(
    "sign-up",
    new LocalStrategy(
      {
        usernameField: "Username",
        passwordField: "Password",
        passReqToCallback: true,
      },
      function (req, Username, Password, done) {
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
                  var FullName = req.body.FullName;
                  var Phone = "0123456789";
                  var Address = "123 Hoang Dieu";
                  var City = "Da nang";
                  var Country = "Viet Nam";
                  var Avatar =
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI3vvVZ-pOGsyhaNEm9s-tm96lh7OGxJrpPQ&usqp=CAU";
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
                    City +
                    "', \
                                    '" +
                    Country +
                    "', \
                                    '" +
                    Avatar +
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
                    var user = {
                      UserID: insertResult.insertId,
                    };
                    insertQuery =
                      "INSERT INTO DeliveryAdresses\
                                        VALUES(null, " +
                      insertResult.insertId +
                      ", '" +
                      FullName +
                      "', '" +
                      Address +
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
