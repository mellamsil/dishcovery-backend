const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const { errors: celebrateErrors } = require("celebrate");
const limiter = require("./middlewares/limiter");
const { requestLogger, errorLogger } = require("./config/logger");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");

const app = express();

// GLOBAL MIDDLEWARE
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.use(requestLogger);
app.use(limiter);

// ROUTES
app.use("/api", routes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("Welcome to Dishcovery API");
});

// Celebrate validation errors
app.use(celebrateErrors());

// Log errors
app.use(errorLogger);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: "Requested resource not found." } });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
