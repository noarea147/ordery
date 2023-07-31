const UserModel = require("../src/user/user.model");
const BusinessModel = require("../src/business/business.model");

exports.createBusiness = async (data) => {
  try {
    const business = new BusinessModel.create(data);
    return business;
  } catch (err) {
    console.log(err);
  }
};
exports.createUser = async (data) => {
  try {
    const user = new UserModel.create(data);
    return user;
  } catch (err) {
    console.log(err);
  }
};
