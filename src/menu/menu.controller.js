const MenuModel = require("./menu.model");
const ProductModel = require("./product.model");
const BusinessModel = require("../business/business.model");
const utils = require("../../helpers/utils");

exports.AddMenu = async (req, res) => {
  try {
    const { MenuName, description, category, businessId } = req.body;
    const business = await BusinessModel.findOne({ _id: businessId });
    if (!business) {
      return res.json(utils.handleResponse("Business not found", 404));
    }

    const menu = await new MenuModel({
      MenuName,
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

exports.AddProducts = async (req, res) => {
  const { products, menuId } = req.body;
  const menu = await MenuModel.findOne({ _id: menuId });
  if (!menu) {
    return res.json(utils.handleResponse("Menu not found", 404));
  }

  const newProducts = [];

  products.forEach((product) => {
    const vars = [];
    product.prices?.forEach((price) => {
      vars.push({
        size: price.size,
        price: price.price,
      });
    });
    const productNew = {
      name: product.ProductName,
      description: product.description,
      prices: vars,
      images: product.images,
    };

    const newProduct = new ProductModel(productNew);
    newProduct.save();
    newProducts.push(newProduct._id);
  });
  menu.products = newProducts;

  await menu.save();
  return res.json(
    utils.handleResponse("Product added successfully", 201, menu)
  );
};
exports.EditProducts = async (req, res) => {
  const { products, menuId } = req.body;
  const menu = await MenuModel.findOne({ _id: menuId });

  if (!menu) {
    return res.json(utils.handleResponse("Menu not found", 404));
  }

  const updatedProductIds = [];

  for (const product of products) {
    const productToUpdate = await ProductModel.findById(product.productId);

    if (!productToUpdate) {
      return res.json(
        utils.handleResponse(
          `Product with ID ${product.productId} not found`,
          404
        )
      );
    }

    const vars = [];
    product.prices?.forEach((price) => {
      vars.push({
        size: price.size,
        price: price.price,
      });
    });

    productToUpdate.name = product.ProductName;
    productToUpdate.description = product.description;
    productToUpdate.prices = vars;
    productToUpdate.images = product.images;

    await productToUpdate.save();
    updatedProductIds.push(productToUpdate._id);
  }

  menu.products = updatedProductIds;
  await menu.save();

  return res.json(
    utils.handleResponse("Products updated successfully", 200, menu)
  );
};

exports.GetMyMenus = async (req, res) => {
  try {
    const { businessId } = req.body;
    const business = await BusinessModel.findOne({ _id: businessId }).populate(
      "menus"
    );
    if (!business) {
      return res.json(utils.handleResponse("Business not found", 404));
    }
    const menus = await MenuModel.find({ _id: { $in: business.menus } });
    if (menus.length === 0) {
      return res.json(utils.handleResponse("No menus found", 404));
    }
    return res.json(utils.handleResponse("Menus found", 200, menus));
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
