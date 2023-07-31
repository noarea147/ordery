const express = require("express");
const BusinessController = require("./business.controller");
const jwt = require("../../helpers/jwt");

const router = express.Router();

router.post("/create",jwt.authenticateAccessToken, BusinessController.AddBusiness);

module.exports = router;