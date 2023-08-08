const mongoose = require("mongoose");
const UserModel = require("../src/user/user.model");
const MenuModel = require("../src/menu/menu.model");
const BusinessModel = require("../src/business/business.model");
const OrderModel = require("../src/order/order.model");
const config = require("../config/database");

config();

// const dropDB = async () => {
//     try {
//       await UserModel.deleteMany({});
//       await MenuModel.deleteMany({});
//       await BusinessModel.deleteMany({});
//       await OrderModel.deleteMany({});
//       console.log("Database cleared");
//     } catch (error) {
//       console.log(error);
//     } finally {
//       // Close the database connection after clearing
//       mongoose.connection.close();
//     }
//   };

const dropDB = async () => {
  try {
    const user = await UserModel.find({ email: "nejone5601@v1zw.com" });
    const userJSONString = JSON.stringify(user);
    console.log(userJSONString);
  } catch (error) {
    console.log(error);
  } finally {
    mongoose.connection.close();
  }
};

dropDB();
