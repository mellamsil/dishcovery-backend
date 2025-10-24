const User = require("../models/user");
const {
  NotFoundError,
  ConflictError,
  InternalServerError,
} = require("../utils/errors");

// Get current logged-in user
exports.getCurrentUser = (req, res) => {
  User.findById(req.userId)
    .select("-password")
    .then((user) => {
      if (!user) throw new NotFoundError("User not found");
      return res.json(user);
    })
    .catch((err) => {
      const error = !err.statusCode
        ? new InternalServerError(err.message)
        : err;
      return res.status(error.statusCode).json({ message: error.message });
    });
};

// Get all users
exports.getAllUsers = (req, res) => {
  User.find()
    .select("-password")
    .then((users) => res.json(users))
    .catch((err) => {
      const error = !err.statusCode
        ? new InternalServerError(err.message)
        : err;
      return res.status(error.statusCode).json({ message: error.message });
    });
};

// Get user by ID
exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .select("-password")
    .then((user) => {
      if (!user) throw new NotFoundError("User not found");
      return res.json(user);
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
      });

      return newUser.save();
    })
    .then((savedUser) => {
      if (!savedUser) throw new InternalServerError("User not saved");

      const userObject = savedUser.toObject();
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

// Update user
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .then((updatedUser) => {
      if (!updatedUser) throw new NotFoundError("User not found");
      return res.json(updatedUser);
    })
    .catch((err) => {
      const error = !err.statusCode
        ? new InternalServerError(err.message)
        : err;
      return res.status(error.statusCode).json({ message: error.message });
    });
};

// Delete user
exports.deleteUser = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((deletedUser) => {
      if (!deletedUser) throw new NotFoundError("User not found");
      return res.json({ message: "User deleted successfully" });
    })
    .catch((err) => {
      const error = !err.statusCode
        ? new InternalServerError(err.message)
        : err;
      return res.status(error.statusCode).json({ message: error.message });
    });
};
