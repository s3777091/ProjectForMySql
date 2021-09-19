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
      customer: req.user,
    });
  });
});

router.get("/add_product", isAdmin, (req, res) => {
  res.render("admin/form/add_product_form", {
    title: "Shopee 2.0",
    customer: req.user,
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
      customer: req.user,
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
    "${ProductSlug}";
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

router.get("/api/topuser", isAdmin, (req, res) => {
  let sqlStr =
    "SELECT DISTINCT U.Username,COUNT(*) AS Quality, SUM(O.SubTotal) AS TOTALMONEY FROM Users U, Orders O, `Order Details` OD WHERE U.UserID = O.UserID AND OD.OrderID = O.OrderID GROUP BY U.UserID HAVING COUNT(*) >= 2";
  RunQuery(sqlStr, function (user) {
    res.json(user);
  });
});

router.get("/chart", isAdmin, (req, res) => {
  res.render("admin/Chart/StockChart", {
    title:
      "Display who buy more than 2 product and total money which they spend to buy product",
    customer: req.user,
  });
});

// Orders chart-----------------------------------------
// Orders JSon
router.get("/api/sales/chartinday", isAdmin, (req, res) => {
  let sqlStr = "SELECT * FROM Products";
  RunQuery(sqlStr, function (product) {
    res.json(product);
  });
});

router.get("/api/order1000", isAdmin, (req, res) => {
  let sqlStr =
    "SELECT * FROM Products P, Orders O, `Order Details` OD WHERE P.ProductID = OD.ProductID AND O.OrderID = OD.OrderID HAVING O.SubTotal >= 1000";
  RunQuery(sqlStr, function (or) {
    res.json(or);
  });
});

// Orders chart Page
router.get("/Orderschart", isAdmin, (req, res) => {
  res.render("admin/Orderschart/Orders", {
    title: "Shopee 2.0",
    customer: req.user,
  });
});

// ------------------------------------------------------
router.get("/api/SalesOverTimeChartDay", isAdmin, (req, res) => {
  let sqlStr =
    "SELECT SUM(Total) AS Sales, DATE_FORMAT(OrderDate, '%d %M %Y') AS Time FROM Orders GROUP BY DATE_FORMAT(OrderDate, '%d %M %Y')";
  RunQuery(sqlStr, function (chart) {
    res.json(chart);
  });
});

// SOT PageS
router.get("/sales", isAdmin, (req, res) => {
  res.render("admin/Chart/SalesDay", {
    title: "Sales Over Time by Day",
    customer: req.user,
  });
});

router.get("/api/SalesOverTimeChartMonths", isAdmin, (req, res) => {
  let sqlStr =
    "SELECT SUM(Total) AS Sales, DATE_FORMAT(OrderDate, '%M %Y') AS Time FROM Orders GROUP BY DATE_FORMAT(OrderDate, '%M %Y')";
  RunQuery(sqlStr, function (chart) {
    res.json(chart);
  });
});

router.get("/api/SalesYear", isAdmin, (req, res) => {
  let sqlStr =
    "SELECT SUM(Total) AS Sales, DATE_FORMAT(OrderDate, '%Y') AS Time FROM Orders GROUP BY DATE_FORMAT(OrderDate, '%Y')";
  RunQuery(sqlStr, function (chart) {
    res.json(chart);
  });
});

router.get("/api/top10trendingproduct", isAdmin, (req, res) => {
  let sqlStr =
    "SELECT ProductName, ProductSold FROM Products P JOIN (SELECT ProductID, COUNT(ProductID) AS ProductSold FROM `Order Details` GROUP BY ProductID ORDER BY COUNT(ProductID) DESC LIMIT 10) A ON A.ProductID = P.ProductID";
  RunQuery(sqlStr, function (chart) {
    res.json(chart);
  });
});

router.get("/TrendingProChart", isAdmin,(req, res) => {
  res.render("admin/TrendingProChart/Trending", {
    title: "Shopee 2.0",
    customer: req.user,
  });
});


router.get("/api/manuyear", isAdmin, (req, res) => {
  let sqlStr =
    "SELECT ManufactureYear, COUNT(*) AS Quantity FROM Products GROUP BY ManufactureYear ORDER BY 1 ASC";
  RunQuery(sqlStr, function (year) {
    res.json(year);
  });
});

router.get("/UnitInStock", isAdmin, (req, res) => {
  res.render("admin/UnitInStockChart/UnitInStockChart", {
    title: "UnitInStockChart Chart",
    customer: req.user,
  });
});


router.get("/api/UnitInStock", isAdmin, (req, res) => {
  let sqlStr = "SELECT * FROM Products";
  RunQuery(sqlStr, function (Unit) {
    res.json(Unit);
  });
});

router.get("/sales", isAdmin, (req, res) => {
  res.render("admin/Chart/SalesDay", {
    title: "Sales Over Time by Day",
    customer: req.user,
  });
});

// ------------------------------------------------------

// Total users report //////////////////////////////////
router.get("/report/Userinfo", isAdmin, (req, res) => {
  var mysql = "SELECT * FROM Users";
  RunQuery(mysql, function (UserInfor) {
    var content = {
      title: "user",
      usr: UserInfor,
      customer: req.user,
    };
    res.render("admin/Report/Userinfo", content);
  });
});

// Total products report //////////////////////////////////
router.get("/report/Productinfo", isAdmin, (req, res) => {
  var mysql = "SELECT * FROM Products";
  RunQuery(mysql, function (UserInfor) {
    var content = {
      title: "user",
      usr: UserInfor,
      customer: req.user,
    };
    res.render("admin/Report/Productinfo", content);
  });
});
//////////////////////////////////////////////////////

// >= 1000 units products report //////////////////////////////////
router.get("/report/Product1000", isAdmin, (req, res) => {
  var mysql =
    "SELECT P.Image,P.ProductID, P.ProductName, P.UnitsInStock\
                FROM Products P\
                WHERE P.UnitsInStock >= 1000";
  RunQuery(mysql, function (UserInfor) {
    var content = {
      title: "user",
      usr: UserInfor,
      customer: req.user,
    };
    res.render("admin/Report/Product1000", content);
  });
});
//////////////////////////////////////////////////////

// City and Number of Users in  //////////////////////////////////
router.get("/report/UsersFromCity", isAdmin, (req, res) => {
  var mysql =
    "SELECT U.City, COUNT(*) AS Number_Cus\
                FROM Users U\
                GROUP BY U.City";
  RunQuery(mysql, function (UserInfor) {
    var content = {
      title: "user",
      usr: UserInfor,
      customer: req.user,
    };
    res.render("admin/Report/UsersFromCity", content);
  });
});

// Revenue by Products  //////////////////////////////////
router.get("/report/RevenueByProducts", isAdmin, (req, res) => {
  var mysql =
    "SELECT P.Image, P.ProductName, P.ProductID, P.ProductPrice, SUM(O.Total) AS Total_revenue FROM Products P, `Order Details` O WHERE P.ProductID = O.ProductID GROUP BY P.ProductName, P.ProductID, P.ProductPrice, P.Image";
  RunQuery(mysql, function (UserInfor) {
    var content = {
      title: "user",
      usr: UserInfor,
      customer: req.user,
    };
    res.render("admin/Report/RevenueByProducts", content);
  });
});

// Revenue and orders by Customers  //////////////////////////////////
router.get("/report/ReOrByUsers", isAdmin, (req, res) => {
  var mysql =
    "SELECT U.Avatar, U.UserID, U.FullName, SUM(O.Total) AS Total_revenue, COUNT(O.UserID) AS Total_orders\
                FROM Users U, Orders O\
                WHERE O.UserID = U.UserID\
                GROUP BY U.UserID, U.FullName";
  RunQuery(mysql, function (UserInfor) {
    var content = {
      title: "user",
      usr: UserInfor,
      customer: req.user,
    };
    res.render("admin/Report/ReOrByUsers", content);
  });
});

// Revenue and Orders By Regions//////////////////////////////////
router.get("/report/ReOrByRegions", isAdmin, (req, res) => {
  var mysql =
    "SELECT U.City, SUM(U.UserID) AS Total_users, SUM(O.Total) AS Total_revenue, COUNT(O.UserID) AS Total_orders\
                FROM Users U, Orders O\
                WHERE O.UserID = U.UserID\
                GROUP BY U.City";
  RunQuery(mysql, function (UserInfor) {
    var content = {
      title: "user",
      usr: UserInfor,
      customer: req.user,
    };
    res.render("admin/Report/ReOrByRegions", content);
  });
});

// Revenue and Orders By Categories//////////////////////////////////
router.get("/report/ReOrByCats", isAdmin, (req, res) => {
  var mysql =
    "SELECT C.CategoryID, C.CategoryName, COUNT(P.ProductName) AS Total_products, SUM(O.Quantity) AS Total_orders, SUM(O.Total) AS Total_revenue\
                FROM Categories C,  `Order Details` O right join Products P on P.ProductID = O.ProductID\
                WHERE C.CategoryID = P.CategoryID\
                GROUP BY C.CategoryID";
  RunQuery(mysql, function (UserInfor) {
    var content = {
      title: "user",
      usr: UserInfor,
      customer: req.user,
    };
    res.render("admin/Report/ReOrByCats", content);
  });
});
// Revenue and Orders By Categories//////////////////////////////////

router.get("/report/ReProductByCate", isAdmin, (req, res) => {
  var mysql =
    "SELECT B.CategoryID, C.CategoryName, SUM(B.UnitsInStock) AS TotalUnits, COUNT(B.ProductID) AS TotalProducts\
    FROM Products B\
    INNER JOIN Categories C on B.CategoryID = C.CategoryID\
    GROUP BY CategoryID\
    ORDER BY CategoryID ASC";
  RunQuery(mysql, function (product) {
    var content = {
      title: "user",
      productCategory: product,
      customer: req.user,
    };
    res.render("admin/Report/ReProductByCate", content);
  });
});

router.get("/report/ReTop10Order", isAdmin, (req, res) => {
  var mysql =
    "SELECT OrderID, U.FullName, Total, DATE_FORMAT(OrderDate,'%d %M %Y') AS Date\
              FROM Orders\
              INNER JOIN Users U on Orders.UserID = U.UserID\
              ORDER BY SubTotal DESC\
              LIMIT 10;";
  RunQuery(mysql, function (UserInfor) {
    var content = {
      title: "user",
      usr: UserInfor,
      customer: req.user,
    };
    res.render("admin/Report/ReTop10Order", content);
  });
});
//////////////////////////////////////////////////////

module.exports = router;
