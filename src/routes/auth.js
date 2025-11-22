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

// POST /auth/signup
router.post("/signup", validateSignup, async (req, res, next) => {
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

    if (!email || !password)
      throw new BadRequestError("Email and password are required");

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ConflictError("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword)
      throw new InternalServerError("Password hashing failed");

    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar: avatar?.trim() || DEFAULT_AVATAR,
      favoriteCuisine: favoriteCuisine || "",
      dietaryPreferences: Array.isArray(dietaryPreferences)
        ? dietaryPreferences
        : [],
      preferences: preferences || {},
      isDeleted: false,
    });

    const savedUser = await user.save();
    if (!savedUser) throw new InternalServerError("User not saved");

    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const userResponse = savedUser.toObject();
    delete userResponse.password;

    return res.status(201).json({ user: userResponse, token });
  } catch (err) {
    return next(err);
  }
});

// POST /auth/signin
router.post("/signin", validateSignin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new BadRequestError("Missing email or password");

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new NotFoundError("Email not registered");
    if (user.isDeleted)
      throw new ForbiddenError("This account has been deleted");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestError("Incorrect password");

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    const userResponse = user.toObject();
    delete userResponse.password;
    if (!userResponse.avatar) userResponse.avatar = DEFAULT_AVATAR;

    return res.status(200).json({ user: userResponse, token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
