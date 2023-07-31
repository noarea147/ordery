const OrderController = require("./order.controller");
const express = require("express");
const router = express.Router();

router.post("/place-order", OrderController.PlacrOrder);

module.exports = router;
