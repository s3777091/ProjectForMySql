var express = require("express");
var router = express.Router();
const connection = require("../config/database");
var RunQuery = connection.RunQuery;

function isAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.Admin == 1) {
      return next();
    } else {
      res.redirect("/usr/" + req.user.Username);
    }
  }
  res.redirect("/");
}
router.all("/", isAdmin, (req, res) => {
  let sqlStr = "SELECT * FROM Products";

  RunQuery(sqlStr, function (product) {
    res.render("admin/adminapp", {
      title: "Shopee 2.0",
      product: product,
    });
  });
});

router.get("/add_product", isAdmin, (req, res) => {
  res.render("admin/form/add_product_form", {
    title: "Shopee 2.0",
  });
});

router.post("/save_product", isAdmin, (req, res) => {
  let data = {
    ProductName: req.body.ProductName,
    CategoryID: req.body.CategoryID,
    ProductPrice: req.body.ProductPrice,
    UnitsInStock: req.body.UnitsInStock,
    Description: req.body.Description,
    ManufactureYear: req.body.ManufactureYear,
    Image: req.body.Image,
    ProductSlug: req.body.ProductSlug,
    Feature: req.body.Feature,
    Banner_event: req.body.Banner_event,
  };

  let sql = "INSERT INTO Products SET ?";
  RunQuery(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

router.get("/edit/:ProductSlug", isAdmin, (req, res) => {
  const ProductSlug = req.params.ProductSlug;
  let sql = `SELECT * FROM Products WHERE ProductSlug = '${ProductSlug}'`;
  RunQuery(sql, function (result) {
    res.render("admin/form/update_form", {
      title: "Shopee 2.0",
      product: result[0],
    });
  });
});

router.post("/update", isAdmin, (req, res) => {
  const ProductSlug = req.body.ProductSlug;
  let sql =
    "UPDATE Products SET ProductName='" +
    req.body.ProductName +
    "',  ProductPrice='" +
    req.body.ProductPrice +
    "', Image='" +
    req.body.Image +
    "', Description='" +
    req.body.Description +
    "',UnitsInStock='" +
    req.body.UnitsInStock +
    "', ManufactureYear='" +
    req.body.ManufactureYear +
    "' WHERE ProductSlug =" +
    '${ProductSlug}';
  RunQuery(sql, function () {
    if (err) throw err;
    res.redirect("/");
  });
});

router.get("/delete/:ProductSlug", isAdmin, (req, res) => {
  const ProductSlug = req.params.ProductSlug;
  let sql = `DELETE from Products WHERE ProductSlug = '${ProductSlug}'`;
  RunQuery(sql, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});


// Unit in stock-------------------------------------
// api router
router.get("/api/product", (req, res) => {
  let sqlStr = "SELECT * FROM Products";
  RunQuery(sqlStr, function (product) {
    res.json(product);
  });
});
// router.get("/api/product/:UnitsInStock", (req, res) => {
//   let UnitsInStock = req.params.UnitsInStock;
//   let sqlStr = SELECT * FROM Products WHERE UnitsInStock > ${UnitsInStock};
//   RunQuery(sqlStr, function (product) {
//     res.json(product);
//   });
// });

var fs = require("fs");
router.post("/api/product/post", (req, res) => {
  let UnitsInStock = req.body.UnitsInStock;
  let sqlStr = `SELECT * FROM Products WHERE UnitsInStock > ${UnitsInStock}`;
  RunQuery(sqlStr, function (product) {
    var data = JSON.stringify(product, null, 2);
    fs.writeFile("UnitStock.json", data, finished);
    function finished(err) {
      console.log("all set");
    }
    res.redirect("/admin/chart");
  });
});

//api tạo trang
router.get("/chart", (req, res) => {
  res.render("admin/Chart/StockChart", {
    title: "Shopee 2.0",
  });
});
// -----------------------------------------------------


// Orders chart-----------------------------------------
// Orders JSon
var fs = require("fs");
router.post("/api/product/post", (req, res) => {
  let Ordersdata = req.body.Ordersdata;
  let sqlStr = `SELECT * FROM Products WHERE Orders > ${Orders}`;
  RunQuery(sqlStr, function (product) {
    var data = JSON.stringify(product, null, 2);
    fs.writeFile("Orders.json", data, finished);
    function finished(err) {
      console.log("all set");
    }
    res.redirect("/admin/Orderschart");
  });
});

// Orders chart Page
router.get("/Orderschart", (req, res) => {
   res.render("admin/Orderschart/Orders", {
     title: "Shopee 2.0",
   });
 });
// ------------------------------------------------------

// Total users report //////////////////////////////////
router.get("/report/Userinfo", (req, res) => {
  var mysql = "SELECT * FROM Users";
  RunQuery(mysql, function(UserInfor) {
  var content = {
  title: "user",
  usr: UserInfor,
  customer: req.user
  };
  res.render("admin/Report/Userinfo", content);
  });
  });


// Total products report //////////////////////////////////
router.get("/report/Productinfo", (req, res) => {
  var mysql = "SELECT * FROM Products";
    RunQuery(mysql, function(UserInfor) {
        var content = {
          title: "user",
          usr: UserInfor,
          customer: req.user
        };
        res.render("admin/Report/Productinfo", content);
    });
});
//////////////////////////////////////////////////////

// >= 1000 units products report //////////////////////////////////
router.get("/report/Product1000", (req, res) => {
  var mysql = "SELECT P.Image,P.ProductID, P.ProductName, P.UnitsInStock\
                FROM Products P\
                WHERE P.UnitsInStock >= 1000";
    RunQuery(mysql, function(UserInfor) {
        var content = {
          title: "user",
          usr: UserInfor,
          customer: req.user
        };
        res.render("admin/Report/Product1000", content);
    });
});
//////////////////////////////////////////////////////

// City and Number of Users in  //////////////////////////////////
router.get("/report/UsersFromCity", (req, res) => {
  var mysql = "SELECT U.City, COUNT(*) AS Number_Cus\
                FROM Users U\
                GROUP BY U.City";
    RunQuery(mysql, function(UserInfor) {
        var content = {
          title: "user",
          usr: UserInfor,
          customer: req.user
        };
        res.render("admin/Report/UsersFromCity", content);
    });
});
//////////////////////////////////////////////////////

// Revenue by Products  //////////////////////////////////
router.get("/report/RevenueByProducts", (req, res) => {
  var mysql = "SELECT P.Image, P.ProductName, P.ProductID, P.ProductPrice, SUM(O.Total) AS Total_revenue FROM Products P, `Order Details` O WHERE P.ProductID = O.ProductID GROUP BY P.ProductName, P.ProductID, P.ProductPrice, P.Image";
    RunQuery(mysql, function(UserInfor) {
        var content = {
          title: "user",
          usr: UserInfor,
          customer: req.user
        };
        res.render("admin/Report/RevenueByProducts", content);
    });
});
//////////////////////////////////////////////////////

// Revenue and orders by Customers  //////////////////////////////////
router.get("/report/ReOrByUsers", (req, res) => {
  var mysql = "SELECT U.UserID, U.FullName, SUM(O.Total) AS Total_revenue, COUNT(O.UserID) AS Total_orders\
                FROM Users U, Orders O\
                WHERE O.UserID = U.UserID\
                GROUP BY U.UserID, U.FullName";
    RunQuery(mysql, function(UserInfor) {
        var content = {
          title: "user",
          usr: UserInfor,
          customer: req.user
        };
        res.render("admin/Report/ReOrByUsers", content);
    });
});
//////////////////////////////////////////////////////

// Revenue and Orders By Regions//////////////////////////////////
router.get("/report/ReOrByRegions", (req, res) => {
  var mysql = "SELECT U.City, SUM(U.UserID) AS Total_users, SUM(O.Total) AS Total_revenue, COUNT(O.UserID) AS Total_orders\
                FROM Users U, Orders O\
                WHERE O.UserID = U.UserID\
                GROUP BY U.City";
    RunQuery(mysql, function(UserInfor) {
        var content = {
          title: "user",
          usr: UserInfor,
          customer: req.user
        };
        res.render("admin/Report/ReOrByRegions", content);
    });
});
//////////////////////////////////////////////////////

// Revenue and Orders By Categories//////////////////////////////////
router.get("/report/ReOrByCats", (req, res) => {
  var mysql = "SELECT C.CategoryName, COUNT(P.ProductName) AS Total_products, SUM(O.Quantity) AS Total_orders, SUM(O.Total) AS Total_revenue\
                FROM Categories C,  `Order Details` O right join Products P on P.ProductID = O.ProductID\
                WHERE C.CategoryID = P.CategoryID\
                GROUP BY C.CategoryID";
    RunQuery(mysql, function(UserInfor) {
        var content = {
          title: "user",
          usr: UserInfor,
          customer: req.user
        };
        res.render("admin/Report/ReOrByCats", content);
    });
});
//////////////////////////////////////////////////////

module.exports = router;