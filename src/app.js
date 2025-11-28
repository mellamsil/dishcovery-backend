const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");

const { errors: celebrateErrors } = require("celebrate");
const limiter = require("./middlewares/limiter");
const { requestLogger, errorLogger } = require("./config/logger");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");
const { NotFoundError } = require("./utils/errors");

const app = express();

// GLOBAL MIDDLEWARE
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(requestLogger);
app.use(limiter);
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.send("Welcome to Dishcovery API");
});

// ROUTES
app.use("/api", routes);

// Celebrate validation errors
app.use(celebrateErrors());

// 404 HANDLER
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found."));
});

// --- ERROR LOGGING ---
app.use(errorLogger);

// --- CENTRALIZED ERROR HANDLER ---
app.use(errorHandler);

module.exports = app;
