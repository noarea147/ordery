const express = require("express");
const UserController = require("./user.controller");
const jwt = require("../../helpers/jwt");

const router = express.Router();

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);
router.get("/verify", UserController.Verify);

module.exports = router;
