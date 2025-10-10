const User = require("../models/user");

// Get current logged-in user
exports.getCurrentUser = (req, res) => {
  User.findById(req.userId)
    .select("-password")
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

// Get all users
exports.getAllUsers = (req, res) => {
  User.find()
    .select("-password")
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json({ message: err.message }));
};

// Get user by ID
exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .select("-password")
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
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

  const newUser = new User({
    name,
    email,
    password,
    avatar,
    favoriteCuisine,
    dietaryPreferences,
    preferences,
  });

  newUser
    .save()
    .then((savedUser) => res.status(201).json(savedUser))
    .catch((err) => res.status(400).json({ message: err.message }));
};

// Update user
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .then((updatedUser) => {
      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });
      res.json(updatedUser);
    })
    .catch((err) => res.status(400).json({ message: err.message }));
};

// Delete user
exports.deleteUser = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((deletedUser) => {
      if (!deletedUser)
        return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted successfully" });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
