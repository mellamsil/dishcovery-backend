const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    favoriteCuisine: { type: String, default: "" },
    dietaryPreferences: { type: String, default: "" },
    preferences: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Prevent OverwriteModelError in dev with nodemon
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
