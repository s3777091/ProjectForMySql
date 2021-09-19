var express = require("express");
var router = express.Router();

// database connect from digital ocean
var database = require("../config/database");
var RunQuery = database.RunQuery;


//function to check is that a admin or user
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else{
    res.redirect("/sign-in");
  }
}

//home page rendering
router.all("/", isLoggedIn, function (req, res) {
  var sqlStr = "\
        SELECT *\
        FROM Categories";
        // i want the homepage have categories and product
  RunQuery(sqlStr, function (categories) {
    sqlStr =
      "SELECT P.*, C.CategoryName, C.CategorySlug\
      FROM Products P\
      INNER JOIN Categories C\
      ON P.CategoryID = C.CategoryID\
      WHERE Feature = 1";
// join category and product
    RunQuery(sqlStr, function (products) {
      var content = {
        title: "Home",
        categories: categories,
        featProducts: products,
        customer: req.user,
      };
      res.render("app", content);
    });
  });
});

//click go to categories page
router.route("/cat/").all(isLoggedIn,function (req, res, next) {
  var sqlStr = "SELECT * FROM Categories";
  RunQuery(sqlStr, function (categories) {
    var content = {
      title: "Categories",
      categories: categories,
      customer: req.user,
    };

    res.render("categories", content);
  });
});

//this one render category and product of that category
router.route("/cat/:catSlug").all(isLoggedIn,function (req, res, next) {
  if (req.params.catSlug == "all") {
    var select1 =
      "\
      SELECT P.*, C.CategoryName, C.CategorySlug\
      FROM Products P\
      INNER JOIN Categories C\
      ON P.CategoryID = C.CategoryID";

    RunQuery(select1, function (products) {
      select2 = "SELECT * FROM Categories";
      RunQuery(select2, function (categories) {
        var content = {
          title: "All products",
          products: products,
          categories: categories,
          customer: req.user,
        };

        res.render("shop/productDetail/CatoryProduct", content);
      });
    });
  } else {
    var sqlStr =
      `SELECT P.*, C.CategoryName, C.CategorySlug\
       FROM Products P\
        INNER JOIN Categories C\
       ON P.CategoryID = C.CategoryID\
       WHERE C.CategorySlug = '${req.params.catSlug}'` 

    RunQuery(sqlStr, function (products) {
      sqlStr = "SELECT * FROM Categories";
      RunQuery(sqlStr, function (categories) {
        var content = {
          title: products[0].CategoryName,
          products: products,
          categories: categories,
          customer: req.user,
        };

        res.render("shop/productDetail/CatoryProduct", content);
      });
    });
  }
});

//category page 
router.route("/cat/:catSlug/:prodSlug").all(isLoggedIn,function (req, res, next) {
  var sqlStr =
    `SELECT * FROM Products WHERE ProductSlug = '${req.params.prodSlug}'`
  RunQuery(sqlStr, function (product) {
    var content = {
      title: product[0].ProductName,
      product: product[0],
      customer: req.user,
    };

    res.render("shop/productDetail/detail", content);
  });
});

module.exports = router;
