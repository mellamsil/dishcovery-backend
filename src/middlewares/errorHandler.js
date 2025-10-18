const { NODE_ENV } = require("../config/config");

function errorHandler(err, req, res, next) {
  var status = err && err.statusCode ? err.statusCode : 500;
  var message =
    status === 500
      ? "Something went wrong on the server."
      : err && err.message
        ? err.message
        : "Unexpected error.";

  // Log to console in all environments
  console.error("Error:", message);
  if (NODE_ENV === "development" && err && err.stack) {
    console.error("Stack trace:\n", err.stack);
  }

  // Build response object manually (no spread syntax)
  var errorResponse = { error: { message: message } };
  if (NODE_ENV === "development" && err && err.stack) {
    errorResponse.error.stack = err.stack;
  }

  res.status(status).json(errorResponse);
}

module.exports = { errorHandler };
