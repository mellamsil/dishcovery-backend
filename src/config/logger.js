const fs = require("fs");
const path = require("path");

// Log requests
// Using console as a simple logger
const logger = {
  info: console.log,
  error: console.error,
};

// Log requests
const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};

const errorLogger = (err, req, res, next) => {
  logger.error(err.stack || err);
  next(err);
};

module.exports = { logger, requestLogger, errorLogger };
