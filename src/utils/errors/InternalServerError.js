class InternalServerError extends Error {
  constructor(message) {
    super(message || "Internal server error");
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}

module.exports = InternalServerError;
