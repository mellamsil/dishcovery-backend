const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { requestLogger, errorLogger } = require("./config/logger");

// Import routes & middleware
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const cookbookRoutes = require("./routes/cookbooks");
const itemRoutes = require("./routes/items");
const recipeRoutes = require("./routes/recipes");
const { errorHandler } = require("./middlewares/errorHandler");
const authMiddleware = require("./middlewares/authMiddleware");

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
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/cookbooks", authMiddleware, cookbookRoutes);
app.use("/api/items", itemRoutes);

// Recipes route (public)
app.use(
  "/api/recipes",
  function (req, res, next) {
    res.set("Cache-Control", "no-store");
    next();
  },
  recipeRoutes
);

// Root / health check
app.get("/", function (req, res) {
  res.send("Welcome to Dishcovery API");
});

// DEBUG: List all registered routes
if (app._router && app._router.stack) {
  console.log("Registered routes:");
  app._router.stack.forEach(function (middleware) {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods)
        .map(function (m) {
          return m.toUpperCase();
        })
        .join(",");
      console.log(methods, middleware.route.path);
    } else if (middleware.name === "router" && middleware.handle.stack) {
      middleware.handle.stack.forEach(function (handler) {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods)
            .map(function (m) {
              return m.toUpperCase();
            })
            .join(",");
          console.log(methods, handler.route.path);
        }
      });
    }
  });
} else {
  console.log("No routes registered yet or app._router is undefined");
}

// Error handling
app.use(errorLogger);
app.use(errorHandler);

module.exports = app;
