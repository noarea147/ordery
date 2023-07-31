const mongoose = require("mongoose");

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    profilePicture: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "business", "admin"],
      default: "user",
    },
    firebaseToken: String,
    verificationKey: String,
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
    BusinessID: [
      {
        type: Schema.Types.ObjectId,
        ref: "Business",
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
