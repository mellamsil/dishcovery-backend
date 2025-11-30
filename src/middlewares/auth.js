const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return next(
        new UnauthorizedError("Authorization header missing or malformed")
      );
    }

    const token = header.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.id) {
      return next(new UnauthorizedError("Invalid token"));
    }

    // Standardize on _id for consistency with Mongoose models
    req.user = { _id: decoded.id };
    next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid token"));
  }
}

module.exports = auth;
