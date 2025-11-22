const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  NotFoundError,
  ConflictError,
  BadRequestError,
  UnauthorizedError,
} = require("../utils/errors");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// Helper to build full avatar URL
function attachFullAvatarUrl(user) {
  if (!user) return user;

  const avatarUrl =
    user.avatar && !user.avatar.startsWith("http")
      ? `${BASE_URL}/${user.avatar.replace(/^\/+/, "")}`
      : user.avatar;

  return {
    ...(user.toObject ? user.toObject() : user),
    avatar: avatarUrl,
  };
}

// GET CURRENT USER
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user || user.isDeleted)
      return next(new NotFoundError("User not found"));

    return res.json(attachFullAvatarUrl(user));
  } catch (err) {
    return next(err);
  }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isDeleted: { $ne: true } }).select(
      "-password"
    );
    const cleaned = users.map((u) => attachFullAvatarUrl(u));
    return res.json(cleaned);
  } catch (err) {
    return next(err);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true },
    }).select("-password");
    if (!user) return next(new NotFoundError("User not found"));

    return res.json(attachFullAvatarUrl(user));
  } catch (err) {
    return next(err);
  }
};

// Create user (SIGNUP)
exports.createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      avatar,
      favoriteCuisine,
      dietaryPreferences,
      preferences,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return next(new ConflictError("Email already in use"));

    const user = await User.create({
      name,
      email,
      password,
      avatar,
      favoriteCuisine,
      dietaryPreferences,
      preferences,
      isDeleted: false,
    });

    const obj = attachFullAvatarUrl(user);
    delete obj.password;

    return res.status(201).json(obj);
  } catch (err) {
    return next(err);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, email, avatar, passwordUpdate } = req.body;

    const user = await User.findOne({ _id: userId, isDeleted: { $ne: true } });
    if (!user) return next(new NotFoundError("User not found"));

    if (name) user.name = name.trim();
    if (avatar) user.avatar = avatar.trim();

    if (email && email.trim() !== user.email) {
      const exists = await User.findOne({ email: email.trim() });
      if (exists) return next(new ConflictError("Email already in use"));
      user.email = email.trim();
    }

    if (passwordUpdate) {
      const { currentPassword, newPassword } = passwordUpdate;
      if (!currentPassword || !newPassword) {
        return next(
          new BadRequestError("Both current and new passwords are required")
        );
      }

      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match)
        return next(new UnauthorizedError("Current password incorrect"));

      user.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = await user.save();
    const obj = attachFullAvatarUrl(updated);
    delete obj.password;

    return res.json(obj);
  } catch (err) {
    return next(err);
  }
};

// Delete user (Soft delete)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { isDeleted: true },
      { new: true }
    );

    if (!user) return next(new NotFoundError("User not found"));

    return res.json({ message: "User marked as deleted successfully" });
  } catch (err) {
    return next(err);
  }
};
