var express = require("express");
var router = express.Router();

// this one to take data from digital ocean sever
var database = require("../config/database");
var RunQuery = database.RunQuery;

router.route("/").get(function (req, res) {
  req.session.address = {};
  if (req.isAuthenticated()) {
    if (req.session.cart) {
      if (req.session.summary.totalQuantity > 0) {
        res.redirect("/checkout/delivery");
      }
    }
    res.redirect("/cart");
  } else {
    req.session.inCheckOut = true;
    res.redirect("/sign-in");
  }
});

router.route("/delivery").get(function (req, res, next) {
  req.session.address = {};
  // show DeliveryAdressessvs
  var selectQuery =
    "\
            SELECT *\
            FROM DeliveryAdresses\
            WHERE UserID = " +
    req.user.UserID +
    ";";
  RunQuery(selectQuery, function (ad) {
    req.session.address = ad;
    var content = {
      title: "Delivery Address",
      addresses: ad,
      customer: req.user,
    };
    res.render("shop/CheckOut/delivery", content);
  });
});

router.route("/delivery/new").post(function (req, res, next) {
  var fullName = req.body.fullName;
  var email = req.body.email;
  var address = req.body.streetAddress;
  var city = req.body.city;
  var country = req.body.country;
  var phone = req.body.phone;

  // add address
  var Query =
    "INSERT INTO DeliveryAdresses VALUES(null, " +
    req.user.UserID +
    ", '" +
    fullName +
    "', '" +
    address +
    "', '" +
    city +
    "', '" +
    country +
    "', '" +
    phone +
    "')";
  RunQuery(Query, function (rows) {
    req.session.address = {
      AddressID: rows.insertId,
      FullName: fullName,
      Email: email,
      StreetAddress: address,
      City: city,
      Country: country,
      Phone: phone,
    };
    res.redirect("/checkout/review");
  });
});

router.route("/delivery/:id").post(function (req, res) {
  var selectQuery =
    "\ SELECT *\
            FROM DeliveryAdresses\
            WHERE AddressID = " +
    req.params.id +
    ";";

  RunQuery(selectQuery, function (rows) {
    req.session.address = rows[0];
    res.redirect("/checkout/review");
  });
});

router.route("/review").get(function (req, res) {
  var content = {
    title: "Review Order",
    cart: req.session.showCart,
    summary: req.session.cartSummary,
    address: req.session.address,
    customer: req.user,
  };
  res.render("shop/CheckOut/review", content);
});

router.route("/order").get(function (req, res) {
  var insertQuery =
    "\
            INSERT INTO Orders\
            VALUES(null, " +
    req.user.UserID +
    ", " +
    req.session.address.AddressID +
    ", " +
    req.session.cartSummary.subTotal +
    ", " +
    req.session.cartSummary.total +
    ", NOW(), 'we see your order');";

  RunQuery(insertQuery, function (rows) {
    for (var item in req.session.cart) {
      if (req.session.cart[item].quantity > 0) {
        insertQuery =
          "\
                        INSERT INTO `Order Details`\
                        VALUES(" +
          rows.insertId +
          ", " +
          req.session.cart[item].ProductID +
          ", " +
          req.session.cart[item].quantity +
          ", " +
          req.session.cart[item].productTotal +
          ");";

        updateQuery =
          "UPDATE Products SET UnitsInStock = (UnitsInStock - " +
          req.session.cart[item].quantity +
          ") WHERE ProductID = " +
          req.session.cart[item].ProductID;
        RunQuery(insertQuery, function (r) {
          RunQuery(updateQuery, function (r2) {});
        });
      }
    }
    var selectQuery =
      "\
            SELECT *\
            FROM Orders\
            WHERE OrderID = " +
      rows.insertId;
    RunQuery(selectQuery, function (order) {
      //i take the delivery infor
      selectQuery =
        "\
                SELECT *\
                FROM DeliveryAdresses\
                WHERE AddressID = " +
        order[0].AddressID;

      RunQuery(selectQuery, function (address) {
        //i take the order infor 
        selectQuery =
          "\
                    SELECT *\
                    FROM `Order Details` O\
                    INNER JOIN (\
                        SELECT P.*, C.CategorySlug\
                        FROM Products P\
                        INNER JOIN Categories C\
                        ON P.CategoryID = C.CategoryID\
                    ) T\
                    ON O.ProductID = T.ProductID\
                    WHERE OrderID = " +
          order[0].OrderID;

        RunQuery(selectQuery, function (products) {
          req.session.cart = {};
          req.session.summary = {
            totalQuantity: 0,
            subTotal: 0.0,
            total: 0.0,
          };
          req.session.cartSummary = {};
          req.session.showCart = {};
          req.session.address = {};
          var content = {
            title: "Order" + rows.insertId,
            customer: req.user,
            order: order[0],
            address: address[0],
            products: products,
          };
          res.render("shop/CheckOut/comfirm", content);
        });
      });
    });
  });
});

module.exports = router;