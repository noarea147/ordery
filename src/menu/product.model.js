const mongoose = require("mongoose");

const { Schema } = mongoose;
const productSchema = new Schema(
  {
    name: String,
    description: String,
    images: String,
    prices: [],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
