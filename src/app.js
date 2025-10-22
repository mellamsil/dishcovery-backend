const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { errorLogger } = require("./config/logger");
const { errors: celebrateErrors } = require("celebrate");

// Import routes & middleware
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const cookbookRoutes = require("./routes/cookbooks");
const itemRoutes = require("./routes/items");
const recipeRoutes = require("./routes/recipes");
const { errorHandler } = require("./middlewares/errorHandler");
const auth = require("./middlewares/auth");

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", auth, userRoutes);
app.use("/api/cookbooks", cookbookRoutes);
app.use("/api/items", itemRoutes);

// Recipes route (public)
app.use(
  "/api/recipes",
  (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  },
  recipeRoutes
);

// Root / health check
app.get("/", (req, res) => {
  res.send("Welcome to Dishcovery API");
});

// Celebrate validation error handler
app.use(celebrateErrors());

// Custom error logging and central error handler
app.use(errorLogger);
app.use(errorHandler);

module.exports = app;
