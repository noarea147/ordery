const MenuModel = require("./menu.model");
const BusinessModel = require("../business/business.model");
const utils = require("../../helpers/utils");

exports.AddMenu = async (req, res) => {
  try {
    const { MenuName, description, businessId } = req.body;
    const business = await BusinessModel.findOne({ _id: businessId });
    if (!business) {
      return res.json(utils.handleResponse("Business not found", 404));
    }

    const menu = await new MenuModel({
      MenuName,
      description,
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

exports.AddProducts = async (req, res) => {
  const { products, menuId } = req.body;
  const menu = await MenuModel.findOne({ _id: menuId });
  if (!menu) {
    return res.json(utils.handleResponse("Menu not found", 404));
  }
  products.forEach((product) => {
    const vars = [];
    product.prices?.forEach((price) => {
      vars.push({
        size: price.size,
        price: price.price,
      });
    });
    const productNew = {
      Name: product.ProductName,
      description: product.description,
      prices: vars,
      images: product.images,
    };

    menu.products.push(productNew);
  });
  await menu.save();
  return res.json(
    utils.handleResponse("Product added successfully", 201, menu)
  );
};

exports.GetMyMenus = async (req, res) => {
  try {
    const { businessId } = req.body;
    const business = await BusinessModel.findOne({ _id: businessId });
    if (!business) {
      return res.json(utils.handleResponse("Business not found", 404));
    }
    const menus = await MenuModel.find({ _id: business.menus });
    const activatedMenus = menus.filter((menu) => menu.isActivated);
    if (activatedMenus.length === 0) {
      return res.json(utils.handleResponse("No menus found", 404));
    }
    return res.json(utils.handleResponse("Menus found", 200, activatedMenus));
  } catch (error) {
    return res.json(utils.handleResponse(error.message, 500));
  }
};
const products = [
  {
    ProductName: "expresso",
    description: "coffee description",
    prices: [
      {
        price: 5,
        size: "standard",
        category: "coffee",
      },
    ],
    ProductName: "cappuccino",
    description: "description",
    prices: [
      {
        price: 7,
        size: "standard",
        category: "coffee",
      },
    ],
    ProductName: "maricana",
    description: "my 1 menu description",
    prices: [
      {
        price: 9,
        size: "standard",
        category: "coffee",
      },
    ],
  },
];
