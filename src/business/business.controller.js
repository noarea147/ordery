const BusinessModel = require("./business.model");
const UserModel = require("../user/user.model");
const utils = require("../../helpers/utils");

exports.AddBusiness = async (req, res) => {
  try {
    const {
      BusinessName,
      description,
      location,
      address,
      email,
      phone,
      userId,
    } = req.body;

    const user = await UserModel.findOne({ _id: userId }); // Add "await" here
    if (!user) {
      return res.json(utils.handleResponse("User not found", 404));
    }

    const business = await new BusinessModel({
      BusinessName,
      description,
      location,
      address,
      email,
      phone,
    });
    await business.save();

    user.BusinessID.push(business._id); // Assuming BusinessID is an array, use "push" method to add the business ID
    await user.save();

    return res.json(
      utils.handleResponse("Business added successfully", 201, business)
    );
  } catch (error) {
    return res.json(utils.handleResponse(error.message, 500));
  }
};

exports.UpdateBusiness = async (req, res) => {
  try {
    const AuthUser = req.user;
    const user = await UserModel.findById(AuthUser._id).populate("BusinessID");
    const {
      businessId,
      BusinessName,
      description,
      location,
      address,
      email,
      phone,
    } = req.body;
    const business = await BusinessModel.findOne({ _id: businessId });
    if (!business) {
      return res.json(utils.handleResponse("Business not found", 404));
    }
    if (utils.isBusinessOwner(user.BusinessID, req.body.businessId)) {
      return res.json(
        utils.handleResponse("You are not the owner of this business", 401)
      );
    }
    business.BusinessName = BusinessName;
    business.description = description;
    business.location = location;
    business.address = address;
    business.email = email;
    business.phone = phone;
    await business.save();
    return res.json(
      utils.handleResponse("Business updated successfully", 200, business)
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
