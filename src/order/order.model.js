const mongoose = require("mongoose");

const { Schema } = mongoose;
const orderSchema = new Schema(
  {
    notes: String,
    products: [],
    tableNumber: Number,
    status: {
      enum: ["pending", "confirmed", "completed"],
      type: String,
      default: "pending",
    },
    total: Number,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
