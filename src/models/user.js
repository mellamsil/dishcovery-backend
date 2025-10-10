const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // don’t return hash by default
    },
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
