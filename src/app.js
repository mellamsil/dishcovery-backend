const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { requestLogger, errorLogger } = require("./config/logger");

// Import routes & middleware
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const cookbookRoutes = require("./routes/cookbooks");
const { errorHandler } = require("./middlewares/errorHandler");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
// app.use(requestLogger);
app.use(morgan("dev"));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/cookbook", authMiddleware, cookbookRoutes);

// Health check / root
app.get("/", (req, res) => res.send("Welcome to Dishcovery API"));

// Error logging & centralized handler
app.use(errorLogger);
app.use(errorHandler);

module.exports = app;
