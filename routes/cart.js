var express = require("express");
var router = express.Router();

// This function use to call the data sever from digital ocean
var database = require("../config/database");
var RunQuery = database.RunQuery;

router.route("/").all(function (req, res, next) {
  var summary = req.session.summary;
  var cart = req.session.cart;
  var cartSummary;
  var showCart = [];
  //i create 2 variable and session summary is call back function to graph back the summary
    //create 1 variable with call back function and array
  if (summary)
    cartSummary = {
      total: summary.total.toFixed(2),
      subTotal: summary.subTotal.toFixed(2),
    };
    //function to check the did they use the discount or shipCost if need
  for (var item in cart) {
    var aItem = cart[item];
    if (cart[item].quantity > 0) {
      showCart.push({
        //in hear aItem is variale i call below the loop for the variable mean to take the collumn in mysql
        productTotal: aItem.productTotal.toFixed(2),
        ProductSlug: aItem.ProductSlug,
        Image: aItem.Image,
        ProductID: aItem.ProductID,
        Description: aItem.Description,
        ProductName: aItem.ProductName,
        ProductPrice: aItem.ProductPrice,
        CategorySlug: aItem.CategorySlug,
        quantity: aItem.quantity,
      });
    }
  }
  //loop for all of element in cart and check if the iteams is greater than 0 push them to user interface
  req.session.showCart = showCart;
  req.session.cartSummary = cartSummary;
  //two call back
  var content = {
    title: "Cart Page",
    customer: req.user,
    cart: showCart,
    summary: cartSummary,
  };
  //in here is the function to take all the element call before to render it in ejs design
  res.render("shop/cart/cart", content);
  //res.render mean where to display that element in shop/cart/cart is the file, content variable to graph all element.
});

router.route("/:id/updateitem").post(function (req, res, next) {
  //this is rouetr to update back the cost and quality when user increase or want to buy more product
  var cart = req.session.cart;
  var newQuantityItem = parseInt(req.body[req.params.id]);
  for (var item in cart) {
    //loop for all item in cart
    if (cart[item].ProductID == req.params.id) {
      // check item prodict id of the item
      var diffirent = newQuantityItem - cart[item].quantity;
      if (diffirent != 0) {
        var summary = req.session.summary;
        summary.totalQuantity += diffirent;
        //in the begin i call back the summary to ta
        summary.subTotal = summary.subTotal + cart[item].ProductPrice * diffirent;
        //math to caculate the subtotal and return the price
        summary.total = summary.total + cart[item].ProductPrice * diffirent;
        cart[item].productTotal =
          cart[item].productTotal + cart[item].ProductPrice * diffirent;
        cart[item].quantity = newQuantityItem;
      }
    }
  }
  res.redirect("/cart");
});


//router to delete the item 
router.route("/:id/deleteitem").post(function (req, res, next) {
  var callbackcart = req.session.cart;
  var summary = req.session.summary;

  //in here i call back two variable
  summary.totalQuantity -= callbackcart[req.params.id].quantity;
  // first one update new quality
  callbackcart[req.params.id].quantity = 0;
  // bring that quality to 0
  summary.subTotal = summary.subTotal - callbackcart[req.params.id].productTotal;
  // use subtotal minus the productotal
  summary.total = summary.total - callbackcart[req.params.id].productTotal;
  callbackcart[req.params.id].productTotal = 0;
  //then bring it to 0
  res.redirect("/cart");
});

router.route("/:id/add").post(function (req, res, next) {
  req.session.cart = req.session.cart || {};
  var cart = req.session.cart;

  req.session.summary = req.session.summary || {
    totalQuantity: 0,
    subTotal: 0.0,
    total: 0.0,
  };
  var summary = req.session.summary;

  var selectQuery =
    "\
            SELECT p.*, c.CategorySlug\
            FROM Products p\
            INNER JOIN Categories c\
            ON p.CategoryID = c.CategoryID\
            WHERE ProductID = " +
    req.params.id;

  RunQuery(selectQuery, function (rows) {
    var pls = 0.0;
    var inputQuantity = parseInt(req.body.quantity);
  //in here is the function to check the product total price and if the input quality increase it will retunr the caculate
  //and update the real price for user
    if (cart[req.params.id]) {
      if (inputQuantity) {
        cart[req.params.id].quantity += inputQuantity;
        pls = cart[req.params.id].ProductPrice * inputQuantity;
        cart[req.params.id].productTotal += pls;
        summary.subTotal += pls;
        summary.totalQuantity += inputQuantity;
      } else {
        cart[req.params.id].quantity++;
        pls = cart[req.params.id].ProductPrice;
        cart[req.params.id].productTotal += pls;
        summary.subTotal += pls;
        summary.totalQuantity++;
      }
    } else {
      //if the function item not have any value we will update them
      cart[req.params.id] = rows[0];
      if (req.body.quantity) {
        cart[req.params.id].quantity = inputQuantity;
        pls = cart[req.params.id].ProductPrice * inputQuantity;
        cart[req.params.id].productTotal = pls;
        summary.subTotal += pls;
        summary.totalQuantity += inputQuantity;
      } else {
        rows[0].quantity = 1;
        pls = cart[req.params.id].ProductPrice;
        cart[req.params.id].productTotal = pls;
        summary.subTotal += pls;
        summary.totalQuantity++;
      }
    }

    summary.total = summary.subTotal;

    res.redirect("/cart");
  });
});

module.exports = router;
