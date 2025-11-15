const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    const err = new UnauthorizedError(
      "Authorization header missing or malformed"
    );
    return res.status(err.statusCode).json({ message: err.message });
  }

  const token = header.slice(7).trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.id) {
      const e = new UnauthorizedError("Invalid token");
      return res.status(e.statusCode).json({ message: e.message });
    }

    req.user = { id: decoded.id };

    return next();
  } catch (err) {
    const e = new UnauthorizedError("Invalid token");
    return res.status(e.statusCode).json({ message: e.message });
  }
}

module.exports = auth;
