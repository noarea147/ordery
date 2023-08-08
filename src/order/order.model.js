const mongoose = require("mongoose");

const { Schema } = mongoose;
const orderSchema = new Schema(
  {
    notes: String,
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    tableNumber: String,
    status: {
      enum: ["pending", "confirmed", "completed"],
      type: String,
      default: "pending",
    },
    total: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
