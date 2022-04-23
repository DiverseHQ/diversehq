const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
      walletAddress: {
          type: String,
          required: true,
      },
      name: {
          type: String,
      },
      profileImageUrl: {
          type: String,
      }
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("User", userSchema);
