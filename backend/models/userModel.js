const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    accountVerified: { type: Boolean, default: false },
    cartData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

module.exports = mongoose.model("User", userSchema);