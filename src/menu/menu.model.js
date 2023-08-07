const mongoose = require("mongoose");

const { Schema } = mongoose;
const menuSchema = new Schema(
  {
    menuName: String,
    description: String,
    category: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isActivated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.models.Menu || mongoose.model("Menu", menuSchema);
