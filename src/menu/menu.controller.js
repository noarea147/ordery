const mongoose = require("mongoose");
const MenuModel = require("./menu.model");
const ProductModel = require("./product.model");
const BusinessModel = require("../business/business.model");
const OrderModel = require("../order/order.model");
const UserModel = require("../user/user.model");
const utils = require("../../helpers/utils");

exports.AddMenu = async (req, res) => {
  try {
    const { menuName, description, category, businessId } = req.body;
    const business = await BusinessModel.findOne({ _id: businessId });
    if (!business) {
      return res.json(utils.handleResponse("Business not found", 404));
    }

    const menu = await new MenuModel({
      menuName,
      description,
      category,
    });
    await menu.save();

    if (!business.menus) {
      business.menus = [];
    }
    business.menus.push(menu._id);
    await business.save();

    return res.json(utils.handleResponse("Menu added successfully", 201, menu));
  } catch (error) {
    return res.json(utils.handleResponse(error.message, 500));
  }
};
exports.EditMenu = async (req, res) => {
  try {
    const { menuId, menuName, description, category } = req.body;
    const menu = await MenuModel.findOne({ _id: menuId });
    if (!menu) {
      return res.json(utils.handleResponse("Menu not found", 404));
    }
    menu.menuName = menuName;
    menu.description = description;
    menu.category = category;
    await menu.save();
    return res.json(
      utils.handleResponse("Menu updated successfully", 200, menu)
    );
  } catch (error) {
    return res.json(utils.handleResponse(error.message, 500));
  }
};
exports.DeleteMenu = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.user.id }).populate(
      "BusinessID"
    );
    const { menuId, businessId } = req.body;

    const hasAuthorization = user.BusinessID.some(
      (business) => business._id.toString() === businessId
    );
    if (!hasAuthorization) {
      return res.json(
        utils.handleResponse("You are not authorized to delete this menu", 401)
      );
    }
    const business = await BusinessModel.findOne({ _id: businessId });
    if (!business) {
      return res.json(utils.handleResponse("Business not found", 404));
    }

    if (!business.menus.includes(menuId)) {
      return res.json(utils.handleResponse("Menu not found", 404));
    }
    //delete menu from business
    await MenuModel.deleteOne({ _id: menuId });
    business.menus = business.menus.filter((menu) => menu !== menuId);
    await business.save();
    return res.json(utils.handleResponse("Menu deleted successfully", 200));
  } catch (error) {
    return res.json(utils.handleResponse(error.message, 500));
  }
};

exports.AddProducts = async (req, res) => {
  try {
    const { name, description, prices, image, menuId } = req.body;

    const menu = await MenuModel.findOne({ _id: menuId });
    if (!menu) {
      return res.status(404).json(utils.handleResponse("Menu not found", 404));
    }

    const productNew = {
      name: name,
      description: description,
      prices: prices,
      images: image,
    };
    const newProduct = new ProductModel(productNew);
    await newProduct.save();
    menu.products.push(newProduct._id);
    await menu.save();

    return res
      .status(201)
      .json(utils.handleResponse("Product added successfully", 201, menu));
  } catch (error) {
    console.error("Error in AddProducts:", error);
    return res
      .status(500)
      .json(utils.handleResponse("Internal Server Error", 500));
  }
};

exports.EditProduct = async (req, res) => {
  try {
    const { productId, menuId, name, prices, description } = req.body;
    const menu = await MenuModel.findOne({ _id: menuId });

    if (!menu) {
      return res.json(utils.handleResponse("Menu not found", 404));
    }

    if (!menu.products.includes(productId)) {
      return res.json(
        utils.handleResponse("Product not found in the menu", 404)
      );
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.json(utils.handleResponse("Product not found", 404));
    }

    product.name = name;
    product.description = description;
    product.prices = prices;

    await product.save();

    return res.json(
      utils.handleResponse("Product updated successfully", 200, product)
    );
  } catch (error) {
    return res.json(utils.handleResponse(error.message, 500));
  }
};

exports.DeleteProduct = async (req, res) => {
  try {
    const { productsId, menuId } = req.body;
    const menu = await MenuModel.findOne({ _id: menuId });

    if (!menu) {
      return res.json(utils.handleResponse("Menu not found", 404));
    }

    const invalidProductIds = productsId.filter(
      (productId) => !menu.products.includes(productId)
    );
    if (invalidProductIds.length > 0) {
      return res.json(utils.handleResponse("Product not found", 404));
    }

    const productsToDelete = await ProductModel.find({
      _id: { $in: productsId },
    });
    if (!productsToDelete || productsToDelete.length === 0) {
      return res.json(utils.handleResponse("Product(s) not found", 404));
    }

    await ProductModel.deleteMany({ _id: { $in: productsId } });

    return res.json(
      utils.handleResponse("Products deleted successfully", 200, menu)
    );
  } catch (error) {
    return res.json(utils.handleResponse(error.message, 500));
  }
};

exports.GetMyMenus = async (req, res) => {
  try {
    const { businessId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.json(utils.handleResponse("Invalid Business ID", 404));
    }
    const business = await BusinessModel.findOne({ _id: businessId }).populate(
      "menus",
      "orders"
    );

    if (!business) {
      return res.json(utils.handleResponse("Business not found", 404));
    }
    const menus = await MenuModel.find({ _id: { $in: business.menus } });
    const orders = await OrderModel.find({ _id: { $in: business.orders } });
    business.orders = orders;
    business.menus = menus;

    return res.json(utils.handleResponse("Business Data found", 200, business));
  } catch (error) {
    return res.json(utils.handleResponse(error.message, 500));
  }
};

exports.GetMenu = async (req, res) => {
  try {
    const { businessId } = req.body;
    const business = await BusinessModel.findOne({ _id: businessId }).populate(
      "menus"
    );
    if (!business) {
      return res.json(utils.handleResponse("Business not found", 404));
    }
    const menus = await MenuModel.find({
      _id: { $in: business.menus },
    }).populate("products");
    if (menus.length === 0) {
      return res.json(utils.handleResponse("No menus found", 404));
    }
    return res.json(utils.handleResponse("Menus found", 200, menus));
  } catch (error) {
    return res.json(utils.handleResponse(error.message, 500));
  }
};

exports.GetMenuById = async (req, res) => {
  try {
    const { menuId } = req.body;
    const menu = await MenuModel.findOne({ _id: menuId }).populate("products");
    if (!menu) {
      return res.json(utils.handleResponse("Menu not found", 404));
    }
    return res.json(utils.handleResponse("Menu found", 200, menu));
  } catch (error) {
    return res.json(utils.handleResponse(error.message, 500));
  }
};
