const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Get current logged-in user
router.get("/me", authMiddleware, (req, res) => {
  User.findById(req.userId)
    .select("-password")
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

// Get all users
router.get("/", (req, res) => {
  User.find()
    .select("-password")
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json({ message: err.message }));
});

// Get a user by ID
router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .select("-password")
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

// Create a new user
router.post("/", (req, res) => {
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
});

// Update a user
router.put("/:id", (req, res) => {
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
});

// Delete a user
router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((deletedUser) => {
      if (!deletedUser)
        return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted successfully" });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

module.exports = router;
