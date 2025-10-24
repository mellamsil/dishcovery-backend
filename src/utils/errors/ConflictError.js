class ConflictError extends Error {
  constructor(message) {
    super(message || "Conflict occurred");
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
