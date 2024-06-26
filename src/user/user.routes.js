const express = require("express");
const UserController = require("./user.controller");
const jwt = require("../../helpers/jwt");

const router = express.Router();

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);
router.post("/verify", UserController.Verify);
router.post("/updateToken", UserController.updateFcmToken);

module.exports = router;
