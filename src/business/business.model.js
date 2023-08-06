const mongoose = require("mongoose");

const { Schema } = mongoose;
const businessSchema = new Schema(
  {
    BusinessName: String,
    description: String,
    location: {
      lng: Number,
      lat: Number,
    },
    address: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    menus: [
      {
        type: Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    profilePicture: String,
    coverPicture: String,
    username: {
      type: String,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
      enum: ["TUN", "DZA", "MCO"],
      default: "TUN",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports =
  mongoose.models.Business || mongoose.model("Business", businessSchema);
