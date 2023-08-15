const express = require("express");
const MenuController = require("./menu.controller");
const jwt = require("../../helpers/jwt");

const router = express.Router();

router.post("/create",jwt.authenticateAccessToken, MenuController.AddMenu);
router.post("/edit",jwt.authenticateAccessToken, MenuController.EditMenu);
router.post("/addProduct",jwt.authenticateAccessToken, MenuController.AddProducts);
router.post("/getMyMenus",jwt.authenticateAccessToken, MenuController.GetMyMenus);
router.post("/getMenu", MenuController.GetMenu);
router.post("/getMenuProducts", MenuController.GetMenuById);
router.post("/delete",jwt.authenticateAccessToken, MenuController.DeleteMenu);
router.post("/deleteProduct",jwt.authenticateAccessToken, MenuController.DeleteProduct);
// router.post("/login", UserController.Login);
// router.get("/refresh", UserController.Refresh);
// router.post("/update", jwt.authenticateToken, UserController.Update);
// router.post("/reset-password", UserController.ResetPassword);
// router.post("/change-password", jwt. authenticateToken, UserController.ChangePassword);
// router.post("/forgot-password", UserController.ForgotPassword);
// router.post("/verify/", UserController.Verify);
// router.post("/change-email", jwt.authenticateToken, UserController.ChangeEmail);
// router.post("/update-token",UserController.updateFcmToken);

module.exports = router;
