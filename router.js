const express = require("express");
const router = express.Router();

const orderProducts = require("./api/orderProducts/orderProducts.controller");
const orders = require("./api/orders/orders.controller");
const products = require("./api/products/products.controller");
const users = require("./api/users/users.controller");

router.use("/orderProducts", orderProducts);
router.use("/orders", orders);
router.use("/products", products);
router.use("/users", users);

module.exports = router;