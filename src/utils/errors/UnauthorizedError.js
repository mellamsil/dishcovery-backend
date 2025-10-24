class UnauthorizedError extends Error {
  constructor(message) {
    super(message || "Unauthorized access");
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
