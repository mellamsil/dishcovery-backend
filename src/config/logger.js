const fs = require("fs");
const path = require("path");

// Create a log directory if it doesn't exist
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const accessLogPath = path.join(logDir, "access.log");
const errorLogPath = path.join(logDir, "error.log");

// Simple logger object
const logger = {
  info: function (message) {
    const logMessage = `[INFO] ${new Date().toISOString()} - ${message}\n`;
    fs.appendFileSync(accessLogPath, logMessage);
    console.log(logMessage.trim());
  },
  error: function (message) {
    const logMessage = `[ERROR] ${new Date().toISOString()} - ${message}\n`;
    fs.appendFileSync(errorLogPath, logMessage);
    console.error(logMessage.trim());
  },
};

// Middleware to log requests
function requestLogger(req, res, next) {
  logger.info(req.method + " " + req.url);
  next();
}

// Middleware to log errors
function errorLogger(err, req, res, next) {
  logger.error(err.stack || err);
  next(err);
}

module.exports = { logger, requestLogger, errorLogger };
