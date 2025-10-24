const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

// Unified authentication middleware
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization required" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Attach user object to request
    req.user = { id: decoded.id || decoded._id };

    next();
    return null;
  });

  return null;
};

module.exports = auth;
