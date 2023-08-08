const OrderController = require("./order.controller");
const express = require("express");
const router = express.Router();

router.post("/placeOrder", OrderController.PlacrOrder);
router.post("/getMyBusinessOrders", OrderController.GetMyBusinessOrders);

module.exports = router;
