const express = require("express");
const BusinessController = require("./business.controller");
const jwt = require("../../helpers/jwt");

const router = express.Router();

router.post("/create",jwt.authenticateAccessToken, BusinessController.AddBusiness);
router.post("/update",jwt.authenticateAccessToken, BusinessController.UpdateBusiness);
router.post("/getMyBusiness",jwt.authenticateAccessToken, BusinessController.GetMyBusiness);
router.post("/GetBusinessByUsername",BusinessController.GetBusinessByUsername);


module.exports = router;