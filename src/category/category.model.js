const mongoose = require("mongoose");

const { Schema } = mongoose;
const categorySchema = new Schema(
  {
    name: String,
    description: String,
    images: String,
  },
  {
    timestamps: true,
  }
);
module.exports =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
