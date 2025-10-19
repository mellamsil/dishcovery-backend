const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { validateSignup, validateSignin } = require("../middlewares/validation");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

// Signup route
router.post("/signup", validateSignup, (req, res) => {
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
    return res.status(400).json({ message: "Missing required fields" });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      return bcrypt.hash(password, 10).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
          avatar,
          favoriteCuisine,
          dietaryPreferences,
          preferences,
        });

        return user.save();
      });
    })
    .then((savedUser) => {
      if (!savedUser) return; // handled above if user existed

      const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      const userResponse = savedUser.toObject();
      delete userResponse.password;

      res.status(201).json({ user: userResponse, token });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error creating user",
        error: err.message,
      });
    });
});

// Signin route
router.post("/signin", validateSignin, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
          expiresIn: "1h",
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({ user: userResponse, token });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error signing in user",
        error: err.message,
      });
    });
});

module.exports = router;
