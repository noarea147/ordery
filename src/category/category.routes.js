const express = require("express");
const CategoryController = require("./category.controller");
const jwt = require("../../helpers/jwt");

const router = express.Router();

// router.post("/create",jwt.authenticateAccessToken, CategoryController.AddCategory);
router.post("/getCategories", CategoryController.GetCategories);

module.exports = router;
