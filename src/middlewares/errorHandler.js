const { NODE_ENV } = require("../config/config");
const { logger } = require("../config/logger");

// Express requires 4 args for error handlers: (err, req, res, next)
function errorHandler(err, req, res, next) {
  const statusCode = err?.statusCode || 500;

  const message =
    statusCode === 500
      ? "An internal server error occurred."
      : err?.message || "Unexpected error.";

  // Prevent "Cannot set headers after they are sent" error
  if (res.headersSent) {
    return next(err);
  }

  // Log error to console only in development
  if (NODE_ENV === "development") {
    console.error("Error:", message);
    if (err?.stack) {
      console.error("Stack trace:", err.stack);
    }
  }

  // Log error to file using logger
  logger.error(
    `${req.method} ${req.originalUrl} ${statusCode} - ${message}${
      err?.stack ? `\n${err.stack}` : ""
    }`
  );

  // Build error response
  const errorResponse = { error: { message } };
  if (NODE_ENV === "development" && err?.stack) {
    errorResponse.error.stack = err.stack;
  }

  // Send response
  res.status(statusCode).json(errorResponse);

  return null;
}

module.exports = errorHandler;
