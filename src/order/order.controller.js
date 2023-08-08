const orderModel = require("./order.model");
const businessModel = require("../business/business.model");
const utils = require("../../helpers/utils");

exports.PlacrOrder = async (req, res) => {
  try {
    const { notes, products, total, businessId, tableNumber } = req.body;
    const business = await businessModel.findById(businessId);
    const orderProducts = [];
    products.forEach((product) => {
      orderProducts.push(product._id);
    });
    const orderNotes = notes || "No notes";

    const order = await new orderModel({
      notes: orderNotes,
      products: orderProducts,
      total: total,
      tableNumber: tableNumber,
    });
    await order.save();
    business.orders.push(order._id);
    await business.save();
    return res.json(
      utils.handleResponse("Order placed successfully", 201, order)
    );
  } catch (error) {
    return res.json(utils.handleResponse(error.message, 500));
  }
};

exports.GetMyBusinessOrders = async (req, res) => {
  try {
    const { businessId } = req.body;
    const business = await businessModel.find({ _id: businessId }).populate({
      path: "orders",
      populate: {
        path: "products",
      },
    });
    const StringData = JSON.stringify(business);
    const JSONData = JSON.parse(StringData);
    const ordersArra = JSONData[0].orders || [];

    if (!business) {
      return res.json(utils.handleResponse("Business not found", 404));
    }
    if (ordersArra.length === 0) {
      return res.json(
        utils.handleResponse("No orders found for the business", 404)
      );
    }

    return res.json(
      utils.handleResponse("Orders fetched successfully", 200, ordersArra)
    );
  } catch (error) {
    return res.json(utils.handleResponse(error.message, 500));
  }
};
