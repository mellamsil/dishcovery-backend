const { NODE_ENV } = require("../config/config");

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message =
    status === 500 ? "Something went wrong on the server." : err.message;

  res.status(status).json({
    error: {
      message,
      ...(NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

module.exports = { errorHandler };
