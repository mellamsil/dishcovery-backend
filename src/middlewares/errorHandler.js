const { isCelebrateError } = require("celebrate");
const { NODE_ENV } = require("../config/config");
const { logger } = require("../config/logger");
const AppError = require("../utils/errors/AppError");

// Centralized error handler middleware
function errorHandler(err, req, res, next) {
  // --- Handle Celebrate/Joi validation errors ---
  if (isCelebrateError(err)) {
    const details = {};
    Array.from(err.details.entries()).forEach(([segment, joiError]) => {
      details[segment] = {
        message: joiError.message,
        keys: joiError.details.map((d) => d.context.key),
      };
    });

    return res.status(400).json({
      error: {
        type: "ValidationError",
        message: "Validation failed",
        details,
      },
    });
  }

  // --- Handle known/custom AppError instances ---
  if (err instanceof AppError) {
    logger.error(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${err.statusCode} - ${err.message}`
    );

    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(NODE_ENV === "development" && err.stack && { stack: err.stack }),
      },
    });
  }

  // --- Handle unknown/unexpected errors ---
  logger.error(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} 500 - ${err.message || "Unexpected Error"}\n${
      err.stack || ""
    }`
  );

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    error: {
      message: "An internal server error occurred.",
      ...(NODE_ENV === "development" && err.stack && { stack: err.stack }), // stack only in dev
    },
  });
}

module.exports = errorHandler;

// const { isCelebrateError } = require("celebrate");
// const { NODE_ENV } = require("../config/config");
// const { logger } = require("../config/logger");

// function errorHandler(err, req, res, next) {
//   // Handle Celebrate/Joi validation errors
//   if (isCelebrateError(err)) {
//     const details = {};

//     // Replace for...of with forEach
//     Array.from(err.details.entries()).forEach(([segment, joiError]) => {
//       details[segment] = {
//         message: joiError.message,
//         keys: joiError.details.map((d) => d.context.key),
//       };
//     });

//     return res.status(400).json({
//       error: {
//         type: "ValidationError",
//         message: "Validation failed",
//         details,
//       },
//     });
//   }

//   // Standard error handling
//   const statusCode = err?.statusCode || 500;

//   const message =
//     statusCode === 500
//       ? "An internal server error occurred."
//       : err?.message || "Unexpected error.";

//   if (res.headersSent) {
//     return next(err);
//   }

//   // Log to console (development only)
//   if (NODE_ENV === "development") {
//     console.error("Error:", message);
//     if (err?.stack) {
//       console.error(err.stack);
//     }
//   }

//   // Log to file
//   logger.error(
//     `${req.method} ${req.originalUrl} ${statusCode} - ${message}${
//       err?.stack ? `\n${err.stack}` : ""
//     }`
//   );

//   // Response object
//   const errorResponse = { error: { message } };

//   if (NODE_ENV === "development" && err?.stack) {
//     errorResponse.error.stack = err.stack;
//   }

//   return res.status(statusCode).json(errorResponse);
// }

// module.exports = errorHandler;
