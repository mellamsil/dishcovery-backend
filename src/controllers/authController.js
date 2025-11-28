const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const ConflictError = require("../utils/errors/ConflictError");
const BadRequestError = require("../utils/errors/BadRequestError");

const { JWT_SECRET = "dev-secret" } = process.env;

// Signup controller
exports.signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name: name || "Anonymous",
    });

    const userResponse = { email: user.email, name: user.name };
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ user: userResponse, token });
  } catch (err) {
    next(err);
  }
};

// Login controller
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");

    // Return 401 Unauthorized if email not found or password incorrect
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError("Incorrect email or password");
    }

    const userResponse = { email: user.email, name: user.name };
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ user: userResponse, token });
  } catch (err) {
    next(err);
  }
};
