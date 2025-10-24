const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { validateSignup, validateSignin } = require("../middlewares/validation");
const {
  ConflictError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
} = require("../utils/errors");

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

  if (!email || !password || !avatar) {
    const err = new BadRequestError("Email, password, and avatar are required");
    return res.status(err.statusCode).json({ message: err.message });
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) throw new ConflictError("User already exists");

      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      if (!hashedPassword)
        throw new InternalServerError("Password hashing failed");

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
    })
    .then((savedUser) => {
      if (!savedUser) throw new InternalServerError("User not saved");

      const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      const userResponse = savedUser.toObject();
      delete userResponse.password;

      res.status(201).json({ user: userResponse, token });
    })
    .catch((err) => {
      const status = err.statusCode || 500;
      res.status(status).json({ message: err.message });
    });
});

// Signin route
router.post("/signin", validateSignin, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new BadRequestError("Missing email or password");
    return res.status(err.statusCode).json({ message: err.message });
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) throw new NotFoundError("User not found");

      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) throw new BadRequestError("Incorrect password");

        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
          expiresIn: "1h",
        });
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({ user: userResponse, token });
      });
    })
    .catch((err) => {
      const status = err.statusCode || 500;
      res.status(status).json({ message: err.message });
    });
});

module.exports = router;
