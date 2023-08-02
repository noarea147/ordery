const mongoose = require("mongoose");

const { Schema } = mongoose;
const menuSchema = new Schema(
  {
    MenuName: String,
    description: String,
    categorie: String,
    products: [],
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