const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { errors: celebrateErrors } = require("celebrate");
const { requestLogger, errorLogger } = require("./config/logger");
const errorHandler = require("./middlewares/errorHandler");
const auth = require("./middlewares/auth");
const config = require("./config/config");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const cookbookRoutes = require("./routes/cookbooks");
const itemRoutes = require("./routes/items");
const recipeRoutes = require("./routes/recipes");

const app = express();

// Global Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Request logger (logs every request)
app.use(requestLogger);

// Rate Limiter
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again later." },
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", auth, userRoutes);
app.use("/api/cookbooks", cookbookRoutes);
app.use("/api/items", itemRoutes);

// Public Recipes route
app.use(
  "/api/recipes",
  (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  },
  recipeRoutes
);

// Health check
app.get("/", (req, res) => res.send("Welcome to Dishcovery API"));

// Celebrate validation errors
app.use(celebrateErrors());

// Error logger (after routes and validation)
app.use(errorLogger);

// Unknown route handler (404)
app.use((req, res) => {
  res.status(404).json({ error: { message: "Requested resource not found." } });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
