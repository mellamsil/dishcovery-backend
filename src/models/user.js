const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
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
      select: false,
    },
    avatar: {
      type: String,
      required: true,
      trim: true,
    },
    favoriteCuisine: {
      type: String,
      default: "",
      trim: true,
    },
    dietaryPreferences: {
      type: [String],
      default: [],
    },
    preferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Remove password before sending user object to frontend
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Prevent OverwriteModelError in dev with nodemon
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
