const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

// Signup
router.post("/signup", (req, res) => {
  const {
    name,
    email,
    password,
    avatar,
    favoriteCuisine,
    dietaryPreferences,
    preferences,
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing field" });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const user = new User({
            name,
            email,
            password: hashedPassword,
            avatar,
            favoriteCuisine,
            dietaryPreferences,
            preferences,
          });

          user
            .save()
            .then(() => {
              const token = jwt.sign({ id: user._id }, JWT_SECRET, {
                expiresIn: "1h",
              });
              res.json({ user, token });
            })
            .catch((err) =>
              res
                .status(500)
                .json({ message: "Failed to save user", error: err.message })
            );
        })
        .catch((err) =>
          res
            .status(500)
            .json({ message: "Failed to hash password", error: err.message })
        );
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error checking existing user", error: err.message })
    );
});

// Signin
router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (!match) {
            return res.status(400).json({ message: "Incorrect password" });
          }

          const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "1h",
          });
          res.json({ user, token });
        })
        .catch((err) =>
          res
            .status(500)
            .json({ message: "Error comparing password", error: err.message })
        );
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error finding user", error: err.message })
    );
});

module.exports = router;
