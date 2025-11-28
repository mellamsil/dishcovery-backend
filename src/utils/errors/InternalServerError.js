const AppError = require("./AppError");

class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500);
    this.name = "InternalServerError";
  }
}

module.exports = InternalServerError;
