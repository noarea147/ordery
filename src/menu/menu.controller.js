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

exports.AddProduct = async (req, res) => {
  const { ProductName, description, menuId, prices, category, images } =
    req.body;
  const menu = await MenuModel.findOne({ _id: menuId });
  if (!menu) {
    return res.json(utils.handleResponse("Menu not found", 404));
  }
  const vars = [];
  prices?.forEach((price) => {
    vars.push({
      size: price.size,
      price: price.price,
      currency: price.currency,
    });
  });
  const product = {
    Name: ProductName,
    description: description,
    prices: vars,
    category: category,
    images: images,
  };
  menu.products.push(product);
  await menu.save();
  return res.json(
    utils.handleResponse("Product added successfully", 201, menu)
  );
};
