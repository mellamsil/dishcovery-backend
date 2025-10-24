const fs = require("fs");
const path = require("path");
const winston = require("winston");
const expressWinston = require("express-winston");

// Logs directory
const logsDir = path.join(__dirname, "../../logs");

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Common Winston log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Request logger (logs all HTTP requests)
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, "request.log"),
    }),
  ],
  format: logFormat,
  meta: true, // Include request metadata
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
});

// Error logger (logs all errors hitting Express middleware)
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(logsDir, "error.log") }),
  ],
  format: logFormat,
});

module.exports = { requestLogger, errorLogger };
