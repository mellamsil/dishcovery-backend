const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  NotFoundError,
  ConflictError,
  InternalServerError,
  BadRequestError,
  UnauthorizedError,
} = require("../utils/errors");

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// Helper to attach full URL to avatar if it's a relative path
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

// Get current logged-in user
exports.getCurrentUser = (req, res) => {
  User.findById(req.userId)
    .select("-password")
    .then((user) => {
      if (!user || user.isDeleted) throw new NotFoundError("User not found");
      return res.json(attachFullAvatarUrl(user.toObject()));
    })
    .catch((err) => {
      const error = !err.statusCode
        ? new InternalServerError(err.message)
        : err;
      return res.status(error.statusCode).json({ message: error.message });
    });
};

// Get all users (excluding deleted)
exports.getAllUsers = (req, res) => {
  User.find({ isDeleted: { $ne: true } })
    .select("-password")
    .then((users) => {
      const usersWithFullAvatar = users.map((u) =>
        attachFullAvatarUrl(u.toObject())
      );
      res.json(usersWithFullAvatar);
    })
    .catch((err) => {
      const error = !err.statusCode
        ? new InternalServerError(err.message)
        : err;
      return res.status(error.statusCode).json({ message: error.message });
    });
};

// Get user by ID (skip deleted)
exports.getUserById = (req, res) => {
  User.findOne({ _id: req.params.id, isDeleted: { $ne: true } })
    .select("-password")
    .then((user) => {
      if (!user) throw new NotFoundError("User not found");
      return res.json(attachFullAvatarUrl(user.toObject()));
    })
    .catch((err) => {
      const error = !err.statusCode
        ? new InternalServerError(err.message)
        : err;
      return res.status(error.statusCode).json({ message: error.message });
    });
};

// Create new user
exports.createUser = (req, res) => {
  const {
    name,
    email,
    password,
    avatar,
    favoriteCuisine,
    dietaryPreferences,
    preferences,
  } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) throw new ConflictError("Email already in use");

      const newUser = new User({
        name,
        email,
        password,
        avatar,
        favoriteCuisine,
        dietaryPreferences,
        preferences,
        isDeleted: false,
      });

      return newUser.save();
    })
    .then((savedUser) => {
      if (!savedUser) throw new InternalServerError("User not saved");

      const userObject = attachFullAvatarUrl(savedUser.toObject());
      delete userObject.password;
      return res.status(201).json(userObject);
    })
    .catch((err) => {
      const error = !err.statusCode
        ? new InternalServerError(err.message)
        : err;
      return res.status(error.statusCode).json({ message: error.message });
    });
};

// Secure update of current user (name, email, avatar, password)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, avatar, passwordUpdate } = req.body;

    // Find user
    const user = await User.findOne({ _id: userId, isDeleted: { $ne: true } });
    if (!user) throw new NotFoundError("User not found");

    // Update basic fields
    if (name) user.name = name.trim();
    if (avatar) user.avatar = avatar.trim();

    // Handle email change safely
    if (email && email.trim() !== user.email) {
      const existingEmail = await User.findOne({ email: email.trim() });
      if (existingEmail) throw new ConflictError("Email already in use");
      user.email = email.trim();
    }

    // Handle password update securely
    if (passwordUpdate) {
      const { currentPassword, newPassword } = passwordUpdate;

      if (!currentPassword || !newPassword) {
        throw new BadRequestError(
          "Both current and new passwords are required"
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        throw new UnauthorizedError("Current password is incorrect");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    // Save updates
    const updatedUser = await user.save();
    const userObj = attachFullAvatarUrl(updatedUser.toObject());
    delete userObj.password;

    return res.json(userObj);
  } catch (err) {
    const error = !err.statusCode ? new InternalServerError(err.message) : err;
    return res.status(error.statusCode).json({ message: error.message });
  }
};

// Soft delete user
exports.deleteUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id, isDeleted: { $ne: true } },
    { isDeleted: true },
    { new: true }
  )
    .then((user) => {
      if (!user) throw new NotFoundError("User not found");
      return res.json({ message: "User marked as deleted successfully" });
    })
    .catch((err) => {
      const error = !err.statusCode
        ? new InternalServerError(err.message)
        : err;
      return res.status(error.statusCode).json({ message: error.message });
    });
};
