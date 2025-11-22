const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return next(
        new UnauthorizedError("Authorization header missing or malformed")
      );
    }

    const token = header.slice(7).trim();
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.id) {
      return next(new UnauthorizedError("Invalid token"));
    }

    req.user = { id: decoded.id };
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid token"));
  }
}

module.exports = auth;
