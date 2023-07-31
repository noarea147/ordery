const orderModel = require("./order.model");
const utils = require("../../helpers/utils");

exports.PlacrOrder = async (req, res) => {
  try {
    const { notes, products, total, businessId, tableNumber } = req.body;
    const business = await businessModel.findById(businessId);
    const order = await new orderModel({
      notes: notes,
      products: products,
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
