const BusinessModel = require("./business.model");
const UserModel = require("../user/user.model");
const utils = require("../../helpers/utils");

exports.AddBusiness = async (req, res) => {
  try {
    const {
      businessName,
      description,
      location,
      address,
      email,
      phone,
      userId,
      username,
      maxDistance,
    } = req.body;

    const user = await UserModel.findOne({ _id: userId }); // Add "await" here
    if (!user) {
      return res.json(utils.handleResponse("User not found", 404));
    }

    const business = await new BusinessModel({
      businessName,
      description,
      location,
      address,
      email,
      phone,
      username,
      maxDistance,
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
      businessName,
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
    business.BusinessName = businessName;
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

exports.GetMyBusiness = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UserModel.findOne({ _id: userId }).populate(
      "BusinessID"
    );
    if (!user) {
      return res.json(utils.handleResponse("User not found", 404));
    }
    if (user.BusinessID.length === 0) {
      return res.json(utils.handleResponse("No business found", 404));
    }
    return res.json(
      utils.handleResponse("Business found", 200, user.BusinessID)
    );
  } catch (err) {
    return res.json(utils.handleResponse(err.message, 500));
  }
};

exports.GetBusinessByUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const business = await BusinessModel.findOne({ username }).populate({
      path: "menus",
      populate: {
        path: "products",
        model: "Product",
      },
    });
    //i want to get the menus here and populate products with it
    if (!business) {
      return res.json(utils.handleResponse("Business not found", 404));
    }
    return res.json(utils.handleResponse("Business found", 200, business));
  } catch (err) {
    return res.json(utils.handleResponse(err.message, 500));
  }
};
