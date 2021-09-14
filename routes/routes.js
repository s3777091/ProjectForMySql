var express = require("express");
var router = express.Router();

// database module
var database = require("../config/database");
var RunQuery = database.RunQuery;

/* Route Home page. */

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else{
    res.redirect("/sign-in");
  }
}
router.all("/", isLoggedIn, function (req, res, next) {
  var sqlStr = "\
        SELECT *\
        FROM Categories";

  RunQuery(sqlStr, function (categories) {
    sqlStr =
      "\
            SELECT P.*, C.CategoryName, C.CategorySlug\
            FROM Products P\
            INNER JOIN Categories C\
            ON P.CategoryID = C.CategoryID\
            WHERE Feature = 1";

    RunQuery(sqlStr, function (products) {
      var contextDict = {
        currentUrl: "/",
        title: "Home",
        categories: categories,
        featProducts: products,
        customer: req.user,
      };
      res.render("app", contextDict);
    });
  });
});

/* Route Category page. */
router.route("/cat/").all(isLoggedIn,function (req, res, next) {
  var sqlStr = "\
        SELECT *\
        FROM Categories";

  RunQuery(sqlStr, function (categories) {
    var contextDict = {
      currentUrl: "/cat",
      title: "Categories",
      categories: categories,
      customer: req.user,
    };

    res.render("categories", contextDict);
  });
});

/* Route Category Products page. */
router.route("/cat/:catSlug").all(isLoggedIn,function (req, res, next) {
  if (req.params.catSlug == "all") {
    var selectQuery =
      "\
      SELECT P.*, C.CategoryName, C.CategorySlug\
      FROM Products P\
      INNER JOIN Categories C\
      ON P.CategoryID = C.CategoryID";

    RunQuery(selectQuery, function (products) {
      selectQuery = "\
                SELECT *\
                FROM Categories";

      RunQuery(selectQuery, function (categories) {
        var contextDict = {
          title: "All products",
          products: products,
          categories: categories,
          customer: req.user,
        };

        res.render("shop/productDetail/CatoryProduct", contextDict);
      });
    });
  } else {
    var sqlStr =
      "\
                SELECT P.*, C.CategoryName, C.CategorySlug\
                FROM Products P\
                INNER JOIN Categories C\
                ON P.CategoryID = C.CategoryID\
                WHERE C.CategorySlug = '" +
      req.params.catSlug +
      "'";

    RunQuery(sqlStr, function (products) {
      sqlStr = "\
                SELECT *\
                FROM Categories";

      RunQuery(sqlStr, function (categories) {
        var contextDict = {
          title: products[0].CategoryName,
          products: products,
          categories: categories,
          customer: req.user,
        };

        res.render("shop/productDetail/CatoryProduct", contextDict);
      });
    });
  }
});

/* Route Product page. */
router.route("/cat/:catSlug/:prodSlug").all(isLoggedIn,function (req, res, next) {
  var sqlStr =
    "\
        SELECT *\
        FROM Products\
        WHERE ProductSlug = '" +
    req.params.prodSlug +
    "'";

  RunQuery(sqlStr, function (product) {
    var contextDict = {
      title: product[0].ProductName,
      product: product[0],
      customer: req.user,
    };

    res.render("shop/productDetail/detail", contextDict);
  });
});

module.exports = router;
