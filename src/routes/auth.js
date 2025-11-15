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
  ForbiddenError,
} = require("../utils/errors");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";
const DEFAULT_AVATAR =
  process.env.DEFAULT_AVATAR || "/src/assets/images/user-placeholder.png";

/**
 * POST /auth/signup
 */
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
    const err = new BadRequestError("Email and password are required");
    return res.status(err.statusCode).json({ message: err.message });
  }

  const diets = Array.isArray(dietaryPreferences) ? dietaryPreferences : [];

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
        avatar: avatar?.trim() || DEFAULT_AVATAR,
        favoriteCuisine: favoriteCuisine || "",
        dietaryPreferences: diets,
        preferences: preferences || {},
      });

      return user.save();
    })
    .then((savedUser) => {
      if (!savedUser) throw new InternalServerError("User not saved");

      const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const userResponse = savedUser.toObject();
      delete userResponse.password;

      return res.status(201).json({ user: userResponse, token });
    })
    .catch((err) => {
      const status = err.statusCode || 500;
      return res.status(status).json({ message: err.message });
    });
});

/**
 * POST /auth/signin
 */
router.post("/signin", validateSignin, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new BadRequestError("Missing email or password");
    return res.status(err.statusCode).json({ message: err.message });
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        const err = new NotFoundError("Email not registered");
        return res.status(err.statusCode).json({ message: err.message });
      }

      if (user.isDeleted) {
        const err = new ForbiddenError("This account has been deleted");
        return res.status(err.statusCode).json({ message: err.message });
      }

      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          const err = new BadRequestError("Incorrect password");
          return res.status(err.statusCode).json({ message: err.message });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
          expiresIn: "1h",
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        if (!userResponse.avatar) userResponse.avatar = DEFAULT_AVATAR;

        return res.status(200).json({ user: userResponse, token });
      });
    })
    .catch((err) => {
      const status = err.statusCode || 500;
      return res.status(status).json({ message: err.message });
    });
});

module.exports = router;
