const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No token provided");

  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send("Invalid token");
    req.userId = decoded.id;
    next();
  });
};

module.exports = authMiddleware;
