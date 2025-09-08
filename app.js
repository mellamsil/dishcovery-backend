const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

// MongoDB setup
mongoose.connect("mongodb://localhost:27017/dishcovery", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Middleware to check JWT token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No token provided");
  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send("Invalid token");
    req.userId = decoded.id;
    next();
  });
};

// Routes
app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send("Missing field");
  bcrypt.hash(password, 10).then((hashed) => {
    const user = new User({ email, password: hashed });
    user
      .save()
      .then(() => res.status(201).send("User created"))
      .catch((err) => res.status(400).send(err.message));
  });
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).send("User not found");
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) return res.status(400).send("Incorrect password");
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    });
  });
});

app.get("/users/me", authMiddleware, (req, res) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) return res.status(404).send("User not found");
      res.json({ email: user.email });
    })
    .catch((err) => res.status(400).send(err.message));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
